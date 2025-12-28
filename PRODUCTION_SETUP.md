# Production Deployment Guide

## Environment Variables Required for Production

Your production environment MUST have these variables set:

### Required for Authentication
```bash
NEXTAUTH_SECRET="your-32-character-or-longer-secret-key"
NEXTAUTH_URL="https://your-domain.com"
```

### Required for Database
```bash
DATABASE_URL="file:./data/production.db"
```

### Optional (but recommended for full functionality)
```bash
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"
GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"
```

## Database Setup for Production

1. **Create production database directory:**
   ```bash
   mkdir -p data
   ```

2. **Set correct permissions:**
   ```bash
   chmod 755 data
   ```

3. **Run database migrations:**
   ```bash
   npx prisma migrate deploy
   ```

4. **Seed the database (optional):**
   ```bash
   npx prisma db seed
   ```

## NextAuth Secret Generation

Generate a secure secret for NextAuth:
```bash
# Using openssl
openssl rand -base64 32

# Or using node
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Deployment Checklist

- [ ] Set `NEXTAUTH_SECRET` (32+ characters)
- [ ] Set `NEXTAUTH_URL` to your production domain
- [ ] Set `DATABASE_URL` to production database path
- [ ] Run `npx prisma generate`
- [ ] Run `npx prisma migrate deploy`
- [ ] Test login functionality
- [ ] Verify chat works
- [ ] Check environment logs for errors

## Common Production Issues

### 1. Authentication Not Working
- Check `NEXTAUTH_SECRET` is set and long enough
- Verify `NEXTAUTH_URL` matches your domain exactly

### 2. Database Connection Failed
- Ensure database file exists and has correct permissions
- Check `DATABASE_URL` is set correctly

### 3. Build Fails
- Run `npx prisma generate` before building
- Ensure all environment variables are available during build

### 4. Chat Not Working
- Check `GOOGLE_GENERATIVE_AI_API_KEY` is set
- Verify API key has correct permissions

## Vercel Deployment

For Vercel, set these in your project settings:

1. Go to Project Settings → Environment Variables
2. Add all required variables listed above
3. Redeploy after setting variables

## Testing Production Login

After deployment:
1. Visit your production URL
2. Try signing up a new user
3. Try signing in with existing credentials
4. Test the chat functionality

If login fails, check the server logs for authentication errors.
