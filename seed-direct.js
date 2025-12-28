// Direct seeding script to bypass tsx issues
process.env.DATABASE_URL = "postgres://02aa437a5ddfbf64e3f21d0c1f4c78cc5484ad0138c7285084a4b1e459a4b53c:sk_w2rEISGsWfZKf8yUaTl0J@db.prisma.io:5432/postgres?sslmode=require";

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function seed() {
  console.log('🌱 Starting direct seed...');

  const prisma = new PrismaClient();

  try {
    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 12);

    // Check if test user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });

    if (existingUser) {
      console.log('ℹ️  Test user already exists, updating...');
      await prisma.user.update({
        where: { email: 'test@example.com' },
        data: {
          password: hashedPassword,
          name: 'Test User',
          provider: 'credentials'
        }
      });
    } else {
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

    console.log('✅ Database seeded successfully!');
    console.log('📧 Test login: test@example.com / password123');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
