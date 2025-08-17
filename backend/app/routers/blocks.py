from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import User, Block
from app.schemas import BlockCreate, BlockResponse
from app.security import get_current_user

router = APIRouter(prefix="/blocks", tags=["blocks"])


@router.get("/", response_model=List[dict])
def list_blocks():
    """List all available blocks (placeholder with demo data)."""
    return {
        "blocks": [
            {
                "id": "demo-block-1",
                "name": "Text Summarizer",
                "description": "Summarizes long text using AI",
                "price_per_call": 0.01,
                "owner": "demo-user"
            },
            {
                "id": "demo-block-2", 
                "name": "Image Analyzer",
                "description": "Analyzes images and extracts information",
                "price_per_call": 0.05,
                "owner": "demo-user"
            }
        ]
    }


@router.post("/", response_model=dict)
def create_block(current_user: User = Depends(get_current_user)):
    """Create a new block (placeholder - requires authentication)."""
    return {
        "message": f"Block creation endpoint - coming soon! Authenticated as {current_user.username}"
    }


@router.get("/{block_id}", response_model=dict)
def get_block(block_id: str):
    """Get a specific block by ID (placeholder)."""
    return {
        "id": block_id,
        "name": f"Demo Block {block_id}",
        "description": "This is a demo block",
        "price_per_call": 0.01,
        "owner": "demo-user"
    }
