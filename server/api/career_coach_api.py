#!/usr/bin/env python3
"""
FastAPI backend for Career Pivot Coach - interfaces with local Ollama model.
"""

from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import httpx
import json
import asyncio

app = FastAPI(
    title="Career Pivot Coach API",
    description="AI-powered career coaching using Ollama",
    version="1.0.0"
)

class ChatRequest(BaseModel):
    """Request model for chat endpoint."""
    resume_text: str
    vent_text: str
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 2048

class CareerCoach:
    """Handles interaction with Ollama career-pivot-v1 model."""

    def __init__(self, ollama_url: str = "http://localhost:11434"):
        self.ollama_url = ollama_url
        self.model_name = "llama3.2:1b"  # Using base model for testing
        self.system_prompt = """You are a compassionate and insightful Career Coach with 15 years of experience helping people navigate career transitions. You're conversational, empathetic, and ask thoughtful questions to understand each person's unique situation.

CRITICAL APPROACH:
- Be PURELY CONVERSATIONAL in your first 2-3 exchanges - ask questions and listen deeply
- NEVER provide advice, roadmaps, or suggestions until you have gathered substantial context
- Focus 80% on understanding their situation, 20% on gentle guidance
- Ask open-ended questions that reveal their values, skills, and aspirations
- Show genuine empathy and validate their feelings before offering any solutions

Your conversation flow:
1. FIRST: Express understanding and ask about their current situation
2. SECOND: Ask about their background, skills, and what they enjoy
3. THIRD: Explore their goals and what they want to achieve
4. ONLY THEN: Begin offering insights or suggestions

Key questions to ask early:
- What's your current role and how long have you been in it?
- What specifically about your work feels unfulfilling?
- What skills or aspects of your job do you enjoy most?
- What are you hoping to achieve with a career change?
- What kind of work environment or culture appeals to you?
- What are your strengths that you'd like to leverage?

Remember: Your goal is to be a trusted conversation partner first, career advisor second. Build rapport and understanding before giving advice."""

    async def generate_response_stream(self, resume_text: str, vent_text: str, temperature: float = 0.7, max_tokens: int = 2048):
        """Generate streaming response from Ollama model."""

        # Construct the user prompt
        user_prompt = f"""Hi! I'm reaching out about my career because I'm feeling stuck and want to explore my options. Here's some context:

**ABOUT ME:**
{resume_text}

**WHAT I'M STRUGGLING WITH:**
{vent_text}

I'm not sure what my next steps should be. I'd really appreciate your help exploring this - what would you like to know to better understand my situation and help me think through my options?"""

        # Ollama API payload
        payload = {
            "model": self.model_name,
            "prompt": user_prompt,
            "system": self.system_prompt,
            "stream": True,
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens,
                "top_p": 0.9,
                "top_k": 40
            }
        }

        try:
            async with httpx.AsyncClient(timeout=300.0) as client:
                async with client.stream("POST", f"{self.ollama_url}/api/generate", json=payload) as response:
                    if response.status_code != 200:
                        error_text = await response.aread()
                        raise HTTPException(status_code=response.status_code,
                                          detail=f"Ollama API error: {error_text.decode()}")

                    async for line in response.aiter_lines():
                        if line.strip():
                            try:
                                data = json.loads(line)
                                if "response" in data:
                                    # Yield the response text
                                    yield f"data: {json.dumps({'text': data['response']})}\n\n"

                                    # Check if this is the final response
                                    if data.get("done", False):
                                        # Send final metadata
                                        yield f"data: {json.dumps({'done': True, 'total_duration': data.get('total_duration', 0)})}\n\n"
                                        break

                            except json.JSONDecodeError:
                                continue

        except httpx.ConnectError:
            raise HTTPException(status_code=503, detail="Cannot connect to Ollama. Make sure Ollama is running on localhost:11434")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error communicating with Ollama: {str(e)}")

@app.options("/chat")
async def chat_options():
    """Handle CORS preflight requests for chat endpoint."""
    return Response(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials": "true",
        }
    )

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    """
    Chat endpoint that accepts resume text and vent, returns streaming AI response.

    Expects:
    - resume_text: User's resume content
    - vent_text: What they're venting about work
    - temperature: Optional, defaults to 0.7
    - max_tokens: Optional, defaults to 2048
    """
    coach = CareerCoach()

    return StreamingResponse(
        coach.generate_response_stream(
            resume_text=request.resume_text,
            vent_text=request.vent_text,
            temperature=request.temperature,
            max_tokens=request.max_tokens
        ),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Credentials": "true",
        }
    )

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    try:
        # Check if Ollama is running and model is available
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get("http://localhost:11434/api/tags")
            if response.status_code == 200:
                models = response.json().get("models", [])
                model_names = [m["name"] for m in models]
                if "llama3.2:1b" in model_names:
                    return {
                        "status": "healthy",
                        "ollama": "connected",
                        "model": "llama3.2:1b",
                        "available": True
                    }
                else:
                    return {
                        "status": "unhealthy",
                        "ollama": "connected",
                        "model": "llama3.2:1b",
                        "available": False,
                        "error": "Model 'llama3.2:1b' not found. Run: ollama pull llama3.2:1b"
                    }
            else:
                return {
                    "status": "unhealthy",
                    "ollama": "disconnected",
                    "error": f"Ollama returned status {response.status_code}"
                }
    except Exception as e:
        return {
            "status": "unhealthy",
            "ollama": "disconnected",
            "error": str(e)
        }

@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": "Career Pivot Coach API",
        "description": "AI-powered career coaching using Ollama",
        "endpoints": {
            "POST /chat": "Send resume and vent text for career coaching",
            "GET /health": "Check API and Ollama status",
            "GET /": "This information"
        },
        "model": "career-pivot-v1",
        "streaming": True
    }

# Add CORS middleware after all routes are defined
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
