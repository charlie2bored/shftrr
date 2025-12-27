# Career Pivot Coach - Complete Setup Guide

## ✅ COMPLETED:
- ✅ Google AI API Key configured
- ✅ NextAuth Secret configured
- ✅ Prisma schema updated for PostgreSQL
- ✅ Environment file created
- ✅ Supabase client installed

## 🚀 NEXT STEPS (5-10 minutes):

### 1. Set up Supabase Database
1. Go to https://supabase.com
2. Create new project
3. Wait for database to be ready (2-3 minutes)
4. Go to Settings → Database
5. Copy the 'Connection string'
6. Update .env.local: Replace 'your-supabase-database-url-here' with your actual URL

### 2. Run Database Setup
```bash
# Push schema to Supabase
npx prisma db push

# Generate Prisma client
npx prisma generate

# Seed with test user
npx prisma db seed
```

### 3. Add Row Level Security (Optional but recommended)
1. Go to Supabase Dashboard → SQL Editor
2. Run the contents of supabase-rls.sql

### 4. Start Development Server
```bash
npm run dev
```

### 5. Test the Application
1. Go to http://localhost:3000
2. Try the test login: test@example.com / password123
3. Complete onboarding
4. Try the job tracker and AI chat

## 🔧 Environment Variables (.env.local)
```
DATABASE_URL=your-supabase-connection-string
GOOGLE_AI_API_KEY=AIzaSyD5gW8bKlXLoS6FV6os6HGmD6dq17HZYHM
NEXTAUTH_SECRET=default-build-secret-key-for-development-only
NEXTAUTH_URL=http://localhost:3000
```

## 🚀 Production Deployment
When ready for production:
1. Generate a proper NEXTAUTH_SECRET (32+ characters)
2. Set NEXTAUTH_URL to your domain
3. Deploy to Vercel/Netlify
4. Set environment variables in hosting platform

## 📞 Need Help?
- Supabase setup issues? Check their docs
- Database connection problems? Verify your DATABASE_URL
- AI not working? Verify GOOGLE_AI_API_KEY

Your app is 95% ready - just need that Supabase database URL! 🎯
