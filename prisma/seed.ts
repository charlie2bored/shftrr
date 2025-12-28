import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

// Create Prisma client using same logic as main app
const createPrismaClient = () => {
  const url = process.env.DATABASE_URL;

  console.log('🔧 Starting seed script...');
  console.log('🔧 DATABASE_URL available:', !!url);
  console.log('🔧 URL type:', url?.startsWith('prisma+postgres://') ? 'Accelerate' : 'PostgreSQL');

  if (url?.startsWith('postgres://')) {
    // For PostgreSQL URLs - use adapter
    const connectionString = url;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    const client = new PrismaClient({
      adapter,
    });
    console.log('✅ Seed Prisma client with PostgreSQL adapter created');
    return client;
  } else {
    // Fallback
    const client = new PrismaClient();
    console.log('✅ Seed Prisma client created (fallback)');
    return client;
  }
};

const prisma = createPrismaClient();

async function main() {
  console.log('🌱 Seeding database...')

  try {
    // Test database connection first
    console.log('🔍 Testing database connection...')
    const userCount = await prisma.user.count()
    console.log('✅ Database connection successful, found', userCount, 'users')

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 12)

    // Check if test user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    })

    if (existingUser) {
      console.log('ℹ️  Test user already exists, updating...')
      await prisma.user.update({
        where: { email: 'test@example.com' },
        data: {
          password: hashedPassword,
          name: 'Test User',
          provider: 'credentials'
        }
      })
    } else {
      console.log('➕ Creating new test user...')
      await prisma.user.create({
        data: {
          id: 'test-user-id',
          email: 'test@example.com',
          name: 'Test User',
          password: hashedPassword,
          provider: 'credentials'
        }
      })
    }

    console.log('✅ Created/updated test user: test@example.com')
    console.log('📧 Test login: test@example.com / password123')

  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => {
  console.error('❌ Seeding failed:', e)
  process.exit(1)
})