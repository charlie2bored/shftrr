// Direct SQL seeding to bypass Prisma client issues
const { Client } = require('pg');
const bcrypt = require('bcryptjs');

async function seedWithSQL() {
  console.log('🌱 Seeding with direct SQL...');

  const client = new Client({
    connectionString: "postgres://02aa437a5ddfbf64e3f21d0c1f4c78cc5484ad0138c7285084a4b1e459a4b53c:sk_w2rEISGsWfZKf8yUaTl0J@db.prisma.io:5432/postgres?sslmode=require"
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 12);
    const userId = 'test-user-id';
    const now = new Date().toISOString();

    // Insert or update test user
    await client.query(`
      INSERT INTO users (id, email, name, password, provider, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (email) DO UPDATE SET
        password = EXCLUDED.password,
        name = EXCLUDED.name,
        provider = EXCLUDED.provider,
        "updatedAt" = EXCLUDED."updatedAt"
    `, [userId, 'test@example.com', 'Test User', hashedPassword, 'credentials', now, now]);

    console.log('✅ Database seeded successfully!');
    console.log('📧 Test login: test@example.com / password123');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await client.end();
  }
}

seedWithSQL();
