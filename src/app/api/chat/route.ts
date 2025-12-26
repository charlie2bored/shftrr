import { NextRequest, NextResponse } from 'next/server';

const API_URL = 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const backendResponse = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      return NextResponse.json(
        { error: `Backend error: ${backendResponse.status} - ${errorText}` },
        { status: backendResponse.status }
      );
    }

    // Get the full response as text since it's streaming
    const responseText = await backendResponse.text();

    return new NextResponse(responseText, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
