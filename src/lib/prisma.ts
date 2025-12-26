import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

// Create Prisma client with proper error handling for build time
const createPrismaClient = () => {
  try {
    if (!process.env.DATABASE_URL) {
      // During build time, DATABASE_URL might not be available
      // Return a mock client that throws helpful errors
      return new Proxy({} as PrismaClient, {
        get: (target, prop) => {
          if (prop === '$disconnect') return () => Promise.resolve();
          return () => {
            throw new Error(
              'DATABASE_URL is not configured. Please set your DATABASE_URL environment variable.'
            );
          };
        },
      });
    }

    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
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
  if (process.env.NODE_ENV === 'production') {
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
