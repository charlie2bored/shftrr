import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'
import { env } from './env'

declare global {
  // eslint-disable-next-line no-var
  var __prisma: any
}

// Create Prisma client with Accelerate support
const createPrismaClient = () => {
  // During build time, return a mock client to prevent errors
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    console.log('🔧 Build time, using mock client');
    return new Proxy({} as any, {
      get: () => () => Promise.resolve(null),
    });
  }

  try {
    console.log('🔧 Creating Prisma client');
    console.log('🔧 Environment:', env.NODE_ENV);
    console.log('🔧 Using Accelerate:', env.DATABASE_URL?.startsWith('prisma+postgres://'));

    // For Accelerate URLs, use Accelerate extension
    if (env.DATABASE_URL?.startsWith('prisma+postgres://')) {
      const client = new PrismaClient({
        log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        accelerateUrl: env.DATABASE_URL,
      }).$extends(withAccelerate());

      console.log('✅ Prisma client with Accelerate created successfully');
      return client;
    } else {
      // For direct PostgreSQL URLs (like in development or other setups)
      const client = new PrismaClient({
        log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      });

      console.log('✅ Prisma client created successfully');
      return client;
    }
  } catch (error) {
    console.error('❌ Failed to create Prisma client:', error);
    // Return a mock client during build time or when database is unavailable
    return new Proxy({} as any, {
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