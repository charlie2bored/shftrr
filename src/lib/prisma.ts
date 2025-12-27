import { PrismaClient } from '@prisma/client'
import { env } from './env'

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

// Create Prisma client with proper error handling for build time
const createPrismaClient = () => {
  try {
    return new PrismaClient({
      log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  } catch (error) {
    console.error('Failed to create Prisma client:', error);
    // Return a mock client during build time
    return new Proxy({} as PrismaClient, {
      get: () => () => Promise.resolve(null),
    });
  }
};

let prisma: PrismaClient

if (typeof window === 'undefined') {
  // Server-side only
  if (env.NODE_ENV === 'production') {
    prisma = createPrismaClient();
  } else {
    if (!global.__prisma) {
      global.__prisma = createPrismaClient();
    }
    prisma = global.__prisma;
  }
} else {
  // This should never happen in production
  prisma = createPrismaClient();
}

export { prisma }
