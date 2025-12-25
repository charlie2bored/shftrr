-- Add diagnostic quiz table
CREATE TABLE public.user_assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    career_satisfaction INTEGER CHECK (career_satisfaction >= 1 AND career_satisfaction <= 10),
    burnout_level INTEGER CHECK (burnout_level >= 1 AND burnout_level <= 10),
    risk_tolerance VARCHAR(20) CHECK (risk_tolerance IN ('conservative', 'moderate', 'aggressive')),
    financial_readiness VARCHAR(20) CHECK (financial_readiness IN ('poor', 'fair', 'good', 'excellent')),
    timeline_preference VARCHAR(20) CHECK (timeline_preference IN ('immediate', '6_months', '1_year', '2_years')),
    family_situation JSONB,
    skills_gaps TEXT[],
    industry_interests TEXT[],
    motivation_factors TEXT[],
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_assessments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own assessments" ON public.user_assessments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessments" ON public.user_assessments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assessments" ON public.user_assessments
    FOR UPDATE USING (auth.uid() = user_id);
