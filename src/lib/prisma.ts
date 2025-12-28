import { PrismaClient } from '@prisma/client'
import { env } from './env'

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

// Create Prisma client with proper error handling for build time
const createPrismaClient = () => {
  try {
    console.log('🔧 Creating Prisma client');
    console.log('🔧 Environment:', env.NODE_ENV);

    const client = new PrismaClient({
      log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

    console.log('✅ Prisma client created successfully');
    return client;
  } catch (error) {
    console.error('❌ Failed to create Prisma client:', error);
    // Return a mock client during build time
    return new Proxy({} as PrismaClient, {
      get: () => () => Promise.resolve(null),
    });
  }
};

let prisma: PrismaClient

if (typeof window === 'undefined') {
  // Server-side only - use singleton pattern in all environments
  if (!global.__prisma) {
    global.__prisma = createPrismaClient();
  }
  prisma = global.__prisma;
} else {
  // This should never happen in production
  prisma = createPrismaClient();
}

export { prisma }