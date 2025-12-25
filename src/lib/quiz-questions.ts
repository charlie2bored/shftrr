export interface QuizQuestion {
  id: string
  question: string
  type: 'scale' | 'multiple_choice' | 'checkbox' | 'text'
  options?: string[]
  min?: number
  max?: number
  labels?: { [key: number]: string }
  category: string
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Career Satisfaction
  {
    id: 'career_satisfaction',
    question: 'On a scale of 1-10, how satisfied are you with your current career?',
    type: 'scale',
    min: 1,
    max: 10,
    labels: { 1: 'Completely dissatisfied', 10: 'Extremely satisfied' },
    category: 'career'
  },

  // Burnout Assessment
  {
    id: 'burnout_level',
    question: 'How would you rate your current level of burnout or work-related stress?',
    type: 'scale',
    min: 1,
    max: 10,
    labels: { 1: 'No stress at all', 10: 'Completely burned out' },
    category: 'burnout'
  },

  // Daily Stress Indicators
  {
    id: 'stress_indicators',
    question: 'Which of these do you experience regularly? (Select all that apply)',
    type: 'checkbox',
    options: [
      'Difficulty sleeping due to work/stress thoughts',
      'Irritability or mood swings',
      'Physical symptoms (headaches, stomach issues)',
      'Loss of interest in hobbies',
      'Feeling overwhelmed by small tasks',
      'Procrastination on important tasks',
      'Social withdrawal',
      'Decreased productivity',
      'Job search anxiety (if unemployed)',
      'Financial stress',
      'Uncertainty about career future'
    ],
    category: 'burnout'
  },

  // Risk Tolerance
  {
    id: 'risk_tolerance',
    question: 'How comfortable are you with taking career risks?',
    type: 'multiple_choice',
    options: [
      'Conservative - I prefer stability and predictable outcomes',
      'Moderate - I\'m willing to take calculated risks',
      'Aggressive - I thrive on change and uncertainty'
    ],
    category: 'personality'
  },

  // Financial Readiness
  {
    id: 'financial_readiness',
    question: 'How prepared do you feel financially for a career transition?',
    type: 'multiple_choice',
    options: [
      'Poor - I have significant debt and minimal savings',
      'Fair - I have some savings but limited runway',
      'Good - I have 6-12 months of expenses saved',
      'Excellent - I have strong financial stability'
    ],
    category: 'financial'
  },

  // Emergency Fund
  {
    id: 'emergency_fund',
    question: 'How many months of expenses could you cover with your current savings?',
    type: 'multiple_choice',
    options: [
      'Less than 1 month',
      '1-3 months',
      '3-6 months',
      '6-12 months',
      'More than 12 months'
    ],
    category: 'financial'
  },

  // Timeline Preference
  {
    id: 'timeline_preference',
    question: 'What\'s your ideal timeline for making a career change?',
    type: 'multiple_choice',
    options: [
      'Immediate - I want to leave as soon as possible',
      '6 months - I need time to plan and prepare',
      '1 year - I want to be thorough in my transition',
      '2+ years - I\'m in no rush and want long-term planning'
    ],
    category: 'timeline'
  },

  // Family Situation
  {
    id: 'dependents',
    question: 'How many dependents do you have? (children, elderly parents, etc.)',
    type: 'multiple_choice',
    options: [
      'None',
      '1 dependent',
      '2 dependents',
      '3+ dependents'
    ],
    category: 'family'
  },

  // Location Flexibility
  {
    id: 'location_flexibility',
    question: 'How flexible are you with your location?',
    type: 'multiple_choice',
    options: [
      'Not flexible - I must stay in my current area',
      'Somewhat flexible - Open to nearby cities',
      'Very flexible - Willing to relocate anywhere',
      'Remote work only - Location doesn\'t matter'
    ],
    category: 'family'
  },

  // Skills Assessment
  {
    id: 'technical_skills',
    question: 'Which technical skills do you consider yourself proficient in?',
    type: 'checkbox',
    options: [
      'Programming/Development',
      'Data Analysis',
      'Design/UI/UX',
      'Project Management',
      'Marketing/Digital Marketing',
      'Sales/Business Development',
      'Writing/Content Creation',
      'Teaching/Training',
      'Customer Service',
      'Other technical skills'
    ],
    category: 'skills'
  },

  // Skills Gaps
  {
    id: 'skills_gaps',
    question: 'What skills do you feel you need to develop for your target career?',
    type: 'checkbox',
    options: [
      'Technical skills specific to new field',
      'Industry knowledge and terminology',
      'Networking and relationship building',
      'Interview and job search skills',
      'Salary negotiation',
      'Leadership and management',
      'Communication and presentation',
      'Time management and productivity',
      'Learning new tools/software',
      'Certifications or formal education'
    ],
    category: 'skills'
  },

  // Career Interests
  {
    id: 'career_interests',
    question: 'What aspects of work are most important to you?',
    type: 'checkbox',
    options: [
      'Helping others/ making an impact',
      'Creative expression',
      'Problem solving/ analytical work',
      'Leadership and team management',
      'Working with data/technology',
      'Customer interaction',
      'Independent work/freelancing',
      'Structured environment with clear rules',
      'Continuous learning and growth',
      'Work-life balance',
      'High earning potential',
      'Job security and stability',
      'Travel or location flexibility',
      'Building/creating things'
    ],
    category: 'interests'
  },

  // Industry Interests
  {
    id: 'industry_interests',
    question: 'Which industries are you most interested in exploring?',
    type: 'checkbox',
    options: [
      'Technology/Software',
      'Healthcare/Medicine',
      'Education/Training',
      'Finance/Banking',
      'Marketing/Advertising',
      'Consulting',
      'Non-profit/Social Impact',
      'Creative Arts/Design',
      'Manufacturing/Engineering',
      'Hospitality/Tourism',
      'Real Estate',
      'Legal Services',
      'Government/Public Sector',
      'Retail/E-commerce',
      'Environmental/Sustainability',
      'Research & Development',
      'Sales/Business Development',
      'Human Resources',
      'Operations/Logistics',
      'Other'
    ],
    category: 'interests'
  },

  // Motivation Factors
  {
    id: 'motivation_factors',
    question: 'What factors are most important to you in a new career?',
    type: 'checkbox',
    options: [
      'Higher salary/compensation',
      'Better work-life balance',
      'More interesting/meaningful work',
      'Career growth opportunities',
      'Better company culture',
      'Remote work flexibility',
      'Learning and development',
      'Job security',
      'Autonomy/independence',
      'Making a positive impact',
      'Creative expression',
      'Work-life integration'
    ],
    category: 'motivation'
  },

  // Work Environment Preferences
  {
    id: 'work_environment',
    question: 'What type of work environment do you prefer?',
    type: 'multiple_choice',
    options: [
      'Fast-paced startup environment',
      'Stable corporate setting',
      'Non-profit or mission-driven organization',
      'Academic or research institution',
      'Freelance/consulting (self-employed)',
      'Small business or local company',
      'Remote-first company',
      'Traditional office environment'
    ],
    category: 'preferences'
  }
]

export const QUIZ_CATEGORIES = {
  career: 'Career Satisfaction',
  burnout: 'Burnout Assessment',
  personality: 'Personality & Risk',
  financial: 'Financial Readiness',
  timeline: 'Timeline Preferences',
  family: 'Family Situation',
  skills: 'Skills Assessment',
  interests: 'Industry Interests',
  motivation: 'Motivation Factors',
  preferences: 'Work Preferences'
} as const
