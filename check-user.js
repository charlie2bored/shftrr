const Database = require('better-sqlite3');
const db = new Database('./prisma/dev.db');

console.log('👤 CHECKING USERS:');
const users = db.prepare('SELECT id, email, name, password FROM users').all();
console.log(users);

console.log('\n🔐 CHECKING TEST USER PASSWORD:');
if (users.length > 0) {
  const testUser = users.find(u => u.email === 'test@example.com');
  if (testUser) {
    console.log('Test user found:', testUser);
    console.log('Password hash length:', testUser.password ? testUser.password.length : 0);
    console.log('Password hash preview:', testUser.password ? testUser.password.substring(0, 20) + '...' : 'NULL');
  } else {
    console.log('❌ Test user not found');
  }
}

db.close();
