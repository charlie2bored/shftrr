#!/usr/bin/env node

/**
 * Test script to verify markdown rendering in chat messages
 */

// Sample Gemini response with markdown
const sampleResponse = `Breaking into Data Analytics requires a disciplined, data-driven financial plan, not just a learning path. To build your factual, high-stakes escape plan, I need specific data to anchor your transition timeline and financial viability.

Please provide the following:

### 1. Market Data (For Salary Expectation)
What is your **target location** (city or metro area) for your first Data Analyst role?

### 2. Financial Data (For Runway Calculation)
To determine how much time you can afford to spend on training, job searching, and potential salary dips, I need to calculate your financial runway.

* **Total Cash Reserves / Savings:** (e.g., $25,000)
* **Current Average Monthly Expenses:** (e.g., $3,000)
* **Current Average Monthly Income (if applicable):** (e.g., $4,500)

Once I have this, I will use the tools to provide realistic salary expectations and calculate multiple scenarios for your transition timeline (conservative, moderate, aggressive).`;

console.log('Sample Gemini Response:');
console.log('=' .repeat(50));
console.log(sampleResponse);
console.log('=' .repeat(50));
console.log('\nThis response should now render properly with:');
console.log('- Proper headings (# and ###)');
console.log('- Bold text (**)');
console.log('- Bullet points (*) ');
console.log('- Clean paragraph spacing');
console.log('- Only actual roadmaps go to the right pane');



