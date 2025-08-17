from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=False)
    username = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    blocks = relationship("Block", back_populates="owner")
    invocations = relationship("Invocation", back_populates="user")

class Block(Base):
    __tablename__ = "blocks"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    description = Column(Text)
    owner_id = Column(String, ForeignKey("users.id"), nullable=False)
    endpoint_url = Column(String, nullable=False)
    pricing_model = Column(String, nullable=False)  # "per_call", "subscription", "tiered"
    price_per_call = Column(Float, default=0.0)
    subscription_price = Column(Float, default=0.0)
    is_public = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True)
    block_metadata = Column(JSON)  # Additional block configuration
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    owner = relationship("User", back_populates="blocks")
    invocations = relationship("Invocation", back_populates="block")

class Invocation(Base):
    __tablename__ = "invocations"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    block_id = Column(String, ForeignKey("blocks.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    request_data = Column(JSON)
    response_data = Column(JSON)
    status_code = Column(Integer)
    execution_time_ms = Column(Integer)
    cost = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    block = relationship("Block", back_populates="invocations")
    user = relationship("User", back_populates="invocations")
    billing_log = relationship("BillingLog", back_populates="invocation", uselist=False)

class BillingLog(Base):
    __tablename__ = "billing_logs"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    invocation_id = Column(String, ForeignKey("invocations.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    block_id = Column(String, ForeignKey("blocks.id"), nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String, default="USD")
    stripe_payment_intent_id = Column(String)
    status = Column(String, default="pending")  # pending, completed, failed
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    invocation = relationship("Invocation", back_populates="billing_log")
    revenue_splits = relationship("RevenueSplit", back_populates="billing_log")

class RevenueSplit(Base):
    __tablename__ = "revenue_splits"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    billing_log_id = Column(String, ForeignKey("billing_logs.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    split_percentage = Column(Float, nullable=False)  # Platform takes 10%, creator gets 90%
    stripe_transfer_id = Column(String)
    status = Column(String, default="pending")  # pending, completed, failed
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    billing_log = relationship("BillingLog", back_populates="revenue_splits") 