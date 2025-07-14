from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth

app = FastAPI(
    title="FlowBus API",
    description="AI + API building and monetization platform",
    version="0.1.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Welcome to FlowBus API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "flowbus-api"}

@app.get("/api/v1/blocks")
async def list_blocks():
    """List all available blocks"""
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

@app.post("/api/v1/blocks")
async def create_block():
    """Create a new block (placeholder)"""
    return {"message": "Block creation endpoint - coming soon!"}

@app.get("/api/v1/blocks/{block_id}")
async def get_block(block_id: str):
    """Get a specific block by ID"""
    return {
        "id": block_id,
        "name": f"Demo Block {block_id}",
        "description": "This is a demo block",
        "price_per_call": 0.01,
        "owner": "demo-user"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000) 