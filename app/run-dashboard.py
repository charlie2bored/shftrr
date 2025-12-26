#!/usr/bin/env python3
"""
Script to run the Career Pivot Dashboard with Next.js.
"""

import subprocess
import sys
import os

def run_dashboard():
    """Run the Next.js dashboard."""
    print("🚀 Starting Career Pivot Dashboard")
    print("=" * 50)

    # Check if we're in the right directory
    if not os.path.exists("package.json"):
        print("❌ Not in the dashboard directory. Please run from careerpivot-dashboard/")
        sys.exit(1)

    # Check if node_modules exists
    if not os.path.exists("node_modules"):
        print("📦 Installing dependencies...")
        subprocess.run([sys.executable, "-m", "npm", "install"], check=True)
        print("✅ Dependencies installed!")

    print("\n🌐 Starting Next.js development server...")
    print("📱 Dashboard will be available at: http://localhost:3000")
    print("🔗 Make sure the FastAPI server is running on http://localhost:8000")
    print("\nPress Ctrl+C to stop the dashboard")
    print("-" * 50)

    # Run the development server
    try:
        subprocess.run(["npm", "run", "dev"], check=True)
    except KeyboardInterrupt:
        print("\n👋 Dashboard stopped")

if __name__ == "__main__":
    run_dashboard()
