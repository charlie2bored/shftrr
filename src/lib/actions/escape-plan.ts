'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'
import { supabase } from '../supabase'
import {
  EscapePlanInputSchema,
  EscapePlanOutputSchema,
  type EscapePlanInput,
  type EscapePlanOutput
} from '../escape-plan.types'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

const JSON_SCHEMA = `{
  "burnoutRisk": {
    "score": 0-100,
    "level": "Low" | "Medium" | "High" | "Critical",
    "factors": ["array of factors"]
  },
  "financialRunway": {
    "months": 0,
    "status": "Critical" | "Limited" | "Moderate" | "Strong",
    "recommendation": "string"
  },
  "emergencyFund": {
    "recommendedAmount": 0,
    "timeframe": "string",
    "calculation": "string",
    "tips": ["string"]
  },
  "budgetRecommendation": {
    "monthlyIncome": 0,
    "recommendedExpenses": {"category": 0},
    "savingsTarget": 0,
    "debtReduction": "string",
    "rationale": "string"
  },
  "careerPaths": {
    "primary": {
      "title": "string",
      "description": "string",
      "salaryRange": "string",
      "skillsRequired": ["string"],
      "timeToEntry": "string",
      "growthPotential": "string",
      "fitScore": 0
    },
    "alternatives": []
  },
  "skillsNeeded": ["string"],
  "certifications": [],
  "fieldSelector": {
    "recommendedFields": ["string"],
    "reasoning": "string",
    "nextSteps": ["string"]
  },
  "roadmap": {
    "phase1": {
      "title": "string",
      "duration": "6 months",
      "goals": ["string"],
      "actions": ["string"],
      "milestones": ["string"],
      "risks": ["string"],
      "contingencies": ["string"]
    },
    "phase2": {
      "title": "string",
      "duration": "1 year",
      "goals": ["string"],
      "actions": ["string"],
      "milestones": ["string"],
      "risks": ["string"],
      "contingencies": ["string"]
    },
    "phase3": {
      "title": "string",
      "duration": "2 years",
      "goals": ["string"],
      "actions": ["string"],
      "milestones": ["string"],
      "risks": ["string"],
      "contingencies": ["string"]
    }
  },
  "generatedAt": "ISO string"
}`

async function fetchUserAssessment(userId: string) {
  if (!userId) return null

  try {
    const { data, error } = await supabase
      .from('user_assessments')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) return null
    return data
  } catch (error) {
    return null
  }
}

export async function generateEscapePlan(input: EscapePlanInput): Promise<EscapePlanOutput> {
  // Validate input
  const validatedInput = EscapePlanInputSchema.parse(input)

  // Get the Gemini model
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-pro',
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 4096,
    },
  })

  // Fetch user's diagnostic assessment if available (user ID from authenticated context)
  // Note: In a real implementation, you'd pass the user ID from the authenticated session
  const assessment = null // Temporarily disabled until user ID is properly passed

  // Create a comprehensive prompt for the AI
  const prompt = createEscapePlanPrompt(validatedInput, assessment)

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parse and validate the JSON response
    const parsed = JSON.parse(text)

    // Validate the output schema
    const validatedOutput = EscapePlanOutputSchema.parse({
      ...parsed,
      generatedAt: new Date().toISOString(),
    })

    return validatedOutput
  } catch (error) {
    console.error('Error generating escape plan:', error)

    // Fallback: generate a basic plan if AI fails
    return generateFallbackPlan(validatedInput)
  }
}

