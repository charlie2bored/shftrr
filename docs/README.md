# Career Pivot Coach

A complete AI-powered career coaching system with local privacy-first processing.

## Architecture

```
/
├── train/           # Model fine-tuning and training logic
├── app/            # Next.js frontend application
├── server/         # FastAPI backend server
├── models/         # Local model storage (GGUF files)
└── docs/           # Documentation and examples
```

## Quick Start

**Run the complete system:**
```bash
cd server && python run-complete-system.py
```

This starts everything you need:
- 🔧 FastAPI backend on http://localhost:8000
- 🎨 Next.js dashboard on http://localhost:3000
- 📚 API docs on http://localhost:8000/docs

## Prerequisites

- **Ollama** installed and running
- **Python 3.8+** for backend and training
- **Node.js 18+** for frontend
- **Model loaded**: `ollama create career-pivot-v1 -f /models/career-pivot-v1/model.gguf`

## Components

### 🎯 Model Training (`/train`)

Fine-tune Llama models for career coaching:

```bash
cd train
pip install -r requirements.txt
python run_full_pipeline.py
```

### 🔧 Backend Server (`/server`)

FastAPI server with streaming responses:

```bash
cd server
pip install -r api_requirements.txt
python api/career_coach_api.py
```

### 🎨 Frontend Dashboard (`/app`)

Next.js dashboard with dark mode:

```bash
cd app
npm install
npm run dev
```

## Key Features

- **🔒 Privacy First**: All processing happens locally, no external APIs
- **⚡ Streaming**: Real-time word-by-word AI responses
- **📊 History**: Persistent conversation storage
- **🌓 Dark Mode**: Professional aesthetic
- **📱 Responsive**: Works on all devices

## Development

See individual README files in each component directory for detailed development instructions.

## API Reference

- `POST /chat` - Send resume and vent text for coaching
- `GET /health` - Check system status
- `GET /docs` - Interactive API documentation

## Deployment

The system is designed for local deployment with Ollama. All components can be containerized for production deployment.

## Contributing

Follow the coding standards in `.cursorrules`:
- TypeScript for frontend, functional Python for backend
- Privacy-first data handling
- Comprehensive error handling
- Type safety throughout