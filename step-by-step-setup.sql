-- Step-by-step database setup
-- Run each section separately to identify where it fails

-- STEP 1: Basic tables (no foreign keys)
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

-- Password reset tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    token TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session templates (no foreign keys)
CREATE TABLE IF NOT EXISTS session_templates (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    "suggestedPrompt" TEXT,
    questions JSONB,
    "sampleResponse" JSONB,
    "isPublic" BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 2: Tables with foreign keys to users
-- User onboarding
CREATE TABLE IF NOT EXISTS user_onboardings (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    "yearsExperience" INTEGER,
    industry TEXT,
    "currentRole" TEXT,
    "biggestStressor" TEXT,
    "topConstraint" TEXT,
    "careerGoals" TEXT,
    "preferredWorkStyle" TEXT,
    "skillLevel" TEXT,
    "learningStyle" TEXT,
    completed BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Career goals
CREATE TABLE IF NOT EXISTS career_goals (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    "goalType" TEXT,
    "isActive" BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job applications
CREATE TABLE IF NOT EXISTS job_applications (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT REFERENCES users(id) ON DELETE CASCADE,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    "jobUrl" TEXT,
    "jobBoard" TEXT,
    status TEXT DEFAULT 'wishlist',
    "appliedDate" TIMESTAMP WITH TIME ZONE,
    "nextActionDate" TIMESTAMP WITH TIME ZONE,
    "nextAction" TEXT,
    notes TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Action items
CREATE TABLE IF NOT EXISTS action_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    priority TEXT DEFAULT 'medium',
    "dueDate" TIMESTAMP WITH TIME ZONE,
    "sourceType" TEXT,
    "sourceId" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "completedAt" TIMESTAMP WITH TIME ZONE
);

-- STEP 3: Tables with foreign keys to other tables
-- Conversations
CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    "goalId" TEXT REFERENCES career_goals(id),
    "resumeText" TEXT,
    "ventText" TEXT,
    "sessionType" TEXT,
    "isArchived" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversation messages
CREATE TABLE IF NOT EXISTS conversation_messages (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "conversationId" TEXT REFERENCES conversations(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    role TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "toolCalls" JSONB,
    "toolResults" JSONB
);

-- Conversation tags
CREATE TABLE IF NOT EXISTS conversation_tags (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "conversationId" TEXT REFERENCES conversations(id) ON DELETE CASCADE,
    tag TEXT NOT NULL
);

-- STEP 4: Remaining tables
-- Career plans
CREATE TABLE IF NOT EXISTS career_plans (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    duration TEXT DEFAULT '90',
    "isActive" BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Career plan phases
CREATE TABLE IF NOT EXISTS career_plan_phases (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "planId" TEXT REFERENCES career_plans(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    "weekRange" TEXT,
    "order" INTEGER,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Career plan tasks
CREATE TABLE IF NOT EXISTS career_plan_tasks (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "phaseId" TEXT REFERENCES career_plan_phases(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    "isCompleted" BOOLEAN DEFAULT FALSE,
    "order" INTEGER,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User skills
CREATE TABLE IF NOT EXISTS user_skills (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT REFERENCES users(id) ON DELETE CASCADE,
    "skillName" TEXT NOT NULL,
    category TEXT,
    confidence INTEGER,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE("userId", "skillName")
);

-- Career milestones
CREATE TABLE IF NOT EXISTS career_milestones (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT REFERENCES users(id) ON DELETE CASCADE,
    "milestoneType" TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    "isCompleted" BOOLEAN DEFAULT FALSE,
    "completedAt" TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
