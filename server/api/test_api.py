#!/usr/bin/env python3
"""
Test client for Career Pivot Coach API.
"""

import requests
import json
import sys

def test_health():
    """Test the health endpoint."""
    print("🏥 Testing health endpoint...")
    try:
        response = requests.get("http://localhost:8000/health", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print("✅ Health check passed!")
            print(f"   Status: {data.get('status')}")
            print(f"   Ollama: {data.get('ollama')}")
            print(f"   Model available: {data.get('available')}")
            if not data.get('available'):
                print(f"   Error: {data.get('error')}")
                return False
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_chat_streaming():
    """Test the chat endpoint with streaming."""
    print("\n💬 Testing chat endpoint with streaming...")

    # Sample resume and vent
    payload = {
        "resume_text": """John Doe
Software Engineer with 8 years experience

EXPERIENCE:
Senior Software Engineer, Tech Corp (2018-Present)
- Led development of microservices architecture
- Managed team of 5 developers
- Implemented CI/CD pipelines

Software Engineer, Startup Inc (2015-2018)
- Full-stack development using React and Node.js
- Database design and optimization

EDUCATION:
BS Computer Science, University of Tech (2015)

SKILLS:
- Python, JavaScript, Java
- React, Node.js, Docker
- AWS, Kubernetes, PostgreSQL""",

        "vent_text": "I'm 35 years old and feeling completely burnt out from software engineering. I've been doing this for 8 years and I'm tired of the constant pressure, endless debugging, and feeling like I'm just maintaining legacy code. I want to do something more meaningful but I'm scared about the financial risk - I have a mortgage and two kids. What should I do?",

        "temperature": 0.7,
        "max_tokens": 1024
    }

    try:
        print("📤 Sending request to /chat...")
        print("📝 Resume preview:", payload["resume_text"][:100] + "...")
        print("😤 Vent preview:", payload["vent_text"][:100] + "...")

        response = requests.post(
            "http://localhost:8000/chat",
            json=payload,
            stream=True,
            timeout=300
        )

        if response.status_code == 200:
            print("✅ Chat request accepted, streaming response:")
            print("-" * 50)

            full_response = ""
            for line in response.iter_lines():
                if line:
                    line = line.decode('utf-8')
                    if line.startswith('data: '):
                        try:
                            data = json.loads(line[6:])  # Remove 'data: ' prefix
                            if 'text' in data:
                                print(data['text'], end='', flush=True)
                                full_response += data['text']
                            elif 'done' in data and data['done']:
                                duration = data.get('total_duration', 0) / 1e9  # Convert to seconds
                                print(f"\n\n✅ Response complete! ({duration:.2f}s)")
                                break
                        except json.JSONDecodeError:
                            continue

            print("-" * 50)
            print(f"📊 Total response length: {len(full_response)} characters")
            return True
        else:
            print(f"❌ Chat request failed: {response.status_code}")
            print(response.text)
            return False

    except Exception as e:
        print(f"❌ Chat request error: {e}")
        return False

def main():
    print("🧪 Testing Career Pivot Coach API")
    print("=" * 50)

    if not test_health():
        print("\n❌ API is not ready. Make sure:")
        print("   1. FastAPI server is running: python career_coach_api.py")
        print("   2. Ollama is running: ollama serve")
        print("   3. Model is loaded: ollama run career-pivot-v1")
        sys.exit(1)

    if not test_chat_streaming():
        print("\n❌ Chat test failed!")
        sys.exit(1)

    print("\n🎉 All tests passed!")

if __name__ == "__main__":
    main()
