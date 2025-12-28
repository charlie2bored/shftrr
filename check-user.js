const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUser() {
  try {
    console.log('Checking for test user...');
    const user = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });

    if (user) {
      console.log('✅ Test user found:', {
        id: user.id,
        email: user.email,
        name: user.name,
        provider: user.provider,
        hasPassword: !!user.password
      });
    } else {
      console.log('❌ Test user not found');
    }

    // Also check total user count
    const count = await prisma.user.count();
    console.log('Total users in database:', count);

  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();