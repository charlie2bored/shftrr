const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');

async function testLogin() {
  console.log('🔐 Testing login functionality...');

  // Connect to database
  const db = new Database('./prisma/dev.db');

  try {
    // Get user from database
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get('test@example.com');

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('👤 Found user:', { id: user.id, email: user.email, name: user.name });
    console.log('🔑 Has password:', !!user.password);

    if (!user.password) {
      console.log('❌ User has no password (OAuth user?)');
      return;
    }

    // Test password comparison
    const testPassword = 'password123';
    const isValid = await bcrypt.compare(testPassword, user.password);

    console.log('🔍 Password comparison result:', isValid);

    if (isValid) {
      console.log('✅ Authentication should succeed');
    } else {
      console.log('❌ Authentication should fail - password mismatch');

      // Let's check if the hash is valid
      console.log('Hash details:', {
        startsWith: user.password.substring(0, 4),
        length: user.password.length,
        isBcrypt: user.password.startsWith('$2')
      });
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    db.close();
  }
}

testLogin();
