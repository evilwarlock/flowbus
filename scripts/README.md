# FlowBus Development Scripts

This directory contains utility scripts for FlowBus development and setup.

## Development Scripts

### `start-dev-macos.sh`
**Purpose**: Complete development environment setup and startup for macOS

**Features**:
- Checks prerequisites (Docker, Python, PostgreSQL dev tools)
- Starts Docker services (PostgreSQL + Redis)
- Sets up Python virtual environment
- Installs dependencies (with Python 3.13 compatibility)
- Creates configuration files
- Starts FastAPI server

**Usage**:
```bash
./scripts/start-dev-macos.sh
```

### `stop-dev-macos.sh`
**Purpose**: Clean shutdown of development environment

**Features**:
- Stops Docker services
- Provides helpful restart instructions

**Usage**:
```bash
./scripts/stop-dev-macos.sh
```

## Legacy Scripts

### `start-dev.sh` (Root directory)
Original development startup script. Consider using `start-dev-macos.sh` for enhanced features.

## Related Testing Scripts

For testing scripts, see the `tests/` directory:
- `tests/scripts/quick-test-macos.sh` - Quick API validation
- `tests/integration/test_auth_implementation.py` - Full auth testing
- `tests/integration/test_block_management.py` - Full block management testing

## Usage Examples

### Complete Development Setup
```bash
# Start everything
./scripts/start-dev-macos.sh

# In another terminal, run tests
tests/scripts/quick-test-macos.sh

# Stop when done
./scripts/stop-dev-macos.sh
```

### Troubleshooting
If you encounter issues:

1. **PostgreSQL errors**: Run the built-in PostgreSQL installer
2. **Python version issues**: The script handles Python 3.13 compatibility
3. **Permission errors**: Ensure scripts are executable (`chmod +x script_name.sh`)

## Adding New Scripts

When adding new development scripts:
1. Place them in this `scripts/` directory
2. Make them executable: `chmod +x script_name.sh`
3. Update this README with usage information
4. Follow the naming convention: `action-platform.sh`