function createEscapePlanPrompt(input: EscapePlanInput, assessment: any = null): string {
  const { userProfile, financialData, skills, careerGoals } = input

  let assessmentData = ''
  if (assessment) {
    assessmentData = '\n\nDIAGNOSTIC ASSESSMENT RESULTS:\n' +
      '- Career Satisfaction: ' + (assessment.career_satisfaction || 'Not assessed') + '/10\n' +
      '- Burnout Level: ' + (assessment.burnout_level || 'Not assessed') + '/10\n' +
      '- Risk Tolerance: ' + (assessment.risk_tolerance || 'Not assessed') + '\n' +
      '- Financial Readiness: ' + (assessment.financial_readiness || 'Not assessed') + '\n' +
      '- Timeline Preference: ' + (assessment.timeline_preference || 'Not assessed') + '\n' +
      '- Family Situation: ' + (assessment.family_situation ? JSON.stringify(assessment.family_situation) : 'Not provided') + '\n' +
      '- Skills Gaps: ' + (assessment.skills_gaps?.join(', ') || 'Not assessed') + '\n' +
      '- Industry Interests: ' + (assessment.industry_interests?.join(', ') || 'Not assessed') + '\n' +
      '- Motivation Factors: ' + (assessment.motivation_factors?.join(', ') || 'Not assessed')
  }

  const careerGoalsData = careerGoals ? '\n\nCAREER GOALS:\n' +
    '- Desired Field: ' + (careerGoals.desiredField || 'Not specified') + '\n' +
    '- Desired Job Title: ' + (careerGoals.desiredJobTitle || 'Not specified') + '\n' +
    '- Desired Salary: ' + (careerGoals.desiredSalary ? '$' + careerGoals.desiredSalary.toLocaleString() : 'Not specified') + '\n' +
    '- Career Interests: ' + (careerGoals.careerInterests?.join(', ') || 'Not specified') : ''

  return 'You are an expert career transition coach and motivational speaker who specializes in helping mid-career professionals break free from "golden handcuffs" and pursue fulfilling careers. You must create an INTERACTIVE, MOTIVATIONAL, and HIGHLY PERSONALIZED escape plan that feels like a conversation with an enthusiastic career coach.\n\n' +
    'IMPORTANT: Make this feel like an exciting journey, not a chore. Use motivational language, celebrate small wins, address fears directly, and create emotional connection. Replace generic advice with SPECIFIC, actionable steps that someone can start doing TODAY.\n\n' +
    'USER PROFILE:\n' +
    '- Employment Status: ' + (userProfile.employmentStatus || 'employed') + '\n' +
    '- Current Job: ' + (userProfile.currentJobTitle || 'Not employed') + '\n' +
    '- Current Salary: ' + (userProfile.currentSalary ? '$' + userProfile.currentSalary.toLocaleString() : 'Not employed') + '\n' +
    '- Years of Experience: ' + (userProfile.yearsExperience || 'Not specified') + '\n' +
    '- Education: ' + (userProfile.education ? JSON.stringify(userProfile.education) : 'Not provided') + '\n' +
    '- Daily Vents/Complaints: ' + (userProfile.dailyVents?.join('; ') || 'None provided') + careerGoalsData + assessmentData + '\n\n' +
    'FINANCIAL DATA:\n' +
    '- Monthly Expenses: $' + financialData.monthlyExpenses.toLocaleString() + '\n' +
    '- Total Debt: $' + financialData.debt.toLocaleString() + '\n' +
    '- Emergency Savings: ' + (financialData.savings ? '$' + financialData.savings.toLocaleString() : 'Not specified') + '\n' +
    '- Monthly Income: $' + (financialData.monthlyIncome?.toLocaleString() || '0') + '\n\n' +
    'SKILLS:\n' +
    '- Technical Skills: ' + skills.technicalSkills.join(', ') + '\n' +
    '- Soft Skills: ' + skills.softSkills.join(', ') + '\n' +
    '- Certifications: ' + (skills.certifications?.join(', ') || 'None') + '\n\n' +
    'CRITICAL REQUIREMENTS FOR MOTIVATIONAL DESIGN:\n\n' +
    '1. EMOTIONAL CONNECTION: Start each phase with an encouraging message addressing their specific fears and aspirations\n\n' +
    '2. SPECIFICITY OVER GENERALITY: Replace "network with 2-3 professionals" with "Join 3 LinkedIn groups for [their target industry] and send 2 connection requests daily with personalized messages"\n\n' +
    '3. IMMEDIATE ACTIONABILITY: Every action must be something they can start within 24 hours. Include exact links, templates, and scripts\n\n' +
    '4. PROGRESS CELEBRATION: Add "Celebration Points" for completing milestones, with motivational messages\n\n' +
    '5. FEAR ADDRESSING: For each risk, include a "Courage Boost" - a motivational message countering that fear\n\n' +
    '6. ACCOUNTABILITY: Add weekly check-in questions and progress reflection prompts\n\n' +
    '7. PERSONALIZATION: Use their actual job title, salary, skills, and goals throughout the plan\n\n' +
    '8. VISUAL PROGRESS: Include completion percentages and visual progress indicators in descriptions\n\n' +
    '9. SOCIAL PROOF: Reference successful transitions similar to their situation\n\n' +
    '10. URGENCY WITHOUT PRESSURE: Create excitement about their future without making them feel rushed\n\n' +
    'INTERACTIVE ELEMENTS TO INCLUDE:\n' +
    '- Progress tracking with visual completion bars\n' +
    '- Daily motivation prompts\n' +
    '- Weekly reflection questions\n' +
    '- Success celebration messages\n' +
    '- Fear-busting affirmations\n' +
    '- Specific tool recommendations (apps, websites, templates)\n' +
    '- Networking scripts and email templates\n' +
    '- Salary negotiation playbooks\n' +
    '- Resume and LinkedIn optimization checklists\n\n' +
    'Make this feel like an exciting adventure where they\'re the hero of their own career story!'

'Based on this data, generate a JSON response that matches this exact schema: ' + JSON_SCHEMA

'CRITICAL REQUIREMENTS:\n\n' +
'1. Emergency Fund Analysis: Calculate recommended emergency fund size (typically 3-6 months of expenses). Provide specific amount, timeframe to reach it, and tips for building it.\n\n' +
'2. Monthly Budget Optimization: Analyze their current expenses vs income. Provide categorized budget recommendations, savings targets, and debt reduction strategies.\n\n' +
'3. Field Selector (for undecided users): If user has no desired field, analyze their skills, interests, and market trends to recommend 3-5 suitable career fields with reasoning.\n\n' +
'4. Career Path Analysis: Provide detailed analysis of:\n' +
'   - Primary career path based on their goals\n' +
'   - 5 alternative career paths they could consider\n' +
'   - Each path should include: title, description, salary range, required skills, time to entry, growth potential, and fit score (0-100)\n\n' +
'5. Skills Gap Analysis: Identify specific skills needed to transition into their desired field. Be realistic about their current skills and experience.\n\n' +
'6. Certification Recommendations: Recommend up to 5 relevant certifications with provider, cost, duration, and value assessment.\n\n' +
'7. Burnout Risk Score: Analyze daily vents for patterns. High frequency of negative comments = higher score. Consider job title stress levels and experience.\n\n' +
'8. Financial Runway: Calculate as (savings / monthly expenses). Be realistic - factor in debt reduction needs and emergency funds.\n\n' +
'9. Roadmap Realism: DO NOT suggest quitting immediately if financial runway is limited. Suggest bridge jobs, side hustles, or gradual transitions. Phase 1 should focus on assessment and preparation, not drastic changes.\n\n' +
'10. Actionable Recommendations: Include concrete steps like "Network with 5 people in target industry per week" rather than vague "Network more".\n\n' +
'11. Skills & Experience Consideration: Consider their current skills, education, and experience when suggesting career paths. Don\'t suggest unrealistic pivots.\n\n' +
'12. Risk Mitigation: Include risk mitigation and contingency plans for each phase.\n\n' +
'Return ONLY valid JSON, no markdown formatting or explanations.'
}

