"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/lib/toast-context';
import { Loader2 } from 'lucide-react';

interface OnboardingData {
  yearsExperience?: number;
  industry?: string;
  currentRole?: string;
  biggestStressor?: string;
  topConstraint?: string;
  careerGoals?: string;
  preferredWorkStyle?: string;
  skillLevel?: string;
  learningStyle?: string;
}

interface OnboardingFormProps {
  onComplete: (data: OnboardingData) => Promise<void>;
  initialData?: Partial<OnboardingData>;
}

const STRESSOR_OPTIONS = [
  'Burnout and work-life balance',
  'Salary and compensation',
  'Career growth and advancement',
  'Bad manager or toxic work environment',
  'Lack of work-life balance',
  'Uncertainty about career direction',
  'Skill development and learning',
  'Workplace politics',
  'Job security',
  'Other'
];

const CONSTRAINT_OPTIONS = [
  'Time constraints (busy schedule)',
  'Financial limitations',
  'Location/geographic restrictions',
  'Visa or immigration status',
  'Family responsibilities',
  'Health concerns',
  'Lack of relevant experience',
  'Education requirements',
  'Age discrimination concerns',
  'Other'
];

const WORK_STYLE_OPTIONS = [
  'Remote work',
  'Hybrid (mix of remote and office)',
  'On-site/office work',
  'Flexible schedule',
  'Not sure yet'
];

const SKILL_LEVEL_OPTIONS = [
  'Entry-level (0-2 years experience)',
  'Mid-level (3-5 years experience)',
  'Senior-level (6-10 years experience)',
  'Executive/Leadership (10+ years experience)'
];

const LEARNING_STYLE_OPTIONS = [
  'Structured learning (courses, certifications)',
  'Exploratory learning (self-directed projects)',
  'Hands-on learning (mentorship, on-the-job)',
  'Mix of all approaches'
];

export function OnboardingForm({ onComplete, initialData = {} }: OnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<OnboardingData>(initialData);
  const { success } = useToast();
  const router = useRouter();

  const steps = [
    { title: 'Welcome', description: 'Let\'s get to know you better' },
    { title: 'Experience', description: 'Tell us about your background' },
    { title: 'Current Situation', description: 'What\'s on your mind?' },
    { title: 'Goals & Preferences', description: 'What do you want to achieve?' },
    { title: 'Learning Style', description: 'How do you prefer to grow?' }
  ];

  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const updateFormData = (field: keyof OnboardingData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onComplete(formData);
      success('Welcome to Career Pivot Coach!', 'Your profile has been set up successfully.');
      router.push('/');
    } catch (error) {
      console.error('Failed to save onboarding data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Welcome
        return (
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Welcome to Career Pivot Coach!</h2>
              <p className="text-gray-300 text-lg">
                I'm excited to help you navigate your career journey. To provide the most personalized guidance,
                I'll ask a few questions about your background and goals.
              </p>
              <p className="text-gray-400">
                This will take about 3-5 minutes, and you can always update your information later.
              </p>
            </div>
          </div>
        );

      case 1: // Experience
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="yearsExperience" className="text-white text-lg">
                How many years of professional experience do you have?
              </Label>
              <Select
                value={formData.yearsExperience?.toString() || ''}
                onValueChange={(value) => updateFormData('yearsExperience', parseInt(value))}
              >
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="0">Less than 1 year</SelectItem>
                  <SelectItem value="1">1-2 years</SelectItem>
                  <SelectItem value="3">3-5 years</SelectItem>
                  <SelectItem value="6">6-10 years</SelectItem>
                  <SelectItem value="11">11-15 years</SelectItem>
                  <SelectItem value="16">16+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label htmlFor="industry" className="text-white text-lg">
                What industry are you currently in or most experienced in?
              </Label>
              <Input
                id="industry"
                placeholder="e.g., Technology, Finance, Healthcare, Education..."
                value={formData.industry || ''}
                onChange={(e) => updateFormData('industry', e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="currentRole" className="text-white text-lg">
                What's your current or most recent role?
              </Label>
              <Input
                id="currentRole"
                placeholder="e.g., Software Engineer, Product Manager, Data Analyst..."
                value={formData.currentRole || ''}
                onChange={(e) => updateFormData('currentRole', e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>
        );

      case 2: // Current Situation
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-white text-lg">
                What's your biggest stressor or challenge right now?
              </Label>
              <Select
                value={formData.biggestStressor || ''}
                onValueChange={(value) => updateFormData('biggestStressor', value)}
              >
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Select your biggest challenge" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {STRESSOR_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label className="text-white text-lg">
                What's your top constraint or limitation?
              </Label>
              <Select
                value={formData.topConstraint || ''}
                onValueChange={(value) => updateFormData('topConstraint', value)}
              >
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Select your main constraint" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {CONSTRAINT_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3: // Goals & Preferences
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="careerGoals" className="text-white text-lg">
                What are your main career goals? (Be as specific as you'd like)
              </Label>
              <Textarea
                id="careerGoals"
                placeholder="e.g., I want to transition from software engineering to product management, or I want to advance to a senior role in my current field..."
                value={formData.careerGoals || ''}
                onChange={(e) => updateFormData('careerGoals', e.target.value)}
                className="bg-gray-800 border-gray-600 text-white min-h-[100px]"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-white text-lg">
                What's your preferred work style?
              </Label>
              <Select
                value={formData.preferredWorkStyle || ''}
                onValueChange={(value) => updateFormData('preferredWorkStyle', value)}
              >
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Select your preferred work arrangement" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {WORK_STYLE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 4: // Learning Style
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-white text-lg">
                What's your current skill level?
              </Label>
              <Select
                value={formData.skillLevel || ''}
                onValueChange={(value) => updateFormData('skillLevel', value)}
              >
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Select your skill level" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {SKILL_LEVEL_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label className="text-white text-lg">
                How do you prefer to learn and develop new skills?
              </Label>
              <Select
                value={formData.learningStyle || ''}
                onValueChange={(value) => updateFormData('learningStyle', value)}
              >
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Select your preferred learning style" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {LEARNING_STYLE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
              <p className="text-blue-300 text-sm">
                🎯 <strong>You're all set!</strong> Based on your answers, I'll provide personalized career guidance
                tailored to your experience level, goals, and learning preferences.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gray-900 border-gray-700">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-400">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-sm text-gray-400">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="mb-4" />
          <CardTitle className="text-white text-xl">
            {steps[currentStep].title}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {steps[currentStep].description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {renderStepContent()}

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Previous
            </Button>

            {currentStep === totalSteps - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up your profile...
                  </>
                ) : (
                  'Complete Setup'
                )}
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
