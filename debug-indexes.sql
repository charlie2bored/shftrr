-- Debug indexes one by one - run each section separately

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_provider ON users(provider);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users("createdAt");
CREATE INDEX IF NOT EXISTS idx_users_updated_at ON users("updatedAt");

-- Password reset tokens indexes
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_email ON password_reset_tokens(email);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens("expiresAt");
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_created_at ON password_reset_tokens("createdAt");

-- User onboardings indexes
CREATE INDEX IF NOT EXISTS idx_user_onboardings_user_id ON user_onboardings("userId");
CREATE INDEX IF NOT EXISTS idx_user_onboardings_completed ON user_onboardings(completed);

-- Career goals indexes
CREATE INDEX IF NOT EXISTS idx_career_goals_user_id ON career_goals("userId");
CREATE INDEX IF NOT EXISTS idx_career_goals_goal_type ON career_goals("goalType");
CREATE INDEX IF NOT EXISTS idx_career_goals_is_active ON career_goals("isActive");

-- Conversations indexes
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations("userId");
CREATE INDEX IF NOT EXISTS idx_conversations_goal_id ON conversations("goalId");
CREATE INDEX IF NOT EXISTS idx_conversations_session_type ON conversations("sessionType");
CREATE INDEX IF NOT EXISTS idx_conversations_is_archived ON conversations("isArchived");
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations("createdAt");

-- Conversation messages indexes
CREATE INDEX IF NOT EXISTS idx_conversation_messages_conversation_id ON conversation_messages("conversationId");
CREATE INDEX IF NOT EXISTS idx_conversation_messages_timestamp ON conversation_messages(timestamp);

-- Conversation tags indexes
CREATE INDEX IF NOT EXISTS idx_conversation_tags_conversation_id ON conversation_tags("conversationId");
CREATE INDEX IF NOT EXISTS idx_conversation_tags_tag ON conversation_tags(tag);

-- Job applications indexes
CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON job_applications("userId");
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_applied_date ON job_applications("appliedDate");
CREATE INDEX IF NOT EXISTS idx_job_applications_next_action_date ON job_applications("nextActionDate");

-- Action items indexes
CREATE INDEX IF NOT EXISTS idx_action_items_user_id ON action_items("userId");
CREATE INDEX IF NOT EXISTS idx_action_items_status ON action_items(status);
CREATE INDEX IF NOT EXISTS idx_action_items_priority ON action_items(priority);
CREATE INDEX IF NOT EXISTS idx_action_items_due_date ON action_items("dueDate");
CREATE INDEX IF NOT EXISTS idx_action_items_source_type ON action_items("sourceType");
CREATE INDEX IF NOT EXISTS idx_action_items_source_id ON action_items("sourceId");

-- Career plans indexes
CREATE INDEX IF NOT EXISTS idx_career_plans_user_id ON career_plans("userId");
CREATE INDEX IF NOT EXISTS idx_career_plans_is_active ON career_plans("isActive");

-- Career plan phases indexes
CREATE INDEX IF NOT EXISTS idx_career_plan_phases_plan_id ON career_plan_phases("planId");
CREATE INDEX IF NOT EXISTS idx_career_plan_phases_order ON career_plan_phases("order");

-- Career plan tasks indexes
CREATE INDEX IF NOT EXISTS idx_career_plan_tasks_phase_id ON career_plan_tasks("phaseId");
CREATE INDEX IF NOT EXISTS idx_career_plan_tasks_is_completed ON career_plan_tasks("isCompleted");
CREATE INDEX IF NOT EXISTS idx_career_plan_tasks_order ON career_plan_tasks("order");

-- User skills indexes
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills("userId");
CREATE INDEX IF NOT EXISTS idx_user_skills_category ON user_skills(category);

-- Career milestones indexes
CREATE INDEX IF NOT EXISTS idx_career_milestones_user_id ON career_milestones("userId");
CREATE INDEX IF NOT EXISTS idx_career_milestones_milestone_type ON career_milestones("milestoneType");
CREATE INDEX IF NOT EXISTS idx_career_milestones_is_completed ON career_milestones("isCompleted");

-- Session templates indexes
CREATE INDEX IF NOT EXISTS idx_session_templates_category ON session_templates(category);
CREATE INDEX IF NOT EXISTS idx_session_templates_is_public ON session_templates("isPublic");
