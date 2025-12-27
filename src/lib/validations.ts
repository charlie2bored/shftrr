import { z } from 'zod';

/**
 * Comprehensive validation schemas for the Career Pivot Coach application
 * All forms and API endpoints should use these schemas for consistent validation
 */

// User Authentication Schemas
export const userRegistrationSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(100, 'Email must be less than 100 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  image: z.string().optional(),
});

export const userLoginSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

export const passwordResetRequestSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address'),
});

export const passwordResetSchema = z.object({
  token: z
    .string()
    .min(1, 'Reset token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z
    .string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Career Coaching Schemas
export const careerChatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().min(1, 'Message content cannot be empty'),
  })).min(1, 'At least one message is required'),
  resumeText: z.string().optional(),
  ventText: z.string().optional(),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().min(1).max(4000).optional(),
});

export const careerAssessmentSchema = z.object({
  currentRole: z.string().min(2, 'Current role is required'),
  experienceYears: z.number().min(0).max(50),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  interests: z.array(z.string()).optional(),
  careerGoals: z.string().min(10, 'Please provide more detail about your career goals'),
  challenges: z.string().optional(),
  preferredWorkStyle: z.enum(['remote', 'hybrid', 'onsite', 'flexible']).optional(),
  salaryRange: z.object({
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional(),
    currency: z.string().default('USD'),
  }).optional(),
});

export const jobSearchPreferencesSchema = z.object({
  keywords: z.array(z.string()).min(1, 'At least one keyword is required'),
  location: z.string().optional(),
  remoteWork: z.boolean().default(false),
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional(),
  jobTypes: z.array(z.enum(['full-time', 'part-time', 'contract', 'freelance'])).optional(),
  experienceLevel: z.enum(['entry', 'mid', 'senior', 'executive']).optional(),
  industries: z.array(z.string()).optional(),
});

// API Response Schemas
export const apiResponseSchema = <T extends z.ZodType>(dataSchema: T) => z.object({
  success: z.boolean(),
  data: dataSchema.optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export const paginatedResponseSchema = <T extends z.ZodType>(itemSchema: T) => z.object({
  items: z.array(itemSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
});

// Settings and Preferences Schemas
export const userSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('dark'),
  notifications: z.boolean().default(true),
  autoSave: z.boolean().default(true),
  language: z.string().default('en'),
  timezone: z.string().optional(),
  emailFrequency: z.enum(['daily', 'weekly', 'monthly', 'never']).default('weekly'),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.string().email().optional(),
  bio: z.string().max(500).optional(),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  location: z.string().max(100).optional(),
  currentRole: z.string().max(100).optional(),
  company: z.string().max(100).optional(),
});

// Chat Session Schemas
export const chatSessionSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1).max(100),
  messages: z.array(z.object({
    id: z.string(),
    text: z.string(),
    isUser: z.boolean(),
    timestamp: z.date(),
    toolCalls: z.array(z.any()).optional(),
    toolResults: z.array(z.any()).optional(),
  })),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const chatMessageSchema = z.object({
  text: z.string().min(1, 'Message cannot be empty').max(10000, 'Message is too long'),
  isUser: z.boolean(),
  timestamp: z.date().optional(),
});

// File Upload Schemas
export const fileUploadSchema = z.object({
  file: z.instanceof(File),
  type: z.enum(['resume', 'cover-letter', 'portfolio', 'other']),
  name: z.string().min(1).max(255),
}).refine((data) => {
  // Check file size (max 10MB)
  return data.file.size <= 10 * 1024 * 1024;
}, {
  message: 'File size must be less than 10MB',
  path: ['file'],
}).refine((data) => {
  // Check file type
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
  return allowedTypes.includes(data.file.type);
}, {
  message: 'File must be a PDF, Word document, or text file',
  path: ['file'],
});

// Export commonly used schemas
export const schemas = {
  user: {
    register: userRegistrationSchema,
    login: userLoginSchema,
    resetPassword: passwordResetSchema,
    resetRequest: passwordResetRequestSchema,
    updateProfile: profileUpdateSchema,
    updateSettings: userSettingsSchema,
  },
  career: {
    chat: careerChatRequestSchema,
    assessment: careerAssessmentSchema,
    jobSearch: jobSearchPreferencesSchema,
  },
  chat: {
    session: chatSessionSchema,
    message: chatMessageSchema,
  },
  file: {
    upload: fileUploadSchema,
  },
} as const;

// Type exports for TypeScript
export type UserRegistration = z.infer<typeof userRegistrationSchema>;
export type UserLogin = z.infer<typeof userLoginSchema>;
export type CareerChatRequest = z.infer<typeof careerChatRequestSchema>;
export type CareerAssessment = z.infer<typeof careerAssessmentSchema>;
export type UserSettings = z.infer<typeof userSettingsSchema>;
export type ChatSession = z.infer<typeof chatSessionSchema>;
export type ChatMessage = z.infer<typeof chatMessageSchema>;
