# FlowBus Test Suite

This directory contains all testing scripts and utilities for the FlowBus platform.

## Directory Structure

### `/integration/`
End-to-end integration tests that test the complete API functionality.

- **`test_auth_implementation.py`** - Complete authentication flow testing
- **`test_block_management.py`** - Complete block CRUD operations testing

### `/unit/`
Unit tests for individual components (to be added).

### `/scripts/`
Utility scripts for testing and debugging.

- **`quick-test-macos.sh`** - Quick API health check and basic functionality test
- **`test-server-startup.sh`** - Server startup and import validation

## Running Tests

### Integration Tests
```bash
# Authentication test
cd tests/integration && python test_auth_implementation.py

# Block management test  
cd tests/integration && python test_block_management.py
```

### Quick Validation
```bash
# Run from project root
tests/scripts/quick-test-macos.sh
```

### Server Startup Test
```bash
# Run from project root
tests/scripts/test-server-startup.sh
```

## Test Requirements

- Server must be running on http://127.0.0.1:8000 or http://localhost:8000
- Database must be accessible (Docker containers running)
- Python environment must have all dependencies installed

## Adding New Tests

- **Integration tests**: Add to `/integration/` directory
- **Unit tests**: Add to `/unit/` directory  
- **Scripts**: Add to `/scripts/` directory
- **Update this README** when adding new test categories
