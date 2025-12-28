const fetch = require('node-fetch');

async function testAuthAPI() {
  try {
    console.log('🧪 Testing authentication API...');

    const response = await fetch('http://localhost:3001/api/test-auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    const data = await response.json();
    console.log('📡 Response status:', response.status);
    console.log('📄 Response data:', data);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAuthAPI();
