from pydantic import BaseModel, HttpUrl
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum

class PricingModel(str, Enum):
    PER_CALL = "per_call"
    SUBSCRIPTION = "subscription"
    TIERED = "tiered"

# Token schema for authentication
class Token(BaseModel):
    access_token: str
    token_type: str

# User schemas
class UserBase(BaseModel):
    email: str
    username: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Block schemas
class BlockBase(BaseModel):
    name: str
    description: Optional[str] = None
    endpoint_url: HttpUrl
    pricing_model: PricingModel
    price_per_call: Optional[float] = 0.0
    subscription_price: Optional[float] = 0.0
    is_public: bool = True
    block_metadata: Optional[Dict[str, Any]] = None

class BlockCreate(BlockBase):
    pass

class BlockUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    endpoint_url: Optional[HttpUrl] = None
    pricing_model: Optional[PricingModel] = None
    price_per_call: Optional[float] = None
    subscription_price: Optional[float] = None
    is_public: Optional[bool] = None
    block_metadata: Optional[Dict[str, Any]] = None

class BlockResponse(BlockBase):
    id: str
    owner_id: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Invocation schemas
class InvocationBase(BaseModel):
    request_data: Optional[Dict[str, Any]] = None

class InvocationCreate(InvocationBase):
    block_id: str

class InvocationResponse(InvocationBase):
    id: str
    block_id: str
    user_id: str
    response_data: Optional[Dict[str, Any]] = None
    status_code: Optional[int] = None
    execution_time_ms: Optional[int] = None
    cost: float
    created_at: datetime

    class Config:
        from_attributes = True

# Billing schemas
class BillingLogResponse(BaseModel):
    id: str
    invocation_id: str
    user_id: str
    block_id: str
    amount: float
    currency: str
    stripe_payment_intent_id: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class RevenueSplitResponse(BaseModel):
    id: str
    billing_log_id: str
    user_id: str
    amount: float
    split_percentage: float
    stripe_transfer_id: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True 