-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Create custom types
CREATE TYPE milestone_period AS ENUM ('6_months', '1_year', '2_years');

-- Create users profile table (extends auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    current_job_title TEXT,
    current_salary DECIMAL(12,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create financial_constraints table
CREATE TABLE public.financial_constraints (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    monthly_expenses DECIMAL(12,2) NOT NULL DEFAULT 0,
    debt DECIMAL(12,2) NOT NULL DEFAULT 0,
    savings DECIMAL(12,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id)
);

-- Create career_goals table
CREATE TABLE public.career_goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    target_industries TEXT[] NOT NULL DEFAULT '{}',
    desired_salary DECIMAL(12,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id)
);

-- Create transition_plans table
CREATE TABLE public.transition_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    period milestone_period NOT NULL,
    milestones TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, period)
);

-- Create user_assessments table
CREATE TABLE public.user_assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    career_satisfaction INTEGER,
    burnout_level INTEGER,
    risk_tolerance TEXT,
    financial_readiness TEXT,
    timeline_preference TEXT,
    family_situation JSONB,
    skills_gaps TEXT[],
    industry_interests TEXT[],
    motivation_factors TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_constraints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transition_plans ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Create policies for financial_constraints table
CREATE POLICY "Users can view own financial constraints" ON public.financial_constraints
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own financial constraints" ON public.financial_constraints
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own financial constraints" ON public.financial_constraints
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for career_goals table
CREATE POLICY "Users can view own career goals" ON public.career_goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own career goals" ON public.career_goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own career goals" ON public.career_goals
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for transition_plans table
CREATE POLICY "Users can view own transition plans" ON public.transition_plans
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transition plans" ON public.transition_plans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transition plans" ON public.transition_plans
    FOR UPDATE USING (auth.uid() = user_id);

-- Enable Row Level Security for user_assessments table
ALTER TABLE public.user_assessments ENABLE ROW LEVEL SECURITY;

-- Create policies for user_assessments table
CREATE POLICY "Users can view own assessments" ON public.user_assessments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessments" ON public.user_assessments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assessments" ON public.user_assessments
    FOR UPDATE USING (auth.uid() = user_id);

-- Create function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_financial_constraints_updated_at
    BEFORE UPDATE ON public.financial_constraints
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_career_goals_updated_at
    BEFORE UPDATE ON public.career_goals
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transition_plans_updated_at
    BEFORE UPDATE ON public.transition_plans
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_assessments_updated_at
    BEFORE UPDATE ON public.user_assessments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
