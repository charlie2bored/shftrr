-- Check if users table exists and what columns it has

-- Check if table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_name = 'users'
);

-- Check table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Try to select from users table
SELECT id, email, "createdAt" FROM users LIMIT 1;
