import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'
import bcrypt from 'bcryptjs'

// Create Prisma client based on DATABASE_URL type
const createPrismaClient = () => {
  if (process.env.DATABASE_URL?.startsWith('prisma+postgres://')) {
    return new PrismaClient({
      accelerateUrl: process.env.DATABASE_URL,
    }).$extends(withAccelerate());
  } else {
    return new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL,
    });
  }
};

const prisma = createPrismaClient();

async function main() {
  console.log('🌱 Seeding database...')

  try {
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