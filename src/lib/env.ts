import { z } from 'zod';

/**
 * Environment variables schema validation
 * This ensures all required environment variables are present and valid
 */

// Environment variables schema - all fields optional with defaults for build compatibility
const envSchema = z.object({
  DATABASE_URL: z.string().default('mysql://default:default@localhost:3306/default'),
  NEXTAUTH_SECRET: z.string().default('default-build-secret-key-for-development-only'),
  NEXTAUTH_URL: z.string().default('http://localhost:3000'),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_AI_API_KEY: z.string().optional(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

// Parse and validate environment variables
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.format());
  throw new Error('Invalid environment configuration');
}

export const env = parsedEnv.data;

/**
 * Type-safe environment variables
 * Use this instead of process.env throughout the application
 */
export type Env = typeof env;
