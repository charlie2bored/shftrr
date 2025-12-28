-- Indexes and RLS policies - run AFTER all tables are created

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_provider ON users(provider);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users("createdAt");
CREATE INDEX IF NOT EXISTS idx_users_updated_at ON users("updatedAt");

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_email ON password_reset_tokens(email);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens("expiresAt");
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_created_at ON password_reset_tokens("createdAt");

CREATE INDEX IF NOT EXISTS idx_user_onboardings_user_id ON user_onboardings("userId");
CREATE INDEX IF NOT EXISTS idx_user_onboardings_completed ON user_onboardings(completed);

CREATE INDEX IF NOT EXISTS idx_career_goals_user_id ON career_goals("userId");
CREATE INDEX IF NOT EXISTS idx_career_goals_goal_type ON career_goals("goalType");
CREATE INDEX IF NOT EXISTS idx_career_goals_is_active ON career_goals("isActive");

CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations("userId");
CREATE INDEX IF NOT EXISTS idx_conversations_goal_id ON conversations("goalId");
CREATE INDEX IF NOT EXISTS idx_conversations_session_type ON conversations("sessionType");
CREATE INDEX IF NOT EXISTS idx_conversations_is_archived ON conversations("isArchived");
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations("createdAt");

CREATE INDEX IF NOT EXISTS idx_conversation_messages_conversation_id ON conversation_messages("conversationId");
CREATE INDEX IF NOT EXISTS idx_conversation_messages_timestamp ON conversation_messages(timestamp);

CREATE INDEX IF NOT EXISTS idx_conversation_tags_conversation_id ON conversation_tags("conversationId");
CREATE INDEX IF NOT EXISTS idx_conversation_tags_tag ON conversation_tags(tag);

CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON job_applications("userId");
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_applied_date ON job_applications("appliedDate");
CREATE INDEX IF NOT EXISTS idx_job_applications_next_action_date ON job_applications("nextActionDate");

CREATE INDEX IF NOT EXISTS idx_action_items_user_id ON action_items("userId");
CREATE INDEX IF NOT EXISTS idx_action_items_status ON action_items(status);
CREATE INDEX IF NOT EXISTS idx_action_items_priority ON action_items(priority);
CREATE INDEX IF NOT EXISTS idx_action_items_due_date ON action_items("dueDate");
CREATE INDEX IF NOT EXISTS idx_action_items_source_type ON action_items("sourceType");
CREATE INDEX IF NOT EXISTS idx_action_items_source_id ON action_items("sourceId");

CREATE INDEX IF NOT EXISTS idx_career_plans_user_id ON career_plans("userId");
CREATE INDEX IF NOT EXISTS idx_career_plans_is_active ON career_plans("isActive");

CREATE INDEX IF NOT EXISTS idx_career_plan_phases_plan_id ON career_plan_phases("planId");
CREATE INDEX IF NOT EXISTS idx_career_plan_phases_order ON career_plan_phases("order");

CREATE INDEX IF NOT EXISTS idx_career_plan_tasks_phase_id ON career_plan_tasks("phaseId");
CREATE INDEX IF NOT EXISTS idx_career_plan_tasks_is_completed ON career_plan_tasks("isCompleted");
CREATE INDEX IF NOT EXISTS idx_career_plan_tasks_order ON career_plan_tasks("order");

CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills("userId");
CREATE INDEX IF NOT EXISTS idx_user_skills_category ON user_skills(category);

CREATE INDEX IF NOT EXISTS idx_career_milestones_user_id ON career_milestones("userId");
CREATE INDEX IF NOT EXISTS idx_career_milestones_milestone_type ON career_milestones("milestoneType");
CREATE INDEX IF NOT EXISTS idx_career_milestones_is_completed ON career_milestones("isCompleted");

CREATE INDEX IF NOT EXISTS idx_session_templates_category ON session_templates(category);
CREATE INDEX IF NOT EXISTS idx_session_templates_is_public ON session_templates("isPublic");

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_onboardings ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_plan_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_plan_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_milestones ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only access their own data)
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid()::text = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid()::text = id);

CREATE POLICY "Users can access own onboarding" ON user_onboardings FOR ALL USING (auth.uid()::text = "userId");
CREATE POLICY "Users can access own goals" ON career_goals FOR ALL USING (auth.uid()::text = "userId");
CREATE POLICY "Users can access own conversations" ON conversations FOR ALL USING (auth.uid()::text = "userId");
CREATE POLICY "Users can access conversation messages" ON conversation_messages FOR ALL USING (
  EXISTS (SELECT 1 FROM conversations WHERE id = "conversationId" AND "userId" = auth.uid()::text)
);
CREATE POLICY "Users can access conversation tags" ON conversation_tags FOR ALL USING (
  EXISTS (SELECT 1 FROM conversations WHERE id = "conversationId" AND "userId" = auth.uid()::text)
);
CREATE POLICY "Users can access own applications" ON job_applications FOR ALL USING (auth.uid()::text = "userId");
CREATE POLICY "Users can access own action items" ON action_items FOR ALL USING (auth.uid()::text = "userId");
CREATE POLICY "Users can access own career plans" ON career_plans FOR ALL USING (auth.uid()::text = "userId");
CREATE POLICY "Users can access career plan phases" ON career_plan_phases FOR ALL USING (
  EXISTS (SELECT 1 FROM career_plans WHERE id = "planId" AND "userId" = auth.uid()::text)
);
CREATE POLICY "Users can access career plan tasks" ON career_plan_tasks FOR ALL USING (
  EXISTS (SELECT 1 FROM career_plan_phases p JOIN career_plans c ON p."planId" = c.id WHERE p.id = "phaseId" AND c."userId" = auth.uid()::text)
);
CREATE POLICY "Users can access own skills" ON user_skills FOR ALL USING (auth.uid()::text = "userId");
CREATE POLICY "Users can access own milestones" ON career_milestones FOR ALL USING (auth.uid()::text = "userId");

-- Public access for session templates
CREATE POLICY "Anyone can view public templates" ON session_templates FOR SELECT USING ("isPublic" = true);
