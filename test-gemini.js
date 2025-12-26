#!/usr/bin/env node

/**
 * Test script for Gemini Career Coach API
 * Run with: node test-gemini.js
 */

const testMessages = [
  {
    messages: [
      {
        role: "user",
        content: "I'm a senior software engineer making $150k in San Francisco. I want to become a product manager. What's my runway if I spend $8k/month with a $50k emergency fund?"
      }
    ],
    resumeText: "Senior Software Engineer with 8 years experience, Python, React, leadership experience",
    ventText: "I'm bored with coding and want to move into product management"
  },
  {
    messages: [
      {
        role: "user",
        content: "What's the salary range for a UX Designer in Austin?"
      }
    ]
  }
];

async function testGeminiAPI() {
  console.log("🧪 Testing Gemini Career Coach API\n");

  for (let i = 0; i < testMessages.length; i++) {
    console.log(`Test ${i + 1}:`);
    console.log("Input:", JSON.stringify(testMessages[i], null, 2));

    try {
      const response = await fetch('http://localhost:3000/api/gemini-career-coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testMessages[i]),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("✅ Success!");
      console.log("Response:", result.response.substring(0, 500) + "...");

      if (result.toolCalls && result.toolCalls.length > 0) {
        console.log("🔧 Tool Calls:", result.toolCalls.length);
      }

      if (result.toolResults && result.toolResults.length > 0) {
        console.log("📊 Tool Results:", result.toolResults.length);
      }

    } catch (error) {
      console.log("❌ Error:", error.message);
    }

    console.log("\n" + "=".repeat(50) + "\n");
  }
}

// Only run if this script is executed directly
if (require.main === module) {
  testGeminiAPI().catch(console.error);
}

module.exports = { testGeminiAPI };

