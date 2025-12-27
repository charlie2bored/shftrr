# 🚨 SECURITY ALERT: API Key Compromised

## ⚠️ IMMEDIATE ACTION REQUIRED

Your Google AI API key has been exposed in the repository. Google has detected this and sent security alerts.

### 🔐 IMMEDIATE STEPS (Do These NOW):

#### 1. **Revoke the Compromised Key**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Find your API key in the Google AI Studio dashboard
3. **DELETE** it immediately
4. **CREATE** a new API key
5. **COPY** the new key securely

#### 2. **Update Your Environment**
Edit `.env.local` and replace the old key with your new one:
```env
GOOGLE_AI_API_KEY=your-new-secure-api-key-here
```

#### 3. **Verify Security**
- ✅ `.env.local` is in `.gitignore` (won't be committed)
- ✅ No API keys in any committed files
- ✅ Repository is clean

---

# Career Pivot Coach - Secure Setup Guide

## ✅ CURRENT STATUS:
- ✅ Prisma schema ready for Supabase
- ✅ Security policies prepared
- ✅ Environment template created
- ❌ **API key needs regeneration**

## 🚀 SECURE SETUP PROCESS:

### 1. 🔑 Generate New Google AI API Key (REQUIRED)
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **DELETE** the compromised key
3. **CREATE** new API key
4. **NEVER** share or commit this key

### 2. Set up Supabase Database
1. Go to https://supabase.com
2. Create new project
3. Wait for setup (2-3 minutes)
4. Go to **Settings → Database**
5. Copy **Connection string**
6. Update `.env.local` with your Supabase URL

### 3. Configure Environment Variables
Your `.env.local` should look like:
```env
DATABASE_URL=postgresql://postgres.[project]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
GOOGLE_AI_API_KEY=your-new-secure-api-key-here
NEXTAUTH_SECRET=generate-a-32-character-random-string
NEXTAUTH_URL=http://localhost:3000
```

### 4. Set Up Database Manually

**Since CLI connectivity is having issues, we'll set up the database manually:**

1. **Go to Supabase SQL Editor**: https://hjopsthrkbbbsyckwtil.supabase.co/project/default/sql

2. **Run the table creation script**: Copy and paste the contents of `database-setup.sql`

3. **Run the seed data script**: Copy and paste the contents of `seed-data.sql`

### 5. Generate Prisma Client
```bash
# Generate Prisma client (local only)
npx prisma generate
```

### 6. Enable Security (Already Included)
1. Supabase Dashboard → SQL Editor
2. Run contents of `supabase-rls.sql`

### 7. Launch Application
```bash
npm run dev
```

### 7. Test Everything
1. Visit http://localhost:3000
2. Login: test@example.com / password123
3. Complete onboarding
4. Test job tracker and AI chat

## 🔐 SECURITY BEST PRACTICES

- ✅ **Never commit** `.env.local` or API keys
- ✅ **Regenerate** compromised keys immediately
- ✅ **Monitor** Google AI Studio for usage alerts
- ✅ **Enable RLS** in Supabase for data protection
- ✅ **Use strong** NEXTAUTH_SECRET (32+ characters)

## 🎯 READY FOR SECURE LAUNCH!

Once you have your new API key and Supabase database, you'll have a fully secure, production-ready career coaching platform! 🚀

**Need help regenerating the key?** Let me know and I can guide you through it step-by-step.