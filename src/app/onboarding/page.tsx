"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingForm } from '@/components/onboarding/OnboardingForm';
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

export default function OnboardingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [existingData, setExistingData] = useState<Partial<OnboardingData>>({});
  const router = useRouter();
  const { error: showError } = useToast();

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const response = await fetch('/api/onboarding');
      const data = await response.json();

      if (data.completed) {
        // User has already completed onboarding, redirect to dashboard
        router.push('/');
        return;
      }

      if (data.onboarding) {
        // User has partial onboarding data
        setExistingData(data.onboarding);
      }
    } catch (error) {
      console.error('Failed to check onboarding status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = async (data: OnboardingData) => {
    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save onboarding data');
      }

      // Redirect to dashboard after successful onboarding
      router.push('/');
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      showError('Failed to save your information', 'Please try again or contact support.');
      throw error; // Re-throw to prevent the form from completing
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-blue-400 mx-auto mb-4" />
          <p className="text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return <OnboardingForm onComplete={handleOnboardingComplete} initialData={existingData} />;
}
