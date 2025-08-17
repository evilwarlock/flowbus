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

## 🎯 Phase 1 MVP Features
- ✅ Block upload (metadata, endpoint, pricing)
- ✅ Public listing + owner dashboard
- ✅ Block invocation engine
- ✅ Basic usage tracking and billing
- ✅ Stripe payment flow
- ✅ Revenue sharing logic

---

## ⛓️ Backend Modules (FastAPI)
- `/blocks` – CRUD API for block upload and search
- `/invoke/{block_id}` – API proxy + usage tracker
- `/billing` – Revenue aggregation
- `/auth` – JWT-based user identity

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

## 🚀 Next Steps
1. **Week 1-2**: Complete the backend API endpoints
2. **Week 3-4**: Build the React frontend for block upload
3. **Week 5-6**: Integrate Stripe payments
4. **Week 7-8**: Add monitoring and testing
5. **Week 9-10**: Deploy to staging and production

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