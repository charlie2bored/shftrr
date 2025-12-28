const { KVUserService } = require('./src/lib/kv');
const bcrypt = require('bcryptjs');

async function seedKV() {
  console.log('🌱 Seeding Vercel KV database...');

  try {
    // Check if test user already exists
    const existingUser = await KVUserService.findByEmail('test@example.com');

    if (existingUser) {
      console.log('ℹ️  Test user already exists, updating password...');
      const hashedPassword = await bcrypt.hash('password123', 12);
      await KVUserService.updatePassword('test@example.com', hashedPassword);
      console.log('✅ Updated test user password');
    } else {
      // Create test user
      const hashedPassword = await bcrypt.hash('password123', 12);

      await KVUserService.create({
        email: 'test@example.com',
        name: 'Test User',
        password: hashedPassword,
        provider: 'credentials',
      });

      console.log('✅ Created test user: test@example.com');
    }

    console.log('📧 Test login: test@example.com / password123');
    console.log('🎉 KV database seeded successfully!');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Only run if this script is called directly
if (require.main === module) {
  seedKV();
}

module.exports = { seedKV };
