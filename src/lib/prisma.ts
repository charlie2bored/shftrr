import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'
import { env } from './env'

declare global {
  // eslint-disable-next-line no-var
  var __prisma: any
}

// Create Prisma client with conditional Accelerate extension
const createPrismaClient = () => {
  // During build time or when database is not configured, return a mock client to prevent errors
  if (!env.DATABASE_URL || process.env.NEXT_PHASE === 'phase-production-build') {
    console.log('🔧 Build time or no DATABASE_URL, using mock client');
    return new Proxy({} as any, {
      get: () => () => Promise.resolve(null),
    });
  }

  try {
    console.log('🔧 Creating Prisma client');
    console.log('🔧 Environment:', env.NODE_ENV);
    console.log('🔧 Database URL available:', !!env.DATABASE_URL);
    console.log('🔧 Using Accelerate:', env.DATABASE_URL?.startsWith('prisma+postgres://'));

    // For Accelerate URLs, we need to provide accelerateUrl to the constructor
    if (env.DATABASE_URL?.startsWith('prisma+postgres://')) {
      const client = new PrismaClient({
        log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        accelerateUrl: env.DATABASE_URL,
      }).$extends(withAccelerate());

      console.log('✅ Prisma client with Accelerate created successfully');
      return client;
    } else if (env.DATABASE_URL?.startsWith('postgres://')) {
      // For regular PostgreSQL URLs in production (like Vercel Postgres), still try to create client
      // This will work in runtime but might fail during build
      try {
        const client = new PrismaClient({
          log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        });

        console.log('✅ Prisma client created successfully');
        return client;
      } catch (buildError) {
        console.log('⚠️  Build-time PostgreSQL client creation failed, using mock client');
        return new Proxy({} as any, {
          get: () => () => Promise.resolve(null),
        });
      }
    } else {
      // For production with no/invalid DATABASE_URL, use Accelerate as fallback
      if (env.NODE_ENV === 'production') {
        const accelerateUrl = "prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza193MnJFSVNHc1dmWktmOHlVYVRsMEoiLCJhcGlfa2V5IjoiMDFLREhSUFJGUVZUQUM4QVg4TjVaVlhIWEsiLCJ0ZW5hbnRfaWQiOiIwMmFhNDM3YTVkZGZiZjY0ZTNmMjFkMGMxZjRjNzhjYzU0ODRhZDAxMzhjNzI4NTA4NGE0YjFlNDU5YTRiNTNjIiwiaW50ZXJuYWxfc2VjcmV0IjoiOWYyYmI3NzYtYjA4Ni00Mzg0LTg1NTYtN2Q5YmJkNjUxNzU5In0.ZyDJYIXkdCYX9ISv_sD67V65MLZV8odlwh-XgbrEX3M";

        const client = new PrismaClient({
          log: ['error'],
          accelerateUrl: accelerateUrl,
        }).$extends(withAccelerate());

        console.log('✅ Prisma client with Accelerate (production fallback) created successfully');
        return client;
      } else {
        // For any other case, use mock client
        console.log('⚠️  Unknown database URL format, using mock client');
        return new Proxy({} as any, {
          get: () => () => Promise.resolve(null),
        });
      }
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