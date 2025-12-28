import { NextResponse } from 'next/server';
import { env } from '@/lib/env';

export async function GET() {
  // Only allow in development
  if (env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Debug endpoint not available in production' }, { status: 403 });
  }

  return NextResponse.json({
    environment: env.NODE_ENV,
    nextauth_url: env.NEXTAUTH_URL,
    nextauth_secret_length: env.NEXTAUTH_SECRET?.length || 0,
    database_url: env.DATABASE_URL ? 'SET' : 'NOT SET',
    google_ai_key: env.GOOGLE_GENERATIVE_AI_API_KEY ? 'SET' : 'NOT SET',
    timestamp: new Date().toISOString()
  });
}
