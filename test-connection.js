#!/usr/bin/env node

/**
 * Test script to verify the Career Pivot Coach connection is working
 * Run with: node test-connection.js
 */

async function testConnection() {
  console.log("🔗 Testing Career Pivot Coach Connection\n");

  try {
    // Test 1: Main app page
    console.log("1. Testing main app page...");
    const mainResponse = await fetch('http://localhost:3000');
    if (mainResponse.ok) {
      console.log("✅ Main app page is accessible");
    } else {
      console.log("❌ Main app page not accessible");
      return;
    }

    // Test 2: Gemini API
    console.log("2. Testing Gemini API...");
    const apiResponse = await fetch('http://localhost:3000/api/gemini-career-coach', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello, I want to become a data analyst' }],
        resumeText: 'Software developer with 5 years experience',
        ventText: 'I am bored with coding and want a new challenge'
      }),
    });

    if (apiResponse.ok) {
      const result = await apiResponse.json();
      console.log("✅ Gemini API is responding");

      // Check if response has proper formatting
      if (result.response.includes('##') && result.response.includes('\n\n')) {
        console.log("✅ Response formatting looks good");
      } else {
        console.log("⚠️  Response formatting may need attention");
      }

      console.log(`📝 Response length: ${result.response.length} characters`);
      console.log(`📄 First 200 characters: ${result.response.substring(0, 200)}...`);

    } else {
      console.log("❌ Gemini API not responding");
      console.log("Status:", apiResponse.status, apiResponse.statusText);
    }

  } catch (error) {
    console.log("❌ Connection test failed:", error.message);
  }

  console.log("\n🎯 If you see all green checkmarks, the app is working correctly!");
  console.log("💡 Open http://localhost:3000 in your browser to use the app");
}

// Only run if this script is executed directly
if (require.main === module) {
  testConnection().catch(console.error);
}

module.exports = { testConnection };
