const bcrypt = require('bcryptjs');

async function testPassword() {
  const plainPassword = 'password123';
  const hashedPassword = '$2b$12$Vzn2MOOqkBIqk6zYyM3fuOL857ORovpRR3SQ4j.JCZtriHNK9.Q0O';

  console.log('Testing password verification...');
  console.log('Plain password:', plainPassword);
  console.log('Hashed password:', hashedPassword);

  try {
    const isValid = await bcrypt.compare(plainPassword, hashedPassword);
    console.log('Password valid:', isValid);

    if (isValid) {
      console.log('✅ Password verification works correctly!');
    } else {
      console.log('❌ Password verification failed - hash might be incorrect');

      // Let's also test hashing a new password to see what it produces
      console.log('\nTesting new password hash...');
      const newHash = await bcrypt.hash(plainPassword, 12);
      console.log('New hash:', newHash);
      console.log('New hash length:', newHash.length);

      const isValidNew = await bcrypt.compare(plainPassword, newHash);
      console.log('New hash verification:', isValidNew);
    }
  } catch (error) {
    console.error('Error during password verification:', error);
  }
}

testPassword();
