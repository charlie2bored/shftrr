# Career Pivot Coach

A complete AI-powered career coaching system that includes model fine-tuning, FastAPI backend, and web frontend.

## Quick Start

**Run the complete system:**
```bash
python run-complete-system.py
```

This starts everything you need:
- 🔧 FastAPI backend on http://localhost:8000
- 🎨 Next.js dashboard on http://localhost:3000
- 📚 API docs on http://localhost:8000/docs

**Prerequisites:**
- Ollama installed and running
- Model loaded: `ollama create career-pivot-v1 -f /models/career-pivot-v1/model.gguf`

## Components

### 1. Model Fine-tuning
- `generate_career_pivot_dataset.py` - Generates the training dataset (1,000 instruction-response pairs)
- `fine_tune_career_coach.py` - Fine-tunes the model using Unsloth
- `career_coach_train.jsonl` - The generated training dataset
- `requirements.txt` - Python dependencies for fine-tuning

### 2. FastAPI Backend
- `career_coach_api.py` - FastAPI server with streaming chat endpoint
- `api_requirements.txt` - Backend dependencies
- `run_api_server.py` - Server startup script
- `test_api.py` - API testing script

### 3. Next.js Dashboard
- `careerpivot-dashboard/` - Modern React dashboard with dark mode
- `careerpivot-dashboard/run-dashboard.py` - Dashboard startup script

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Generate the training dataset (if not already done):
```bash
python generate_career_pivot_dataset.py
```

## Fine-tuning

Run the fine-tuning script:
```bash
python fine_tune_career_coach.py
```

### Configuration

The script is configured with:
- **Model**: `unsloth/Llama-3.2-1B-Instruct`
- **Quantization**: 4-bit
- **LoRA**: Rank=16, Alpha=16
- **Training**: 3 epochs
- **Output**: GGUF format (q4_k_m quantization)
- **Save location**: `/models/career-pivot-v1`

## Using with Ollama

After fine-tuning completes, the model will be saved as a GGUF file in `/models/career-pivot-v1/`.

To use with Ollama:
```bash
# Create Ollama model
ollama create career-pivot-v1 -f /models/career-pivot-v1/model.gguf

# Run the model
ollama run career-pivot-v1
```

## Example Usage

Once running in Ollama, you can interact with the career coach:

```
User: I am a 42-year-old accountant with a mortgage feeling burnt out.

Assistant: **Career Pivot Roadmap**

**1. Transferable Skills Assessment**
Based on your background as an accountant, here are three key transferable skills you possess:
• Financial Analysis
• Data Interpretation
• Risk Assessment

...[rest of response]
```

## Running the API Server

1. **Prerequisites**: Make sure Ollama is installed and the model is loaded:
```bash
# Install Ollama (if not already installed)
# Visit: https://ollama.ai

# Load the fine-tuned model
ollama create career-pivot-v1 -f /models/career-pivot-v1/model.gguf
ollama run career-pivot-v1
```

2. **Start the API server**:
```bash
# Option 1: Using the run script
python run_api_server.py

# Option 2: Direct execution
pip install -r api_requirements.txt
python career_coach_api.py
```

3. **Test the API**:
```bash
python test_api.py
```

## Using the Next.js Dashboard

The dashboard provides a complete career coaching experience:

### Features
- **📝 Dual Input Areas**: Separate tabs for resume and venting
- **✨ Glowing Text Box**: Animated focus effects for better UX
- **📊 Sidebar History**: Stores "Escape Plan" conversations
- **📋 Markdown Roadmap**: Formatted AI responses with icons
- **⚡ Streaming Responses**: Real-time word-by-word generation
- **🌓 Dark Mode**: Professional dark theme throughout

### Starting the Dashboard
```bash
# Quick start (starts both backend and frontend)
python run-complete-system.py

# Or start dashboard only
cd careerpivot-dashboard
python run-dashboard.py
```

### Using the Dashboard
1. **Resume Tab**: Paste your resume, LinkedIn profile, or career summary
2. **Vent Tab**: Share what's frustrating you about work (glowing textarea!)
3. **Send Button**: Get personalized career coaching
4. **Roadmap Panel**: View structured AI responses with markdown formatting
5. **History Sidebar**: Access and manage previous conversations

## API Endpoints

- `POST /chat` - Send resume and vent text, get streaming AI response
- `GET /health` - Check API and Ollama status
- `GET /` - API information
- `GET /docs` - Interactive API documentation (Swagger UI)

### Chat Endpoint

```bash
curl -X POST "http://localhost:8000/chat" \
     -H "Content-Type: application/json" \
     -d '{
       "resume_text": "Your resume content here...",
       "vent_text": "What you are venting about work...",
       "temperature": 0.7,
       "max_tokens": 2048
     }'
```

## Model Details

- **Base Model**: Llama-3.2-1B-Instruct
- **Fine-tuned for**: Career coaching and pivot planning
- **Training Data**: 1,000 synthetic career crisis scenarios
- **Quantization**: Q4_K_M (GGUF format for Ollama)
- **System Prompt**: Defines AI as "Senior Career Strategist" with 20+ years experience