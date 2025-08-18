import time
import httpx
from fastapi import APIRouter, HTTPException, status, Depends, Request
from sqlalchemy.orm import Session
from typing import Dict, Any, Optional
from app.database import get_db
from app.models import User, Block, Invocation
from app.schemas import InvokeRequest, InvokeResponse
from app.security import get_current_user
from app.crud import blocks as crud_blocks
from app.rate_limiter import check_combined_rate_limit
from app.cache import cache_manager
from app.config import settings
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/invoke", tags=["invocations"])


@router.post("/{block_id}", response_model=InvokeResponse)
async def invoke_block(
    block_id: str,
    invoke_request: InvokeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    use_cache: bool = True
):
    """Invoke a block by proxying the request to its endpoint."""
    start_time = time.time()
    
    # Get the block
    block = crud_blocks.get_block(db, block_id=block_id)
    if not block:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Block not found"
        )
    
    # Check if block is active
    if not block.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Block is not active"
        )
    
    # Check if user has access to the block (public blocks or owner)
    if not block.is_public and block.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this private block"
        )
    
    # Apply rate limiting
    try:
        rate_limit_result = check_combined_rate_limit(current_user.id, block_id)
        logger.info(f"Rate limit check passed for user {current_user.id}, block {block_id}")
    except HTTPException as e:
        logger.warning(f"Rate limit exceeded for user {current_user.id}, block {block_id}")
        raise e
    
    # Prepare request data for caching
    request_data = {
        "headers": invoke_request.headers or {},
        "query_params": invoke_request.query_params or {},
        "body": invoke_request.body
    }
    
    # Check cache first (if enabled and requested)
    cached_response = None
    if use_cache:
        cached_response = cache_manager.get_cached_response(block_id, request_data)
        if cached_response:
            # Return cached response but still create invocation record
            execution_time_ms = int((time.time() - start_time) * 1000)
            
            invocation = Invocation(
                block_id=block_id,
                user_id=current_user.id,
                request_data=request_data,
                response_data=cached_response["response_data"],
                status_code=cached_response["response_data"]["status_code"],
                execution_time_ms=execution_time_ms,
                cost=block.price_per_call
            )
            
            db.add(invocation)
            db.commit()
            db.refresh(invocation)
            
            return InvokeResponse(
                status_code=cached_response["response_data"]["status_code"],
                headers=cached_response["response_data"]["headers"],
                body=cached_response["response_data"]["body"],
                execution_time_ms=execution_time_ms,
                invocation_id=invocation.id
            )
    
    try:
        # Prepare the request to the external API
        headers = invoke_request.headers or {}
        # Add default headers
        headers.setdefault("Content-Type", "application/json")
        headers.setdefault("User-Agent", "FlowBus-Proxy/1.0")
        
        # Prepare query parameters
        params = invoke_request.query_params or {}
        
        # Make the HTTP request to the block's endpoint
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                str(block.endpoint_url),
                json=invoke_request.body,
                headers=headers,
                params=params
            )
        
        # Calculate execution time
        execution_time_ms = int((time.time() - start_time) * 1000)
        
        # Parse response
        try:
            response_body = response.json()
        except:
            response_body = response.text
        
        # Prepare response data for caching
        response_data = {
            "status_code": response.status_code,
            "headers": dict(response.headers),
            "body": response_body
        }
        
        # Cache the response if successful and cacheable
        if use_cache and response.status_code == 200:
            cache_manager.cache_response(block_id, request_data, response_data)
        
        # Create invocation record
        invocation = Invocation(
            block_id=block_id,
            user_id=current_user.id,
            request_data=request_data,
            response_data=response_data,
            status_code=response.status_code,
            execution_time_ms=execution_time_ms,
            cost=block.price_per_call  # For now, use the per-call price
        )
        
        db.add(invocation)
        db.commit()
        db.refresh(invocation)
        
        # Return the proxied response
        return InvokeResponse(
            status_code=response.status_code,
            headers=dict(response.headers),
            body=response_body,
            execution_time_ms=execution_time_ms,
            invocation_id=invocation.id
        )
        
    except httpx.TimeoutException:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="Request to external API timed out"
        )
    except httpx.ConnectError:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Could not connect to external API"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error invoking block: {str(e)}"
        )


@router.get("/history")
async def get_invocation_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = 100
):
    """Get the current user's invocation history."""
    invocations = db.query(Invocation).filter(
        Invocation.user_id == current_user.id
    ).order_by(Invocation.created_at.desc()).limit(limit).all()
    
    return [
        {
            "id": inv.id,
            "block_id": inv.block_id,
            "status_code": inv.status_code,
            "execution_time_ms": inv.execution_time_ms,
            "cost": inv.cost,
            "created_at": inv.created_at
        } for inv in invocations
    ]


@router.get("/analytics")
async def get_user_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get analytics for the current user's invocations."""
    from sqlalchemy import func, desc
    
    # Get total invocations
    total_invocations = db.query(func.count(Invocation.id)).filter(
        Invocation.user_id == current_user.id
    ).scalar()
    
    # Get total cost
    total_cost = db.query(func.sum(Invocation.cost)).filter(
        Invocation.user_id == current_user.id
    ).scalar() or 0
    
    # Get average execution time
    avg_execution_time = db.query(func.avg(Invocation.execution_time_ms)).filter(
        Invocation.user_id == current_user.id
    ).scalar() or 0
    
    # Get most used blocks
    most_used_blocks = db.query(
        Invocation.block_id,
        func.count(Invocation.id).label('usage_count')
    ).filter(
        Invocation.user_id == current_user.id
    ).group_by(Invocation.block_id).order_by(desc('usage_count')).limit(10).all()
    
    # Get recent activity (last 24 hours)
    from datetime import datetime, timedelta
    recent_activity = db.query(func.count(Invocation.id)).filter(
        Invocation.user_id == current_user.id,
        Invocation.created_at >= datetime.utcnow() - timedelta(days=1)
    ).scalar()
    
    return {
        "total_invocations": total_invocations,
        "total_cost": float(total_cost),
        "average_execution_time_ms": float(avg_execution_time),
        "recent_activity_24h": recent_activity,
        "most_used_blocks": [
            {"block_id": block_id, "usage_count": count} 
            for block_id, count in most_used_blocks
        ]
    }


@router.get("/cache/stats")
async def get_cache_stats(current_user: User = Depends(get_current_user)):
    """Get cache statistics (admin-level info)."""
    return cache_manager.get_cache_stats()


@router.delete("/cache/{block_id}")
async def invalidate_block_cache(
    block_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Invalidate cache for a specific block (only block owner can do this)."""
    # Check if user owns the block
    block = crud_blocks.get_block(db, block_id=block_id)
    if not block:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Block not found"
        )
    
    if block.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only block owners can invalidate cache"
        )
    
    deleted_count = cache_manager.invalidate_block_cache(block_id)
    return {
        "message": f"Invalidated {deleted_count} cache entries for block {block_id}",
        "deleted_count": deleted_count
    }


@router.get("/rate-limit/status")
async def get_rate_limit_status(
    current_user: User = Depends(get_current_user)
):
    """Get current rate limit status for the user."""
    from app.rate_limiter import check_user_rate_limit
    
    user_status = check_user_rate_limit(current_user.id, settings.USER_RATE_LIMIT_PER_MINUTE)
    
    return {
        "user_id": current_user.id,
        "requests_remaining": user_status["remaining"],
        "requests_limit": user_status["limit"],
        "reset_time": user_status["reset_time"],
        "allowed": user_status["allowed"]
    }
