# Sign In Instructions

## Test Account
A test user account has been created for development and testing:

- **Email**: `test@example.com`
- **Password**: `password123`

## How to Sign In

1. Navigate to `/auth/signin`
2. Enter the email: `test@example.com`
3. Enter the password: `password123`
4. Click "Sign in"

## Troubleshooting

If you're getting "Invalid email or password":

1. **Check your credentials**: Make sure you're using the exact email and password above
2. **Check the server**: Ensure the development server is running (`npm run dev`)
3. **Check the database**: The user should exist in the SQLite database
4. **Check the console**: Look for any error messages in the browser console or server logs

## Creating a New Account

If you want to create your own account:

1. Go to `/auth/signup`
2. Fill out the registration form
3. Sign in with your new credentials

## Database Setup

If you need to reset the database:

```bash
# Reset and seed the database
npx prisma migrate reset --force
npm run db:seed
```

The seed script creates the test user account automatically.
