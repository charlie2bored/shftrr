-- Basic setup without RLS to test table creation
-- Run this FIRST in Supabase SQL Editor

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    password TEXT,
    image TEXT,
    provider TEXT DEFAULT 'credentials',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test insert
INSERT INTO users (id, email, name, password, provider) VALUES
('test-user-id', 'test@example.com', 'Test User', '$2a$12$L8uJGzYpQXJcG5QJzHqJe.QzHqJe.QzHqJe.QzHqJe.QzHqJe.QzHq', 'credentials')
ON CONFLICT (email) DO NOTHING;

-- Check if it worked
SELECT * FROM users WHERE email = 'test@example.com';
