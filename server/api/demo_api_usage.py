#!/usr/bin/env python3
"""
Demo script showing how to use the Career Coach API programmatically.
"""

import requests
import json

def chat_with_career_coach(resume_text: str, vent_text: str, temperature: float = 0.7):
    """
    Send a request to the career coach API and print the streaming response.
    """

    payload = {
        "resume_text": resume_text,
        "vent_text": vent_text,
        "temperature": temperature,
        "max_tokens": 1024
    }

    print("🤖 Sending request to Career Coach API...")
    print(f"📝 Resume length: {len(resume_text)} characters")
    print(f"😤 Vent length: {len(vent_text)} characters")
    print("-" * 60)

    try:
        response = requests.post(
            "http://localhost:8000/chat",
            json=payload,
            stream=True,
            timeout=300
        )

        if response.status_code == 200:
            print("💬 AI Response (streaming):\n")

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
                                print(f"\n\n✅ Response complete! ({duration:.2f} seconds)")
                                break
                        except json.JSONDecodeError:
                            continue

            return full_response
        else:
            print(f"❌ Request failed: {response.status_code}")
            print(response.text)
            return None

    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def main():
    print("🎯 Career Coach API Demo")
    print("=" * 40)

    # Sample resume and vent
    sample_resume = """Sarah Johnson
Marketing Manager with 10 years experience

EXPERIENCE:
Senior Marketing Manager, Global Tech Inc (2018-Present)
- Led digital marketing campaigns generating $2M+ revenue
- Managed team of 8 marketing professionals
- Implemented SEO strategies and content marketing

Marketing Coordinator, StartupXYZ (2014-2018)
- Developed social media presence from 0 to 50K followers
- Created email marketing campaigns with 25% open rates
- Managed website redesign and brand refresh

EDUCATION:
MBA Marketing, Business University (2014)
BA Communications, State College (2012)

SKILLS:
- Digital Marketing, SEO/SEM, Content Strategy
- Google Analytics, Facebook Ads, HubSpot
- Team Leadership, Project Management
- Adobe Creative Suite, Canva"""

    sample_vent = """I'm 38 years old and completely exhausted from marketing. I've been in this field for 12 years and I'm tired of the constant pressure to perform, endless campaign optimizations, and feeling like I'm just chasing vanity metrics. I want to do something more meaningful - maybe work in education or non-profit work. But I'm terrified about the pay cut - I have a house, two kids, and aging parents I help support. How do I even begin to think about this transition?"""

    # Make the API call
    response = chat_with_career_coach(sample_resume, sample_vent)

    if response:
        print(f"\n📊 Response summary:")
        print(f"   Length: {len(response)} characters")
        print(f"   Words: {len(response.split())} words")
        print("✅ Demo completed successfully!")
    else:
        print("❌ Demo failed. Make sure the API server is running:")
        print("   python run_api_server.py")

if __name__ == "__main__":
    main()
