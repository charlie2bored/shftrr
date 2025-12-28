-- Debug indexes one by one - CORRECTED VERSION
-- Run each section separately

-- Test 1: Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_provider ON users(provider);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users("createdAt");
CREATE INDEX IF NOT EXISTS idx_users_updated_at ON users("updatedAt");

-- Test 2: Password tokens indexes
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_email ON password_reset_tokens(email);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens("expiresAt");
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_created_at ON password_reset_tokens("createdAt");

-- Test 3: Conversations indexes
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations("userId");
CREATE INDEX IF NOT EXISTS idx_conversations_goal_id ON conversations("goalId");
CREATE INDEX IF NOT EXISTS idx_conversations_session_type ON conversations("sessionType");
CREATE INDEX IF NOT EXISTS idx_conversations_is_archived ON conversations("isArchived");
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations("createdAt");
