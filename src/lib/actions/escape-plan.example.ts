// Example usage of the generateEscapePlan Server Action
// This file demonstrates how to call the function with sample data

import { generateEscapePlan } from './escape-plan'

export const exampleUsage = async () => {
  const result = await generateEscapePlan({
    userProfile: {
      employmentStatus: 'employed',
      currentJobTitle: 'Senior Software Engineer',
      currentSalary: 120000,
      yearsExperience: 8,
      dailyVents: [
        'Constantly fighting fires and putting out emergencies',
        'No time for deep work or learning new technologies',
        'Management prioritizes deadlines over quality',
        'Feeling burned out from constant overtime'
      ]
    },
    financialData: {
      monthlyExpenses: 5500,
      debt: 45000, // mortgage and student loans
      savings: 25000,
      monthlyIncome: 10000
    },
    skills: {
      technicalSkills: ['React', 'TypeScript', 'Node.js', 'AWS', 'Python', 'Docker'],
      softSkills: ['Leadership', 'Mentoring', 'Problem Solving', 'Communication'],
      certifications: ['AWS Certified Solutions Architect', 'Certified Scrum Master']
    }
  })

  console.log('Burnout Risk:', result.burnoutRisk)
  console.log('Financial Runway:', result.financialRunway)
  console.log('Roadmap:', result.roadmap)

  return result
}

// Expected output structure:
/*
{
  burnoutRisk: {
    score: 75,
    level: "High",
    factors: [
      "High frequency of negative work comments",
      "Leadership and management complaints",
      "Work-life balance concerns",
      "Technical stagnation"
    ]
  },
  financialRunway: {
    months: 4,
    status: "Limited",
    recommendation: "Build emergency savings before making major career changes"
  },
  roadmap: {
    phase1: {
      title: "Assessment & Stabilization",
      duration: "6 months",
      goals: [...],
      actions: [...],
      milestones: [...],
      risks: [...],
      contingencies: [...]
    },
    phase2: { ... },
    phase3: { ... }
  }
}
*/
