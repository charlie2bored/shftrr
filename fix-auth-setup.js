#!/usr/bin/env node

/**
 * Fix Authentication Setup Script
 * This script helps set up the required environment variables for NextAuth
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, 'app', '.env.local');
const envExample = `# Gemini API
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyAtEUALutYdmziQO0pRcpMxgKrQV_6b6kk

# NextAuth Configuration (REQUIRED)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=${generateSecret()}

# Google OAuth (optional - for Google sign-in)
# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database (for development)
DATABASE_URL="file:./dev.db"`;

function generateSecret() {
  return require('crypto').randomBytes(32).toString('hex');
}

console.log('🔧 Fixing Authentication Setup...');
console.log('================================\n');

// Check if .env.local exists
if (fs.existsSync(envPath)) {
  console.log('📄 Found existing .env.local file');
  const currentContent = fs.readFileSync(envPath, 'utf8');

  // Check if NextAuth variables are missing
  const hasNextAuthUrl = currentContent.includes('NEXTAUTH_URL=');
  const hasNextAuthSecret = currentContent.includes('NEXTAUTH_SECRET=');

  if (!hasNextAuthUrl || !hasNextAuthSecret) {
    console.log('❌ Missing NextAuth configuration');

    // Generate new secret
    const secret = generateSecret();
    const updatedContent = currentContent.trim() + '\n\n' +
      `# NextAuth Configuration (REQUIRED)\n` +
      `NEXTAUTH_URL=http://localhost:3000\n` +
      `NEXTAUTH_SECRET=${secret}\n\n` +
      `# Google OAuth (optional - for Google sign-in)\n` +
      `# GOOGLE_CLIENT_ID=your-google-client-id\n` +
      `# GOOGLE_CLIENT_SECRET=your-google-client-secret\n\n` +
      `# Database (for development)\n` +
      `DATABASE_URL="file:./dev.db"`;

    fs.writeFileSync(envPath, updatedContent);
    console.log('✅ Added NextAuth configuration to .env.local');
  } else {
    console.log('✅ NextAuth configuration already exists');
  }
} else {
  console.log('📝 Creating new .env.local file with required configuration');
  fs.writeFileSync(envPath, envExample);
  console.log('✅ Created .env.local with all required variables');
}

console.log('\n🎯 Next Steps:');
console.log('1. Restart your development server: npm run dev');
console.log('2. Try signing in again');
console.log('3. If you want Google OAuth, add your Google credentials to the .env.local file');

console.log('\n🔐 Your NextAuth secret has been generated and saved securely.');
console.log('📧 For Google OAuth setup, see: setup-auth.md');

console.log('\n✨ Authentication should now work!');

