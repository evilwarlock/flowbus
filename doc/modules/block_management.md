# Block Management Module Documentation

## Overview

The Block Management system enables users to create, manage, and discover API blocks on the FlowBus platform. Blocks represent external APIs that can be invoked through the platform, complete with metadata, pricing, and ownership controls.

## Implementation Status: ✅ Complete

### Features Implemented

- **Complete CRUD Operations**: Create, read, update, and delete blocks
- **Owner-based Authorization**: Users can only modify their own blocks
- **Public/Private Blocks**: Visibility control for block discovery
- **Rich Metadata**: JSON metadata field for extensible configuration
- **Pagination Support**: Efficient listing with skip/limit parameters
- **Comprehensive Validation**: Input validation and error handling

## API Endpoints

### Public Endpoints
- `GET /api/v1/blocks/` - List all public blocks (with pagination)
- `GET /api/v1/blocks/{block_id}` - Get specific block details

### Protected Endpoints (Require Authentication)
- `POST /api/v1/blocks/` - Create a new block
- `GET /api/v1/blocks/my` - List user's own blocks (including private)
- `PUT /api/v1/blocks/{block_id}` - Update a block (owner only)
- `DELETE /api/v1/blocks/{block_id}` - Delete a block (owner only)

## Technical Architecture

### Components

1. **CRUD Operations** (`app/crud/blocks.py`)
   - Database operations abstracted from HTTP layer
   - Reusable functions for all block operations
   - Efficient querying with pagination support

2. **Block Models** (`app/models.py`)
   - SQLAlchemy Block model with relationships
   - JSON metadata field for flexible configuration
   - Ownership and visibility controls

3. **Schemas** (`app/schemas.py`)
   - `BlockCreate` - New block creation
   - `BlockUpdate` - Partial block updates
   - `BlockResponse` - API response format

4. **Router** (`app/routers/blocks.py`)
   - HTTP endpoint implementations
   - Authentication and authorization logic
   - Error handling and validation

### Service Layer Pattern

The implementation follows a clean service layer pattern:
- **Router Layer**: Handles HTTP requests, authentication, validation
- **CRUD Layer**: Manages database operations and business logic
- **Model Layer**: Defines data structure and relationships

## Database Schema

### Blocks Table
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

### Relationships
- Blocks belong to Users (many-to-one)
- Blocks have many Invocations (one-to-many)

## Data Models

### Block Fields
- **Basic Info**: `name`, `description`, `owner_id`
- **API Details**: `endpoint_url`, `pricing_model`
- **Pricing**: `price_per_call`, `subscription_price`
- **Visibility**: `is_public`, `is_active`
- **Metadata**: `block_metadata` (JSON field for extensible configuration)
- **Timestamps**: `created_at`, `updated_at`

### Pricing Models
- `per_call` - Pay per API invocation
- `subscription` - Monthly/yearly subscription
- `tiered` - Tiered pricing (future enhancement)

### Metadata Examples
```json
{
  "version": "1.0.0",
  "tags": ["ai", "text", "nlp"],
  "rate_limit": "1000/hour",
  "documentation_url": "https://api.example.com/docs",
  "authentication_required": true,
  "supported_methods": ["POST", "GET"]
}
```

## Usage Examples

### Create a Block
```bash
curl -X POST "http://localhost:8000/api/v1/blocks/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "AI Text Processor",
    "description": "Advanced text processing API",
    "endpoint_url": "https://api.example.com/process",
    "pricing_model": "per_call",
    "price_per_call": 0.05,
    "is_public": true,
    "block_metadata": {
      "version": "1.0.0",
      "tags": ["ai", "text"]
    }
  }'
```

### List Public Blocks
```bash
curl "http://localhost:8000/api/v1/blocks/?skip=0&limit=10"
```

### Update a Block
```bash
curl -X PUT "http://localhost:8000/api/v1/blocks/{block_id}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Enhanced AI Text Processor",
    "price_per_call": 0.08
  }'
```

### Delete a Block
```bash
curl -X DELETE "http://localhost:8000/api/v1/blocks/{block_id}" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Authorization & Security

### Access Control Rules
1. **Public Read**: Anyone can view public blocks
2. **Authenticated Create**: Only authenticated users can create blocks
3. **Owner-only Modify**: Only block owners can update/delete their blocks
4. **Private Blocks**: Only owners can see their private blocks

### Security Features
- **Owner Verification**: Strict ownership checks for modifications
- **Input Validation**: Comprehensive Pydantic validation
- **SQL Injection Prevention**: SQLAlchemy ORM protection
- **XSS Protection**: Proper JSON handling

## Error Handling

### HTTP Status Codes
- `200 OK` - Successful retrieval/update
- `201 Created` - Successful block creation
- `204 No Content` - Successful deletion
- `400 Bad Request` - Validation errors
- `401 Unauthorized` - Missing/invalid authentication
- `403 Forbidden` - Permission denied (not owner)
- `404 Not Found` - Block doesn't exist

### Common Error Responses
```json
{
  "detail": "Block not found"
}
```

```json
{
  "detail": "You can only update your own blocks"
}
```

## Testing

### Automated Tests
- **Integration Test**: `tests/integration/test_block_management.py`
- **Coverage**: All CRUD operations, authentication, authorization, error handling

### Test Scenarios
- ✅ Block creation with authentication
- ✅ Public block listing with pagination
- ✅ User's own block listing
- ✅ Block retrieval by ID
- ✅ Block updates (owner only)
- ✅ Block deletion (owner only)
- ✅ Authorization checks (403 errors)
- ✅ Not found handling (404 errors)
- ✅ Unauthorized access (401 errors)

## Pagination

### Query Parameters
- `skip` (integer, ≥0): Number of records to skip
- `limit` (integer, 1-1000): Maximum records to return

### Usage
```bash
# Get first 10 blocks
GET /api/v1/blocks/?skip=0&limit=10

# Get next 10 blocks
GET /api/v1/blocks/?skip=10&limit=10
```

## Performance Considerations

### Database Optimization
- Indexes on `owner_id`, `is_public`, `is_active` for efficient filtering
- Pagination to prevent large result sets
- Efficient queries using SQLAlchemy

### Caching Opportunities
- Public block lists (future enhancement)
- Block metadata (future enhancement)

## Development Guidelines

### Adding New Block Fields
1. Update the SQLAlchemy model in `app/models.py`
2. Update Pydantic schemas in `app/schemas.py`
3. Update CRUD operations if needed
4. Add database migration

### Custom Validation
```python
from pydantic import validator

class BlockCreate(BlockBase):
    @validator('endpoint_url')
    def validate_endpoint(cls, v):
        # Custom validation logic
        return v
```

## Future Enhancements

Potential improvements for future iterations:
- **Search & Filtering**: Search by name, tags, or description
- **Categories & Tags**: Organized block discovery
- **Versioning**: Block version management
- **Analytics**: Usage statistics and performance metrics
- **Block Templates**: Predefined block configurations
- **Approval Workflow**: Admin approval for public blocks
- **Rate Limiting**: Per-block usage quotas
- **Health Monitoring**: External API health checks
