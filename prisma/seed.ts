import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

console.log('🔧 Starting seed script...');
console.log('🔧 DATABASE_URL available:', !!process.env.DATABASE_URL);

// Create Prisma client - rely on DATABASE_URL environment variable
// Since prisma db push works, this should work too
console.log('🔧 DATABASE_URL in seed script:', process.env.DATABASE_URL ? 'Available' : 'Missing');
const prisma = new PrismaClient();

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