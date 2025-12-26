const { signIn } = require('next-auth/react');

async function testAuth() {
  console.log('Testing authentication...');

  try {
    const result = await signIn('credentials', {
      email: 'test@example.com',
      password: 'password123',
      redirect: false
    });

    console.log('Result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

testAuth();
