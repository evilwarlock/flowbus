# FlowBus Tech Stack

## Technology Stack Overview

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

## Prerequisites
- Docker and Docker Compose
- Python 3.11+
- Node.js 18+ (for frontend)

## Development Environment
- Docker Compose: API + PostgreSQL + Redis
- GitHub Actions for CI
- Local test suite with pytest

## Architecture Principles
- Microservices-oriented design
- API-first development
- Containerized deployment
- Cloud-native infrastructure
- Scalable and maintainable codebase
