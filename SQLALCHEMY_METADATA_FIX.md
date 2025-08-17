# SQLAlchemy Metadata Reserved Keyword Fix

## Problem
When starting the FastAPI server, you may encounter this error:
```
sqlalchemy.exc.InvalidRequestError: Attribute name 'metadata' is reserved when using the Declarative API.
```

## Cause
In SQLAlchemy's Declarative API, `metadata` is a reserved attribute name that refers to the database schema metadata. Using it as a column name conflicts with this built-in attribute.

## Solution
The issue was in the `Block` model in `backend/app/models.py`:

### Before (Problematic):
```python
class Block(Base):
    # ... other fields ...
    metadata = Column(JSON)  # ❌ This conflicts with SQLAlchemy's metadata
```

### After (Fixed):
```python
class Block(Base):
    # ... other fields ...
    block_metadata = Column(JSON)  # ✅ Renamed to avoid conflict
```

## Files Modified
1. **`backend/app/models.py`** - Changed `metadata` to `block_metadata`
2. **`backend/app/schemas.py`** - Updated Pydantic schema to match

## Database Impact
If you already have data in your database, you may need to run a migration to rename the column. For new installations, this change will be applied automatically when the tables are created.

## Testing
Run the server startup test to verify the fix:
```bash
./test-server-startup.sh
```

## Prevention
When working with SQLAlchemy, avoid these reserved attribute names:
- `metadata`
- `registry` 
- `__table__`
- `__mapper__`
- `__tablename__`

Always use descriptive names like `block_metadata`, `user_settings`, etc.
