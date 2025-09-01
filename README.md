# FlowBus

**A full-stack platform for monetizing APIs and AI agents through modular, composable blocks.**

![Version](https://img.shields.io/badge/version-0.1.0-blue) ![License](https://img.shields.io/badge/license-MIT-green) ![Python](https://img.shields.io/badge/python-3.11+-blue) ![Build](https://img.shields.io/badge/build-passing-brightgreen)

## At a Glance

• **API Monetization Platform**: Upload APIs/agents as "Blocks," set pricing, and earn revenue  
• **Modular Architecture**: Compose complex workflows from reusable building blocks  
• **Enterprise-Grade Engine**: Built-in rate limiting, caching, usage tracking, and billing  
• **Full-Stack Solution**: FastAPI backend + React frontend with authentication and payments  
• **Developer-First**: Complete REST API, comprehensive docs, and Docker-ready deployment  
• **Marketplace Ready**: Revenue sharing, analytics dashboard, and public block discovery  

## Table of Contents

- [Install](#install)
- [Quickstart](#quickstart)
- [Core Concepts](#core-concepts)
- [Common Tasks](#common-tasks)
- [API Overview](#api-overview)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [Links](#links)

## Install

### Prerequisites

- Docker and Docker Compose
- Python 3.11+
- Node.js 18+ (for frontend)

### macOS Quick Start (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd flowbus

# Run the automated setup script
./scripts/start-dev-macos.sh

# API available at http://127.0.0.1:8000
# API docs: http://127.0.0.1:8000/docs
```

### Manual Setup (All Platforms)

```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Set up backend
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

# Set up frontend (separate terminal)
cd frontend
npm install
npm start
```

## Quickstart

Here's a complete workflow to create and invoke your first block:

```bash
# 1. Start the API server
cd backend && uvicorn main:app --reload

# 2. Check health
curl http://127.0.0.1:8000/health

# 3. Register a user
curl -X POST "http://127.0.0.1:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser", 
    "password": "testpassword123"
  }'

# 4. Login and get token
curl -X POST "http://127.0.0.1:8000/api/v1/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=testpassword123"

# 5. Create a block (use token from step 4)
curl -X POST "http://127.0.0.1:8000/api/v1/blocks/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Text Summarizer",
    "description": "AI-powered text summarization",
    "endpoint_url": "https://api.example.com/summarize",
    "price_per_call": 0.01
  }'

# 6. Invoke the block
curl -X POST "http://127.0.0.1:8000/api/v1/invoke/YOUR_BLOCK_ID" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text": "Long text to summarize..."}'
```

## Core Concepts

### Blocks
**Blocks** are the core primitive—they wrap any REST API with metadata, pricing, and access controls. Each block has:
- Unique ID and metadata (name, description, tags)
- Target endpoint URL and HTTP method
- Pricing model (per-call, subscription, etc.)
- Owner and visibility settings

### Invocation Engine
The **Invocation Engine** acts as an intelligent proxy that:
- Routes requests to block endpoints
- Tracks usage and calculates costs
- Applies rate limiting and caching
- Handles authentication and billing

### Users & Authentication
JWT-based authentication with role-based access:
- **Creators**: Upload and manage blocks
- **Consumers**: Discover and invoke blocks
- **Admins**: Platform management and analytics

```mermaid
graph LR
    A[User] --> B[FlowBus API]
    B --> C[Auth Service]
    B --> D[Block Manager]
    B --> E[Invocation Engine]
    E --> F[External API]
    E --> G[Usage Tracker]
    G --> H[Billing System]
```

## Common Tasks

### Create and publish a block

```python
import requests

# Authenticate
auth = requests.post("http://127.0.0.1:8000/api/v1/auth/login", 
                    data={"username": "myuser", "password": "mypass"})
token = auth.json()["access_token"]

# Create block
block = requests.post("http://127.0.0.1:8000/api/v1/blocks/",
    headers={"Authorization": f"Bearer {token}"},
    json={
        "name": "Weather API",
        "description": "Get current weather for any city",
        "endpoint_url": "https://api.openweathermap.org/data/2.5/weather",
        "price_per_call": 0.001
    })
```

### Invoke a block with custom parameters

```bash
curl -X POST "http://127.0.0.1:8000/api/v1/invoke/weather-block" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"q": "London", "appid": "your-api-key"}'
```

### Monitor usage and analytics

```python
# Get your invocation history
history = requests.get("http://127.0.0.1:8000/api/v1/invoke/history",
                      headers={"Authorization": f"Bearer {token}"})

# Check rate limit status  
limits = requests.get("http://127.0.0.1:8000/api/v1/invoke/rate-limit/status",
                     headers={"Authorization": f"Bearer {token}"})
```

### Manage block visibility and pricing

```python
# Update block settings
requests.put(f"http://127.0.0.1:8000/api/v1/blocks/{block_id}",
    headers={"Authorization": f"Bearer {token}"},
    json={
        "price_per_call": 0.002,
        "is_public": True,
        "description": "Updated description"
    })
```

### Clear block cache

```bash
# Invalidate cache for specific block
curl -X DELETE "http://127.0.0.1:8000/api/v1/invoke/cache/my-block-id" \
  -H "Authorization: Bearer $TOKEN"
```

## API Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Service health check |
| `/api/v1/auth/register` | POST | User registration |
| `/api/v1/auth/login` | POST | User authentication |
| `/api/v1/auth/me` | GET | Current user profile |
| `/api/v1/blocks/` | GET | List public blocks |
| `/api/v1/blocks/` | POST | Create new block |
| `/api/v1/blocks/{id}` | GET/PUT/DELETE | Manage specific block |
| `/api/v1/blocks/my` | GET | List user's blocks |
| `/api/v1/invoke/{block_id}` | POST | **Invoke block** |
| `/api/v1/invoke/history` | GET | Invocation history |
| `/api/v1/invoke/analytics` | GET | Usage analytics |
| `/api/v1/invoke/rate-limit/status` | GET | Rate limit status |

> **Tip:** Interactive API documentation is available at `http://127.0.0.1:8000/docs` when the server is running.

## Configuration

FlowBus uses environment variables for configuration. Create a `.env` file in the backend directory:

```bash
# JWT Configuration
SECRET_KEY=your-super-secret-key-change-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database
DATABASE_URL=postgresql://flowbus:flowbus_dev@localhost:5432/flowbus

# Redis Cache
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

# Rate Limiting
USER_RATE_LIMIT_PER_MINUTE=60
BLOCK_RATE_LIMIT_PER_MINUTE=100
```

**Default values** are set for development. Override any setting by adding it to your `.env` file or setting environment variables directly.

## Troubleshooting

### "Connection refused" errors
**Cause**: PostgreSQL or Redis not running  
**Fix**: Start services with `docker-compose up -d`

### "Authentication failed" errors  
**Cause**: Invalid or expired JWT token  
**Fix**: Login again to get a fresh token: `POST /api/v1/auth/login`

### "Rate limit exceeded" errors
**Cause**: Too many requests in short time  
**Fix**: Wait 60 seconds or check limits: `GET /api/v1/invoke/rate-limit/status`

### "Block not found" errors
**Cause**: Invalid block ID or private block  
**Fix**: Check block exists: `GET /api/v1/blocks/` and verify permissions

### Import errors in Python
**Cause**: Missing dependencies  
**Fix**: Reinstall requirements: `pip install -r requirements.txt`

### Frontend won't start
**Cause**: Node.js version or missing packages  
**Fix**: Use Node.js 18+, run `npm install` in frontend directory

## FAQ

**Q: How do I monetize my API?**  
A: Create a block pointing to your API endpoint, set a price per call, and users pay to invoke it through FlowBus. Revenue sharing splits earnings between you and the platform.

**Q: Can I test blocks before publishing?**  
A: Yes, create blocks as private first. Use the invoke endpoint to test functionality, then set `is_public: true` to publish.

**Q: What's the difference between blocks and workflows?**  
A: Blocks wrap individual APIs. Workflows (coming soon) chain multiple blocks together for complex automations.

**Q: How does rate limiting work?**  
A: Users get 60 requests/minute, blocks get 100 requests/minute. Limits are configurable and tracked per user/block combination.

**Q: Can I use custom authentication for my API?**  
A: Yes, blocks can forward custom headers and authentication to your underlying API endpoint.

**Q: How is pricing calculated?**  
A: Each successful block invocation charges the price_per_call amount. Failed requests (4xx/5xx) are not charged.

**Q: Is there a sandbox environment?**  
A: The development setup acts as a sandbox. For production testing, deploy to a staging environment with separate databases.

**Q: How do I handle API keys for my blocks?**  
A: Pass API keys as parameters in the invoke request body. FlowBus forwards them to your endpoint without storing them.

## Links

- **Repository**: [GitHub](https://github.com/your-username/flowbus)
- **API Documentation**: http://127.0.0.1:8000/docs (when running locally)
- **Issues & Support**: [GitHub Issues](https://github.com/your-username/flowbus/issues)
- **Releases**: [GitHub Releases](https://github.com/your-username/flowbus/releases)
- **Docker Hub**: [flowbus/api](https://hub.docker.com/r/flowbus/api)