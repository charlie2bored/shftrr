# Database Setup Guide

This guide will help you set up MySQL database integration for the Career Pivot Coach application.

## Prerequisites

1. **MySQL Server** installed and running
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Or use Docker: `docker run --name mysql-career -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=career_pivot_db -p 3306:3306 -d mysql:8.0`

2. **Node.js** and **npm** installed
3. **Git** for version control

## Environment Setup

1. **Copy environment template** (create `.env` file):
```bash
# Copy the example environment variables
cp .env.example .env  # (if it exists, otherwise create .env manually)
```

2. **Configure your `.env` file**:
```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-key-here-generate-a-random-string
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (optional - leave empty if not using)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database Configuration
DATABASE_URL="mysql://username:password@localhost:3306/career_pivot_db"

# Alternative format (if you prefer separate variables)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=career_pivot_db
DB_USER=your-mysql-username
DB_PASSWORD=your-mysql-password
```

## Database Creation

1. **Connect to MySQL**:
```bash
mysql -u root -p
```

2. **Create the database**:
```sql
CREATE DATABASE career_pivot_db;
CREATE USER 'career_user'@'localhost' IDENTIFIED BY 'secure_password_here';
GRANT ALL PRIVILEGES ON career_pivot_db.* TO 'career_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

3. **Update your `.env` file** with the database credentials:
```env
DATABASE_URL="mysql://career_user:secure_password_here@localhost:3306/career_pivot_db"
```

## Database Migration

1. **Generate and run migrations**:
```bash
# Generate Prisma client
npx prisma generate

# Create and run migration
npx prisma migrate dev --name init

# (Optional) Seed the database with a test user
npx prisma db seed
```

2. **Verify the setup**:
```bash
# Check database connection
npx prisma db push

# View database in Prisma Studio
npx prisma studio
```

## Testing the Setup

1. **Start the application**:
```bash
npm run dev
```

2. **Test user registration**:
   - Go to `/auth/signup`
   - Create a new account
   - Verify user appears in database

3. **Test password reset**:
   - Go to `/auth/signin`
   - Click "Forgot your password?"
   - Check console for reset link
   - Test password reset flow

## Database Schema

### User Table
```sql
CREATE TABLE users (
  id        VARCHAR(191) PRIMARY KEY,
  email     VARCHAR(191) UNIQUE NOT NULL,
  name      VARCHAR(191),
  password  VARCHAR(191),
  image     VARCHAR(191),
  provider  VARCHAR(191) DEFAULT 'credentials',
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL
);
```

### Password Reset Tokens Table
```sql
CREATE TABLE password_reset_tokens (
  id        VARCHAR(191) PRIMARY KEY,
  token     VARCHAR(191) UNIQUE NOT NULL,
  email     VARCHAR(191) NOT NULL,
  expiresAt DATETIME(3) NOT NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
);
```

## Troubleshooting

### Connection Issues
- **Error**: `Can't connect to MySQL server`
  - **Solution**: Ensure MySQL is running: `sudo service mysql start`
  - **Solution**: Check DATABASE_URL format
  - **Solution**: Verify user permissions

### Migration Issues
- **Error**: `P1001: Can't reach database server`
  - **Solution**: Check DATABASE_URL in `.env`
  - **Solution**: Ensure database exists
  - **Solution**: Verify user credentials

### Authentication Issues
- **Error**: Password validation fails
  - **Solution**: Clear database and re-run migrations
  - **Solution**: Check bcrypt version compatibility

## Production Deployment

For production deployment:

1. **Use environment variables** instead of `.env` file
2. **Set up database backups** regularly
3. **Use connection pooling** for better performance
4. **Enable SSL connections** to database
5. **Set up database monitoring**

## Security Notes

- ✅ **Passwords are hashed** with bcrypt (12 rounds)
- ✅ **Input validation** with Zod schemas
- ✅ **SQL injection prevention** via Prisma ORM
- ✅ **Secure token generation** for password resets
- ✅ **Token expiration** (15 minutes for password resets)

## Next Steps

After setup is complete:
1. Test all authentication flows
2. Verify password reset functionality
3. Check Google OAuth integration (if enabled)
4. Monitor database performance
5. Set up automated backups

---

**Need help?** Check the Prisma documentation: https://www.prisma.io/docs