function generateFallbackPlan(input: EscapePlanInput): EscapePlanOutput {
  const { userProfile, financialData, careerGoals } = input

  // Basic financial runway calculation - handle null/undefined savings
  const monthlyBurn = financialData.monthlyExpenses
  const savings = financialData.savings ?? 0 // Default to 0 if not provided
  const runwayMonths = monthlyBurn > 0 ? Math.floor(savings / monthlyBurn) : 0

  // Emergency fund recommendation (3-6 months of expenses)
  const recommendedEmergencyFund = monthlyBurn * 6
  const emergencyFundTimeframe = savings > 0 ? Math.ceil((recommendedEmergencyFund - savings) / (financialData.monthlyIncome - monthlyBurn)) : 12

  // Basic burnout assessment based on vents
  const ventCount = userProfile.dailyVents?.length || 0
  const burnoutScore = Math.min(ventCount * 15, 100)
  const burnoutLevel = burnoutScore < 25 ? 'Low' : burnoutScore < 50 ? 'Medium' : burnoutScore < 75 ? 'High' : 'Critical'

  const financialStatus = runwayMonths < 3 ? 'Critical' : runwayMonths < 6 ? 'Limited' : runwayMonths < 12 ? 'Moderate' : 'Strong'

  // Career path recommendations
  const primaryPath = careerGoals?.desiredJobTitle ? {
    title: careerGoals.desiredJobTitle,
    description: 'Transition path to ' + careerGoals.desiredJobTitle + ' based on your skills and interests.',
    salaryRange: careerGoals.desiredSalary ? '$' + careerGoals.desiredSalary.toLocaleString() + ' - $' + (careerGoals.desiredSalary * 1.2).toLocaleString() : '$80,000 - $150,000',
    skillsRequired: ['Communication', 'Problem Solving', 'Technical Skills'],
    timeToEntry: '6-12 months',
    growthPotential: 'High',
    fitScore: 85
  } : {
    title: 'Career Exploration Needed',
    description: 'Based on your assessment, you should explore multiple career options.',
    salaryRange: '$60,000 - $120,000',
    skillsRequired: ['Adaptability', 'Learning Agility', 'Self-motivation'],
    timeToEntry: '3-6 months',
    growthPotential: 'Medium',
    fitScore: 70
  }

  return {
    burnoutRisk: {
      score: burnoutScore,
      level: burnoutLevel as 'Low' | 'Medium' | 'High' | 'Critical',
      factors: userProfile.dailyVents?.slice(0, 3) || ['Limited data available'],
    },
    financialRunway: {
      months: runwayMonths,
      status: financialStatus as 'Critical' | 'Limited' | 'Moderate' | 'Strong',
      recommendation: runwayMonths < 6
        ? 'Focus on building emergency savings and reducing expenses before major career changes.'
        : 'Your financial position allows for strategic career exploration.',
    },
    emergencyFund: {
      recommendedAmount: recommendedEmergencyFund,
      timeframe: emergencyFundTimeframe + ' months',
      calculation: 'Based on ' + monthlyBurn + ' monthly expenses × 6 months',
      tips: [
        'Cut non-essential expenses by 20%',
        'Increase income through side gigs',
        'Use windfalls (tax refunds, bonuses) to build savings',
        'Automate transfers to savings account'
      ]
    },
    budgetRecommendation: {
      monthlyIncome: financialData.monthlyIncome || 0,
      recommendedExpenses: {
        'Housing': monthlyBurn * 0.28,
        'Food': monthlyBurn * 0.12,
        'Transportation': monthlyBurn * 0.15,
        'Utilities': monthlyBurn * 0.08,
        'Insurance': monthlyBurn * 0.08,
        'Savings': monthlyBurn * 0.20,
        'Entertainment': monthlyBurn * 0.09
      },
      savingsTarget: monthlyBurn * 0.20,
      debtReduction: financialData.debt > 0 ? 'Focus on paying down $' + financialData.debt + ' in high-interest debt first' : 'No debt reduction needed',
      rationale: '50/30/20 budget rule: 50% needs, 30% wants, 20% savings/debt'
    },
    careerPaths: {
      primary: primaryPath,
      alternatives: [
        {
          title: 'Project Manager',
          description: 'Coordinate teams and manage project lifecycles',
          salaryRange: '$80,000 - $130,000',
          skillsRequired: ['Organization', 'Leadership', 'Communication'],
          timeToEntry: '3-6 months',
          growthPotential: 'High',
          fitScore: 75
        },
        {
          title: 'Business Analyst',
          description: 'Analyze business needs and improve processes',
          salaryRange: '$70,000 - $110,000',
          skillsRequired: ['Data Analysis', 'Problem Solving', 'Communication'],
          timeToEntry: '3-6 months',
          growthPotential: 'Medium',
          fitScore: 70
        },
        {
          title: 'Technical Writer',
          description: 'Create documentation and training materials',
          salaryRange: '$65,000 - $100,000',
          skillsRequired: ['Writing', 'Technical Knowledge', 'Communication'],
          timeToEntry: '1-3 months',
          growthPotential: 'Medium',
          fitScore: 65
        },
        {
          title: 'Customer Success Manager',
          description: 'Support customers and drive retention',
          salaryRange: '$60,000 - $95,000',
          skillsRequired: ['Communication', 'Problem Solving', 'Empathy'],
          timeToEntry: '1-3 months',
          growthPotential: 'High',
          fitScore: 80
        },
        {
          title: 'Operations Coordinator',
          description: 'Streamline business operations and processes',
          salaryRange: '$55,000 - $85,000',
          skillsRequired: ['Organization', 'Process Improvement', 'Communication'],
          timeToEntry: '1-3 months',
          growthPotential: 'Medium',
          fitScore: 75
        }
      ]
    },
    skillsNeeded: [
      'Industry-specific technical skills',
      'Networking and relationship building',
      'Updated resume and LinkedIn optimization',
      'Interview preparation and salary negotiation',
      'Industry certification or coursework'
    ],
    certifications: [
      {
        name: 'Google Career Certificates',
        provider: 'Google',
        cost: '$49/month',
        duration: '3-6 months',
        value: 'High demand, practical skills',
        relevance: 90
      },
      {
        name: 'Project Management Professional (PMP)',
        provider: 'PMI',
        cost: '$555',
        duration: '3 months study',
        value: 'Industry standard certification',
        relevance: 85
      },
      {
        name: 'Certified Scrum Master (CSM)',
        provider: 'Scrum Alliance',
        cost: '$1,000+',
        duration: '2 days training',
        value: 'Agile project management',
        relevance: 80
      }
    ],
    fieldSelector: !careerGoals?.desiredField ? {
      recommendedFields: ['Technology', 'Healthcare', 'Business Analysis', 'Project Management', 'Customer Success'],
      reasoning: 'Based on your current skills and market demand for transferable skills',
      nextSteps: [
        'Take a career assessment quiz',
        'Research entry-level positions in each field',
        'Network with professionals in target industries',
        'Consider short courses or certifications'
      ]
    } : undefined,
    motivation: {
      currentDrive: 'You\'re taking the first brave step toward a career that excites you again!',
      inspiration: 'Thousands of professionals just like you have successfully transitioned to more fulfilling careers. You have the skills, experience, and determination to join them.',
      accountability: 'Remember why you started: for more purpose, better work-life balance, and renewed passion for your work.'
    },
    celebrationPoints: [
      {
        trigger: 'Complete your first networking message',
        message: '🎉 You just took action toward your dream career! That\'s huge!',
        reward: 'Treat yourself to your favorite coffee or snack'
      },
      {
        trigger: 'Build 3 months emergency savings',
        message: '💰 Financial foundation secured! You\'re unstoppable now!',
        reward: 'Plan a small celebration dinner with loved ones'
      },
      {
        trigger: 'Land first freelance project',
        message: '🚀 You\'re officially building your new career! This is real!',
        reward: 'Buy something that represents your new career path'
      }
    ],
    dailyMotivationPrompts: [
      'What\'s one thing you\'re grateful for in your current role that you want to carry forward?',
      'Who in your network could help you with your career transition?',
      'What\'s one skill you\'re excited to develop?',
      'How will your life be different in 6 months if you take action today?',
      'What\'s the bravest career move you\'ve made so far?'
    ],
    progressTracking: {
      overallCompletion: 0,
      phaseProgress: {
        phase1: 0,
        phase2: 0,
        phase3: 0
      }
    },
    roadmap: {
      phase1: {
        title: '🌟 Awakening & Foundation Building',
        duration: '6 months',
        introduction: 'Welcome to your career transformation journey! You\'re not alone in feeling trapped - millions have walked this path before you. Today marks the beginning of your exciting transition to a more fulfilling career.',
        goals: [
          'Complete comprehensive self-assessment and identify your core motivations',
          'Build emergency savings to 6 months of expenses for peace of mind',
          'Identify your transferable skills and rediscover your professional passions'
        ],
        actions: [
          {
            description: 'Create a Career Transition Journal',
            specificSteps: [
              'Download a free journal app (Daylio, Reflectly, or Notion)',
              'Set aside 10 minutes daily to write: "What energized me today? What drained me?"',
              'At the end of each week, identify patterns in your energy levels'
            ],
            timeEstimate: '10 minutes daily',
            tools: ['Journal app', 'Calendar reminders']
          },
          {
            description: 'Build Your Emergency Fund',
            specificSteps: [
              'Calculate your target: $' + (monthlyBurn * 6).toLocaleString() + ' (6 months × $' + monthlyBurn.toLocaleString() + ')',
              'Set up automatic transfers from checking to savings account',
              'Cut one non-essential expense (subscription, eating out, etc.)',
              'Look for side gigs on Upwork, Fiverr, or TaskRabbit'
            ],
            timeEstimate: '15 minutes setup + weekly check-ins',
            tools: ['Banking app', 'Budget tracking app (Mint, YNAB)']
          },
          {
            description: 'Skill Discovery & Documentation',
            specificSteps: [
              'List all jobs you\'ve ever had with key responsibilities',
              'For each role, write: "What did I love? What did I hate? What skills did I use?"',
              'Use LinkedIn Skills assessment or take free skill quizzes online',
              'Research salary ranges for your skills on Glassdoor or Levels.fyi'
            ],
            timeEstimate: '2-3 hours total',
            tools: ['LinkedIn', 'Glassdoor', 'Skills assessment websites']
          }
        ],
        milestones: [
          {
            description: 'Complete Career Journal for 30 days',
            celebration: '🎉 You now know yourself better than 90% of job seekers!',
            measurable: '30 journal entries completed'
          },
          {
            description: 'Achieve 3 months emergency savings',
            celebration: '💪 You\'ve built financial security - huge accomplishment!',
            measurable: 'Savings balance reaches $' + (monthlyBurn * 3).toLocaleString()
          },
          {
            description: 'Identify 3-5 potential career paths',
            celebration: '🚀 Multiple paths ahead - the future looks bright!',
            measurable: 'Documented 3+ career options with research'
          }
        ],
        risks: [
          'Unexpected financial emergencies',
          'Job loss during transition planning',
          'Underestimating skill transferability'
        ],
        courageBoosts: [
          {
            fear: 'Unexpected financial emergencies',
            affirmation: 'You\'re building resilience, not avoiding reality. Having savings actually attracts more opportunities!',
            action: 'Create a "worst-case scenario" plan and see how survivable it really is'
          },
          {
            fear: 'Underestimating skill transferability',
            affirmation: 'Your experience is more valuable than you realize. Every role has taught you something transferable.',
            action: 'Find 3 people in your target industry and ask: "What skills from my background would transfer well?"'
          }
        ],
        contingencies: [
          'Have part-time freelance work ready (create profiles on Upwork, Fiverr)',
          'Maintain current employment stability while building your foundation',
          'Consult with career counselor if feeling overwhelmed (free options available)'
        ],
        interactiveElements: [
          {
            type: 'progress_bar',
            title: 'Foundation Building Progress',
            content: 'Track your emergency fund growth and journal completion',
            frequency: 'weekly'
          },
          {
            type: 'reflection_question',
            title: 'Weekly Reflection',
            content: 'What surprised you most about your skills this week?',
            frequency: 'weekly'
          }
        ],
        weeklyCheckIns: [
          'What\'s one thing you learned about yourself this week?',
          'How close are you to your emergency fund goal?',
          'Which career path excites you most right now?',
          'What\'s one action you can take before next check-in?'
        ]
      },
      phase2: {
        title: '🚀 Skill Building & Market Entry',
        duration: '1 year',
        introduction: 'Now that you have a foundation, it\'s time to dive deep into building the skills and experience that will make you irresistible to employers in your target field. This phase is about transformation - turning your potential into proven capability.',
        goals: [
          'Develop necessary skills for target careers',
          'Gain practical experience in new field',
          'Establish professional network in target industry'
        ],
        actions: [
          {
            description: 'Build Technical Skills',
            specificSteps: [
              'Identify 2-3 key skills needed for your target career',
              'Enroll in online courses (Coursera, Udemy, LinkedIn Learning)',
              'Practice skills through personal projects or coding challenges',
              'Join relevant communities (Reddit, Discord, Slack groups)'
            ],
            timeEstimate: '10-15 hours/week',
            tools: ['Coursera', 'Udemy', 'GitHub', 'LeetCode']
          },
          {
            description: 'Gain Real-World Experience',
            specificSteps: [
              'Create a portfolio showcasing your skills and projects',
              'Offer freelance services on Upwork or Fiverr',
              'Volunteer for projects in your target industry',
              'Network with professionals through LinkedIn and industry events'
            ],
            timeEstimate: '5-10 hours/week',
            tools: ['Upwork', 'LinkedIn', 'Portfolio website', 'GitHub']
          },
          {
            description: 'Build Your Professional Network',
            specificSteps: [
              'Join 3-5 LinkedIn groups related to your target career',
              'Attend virtual meetups and webinars weekly',
              'Send 2-3 personalized connection requests per week',
              'Schedule informational interviews with people in your target field'
            ],
            timeEstimate: '3-5 hours/week',
            tools: ['LinkedIn', 'Meetup.com', 'Eventbrite', 'Zoom']
          },
          {
            description: 'Optimize Your Professional Brand',
            specificSteps: [
              'Update resume with quantifiable achievements',
              'Refresh LinkedIn profile with professional photo and summary',
              'Start a professional blog or share insights on LinkedIn',
              'Get endorsements for your key skills from colleagues'
            ],
            timeEstimate: '2-4 hours total',
            tools: ['LinkedIn', 'Resume templates', 'Canva', 'Medium']
          }
        ],
        milestones: [
          {
            description: 'Complete first certification or course',
            celebration: '🎓 You\'re officially upskilling! This certification opens new doors!',
            measurable: 'Certificate earned and added to LinkedIn'
          },
          {
            description: 'Secure first paid freelance project',
            celebration: '💼 You\'re now a working professional in your new field!',
            measurable: 'First freelance payment received'
          },
          {
            description: 'Build network of 25+ professional contacts',
            celebration: '🤝 Your network is growing - opportunities will follow!',
            measurable: '25+ connections in target industry on LinkedIn'
          }
        ],
        risks: [
          'Skills gap proves larger than expected',
          'Difficulty breaking into new industry',
          'Financial strain from education costs'
        ],
        contingencies: [
          'Start with entry-level positions in new field',
          'Leverage existing network for opportunities',
          'Consider hybrid career path combining old and new skills'
        ],
        courageBoosts: [
          {
            fear: 'Skills gap proves larger than expected',
            affirmation: 'Every expert was once a beginner. Your dedication and fresh perspective are your superpowers.',
            action: 'Identify just ONE skill to focus on this month. Master it completely before moving to the next.'
          },
          {
            fear: 'Difficulty breaking into new industry',
            affirmation: 'Industries need fresh talent and diverse perspectives. Your unique background is your competitive advantage.',
            action: 'Research "transferable skills from [your current field] to [target field]" and highlight these in your networking conversations.'
          }
        ],
        interactiveElements: [
          {
            type: 'progress_bar',
            title: 'Skill Development Tracker',
            content: 'Track certifications completed and projects finished',
            frequency: 'monthly'
          },
          {
            type: 'checklist',
            title: 'Networking Success Checklist',
            content: 'Mark off each networking activity as you complete it',
            frequency: 'weekly'
          }
        ],
        weeklyCheckIns: [
          'What new skill did you practice this week?',
          'How many new professional connections did you make?',
          'What\'s one thing you learned about your target industry?',
          'Did you receive any positive feedback on your work?',
          'What\'s your biggest win from this week?'
        ],
      },
      phase3: {
        title: '🎯 Full Transition & Career Growth',
        duration: '2 years',
        introduction: 'Congratulations! You\'ve built the foundation and developed the skills. Now it\'s time to make the leap into your new career and build the professional life you\'ve always wanted. This is where dreams become reality.',
        goals: [
          'Secure full-time position in target career',
          'Achieve salary growth and job satisfaction',
          'Establish work-life balance'
        ],
        actions: [
          {
            description: 'Launch Your Job Search Campaign',
            specificSteps: [
              'Create a targeted resume for each job application',
              'Apply to 5-10 positions per week in your target industry',
              'Customize cover letters for each application',
              'Track all applications in a spreadsheet'
            ],
            timeEstimate: '10-15 hours/week',
            tools: ['LinkedIn', 'Indeed', 'Company career pages', 'Resume tracking spreadsheet']
          },
          {
            description: 'Master Interview and Negotiation Skills',
            specificSteps: [
              'Practice common interview questions with a friend',
              'Research salary ranges for your target role and location',
              'Prepare questions to ask interviewers',
              'Role-play salary negotiations'
            ],
            timeEstimate: '3-5 hours/week',
            tools: ['Glassdoor', 'Levels.fyi', 'Interview practice apps', 'Negotiation scripts']
          },
          {
            description: 'Build Relationships in Your New Role',
            specificSteps: [
              'Schedule coffee chats with new colleagues weekly',
              'Find a mentor in your new organization',
              'Join company social events and committees',
              'Seek feedback regularly from managers and peers'
            ],
            timeEstimate: '2-4 hours/week',
            tools: ['Calendar for networking', 'Company directory', 'Slack/Teams', 'Feedback templates']
          },
          {
            description: 'Continue Learning and Growing',
            specificSteps: [
              'Set quarterly learning goals with your manager',
              'Take on stretch assignments and new responsibilities',
              'Attend industry conferences and webinars',
              'Pursue advanced certifications in your field'
            ],
            timeEstimate: '5-8 hours/week',
            tools: ['Learning management systems', 'Conference platforms', 'Professional associations', 'Online learning platforms']
          }
        ],
        milestones: [
          {
            description: 'Accept your first full-time offer in target career',
            celebration: '🎊 You did it! Welcome to your new career chapter!',
            measurable: 'Signed offer letter in target industry role'
          },
          {
            description: 'Achieve competitive salary within 6 months',
            celebration: '💰 Your expertise is valued - financial growth unlocked!',
            measurable: 'Salary reaches 80%+ of previous highest earnings'
          },
          {
            description: 'Receive outstanding performance review',
            celebration: '🌟 You\'re excelling in your new career - so proud of you!',
            measurable: 'Performance rating of "exceeds expectations" or equivalent'
          }
        ],
        risks: [
          'Job market challenges',
          'Salary regression during transition',
          'Cultural adjustment difficulties'
        ],
        contingencies: [
          'Accept bridge positions with growth potential',
          'Negotiate for higher starting salary',
          'Seek mentorship and support systems'
        ],
        courageBoosts: [
          {
            fear: 'Job market challenges',
            affirmation: 'The right opportunity is out there, and it\'s looking for someone exactly like you.',
            action: 'Treat job hunting like a part-time job: 20-30 hours/week of dedicated, focused effort.'
          },
          {
            fear: 'Salary regression during transition',
            affirmation: 'Your total compensation includes growth potential, work satisfaction, and long-term earning power.',
            action: 'Calculate your "career earnings potential" over 5 years, not just the starting salary.'
          },
          {
            fear: 'Cultural adjustment difficulties',
            affirmation: 'You\'ve successfully navigated multiple life changes already. This is just another chapter.',
            action: 'Find one "cultural translator" - someone who can help you understand unwritten rules and norms.'
          }
        ],
        interactiveElements: [
          {
            type: 'progress_bar',
            title: 'Career Transition Progress',
            content: 'Track applications sent, interviews completed, and offers received',
            frequency: 'weekly'
          },
          {
            type: 'reflection_question',
            title: 'Career Growth Reflection',
            content: 'How has your perspective on work changed since starting this journey?',
            frequency: 'monthly'
          }
        ],
        weeklyCheckIns: [
          'How many applications did you submit this week?',
          'Did you have any interviews or networking conversations?',
          'What\'s one thing you\'re learning about your new industry?',
          'How is your work-life balance in your new role?',
          'What are you most proud of accomplishing this week?'
        ],
      },
    },
    generatedAt: new Date().toISOString(),
  }
}
