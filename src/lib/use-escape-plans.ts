"use client";

import { useState, useEffect } from 'react';
import { EscapePlan } from './types';

const STORAGE_KEY = 'career-pivot-escape-plans';

// Client-side only hook to prevent hydration mismatches
export function useEscapePlans() {
  const [isClient, setIsClient] = useState(false);
  const [escapePlans, setEscapePlans] = useState<EscapePlan[]>([]);

  // Mark as client-side on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load from localStorage only on client
  useEffect(() => {
    if (!isClient) return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        const plans = parsed.map((plan: any) => ({
          ...plan,
          timestamp: new Date(plan.timestamp)
        }));
        setEscapePlans(plans);
      }
    } catch (error) {
      console.error('Error loading escape plans:', error);
    }
  }, [isClient]);

  // Save to localStorage whenever plans change (only on client)
  useEffect(() => {
    if (!isClient) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(escapePlans));
    } catch (error) {
      console.error('Error saving escape plans:', error);
    }
  }, [escapePlans, isClient]);

  const addEscapePlan = (plan: Omit<EscapePlan, 'id' | 'timestamp'>) => {
    const newPlan: EscapePlan = {
      ...plan,
      id: typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };
    setEscapePlans(prev => [newPlan, ...prev]); // Add to beginning
    return newPlan;
  };

  const deleteEscapePlan = (id: string) => {
    setEscapePlans(prev => prev.filter(plan => plan.id !== id));
  };

  const updateEscapePlan = (id: string, updates: Partial<EscapePlan>) => {
    setEscapePlans(prev => prev.map(plan =>
      plan.id === id ? { ...plan, ...updates } : plan
    ));
  };

  return {
    escapePlans: isClient ? escapePlans : [],
    addEscapePlan,
    deleteEscapePlan,
    updateEscapePlan,
    isClient,
  };
}
