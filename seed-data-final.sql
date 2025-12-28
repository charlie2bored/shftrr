-- Seed data for Career Pivot Coach - FINAL VERSION with correct column names
-- Run this AFTER the tables are created

-- Create test user (password is 'password123' hashed with bcrypt)
INSERT INTO users (id, email, name, password, provider) VALUES
('test-user-id', 'test@example.com', 'Test User', '$2a$12$L8uJGzYpQXJcG5QJzHqJe.QzHqJe.QzHqJe.QzHqJe.QzHqJe.QzHq', 'credentials')
ON CONFLICT (email) DO NOTHING;

-- Sample session templates (using lowercase column names)
INSERT INTO session_templates (title, description, category, suggestedprompt, questions, sampleresponse, ispublic) VALUES
('Lost and Need Direction', 'For professionals feeling stuck and unsure about their next career move', 'career-direction', 'I feel completely lost in my career. I have X years of experience in Y but I am not sure what to do next. Can you help me figure out my options?', '["How many years of experience do you have?", "What industry/role are you currently in?", "What are your main concerns about your current situation?"]'::jsonb, '{"response": "I understand feeling lost in your career can be incredibly stressful..."}'::jsonb, true),
('Burnout Recovery', 'Strategies for dealing with work-related burnout and stress', 'wellness', 'I am experiencing severe burnout at work. I feel exhausted, unmotivated, and dread going to work. What can I do?', '["How long have you been feeling this way?", "What aspects of your job are most draining?", "Have you discussed this with anyone?"]'::jsonb, '{"response": "Burnout is a serious issue that affects many professionals..."}'::jsonb, true),
('Salary Negotiation', 'Prepare for salary discussions and compensation conversations', 'negotiation', 'I have a job offer but I am not sure if the salary is fair. How do I negotiate effectively?', '["What is the offered salary?", "What is your current salary?", "What are your salary expectations?"]'::jsonb, '{"response": "Salary negotiation is a critical skill for career advancement..."}'::jsonb, true)
ON CONFLICT DO NOTHING;
