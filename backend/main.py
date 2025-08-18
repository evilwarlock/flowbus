from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, users, blocks, invocations
from app.database import create_tables

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
app.include_router(users.router, prefix="/api/v1")
app.include_router(blocks.router, prefix="/api/v1")
app.include_router(invocations.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Welcome to FlowBus API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "flowbus-api"}

# Create database tables on startup
@app.on_event("startup")
async def startup_event():
    create_tables()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000) 