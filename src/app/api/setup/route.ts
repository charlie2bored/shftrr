import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import bcrypt from 'bcryptjs';

async function handleSetup() {
  try {
    // Create Prisma client for production with explicit Accelerate URL
    const prisma = new PrismaClient({
      datasourceUrl: "prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza193MnJFSVNHc1dmWktmOHlVYVRsMEoiLCJhcGlfa2V5IjoiMDFLREhSUFJGUVZUQUM4QVg4TjVaVlhIWEsiLCJ0ZW5hbnRfaWQiOiIwMmFhNDM3YTVkZGZiZjY0ZTNmMjFkMGMxZjRjNzhjYzU0ODRhZDAxMzhjNzI4NTA4NGE0YjFlNDU5YTRiNTNjIiwiaW50ZXJuYWxfc2VjcmV0IjoiOWYyYmI3NzYtYjA4Ni00Mzg0LTg1NTYtN2Q5YmJkNjUxNzU5In0.ZyDJYIXkdCYX9ISv_sD67V65MLZV8odlwh-XgbrEX3M"
    }).$extends(withAccelerate());

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 12);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });

    if (existingUser) {
      // Update existing user
      await prisma.user.update({
        where: { email: 'test@example.com' },
        data: {
          password: hashedPassword,
          name: 'Test User',
          provider: 'credentials'
        }
      });
    } else {
      // Create new user
      await prisma.user.create({
        data: {
          id: 'test-user-id',
          email: 'test@example.com',
          name: 'Test User',
          password: hashedPassword,
          provider: 'credentials'
        }
      });
    }

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully! Try logging in with test@example.com / password123'
    });

  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to setup database',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  // Allow GET requests for easy testing in browser
  return handleSetup();
}

export async function POST() {
  return handleSetup();
}
