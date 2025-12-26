# Backend Server

FastAPI server providing streaming career coaching API.

## Structure

```
server/
├── api/           # API endpoints and handlers
├── core/          # Core business logic
├── models/        # Pydantic data models
├── services/      # External integrations
├── utils/         # Helper functions
└── tests/         # Test files
```

## Quick Start

```bash
# Install dependencies
pip install -r api_requirements.txt

# Run server
python api/career_coach_api.py

# Run complete system (backend + frontend)
python run-complete-system.py
```

## API Endpoints

- `POST /chat` - Streaming career coaching responses
- `GET /health` - System health check
- `GET /docs` - Interactive API documentation

## Development

- **Functional Programming**: Pure functions, immutability
- **Type Safety**: Comprehensive type hints
- **Error Handling**: Custom exceptions with proper HTTP codes
- **Streaming**: Server-Sent Events for real-time responses

## Key Features

- **Privacy First**: All processing local, no external data transmission
- **Streaming Responses**: Real-time AI generation
- **Health Monitoring**: System status and model availability
- **CORS Support**: Configured for local development

## Testing

```bash
# Run API tests
python api/test_api.py

# Demo usage
python api/demo_api_usage.py
```

