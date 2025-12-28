-- Phase 3: Enable RLS and create policies (run AFTER indexes)

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
