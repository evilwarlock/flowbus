from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import User
from app.schemas import BlockCreate, BlockResponse, BlockUpdate
from app.security import get_current_user
from app.crud import blocks as crud_blocks

router = APIRouter(prefix="/blocks", tags=["blocks"])


@router.get("/", response_model=List[BlockResponse])
def list_blocks(
    skip: int = Query(0, ge=0, description="Number of blocks to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of blocks to return"),
    db: Session = Depends(get_db)
):
    """List all public blocks with pagination."""
    blocks = crud_blocks.get_blocks(db, skip=skip, limit=limit)
    return blocks


@router.get("/my", response_model=List[BlockResponse])
def list_my_blocks(
    skip: int = Query(0, ge=0, description="Number of blocks to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of blocks to return"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all blocks owned by the current user (including private ones)."""
    blocks = crud_blocks.get_user_blocks(db, owner_id=current_user.id, skip=skip, limit=limit)
    return blocks


@router.post("/", response_model=BlockResponse, status_code=status.HTTP_201_CREATED)
def create_block(
    block: BlockCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new block."""
    try:
        db_block = crud_blocks.create_block(db=db, block=block, owner_id=current_user.id)
        return db_block
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create block: {str(e)}"
        )


@router.get("/{block_id}", response_model=BlockResponse)
def get_block(block_id: str, db: Session = Depends(get_db)):
    """Get a specific block by ID."""
    db_block = crud_blocks.get_block(db, block_id=block_id)
    if db_block is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Block not found"
        )
    return db_block


@router.put("/{block_id}", response_model=BlockResponse)
def update_block(
    block_id: str,
    block_update: BlockUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a block (only the owner can update)."""
    # First check if the block exists
    db_block = crud_blocks.get_block(db, block_id=block_id)
    if db_block is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Block not found"
        )
    
    # Check if the current user is the owner
    if db_block.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own blocks"
        )
    
    # Update the block
    updated_block = crud_blocks.update_block(db, block_id=block_id, block_update=block_update)
    if updated_block is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update block"
        )
    
    return updated_block


@router.delete("/{block_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_block(
    block_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a block (only the owner can delete)."""
    # First check if the block exists
    db_block = crud_blocks.get_block(db, block_id=block_id)
    if db_block is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Block not found"
        )
    
    # Check if the current user is the owner
    if db_block.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own blocks"
        )
    
    # Delete the block
    deleted_block = crud_blocks.delete_block(db, block_id=block_id)
    if deleted_block is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to delete block"
        )
    
    return None  # 204 No Content response
