import { z } from 'zod'

// Input schemas
export const UserProfileSchema = z.object({
  currentJobTitle: z.string().optional(), // Optional for unemployed users
  currentSalary: z.number().optional(), // Optional for unemployed users
  yearsExperience: z.number().optional(),
  employmentStatus: z.enum(['employed', 'unemployed', 'self-employed', 'student']).default('employed'),
  education: z.object({
    degrees: z.array(z.string()).optional(),
    certifications: z.array(z.string()).optional(),
    highestEducation: z.string().optional(),
  }).optional(),
  dailyVents: z.array(z.string()).optional(), // Array of daily complaints/rants
})

export const FinancialDataSchema = z.object({
  monthlyExpenses: z.number(),
  debt: z.number(),
  savings: z.number().nullable().optional(), // Allow null/undefined for users who haven't input savings
  monthlyIncome: z.number(),
})

export const SkillsSchema = z.object({
  technicalSkills: z.array(z.string()),
  softSkills: z.array(z.string()),
  certifications: z.array(z.string()).optional(),
})

export const CareerGoalsSchema = z.object({
  desiredField: z.string().optional(),
  desiredJobTitle: z.string().optional(),
  desiredSalary: z.number().optional(),
  careerInterests: z.array(z.string()).optional(),
})

export const EscapePlanInputSchema = z.object({
  userProfile: UserProfileSchema,
  financialData: FinancialDataSchema,
  skills: SkillsSchema,
  careerGoals: CareerGoalsSchema.optional(),
})

export type EscapePlanInput = z.infer<typeof EscapePlanInputSchema>

// Output schemas
export const BurnoutRiskSchema = z.object({
  score: z.number().min(0).max(100), // 0-100 scale
  level: z.enum(['Low', 'Medium', 'High', 'Critical']),
  factors: z.array(z.string()),
})

export const FinancialRunwaySchema = z.object({
  months: z.number(),
  status: z.enum(['Critical', 'Limited', 'Moderate', 'Strong']),
  recommendation: z.string(),
})

export const CelebrationPointSchema = z.object({
  trigger: z.string(), // When to celebrate (e.g., "Complete first networking call")
  message: z.string(), // Motivational celebration message
  reward: z.string(), // What they get (e.g., "Treat yourself to coffee")
})

export const CourageBoostSchema = z.object({
  fear: z.string(), // The specific fear/risk
  affirmation: z.string(), // Motivational counter-message
  action: z.string(), // Specific action to take
})

export const InteractiveElementSchema = z.object({
  type: z.enum(['progress_bar', 'checklist', 'reflection_question', 'motivation_prompt']),
  title: z.string(),
  content: z.string(),
  frequency: z.string().optional(), // e.g., "daily", "weekly"
})

export const RoadmapPhaseSchema = z.object({
  title: z.string(),
  duration: z.string(), // e.g., "6 months", "1 year"
  introduction: z.string(), // Emotional, motivational intro
  goals: z.array(z.string()),
  actions: z.array(z.object({
    description: z.string(),
    specificSteps: z.array(z.string()), // Break down into concrete steps
    timeEstimate: z.string(),
    tools: z.array(z.string()).optional(), // Apps, websites, templates needed
  })),
  milestones: z.array(z.object({
    description: z.string(),
    celebration: z.string(), // What to celebrate when achieved
    measurable: z.string(), // How to measure success
  })),
  risks: z.array(z.string()).optional(),
  courageBoosts: z.array(CourageBoostSchema).optional(),
  contingencies: z.array(z.string()).optional(),
  interactiveElements: z.array(InteractiveElementSchema).optional(),
  weeklyCheckIns: z.array(z.string()).optional(), // Weekly reflection questions
})

export const EmergencyFundSchema = z.object({
  recommendedAmount: z.number(),
  timeframe: z.string(),
  calculation: z.string(),
  tips: z.array(z.string()),
})

export const BudgetRecommendationSchema = z.object({
  monthlyIncome: z.number(),
  recommendedExpenses: z.record(z.string(), z.number()),
  savingsTarget: z.number(),
  debtReduction: z.string().optional(),
  rationale: z.string(),
})

export const CareerPathSchema = z.object({
  title: z.string(),
  description: z.string(),
  salaryRange: z.string(),
  skillsRequired: z.array(z.string()),
  timeToEntry: z.string(),
  growthPotential: z.string(),
  fitScore: z.number().min(0).max(100),
})

export const CertificationSchema = z.object({
  name: z.string(),
  provider: z.string(),
  cost: z.string(),
  duration: z.string(),
  value: z.string(),
  relevance: z.number().min(0).max(100),
})

export const EscapePlanOutputSchema = z.object({
  // Personal assessment
  burnoutRisk: BurnoutRiskSchema,
  motivation: z.object({
    currentDrive: z.string(),
    inspiration: z.string(),
    accountability: z.string(),
  }),

  // Financial planning
  financialRunway: FinancialRunwaySchema,
  emergencyFund: EmergencyFundSchema,
  budgetRecommendation: BudgetRecommendationSchema,

  // Career exploration
  careerPaths: z.object({
    primary: CareerPathSchema,
    alternatives: z.array(CareerPathSchema).max(5),
  }),
  skillsNeeded: z.array(z.string()),
  certifications: z.array(CertificationSchema).max(5),
  fieldSelector: z.object({
    recommendedFields: z.array(z.string()),
    reasoning: z.string(),
    nextSteps: z.array(z.string()),
  }).optional(),

  // Interactive roadmap
  roadmap: z.object({
    phase1: RoadmapPhaseSchema, // 6 months
    phase2: RoadmapPhaseSchema, // 1 year
    phase3: RoadmapPhaseSchema, // 2 years
  }),

  // Gamification elements
  celebrationPoints: z.array(CelebrationPointSchema),
  dailyMotivationPrompts: z.array(z.string()),
  progressTracking: z.object({
    overallCompletion: z.number(),
    phaseProgress: z.object({
      phase1: z.number(),
      phase2: z.number(),
      phase3: z.number(),
    }),
  }),

  generatedAt: z.string(),
})

export type EscapePlanOutput = z.infer<typeof EscapePlanOutputSchema>

// Types for internal use
export type UserProfile = z.infer<typeof UserProfileSchema>
export type FinancialData = z.infer<typeof FinancialDataSchema>
export type Skills = z.infer<typeof SkillsSchema>
