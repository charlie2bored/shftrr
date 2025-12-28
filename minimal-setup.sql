-- Minimal database setup - just the essential tables first
-- Run this in Supabase SQL Editor to test basic functionality

-- Users table (essential)
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

-- Enable RLS for users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Simple RLS policy
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid()::text = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid()::text = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id);

-- Test user
INSERT INTO users (id, email, name, password, provider) VALUES
('test-user-id', 'test@example.com', '$2a$12$L8uJGzYpQXJcG5QJzHqJe.QzHqJe.QzHqJe.QzHqJe.QzHqJe.QzHq', 'credentials')
ON CONFLICT (email) DO NOTHING;
