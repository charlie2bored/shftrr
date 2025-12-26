# Vercel Deployment Guide

This guide will help you deploy the Career Pivot Coach to Vercel with a production database.

## Prerequisites

1. **Vercel Account** - Sign up at https://vercel.com
2. **GitHub Repository** - Code pushed to GitHub
3. **Database** - Cloud database (PlanetScale recommended)

## Database Setup (Choose One)

### Option 1: PlanetScale (MySQL-compatible, Recommended)

1. **Create PlanetScale Account**: https://planetscale.com
2. **Create Database**:
   ```bash
   # Install PlanetScale CLI
   npm install -g @planetscale/cli

   # Login and create database
   pscale auth login
   pscale database create career-pivot
   pscale branch create career-pivot main
   ```

3. **Get Connection String**:
   ```bash
   pscale connect career-pivot main --port 3309
   ```
   Your DATABASE_URL will look like: `mysql://username:password@aws.connect.psdb.cloud/career-pivot?sslaccept=strict`

### Option 2: Vercel Postgres (Easier Setup)

1. **Enable Vercel Postgres** in your Vercel dashboard
2. **Update Schema**: Change `provider = "mysql"` to `provider = "postgresql"` in `prisma/schema.prisma`
3. **Get Connection String** from Vercel dashboard

### Option 3: Other Cloud Databases

- **AWS RDS MySQL**
- **Google Cloud SQL**
- **DigitalOcean Managed Databases**

## Vercel Deployment Steps

### Step 1: Connect Repository

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Click "New Project"**
3. **Import Git Repository**: Select your `shftrr` repository
4. **Configure Project**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

### Step 2: Environment Variables

Add these environment variables in Vercel dashboard:

#### Required Variables:
```bash
# Database
DATABASE_URL=mysql://username:password@host:port/database

# NextAuth
NEXTAUTH_SECRET=your-super-secure-random-string-here
NEXTAUTH_URL=https://your-app-name.vercel.app

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# AI/API Keys
GOOGLE_AI_API_KEY=your-gemini-api-key
```

#### How to Generate NEXTAUTH_SECRET:
```bash
# Generate a secure random string
openssl rand -base64 32
# Or use: https://generate-secret.vercel.app/32
```

### Step 3: Database Migration

#### For PlanetScale:
```bash
# Push schema to PlanetScale
npx prisma db push

# Generate Prisma client
npx prisma generate
```

#### For Vercel Postgres:
```bash
# Update schema.prisma provider to "postgresql"
# Then push schema
npx prisma db push
```

### Step 4: Deploy

1. **Click "Deploy"** in Vercel
2. **Monitor Build Logs** for any errors
3. **Access Your App** at `https://your-app-name.vercel.app`

## Post-Deployment Configuration

### Step 1: Test Authentication

1. **Visit your deployed app**
2. **Try signing up**: `/auth/signup`
3. **Test login**: `/auth/signin`
4. **Test password reset**: Forgot password flow

### Step 2: Verify Database

1. **Check Vercel function logs** for database connection
2. **Test user creation** and login
3. **Verify password reset** emails (check logs)

### Step 3: Domain Setup (Optional)

1. **Go to Vercel Dashboard** > Your Project > Settings
2. **Add Custom Domain** if desired
3. **Configure DNS** as instructed

## Environment Variables Reference

### Production URLs
- **NEXTAUTH_URL**: `https://your-app-name.vercel.app`
- **Database URL**: Use connection string from your cloud provider

### Security Notes
- ✅ **Never commit secrets** to GitHub
- ✅ **Use environment variables** for all sensitive data
- ✅ **Rotate secrets** regularly
- ✅ **Monitor logs** for security issues

## Troubleshooting

### Build Failures

#### Prisma Client Issues:
```bash
# If Prisma client not found:
npm run db:generate
```

#### Database Connection:
```bash
# Test database connection locally:
npx prisma db push
```

### Runtime Errors

#### Auth Issues:
- Check NEXTAUTH_SECRET is set
- Verify NEXTAUTH_URL matches your domain
- Ensure Google OAuth credentials are correct

#### Database Issues:
- Verify DATABASE_URL format
- Check database server allows connections
- Confirm database exists and user has permissions

#### API Timeouts:
- Vercel functions have 10-second timeout for free plan
- Upgrade to Pro plan for longer timeouts
- Optimize database queries

## Performance Optimization

### Vercel Pro Features:
1. **Analytics** - Monitor performance
2. **Edge Functions** - Faster global response
3. **Preview Deployments** - Test changes safely

### Database Optimization:
1. **Connection Pooling** - Use Prisma's built-in pooling
2. **Query Optimization** - Add indexes to frequently queried fields
3. **Caching** - Implement Redis for session storage

## Monitoring & Maintenance

### Vercel Dashboard:
- **Real-time Logs** - Monitor API calls
- **Error Tracking** - Debug issues
- **Performance Metrics** - Response times

### Database Monitoring:
- **Connection Limits** - Monitor concurrent connections
- **Query Performance** - Identify slow queries
- **Backup Strategy** - Regular automated backups

## Cost Optimization

### Vercel Pricing:
- **Free Plan**: 100GB bandwidth, 100 hours runtime
- **Pro Plan**: $20/month for higher limits

### Database Costs:
- **PlanetScale**: Free tier, then $0.25/dbu
- **Vercel Postgres**: Included in Pro plan
- **AWS RDS**: Pay for usage

## Security Checklist

- ✅ **HTTPS enabled** (automatic on Vercel)
- ✅ **Environment variables** for secrets
- ✅ **Database SSL** connections
- ✅ **Password hashing** with bcrypt
- ✅ **Input validation** with Zod
- ✅ **CSRF protection** via NextAuth
- ✅ **Rate limiting** (consider implementing)

## Next Steps

After successful deployment:

1. **Set up monitoring** (Vercel Analytics)
2. **Configure error tracking** (Sentry, LogRocket)
3. **Set up CI/CD** (GitHub Actions)
4. **Implement backup strategy**
5. **Add user analytics**

---

**Need help?** Check Vercel documentation: https://vercel.com/docs
