const Database = require('better-sqlite3');
const path = require('path');

console.log('🔍 Checking production database...');

// Check if production database exists
const dbPath = path.join(process.cwd(), 'data', 'production.db');

try {
  const db = new Database(dbPath, { readonly: true });

  // Check users table
  const users = db.prepare('SELECT id, email, name, password IS NOT NULL as has_password FROM users').all();
  console.log(`👤 Found ${users.length} users:`);

  users.forEach(user => {
    console.log(`   - ${user.email} (${user.has_password ? 'has password' : 'no password'})`);
  });

  // Check if test user exists
  const testUser = users.find(u => u.email === 'test@example.com');
  if (testUser) {
    console.log('✅ Test user exists!');
    console.log('📧 Test login: test@example.com / password123');
  } else {
    console.log('❌ Test user not found!');
    console.log('💡 Run: npm run db:seed');
  }

  db.close();

} catch (error) {
  console.error('❌ Database error:', error.message);
  console.log('💡 Database might not exist. Run: npx prisma db push && npm run db:seed');
}
