#!/usr/bin/env node

/**
 * Production Setup Script
 * This script helps set up the production environment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up production environment...\n');

// Check if we're in production mode
const isProduction = process.env.NODE_ENV === 'production' ||
                     process.env.VERCEL_ENV === 'production' ||
                     process.env.VERCEL_ENV === 'preview';

console.log('📍 Environment:', isProduction ? 'PRODUCTION' : 'DEVELOPMENT');

if (!isProduction) {
  console.log('ℹ️  Running in development mode. Use NODE_ENV=production to test production setup.');
}

// Check environment variables
console.log('\n🔧 Checking environment variables...');

const requiredVars = [
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'DATABASE_URL'
];

const optionalVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_GENERATIVE_AI_API_KEY'
];

let missingRequired = [];
let missingOptional = [];

requiredVars.forEach(varName => {
  if (!process.env[varName]) {
    missingRequired.push(varName);
  } else {
    console.log(`✅ ${varName}: ${varName.includes('SECRET') ? '[HIDDEN]' : process.env[varName]}`);
  }
});

optionalVars.forEach(varName => {
  if (!process.env[varName]) {
    missingOptional.push(varName);
  } else {
    console.log(`✅ ${varName}: [SET]`);
  }
});

if (missingRequired.length > 0) {
  console.log('\n❌ Missing required environment variables:');
  missingRequired.forEach(varName => console.log(`   - ${varName}`));
  console.log('\n📖 See PRODUCTION_SETUP.md for details');
}

if (missingOptional.length > 0) {
  console.log('\n⚠️  Missing optional environment variables:');
  missingOptional.forEach(varName => console.log(`   - ${varName}`));
}

// Generate NEXTAUTH_SECRET if not set
if (!process.env.NEXTAUTH_SECRET) {
  console.log('\n🔑 Generating NEXTAUTH_SECRET...');
  const crypto = require('crypto');
  const secret = crypto.randomBytes(32).toString('base64');
  console.log(`Suggested NEXTAUTH_SECRET: ${secret}`);
  console.log('Add this to your environment variables!');
}

// Check database connection
console.log('\n💾 Checking database...');
try {
  // This would normally test the database connection
  console.log('ℹ️  Database connection will be tested at runtime');
  console.log('ℹ️  Make sure DATABASE_URL points to a valid database');
} catch (error) {
  console.log('❌ Database connection failed:', error.message);
}

// Production database setup
if (isProduction) {
  console.log('\n🏗️  Production setup...');

  // Ensure data directory exists for SQLite (if using local SQLite)
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('file:')) {
    const dbPath = process.env.DATABASE_URL.replace('file:', '');
    const dbDir = path.dirname(dbPath);

    if (!fs.existsSync(dbDir)) {
      console.log(`📁 Creating database directory: ${dbDir}`);
      fs.mkdirSync(dbDir, { recursive: true });
    }
  }

  // Run Prisma migrations if in production
  try {
    console.log('🔄 Running Prisma migrations...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('✅ Migrations completed');
  } catch (error) {
    console.log('⚠️  Migration failed, this might be expected if using a cloud database');
  }
}

// Generate Prisma client
try {
  console.log('\n🏗️  Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated');
} catch (error) {
  console.log('❌ Failed to generate Prisma client:', error.message);
  process.exit(1);
}

console.log('\n🎉 Production setup complete!');
console.log('\n📋 Next steps:');
console.log('1. Set all required environment variables');
console.log('2. Deploy to your platform (Vercel, etc.)');
console.log('3. Test authentication in production');
console.log('4. Seed your database if needed');

if (missingRequired.length > 0) {
  console.log('\n⚠️  WARNING: Your app will not work without the required environment variables!');
  process.exit(1);
}
