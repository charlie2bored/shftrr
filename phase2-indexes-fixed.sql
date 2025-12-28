-- Phase 2: Create indexes - FIXED for lowercase column names

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_provider ON users(provider);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(createdat);
CREATE INDEX IF NOT EXISTS idx_users_updated_at ON users(updatedat);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_email ON password_reset_tokens(email);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expiresat);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_created_at ON password_reset_tokens(createdat);

CREATE INDEX IF NOT EXISTS idx_user_onboardings_user_id ON user_onboardings(userid);
CREATE INDEX IF NOT EXISTS idx_user_onboardings_completed ON user_onboardings(completed);

CREATE INDEX IF NOT EXISTS idx_career_goals_user_id ON career_goals(userid);
CREATE INDEX IF NOT EXISTS idx_career_goals_goal_type ON career_goals(goaltype);
CREATE INDEX IF NOT EXISTS idx_career_goals_is_active ON career_goals(isactive);

CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(userid);
CREATE INDEX IF NOT EXISTS idx_conversations_goal_id ON conversations(goalid);
CREATE INDEX IF NOT EXISTS idx_conversations_session_type ON conversations(sessiontype);
CREATE INDEX IF NOT EXISTS idx_conversations_is_archived ON conversations(isarchived);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(createdat);

CREATE INDEX IF NOT EXISTS idx_conversation_messages_conversation_id ON conversation_messages(conversationid);
CREATE INDEX IF NOT EXISTS idx_conversation_messages_timestamp ON conversation_messages(timestamp);

CREATE INDEX IF NOT EXISTS idx_conversation_tags_conversation_id ON conversation_tags(conversationid);
CREATE INDEX IF NOT EXISTS idx_conversation_tags_tag ON conversation_tags(tag);

CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON job_applications(userid);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_applied_date ON job_applications(applieddate);
CREATE INDEX IF NOT EXISTS idx_job_applications_next_action_date ON job_applications(nextactiondate);

CREATE INDEX IF NOT EXISTS idx_action_items_user_id ON action_items(userid);
CREATE INDEX IF NOT EXISTS idx_action_items_status ON action_items(status);
CREATE INDEX IF NOT EXISTS idx_action_items_priority ON action_items(priority);
CREATE INDEX IF NOT EXISTS idx_action_items_due_date ON action_items(duedate);
CREATE INDEX IF NOT EXISTS idx_action_items_source_type ON action_items(sourcetype);
CREATE INDEX IF NOT EXISTS idx_action_items_source_id ON action_items(sourceid);

CREATE INDEX IF NOT EXISTS idx_career_plans_user_id ON career_plans(userid);
CREATE INDEX IF NOT EXISTS idx_career_plans_is_active ON career_plans(isactive);

CREATE INDEX IF NOT EXISTS idx_career_plan_phases_plan_id ON career_plan_phases(planid);
CREATE INDEX IF NOT EXISTS idx_career_plan_phases_order ON career_plan_phases("order");

CREATE INDEX IF NOT EXISTS idx_career_plan_tasks_phase_id ON career_plan_tasks(phaseid);
CREATE INDEX IF NOT EXISTS idx_career_plan_tasks_is_completed ON career_plan_tasks(iscompleted);
CREATE INDEX IF NOT EXISTS idx_career_plan_tasks_order ON career_plan_tasks("order");

CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills(userid);
CREATE INDEX IF NOT EXISTS idx_user_skills_category ON user_skills(category);

CREATE INDEX IF NOT EXISTS idx_career_milestones_user_id ON career_milestones(userid);
CREATE INDEX IF NOT EXISTS idx_career_milestones_milestone_type ON career_milestones(milestonetype);
CREATE INDEX IF NOT EXISTS idx_career_milestones_is_completed ON career_milestones(iscompleted);

CREATE INDEX IF NOT EXISTS idx_session_templates_category ON session_templates(category);
CREATE INDEX IF NOT EXISTS idx_session_templates_is_public ON session_templates(ispublic);
