const { env } = require('./src/lib/env.ts');
const Database = require('better-sqlite3');

console.log('🔍 Debugging authentication setup...');
console.log('DATABASE_URL:', env.DATABASE_URL);
console.log('NEXTAUTH_SECRET length:', env.NEXTAUTH_SECRET.length);
console.log('NODE_ENV:', env.NODE_ENV);

// Test database connection
try {
  const db = new Database('./prisma/dev.db');
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
  console.log('👤 Users in database:', userCount.count);

  const testUser = db.prepare('SELECT id, email, name FROM users WHERE email = ?').get('test@example.com');
  console.log('🔍 Test user exists:', !!testUser);

  db.close();
} catch (error) {
  console.error('❌ Database error:', error);
}
