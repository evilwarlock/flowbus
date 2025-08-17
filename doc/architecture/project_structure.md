# FlowBus Project Structure

## Current Project Structure
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
├── doc/                    # Documentation folder
│   ├── plans/             # Project plans and roadmaps
│   ├── modules/           # Module documentation
│   ├── architecture/      # Architecture and design docs
│   └── setup/             # Setup and configuration guides
└── README.md
```

## Documentation Organization

### `/doc/plans/`
- Project vision and roadmap
- MVP timeline and milestones
- Feature specifications

### `/doc/modules/`
- Backend module documentation
- Database schema documentation
- API specifications

### `/doc/architecture/`
- Technology stack overview
- System architecture diagrams
- Design patterns and principles

### `/doc/setup/`
- Development setup guides
- Deployment instructions
- Configuration documentation

## Key Files
- **README.md**: Main project overview and quick start guide
- **docker-compose.yml**: Development environment configuration
- **SETUP.md**: Detailed setup instructions
- Various test files for API validation
