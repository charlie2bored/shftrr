#!/usr/bin/env python3
"""
Script to run the Career Coach API server.
"""

import subprocess
import sys
import os

def run_server():
    """Run the FastAPI server."""
    print("🚀 Starting Career Pivot Coach API Server")
    print("=" * 50)

    # Check if required packages are installed
    try:
        import fastapi
        import uvicorn
        import httpx
        import pydantic
    except ImportError:
        print("❌ Missing required packages. Installing...")
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "api_requirements.txt"], check=True)
        print("✅ Dependencies installed!")

    # Check if Ollama is running
    print("\n🔍 Checking Ollama status...")
    try:
        import httpx
        response = httpx.get("http://localhost:11434/api/tags", timeout=5)
        if response.status_code == 200:
            models = response.json().get("models", [])
            model_names = [m["name"] for m in models]
            if "career-pivot-v1" in model_names:
                print("✅ Ollama is running and career-pivot-v1 model is available!")
            else:
                print("⚠️  Ollama is running but career-pivot-v1 model not found.")
                print("   Run: ollama create career-pivot-v1 -f /models/career-pivot-v1/model.gguf")
                print("   Then: ollama run career-pivot-v1")
        else:
            print("❌ Ollama API returned unexpected status:", response.status_code)
    except Exception as e:
        print("❌ Cannot connect to Ollama. Make sure Ollama is running:")
        print("   1. Install Ollama: https://ollama.ai")
        print("   2. Start Ollama: ollama serve")
        print("   3. Load model: ollama create career-pivot-v1 -f /models/career-pivot-v1/model.gguf")
        return

    print("\n🌐 Starting FastAPI server on http://localhost:8000")
    print("📖 API Documentation: http://localhost:8000/docs")
    print("🎯 Frontend: Open career_coach_frontend.html in your browser")
    print("\nPress Ctrl+C to stop the server")
    print("-" * 50)

    # Run the server
    os.system(f"{sys.executable} career_coach_api.py")

if __name__ == "__main__":
    run_server()
