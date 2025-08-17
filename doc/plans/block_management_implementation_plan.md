# Block Management Module Implementation Plan

## 1. Objective
To implement full CRUD (Create, Read, Update, Delete) functionality for the `Block` resource. This will replace the current placeholder endpoints and enable users to manage their API blocks through the FlowBus platform.

## 2. Current State
The `backend/app/routers/blocks.py` file contains placeholder endpoints for listing, getting, and creating blocks. These endpoints return static demo data and do not interact with the database. The `create_block` endpoint requires authentication but has no logic.

## 3. Proposed Architecture
- **Database-driven**: All block operations will interact with the `blocks` table in the PostgreSQL database via SQLAlchemy.
- **Owner-based Authorization**: Users will only be able to update or delete blocks that they own. Block creation will be tied to the authenticated user.
- **Service Layer (CRUD functions)**: We will create a dedicated file, `backend/app/crud/blocks.py`, to encapsulate all database logic related to blocks, keeping the router file clean and focused on handling API requests and responses.
- **Pydantic Schemas**: We will use the existing `BlockCreate` and `BlockResponse` schemas and potentially add a `BlockUpdate` schema for partial updates.

## 4. Task Breakdown

### Task 1: Create Block CRUD Functions
- **File**: `backend/app/crud/blocks.py` (new file and directory).
- **Details**:
    - `create_block(db: Session, block: BlockCreate, owner_id: str) -> models.Block`: Creates a new block instance in the database, associating it with the owner.
    - `get_block(db: Session, block_id: str) -> models.Block | None`: Retrieves a single block by its ID.
    - `get_blocks(db: Session, skip: int = 0, limit: int = 100) -> list[models.Block]`: Retrieves a list of public blocks with pagination. We can add filtering later (e.g., by owner, by tag).
    - `update_block(db: Session, block_id: str, block_update_data: BlockUpdate) -> models.Block | None`: Updates the fields of an existing block.
    - `delete_block(db: Session, block_id: str) -> models.Block | None`: Deletes a block from the database.

### Task 2: Implement `POST /blocks` (Create) Endpoint
- **File**: `backend/app/routers/blocks.py` (refactor).
- **Details**:
    - The endpoint will depend on `get_current_user` to identify the block's owner.
    - It will accept a `BlockCreate` Pydantic model in the request body.
    - It will call the `crud.blocks.create_block` function to persist the data.
    - It will return a `BlockResponse` with a `201 Created` status code.

### Task 3: Implement `GET /blocks` (List) and `GET /blocks/{block_id}` (Read) Endpoints
- **File**: `backend/app/routers/blocks.py` (refactor).
- **Details**:
    - `GET /blocks`: This endpoint will be public. It will call `crud.blocks.get_blocks` and implement pagination using query parameters (`skip`, `limit`).
    - `GET /blocks/{block_id}`: This will also be a public endpoint. It will call `crud.blocks.get_block` and return the block details. If the block is not found, it should return a `404 Not Found` error.

### Task 4: Implement `PUT /blocks/{block_id}` (Update) Endpoint
- **File**: `backend/app/routers/blocks.py` (new endpoint).
- **Details**:
    - Create a new `BlockUpdate` schema in `schemas.py` that allows for partial updates (all fields optional).
    - The endpoint will depend on `get_current_user`.
    - It must verify that the `current_user` is the owner of the block being updated. If not, return a `403 Forbidden` error.
    - It will call `crud.blocks.update_block` to update the data in the database.
    - Return the updated `BlockResponse`.

### Task 5: Implement `DELETE /blocks/{block_id}` (Delete) Endpoint
- **File**: `backend/app/routers/blocks.py` (new endpoint).
- **Details**:
    - The endpoint will depend on `get_current_user`.
    - It must verify that the `current_user` is the owner of the block being deleted. If not, return a `403 Forbidden` error.
    - It will call `crud.blocks.delete_block`.
    - Upon successful deletion, it should return a `204 No Content` status or a confirmation message.

## 5. Open Questions & Considerations
- **Filtering and Searching**: What criteria should be available for filtering the `GET /blocks` list? (e.g., tags, owner, pricing model). This can be added in a future iteration.
- **Error Handling**: We need robust error handling for cases like `block not found` (404), `permission denied` (403), and `validation errors` (422).
- **Cascading Deletes**: What should happen to `Invocation` records when a `Block` is deleted? The database schema should define this relationship (e.g., cascade delete or set null).
- **Block Versioning**: Should we implement a system for versioning blocks? For the MVP, a simple update-in-place is sufficient.

This plan provides a clear roadmap for building the core block management functionality. Do you feel this design is ready to be implemented? If so, we can switch to "Agent mode" to begin development.
