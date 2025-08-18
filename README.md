# flowbus
flowbus codebase

## 🌍 A Revolution in the Making
Over the past five years, AI and API development exploded:
- LangChain enables LLM chaining
- Zapier/n8n enable non-coders to automate tasks
- Hundreds of thousands of APIs/agents exist, but most aren't monetized

## ❗ The Gap
From a single API to a monetizable product is still hard. There's a massive opportunity:
> If APIs, agents, and workflows can be modular like LEGO blocks—composable, tradeable, monetizable—we unlock a new creator economy.

---

## 🌟 FlowBus = Steam + AWS + Zapier + Shopify
A full-stack AI + API building and monetization platform:

1. Upload APIs / Agents as **Blocks**
2. Assemble Blocks into **Workflows**
3. Add UI to create full **Apps**
4. Publish on marketplace with revenue sharing

## 🚀 Quick Start

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

# The API will be available at http://127.0.0.1:8000
# API docs: http://127.0.0.1:8000/docs
```

### Manual Setup (All Platforms)
```bash
# Start the development environment
docker-compose up -d

# Set up backend
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

# The API will be available at http://localhost:8000
# Health check: http://localhost:8000/health
```

### Development
```bash
# Backend development (in backend/ directory)
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend development (in frontend/ directory)
cd frontend
npm install
npm start
```

## 📁 Project Structure
```
flowbus/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── models.py       # SQLAlchemy models
│   │   ├── schemas.py      # Pydantic schemas
│   │   └── database.py     # Database configuration
│   ├── main.py             # FastAPI app entry point
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile
├── frontend/               # React frontend (coming soon)
├── docker-compose.yml      # Development environment
└── README.md
```

## 🎉 **MAJOR MILESTONE: Invocation Engine Complete!**

### 🎯 **Current MVP Status: 67% Complete**
- ✅ **Block upload** (metadata, endpoint, pricing) - COMPLETE
- ✅ **Public listing + owner dashboard** - COMPLETE
- ✅ **Block invocation engine** - **FULLY COMPLETE** ✨
- ✅ **Basic usage tracking and billing** - **FULLY COMPLETE** ✨
- ⏳ **Stripe payment flow** - Next Phase
- ⏳ **Revenue sharing logic** - Next Phase

### ⚡ **New: Enterprise-Grade Invocation Engine**
**FlowBus now has a complete API proxy with advanced features:**
- 🚀 **API Proxy**: `POST /api/v1/invoke/{block_id}` - Route any API through FlowBus
- 📊 **Usage Tracking**: Complete invocation logging with cost calculation
- 🛡️ **Rate Limiting**: 60 req/min per user, 100 req/min per block (configurable)
- ⚡ **Response Caching**: 5-minute intelligent caching for better performance
- 📈 **Analytics**: Comprehensive usage stats and performance monitoring
- 🔧 **Error Handling**: Robust timeout and connection error management

---

## ⛓️ **Backend API Endpoints (Complete)**

### 🔐 **Authentication**
- `POST /api/v1/auth/login` - User login with JWT
- `GET /api/v1/auth/me` - Get current user info

### 👥 **User Management**  
- `POST /api/v1/users/` - User registration
- `GET /api/v1/users/me` - Current user profile
- `GET /api/v1/users/{user_id}` - User details

### 📦 **Block Management**
- `GET /api/v1/blocks/` - List all public blocks
- `GET /api/v1/blocks/my` - List user's blocks
- `POST /api/v1/blocks/` - Create new block
- `GET /api/v1/blocks/{block_id}` - Get block details
- `PUT /api/v1/blocks/{block_id}` - Update block
- `DELETE /api/v1/blocks/{block_id}` - Delete block

### 🚀 **Invocation Engine** (Just Completed!)
- `POST /api/v1/invoke/{block_id}` - **Invoke any block** ✨
- `GET /api/v1/invoke/history` - User invocation history
- `GET /api/v1/invoke/analytics` - Usage analytics
- `GET /api/v1/invoke/cache/stats` - Cache performance stats
- `DELETE /api/v1/invoke/cache/{block_id}` - Cache invalidation
- `GET /api/v1/invoke/rate-limit/status` - Rate limit monitoring

## 🗃️ Database Tables
- `users`, `blocks`, `invocations`, `billing_logs`, `revenue_splits`

## 🧪 Dev Setup
- Docker Compose: API + PostgreSQL + Redis
- GitHub Actions for CI
- Local test suite with pytest

## 📋 Weekly Plan: MVP Execution Timeline

| Weeks     | Phase     | Tasks                                          | Deliverables                     |
|-----------|-----------|------------------------------------------------|----------------------------------|
| 1–2       | Phase 1   | Design Block model, API contracts, payment flow | API spec, schema, design docs   |
| 3–4       | Phase 1   | Build backend API, billing tracker             | Working Block API                |
| 5–6       | Phase 1   | Frontend upload page                           | React UI for Block upload        |
| 7–8       | Phase 1   | Stripe integration, rev share logic            | Simulated billing & rev split    |
| 9–10      | Phase 1   | Testing, staging deploy                        | Public MVP                       |

## 🔧 Tech Stack

| Function             | Stack                                      |
|----------------------|--------------------------------------------|
| Backend              | FastAPI (Python)                           |
| Frontend             | React + TypeScript                         |
| Database             | PostgreSQL                                 |
| Auth                 | OAuth2 + JWT                               |
| Payments             | Stripe / PayPal                            |
| Monitoring           | Prometheus + Grafana or ELK                |
| Drag-and-Drop Editor | React Flow / D3.js / JointJS               |
| CI/CD                | GitHub Actions                             |
| Containerization     | Docker + Kubernetes (or AWS ECS)           |
| Version Control      | Git + GitHub                               |
| UI/UX Design         | Figma / Sketch                             |
| Infra Management     | Helm (K8s) / Terraform                     |

## 🚀 **Next Steps: Frontend Dashboard**

### **IMMEDIATE PRIORITY (Phase 3)**
1. **Epic 3.1**: Authentication UI (React login/register) - Week 1
2. **Epic 3.2**: Block Management UI (create/edit blocks) - Week 1-2  
3. **Epic 3.3**: Invocation Interface (test APIs) - Week 2
4. **Epic 3.4**: Analytics Dashboard (usage stats) - Week 2-3
5. **Epic 3.5**: UI/UX Polish (design system) - Week 3

### **FOLLOWING PHASES**
- **Phase 4**: Billing System (Stripe integration)
- **Phase 5**: Production Deployment & Scale

### **📋 Epic Reference System**
- ✅ **Phase 1**: Infrastructure (Epic 1.1-1.4) - COMPLETE
- ✅ **Phase 2**: Invocation Engine (Epic 2.1-2.4) - COMPLETE  
- 🔄 **Phase 3**: Frontend Dashboard (Epic 3.1-3.5) - READY TO START

## 🧪 Testing
```bash
# Quick validation
tests/scripts/quick-test-macos.sh

# Full authentication test
cd tests/integration && python test_auth_implementation.py

# Full block management test
cd tests/integration && python test_block_management.py
```

## 📖 Documentation
- **Complete Documentation**: [doc/README.md](doc/README.md)
- **API Documentation**: http://127.0.0.1:8000/docs (when server is running)