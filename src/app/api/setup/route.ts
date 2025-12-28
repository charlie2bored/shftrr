import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    // Create Prisma client for production
    const prisma = new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL,
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
