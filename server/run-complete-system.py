#!/usr/bin/env python3
"""
Complete Career Pivot Coach system runner.
Starts both FastAPI backend and Next.js dashboard.
"""

import subprocess
import sys
import os
import signal
import time
from threading import Thread

def check_ollama():
    """Check if Ollama is running and has the model."""
    try:
        import httpx
        response = httpx.get("http://localhost:11434/api/tags", timeout=5)
        if response.status_code == 200:
            models = response.json().get("models", [])
            model_names = [m["name"] for m in models]
            if "llama3.2:1b" in model_names:
                return True, "Ollama running with llama3.2:1b model"
            else:
                return False, "Ollama running but llama3.2:1b model not found. Run: ollama pull llama3.2:1b"
        else:
            return False, f"Ollama API returned status {response.status_code}"
    except Exception as e:
        return False, f"Cannot connect to Ollama: {e}"

def run_fastapi():
    """Run the FastAPI server."""
    print("🔧 Starting FastAPI backend...")
    try:
        # Change to the server directory
        server_dir = os.path.dirname(os.path.abspath(__file__))
        os.chdir(server_dir)
        subprocess.run([sys.executable, "api/career_coach_api.py"], check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ FastAPI server failed: {e}")
    except KeyboardInterrupt:
        print("🔧 FastAPI server stopped")

def run_nextjs():
    """Run the Next.js dashboard."""
    print("🎨 Starting Next.js dashboard...")
    try:
        # Go up one level from server/ to project root, then to app/
        project_root = os.path.dirname(os.path.abspath(__file__))
        dashboard_dir = os.path.join(project_root, "app")
        os.chdir(dashboard_dir)

        # Install dependencies if needed
        if not os.path.exists("node_modules"):
            print("📦 Installing dashboard dependencies...")
            subprocess.run(["npm", "install"], check=True, capture_output=True)

        subprocess.run(["npm", "run", "dev"], check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Next.js dashboard failed: {e}")
    except KeyboardInterrupt:
        print("🎨 Next.js dashboard stopped")

def main():
    print("🚀 Career Pivot Coach - Complete System")
    print("=" * 60)

    # Check prerequisites
    print("🔍 Checking prerequisites...")

    # Check Ollama
    ollama_ok, ollama_msg = check_ollama()
    if ollama_ok:
        print(f"✅ {ollama_msg}")
    else:
        print(f"❌ {ollama_msg}")
        print("\n📋 Setup instructions:")
        print("1. Install Ollama: https://ollama.ai")
        print("2. Start Ollama: ollama serve")
        print("3. Load model: ollama create career-pivot-v1 -f /models/career-pivot-v1/model.gguf")
        print("4. Run model: ollama run career-pivot-v1")
        return

    # Check if dashboard directory exists
    project_root = os.path.dirname(os.path.abspath(__file__))  # server directory
    project_root = os.path.dirname(project_root)  # project root
    dashboard_dir = os.path.join(project_root, "app")
    if not os.path.exists(dashboard_dir):
        print("❌ Dashboard directory not found. Make sure app/ exists.")
        return

    print("\n🌟 Starting complete system...")
    print("🔧 Backend API: http://localhost:8000")
    print("🎨 Frontend Dashboard: http://localhost:3000")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("\nPress Ctrl+C to stop all services")
    print("=" * 60)

    # Start both servers in parallel
    try:
        # Start FastAPI in a thread
        api_thread = Thread(target=run_fastapi, daemon=True)
        api_thread.start()

        # Give FastAPI a moment to start
        time.sleep(2)

        # Start Next.js (this will block)
        run_nextjs()

    except KeyboardInterrupt:
        print("\n👋 Shutting down complete system...")
        print("✅ All services stopped")

if __name__ == "__main__":
    main()
