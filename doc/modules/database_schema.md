# FlowBus Database Schema

## Overview
The FlowBus platform uses PostgreSQL as the primary database with SQLAlchemy ORM for data modeling and relationships. The schema is designed to support the core platform functionality including user management, block management, API invocations, and billing.

## Core Tables

### `users` Table
Stores user account information and authentication data.

```sql
CREATE TABLE users (
    id VARCHAR PRIMARY KEY DEFAULT uuid_v4(),
    email VARCHAR UNIQUE NOT NULL,
    username VARCHAR UNIQUE NOT NULL,
    hashed_password VARCHAR NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**Key Features:**
- UUID primary keys for security
- Unique constraints on email and username
- Bcrypt hashed passwords
- Soft delete capability via `is_active`
- Audit timestamps

### `blocks` Table
Stores API block metadata, configuration, and ownership information.

```sql
CREATE TABLE blocks (
    id VARCHAR PRIMARY KEY DEFAULT uuid_v4(),
    name VARCHAR NOT NULL,
    description TEXT,
    owner_id VARCHAR REFERENCES users(id) NOT NULL,
    endpoint_url VARCHAR NOT NULL,
    pricing_model VARCHAR NOT NULL,
    price_per_call FLOAT DEFAULT 0.0,
    subscription_price FLOAT DEFAULT 0.0,
    is_public BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    block_metadata JSON,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**Key Features:**
- Foreign key relationship to users
- Flexible pricing models (per_call, subscription, tiered)
- Public/private visibility control
- JSON metadata field for extensible configuration
- Soft delete via `is_active`

### `invocations` Table
Tracks all API calls made through the platform for usage monitoring and billing.

```sql
CREATE TABLE invocations (
    id VARCHAR PRIMARY KEY DEFAULT uuid_v4(),
    block_id VARCHAR REFERENCES blocks(id) NOT NULL,
    user_id VARCHAR REFERENCES users(id) NOT NULL,
    request_data JSON,
    response_data JSON,
    status_code INTEGER,
    execution_time_ms INTEGER,
    cost FLOAT DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Key Features:**
- Links invocations to both blocks and users
- Stores request/response data for debugging
- Performance metrics (execution time)
- Cost calculation for billing
- Comprehensive audit trail

### `billing_logs` Table
Records billing events and payment transactions.

```sql
CREATE TABLE billing_logs (
    id VARCHAR PRIMARY KEY DEFAULT uuid_v4(),
    invocation_id VARCHAR REFERENCES invocations(id) NOT NULL,
    user_id VARCHAR REFERENCES users(id) NOT NULL,
    block_id VARCHAR REFERENCES blocks(id) NOT NULL,
    amount FLOAT NOT NULL,
    currency VARCHAR DEFAULT 'USD',
    stripe_payment_intent_id VARCHAR,
    status VARCHAR DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Key Features:**
- Links to invocations for audit trail
- Stripe integration support
- Multiple currency support
- Payment status tracking
- Billing amount calculation

### `revenue_splits` Table
Manages revenue sharing between platform and block creators.

```sql
CREATE TABLE revenue_splits (
    id VARCHAR PRIMARY KEY DEFAULT uuid_v4(),
    billing_log_id VARCHAR REFERENCES billing_logs(id) NOT NULL,
    user_id VARCHAR REFERENCES users(id) NOT NULL,
    amount FLOAT NOT NULL,
    split_percentage FLOAT NOT NULL,
    stripe_transfer_id VARCHAR,
    status VARCHAR DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Key Features:**
- Configurable revenue split percentages
- Stripe transfer integration
- Payment status tracking
- Creator payout management

## Entity Relationships

### Primary Relationships
```
users (1) ──────── (*) blocks
users (1) ──────── (*) invocations  
blocks (1) ─────── (*) invocations
invocations (1) ── (1) billing_logs
billing_logs (1) ─ (*) revenue_splits
```

### Relationship Details

**Users → Blocks (One-to-Many)**
- Users can create multiple blocks
- Each block has exactly one owner
- Enables ownership-based access control

**Users → Invocations (One-to-Many)**
- Users can make multiple API calls
- Each invocation is tied to a specific user
- Enables user-based usage tracking

**Blocks → Invocations (One-to-Many)**
- Each block can be invoked multiple times
- Each invocation targets exactly one block
- Enables block-based analytics

**Invocations → Billing Logs (One-to-One)**
- Each invocation generates exactly one billing record
- Enables precise usage-based billing

**Billing Logs → Revenue Splits (One-to-Many)**
- Each billing event can have multiple revenue splits
- Supports complex revenue sharing scenarios

## Indexes and Performance

### Recommended Indexes
```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- Block discovery
CREATE INDEX idx_blocks_owner_id ON blocks(owner_id);
CREATE INDEX idx_blocks_public_active ON blocks(is_public, is_active);

-- Invocation queries
CREATE INDEX idx_invocations_user_id ON invocations(user_id);
CREATE INDEX idx_invocations_block_id ON invocations(block_id);
CREATE INDEX idx_invocations_created_at ON invocations(created_at);

-- Billing queries
CREATE INDEX idx_billing_logs_user_id ON billing_logs(user_id);
CREATE INDEX idx_billing_logs_status ON billing_logs(status);
```

## Data Types and Constraints

### UUID Primary Keys
All tables use VARCHAR UUID primary keys for:
- Security (non-sequential, hard to guess)
- Global uniqueness across distributed systems
- Better performance for large datasets

### JSON Fields
- `blocks.block_metadata`: Extensible block configuration
- `invocations.request_data`: API request details
- `invocations.response_data`: API response details

### Enum-like Fields
- `blocks.pricing_model`: "per_call", "subscription", "tiered"
- `billing_logs.status`: "pending", "completed", "failed"
- `revenue_splits.status`: "pending", "completed", "failed"

## Technology Stack

- **Database**: PostgreSQL 15+
- **ORM**: SQLAlchemy 2.0+ with declarative mapping
- **Migrations**: Alembic (when needed)
- **Connection Pooling**: SQLAlchemy built-in pooling
- **JSON Support**: PostgreSQL native JSON/JSONB types

## Security Considerations

### Data Protection
- Passwords stored as bcrypt hashes
- Sensitive data in JSON fields
- Foreign key constraints for data integrity

### Access Control
- Row-level security through owner_id relationships
- Public/private visibility controls
- Soft delete for data retention

### Audit Trail
- Comprehensive timestamps on all tables
- Immutable invocation records
- Complete billing audit trail

## Future Schema Enhancements

Potential additions for future iterations:
- **API Keys Table**: For external service authentication
- **Workflows Table**: For block composition and workflows
- **Analytics Tables**: For pre-computed metrics and dashboards
- **Notifications Table**: For system notifications and alerts
- **Settings Table**: For user and system configuration
