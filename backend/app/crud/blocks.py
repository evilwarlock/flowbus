from sqlalchemy.orm import Session
from typing import List, Optional
from app.models import Block
from app.schemas import BlockCreate, BlockUpdate


def create_block(db: Session, block: BlockCreate, owner_id: str) -> Block:
    """Create a new block in the database."""
    db_block = Block(
        name=block.name,
        description=block.description,
        owner_id=owner_id,
        endpoint_url=str(block.endpoint_url),
        pricing_model=block.pricing_model.value,
        price_per_call=block.price_per_call,
        subscription_price=block.subscription_price,
        is_public=block.is_public,
        block_metadata=block.block_metadata
    )
    db.add(db_block)
    db.commit()
    db.refresh(db_block)
    return db_block


def get_block(db: Session, block_id: str) -> Optional[Block]:
    """Retrieve a single block by its ID."""
    return db.query(Block).filter(Block.id == block_id).first()


def get_blocks(db: Session, skip: int = 0, limit: int = 100, owner_id: Optional[str] = None) -> List[Block]:
    """Retrieve a list of blocks with pagination and optional filtering."""
    query = db.query(Block)
    
    # If owner_id is provided, filter by owner
    if owner_id:
        query = query.filter(Block.owner_id == owner_id)
    else:
        # For public listing, only show public blocks
        query = query.filter(Block.is_public == True, Block.is_active == True)
    
    return query.offset(skip).limit(limit).all()


def get_user_blocks(db: Session, owner_id: str, skip: int = 0, limit: int = 100) -> List[Block]:
    """Retrieve all blocks owned by a specific user (including private ones)."""
    return db.query(Block).filter(
        Block.owner_id == owner_id
    ).offset(skip).limit(limit).all()


def update_block(db: Session, block_id: str, block_update: BlockUpdate) -> Optional[Block]:
    """Update an existing block."""
    db_block = db.query(Block).filter(Block.id == block_id).first()
    if not db_block:
        return None
    
    # Update only the fields that are provided (not None)
    update_data = block_update.model_dump(exclude_unset=True)
    
    # Handle special cases
    if "endpoint_url" in update_data:
        update_data["endpoint_url"] = str(update_data["endpoint_url"])
    if "pricing_model" in update_data:
        update_data["pricing_model"] = update_data["pricing_model"].value
    
    for field, value in update_data.items():
        setattr(db_block, field, value)
    
    db.commit()
    db.refresh(db_block)
    return db_block


def delete_block(db: Session, block_id: str) -> Optional[Block]:
    """Delete a block from the database."""
    db_block = db.query(Block).filter(Block.id == block_id).first()
    if not db_block:
        return None
    
    db.delete(db_block)
    db.commit()
    return db_block


def get_block_count(db: Session, owner_id: Optional[str] = None) -> int:
    """Get the total count of blocks (for pagination)."""
    query = db.query(Block)
    
    if owner_id:
        query = query.filter(Block.owner_id == owner_id)
    else:
        query = query.filter(Block.is_public == True, Block.is_active == True)
    
    return query.count()
