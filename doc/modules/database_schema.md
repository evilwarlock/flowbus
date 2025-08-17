# Database Schema

## Database Tables Overview
The FlowBus platform uses PostgreSQL as the primary database with the following core tables:

## Core Tables

### `users`
- User account information
- Authentication credentials
- Profile data
- Account settings

### `blocks`
- Block metadata and configuration
- API endpoint information
- Pricing and monetization settings
- Owner relationships

### `invocations`
- API call tracking and logging
- Usage metrics and analytics
- Performance monitoring data
- Request/response logging

### `billing_logs`
- Billing event tracking
- Payment transaction records
- Usage-based billing calculations
- Revenue tracking

### `revenue_splits`
- Revenue sharing configuration
- Payment distribution logic
- Commission and fee structures
- Payout tracking

## Relationships
- Users can own multiple Blocks
- Blocks can have multiple Invocations
- Invocations generate Billing Logs
- Revenue Splits are calculated from Billing Logs

## Technology Stack
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Migrations**: Alembic (implied)
- **Connection Pooling**: Built into SQLAlchemy
