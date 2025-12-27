/**
 * Rate limiting utilities for API routes
 * Implements token bucket algorithm with Redis-like storage
 */

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  skipSuccessfulRequests?: boolean; // Don't count successful requests
  skipFailedRequests?: boolean; // Don't count failed requests
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: Date;
  totalRequests: number;
}

// In-memory storage for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, {
  requests: number[];
  lastReset: number;
}>();

/**
 * Clean up old entries from the rate limit store
 */
function cleanupStore() {
  const now = Date.now();
  const cutoff = now - (24 * 60 * 60 * 1000); // 24 hours ago

  for (const [key, data] of rateLimitStore.entries()) {
    // Remove entries older than 24 hours
    if (data.lastReset < cutoff) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Get rate limit key from request
 */
export function getRateLimitKey(request: Request, identifier?: string): string {
  // Use IP address as primary identifier
  const ip = request.headers.get('x-forwarded-for') ||
             request.headers.get('x-real-ip') ||
             'unknown';

  // Add user ID if available (from session/auth)
  const userId = identifier || 'anonymous';

  return `${ip}:${userId}`;
}

/**
 * Check rate limit for a given key
 */
export function checkRateLimit(
  key: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const { windowMs, maxRequests } = options;

  // Get or create entry for this key
  let entry = rateLimitStore.get(key);
  if (!entry) {
    entry = {
      requests: [],
      lastReset: now,
    };
    rateLimitStore.set(key, entry);
  }

  // Clean old requests outside the window
  entry.requests = entry.requests.filter(timestamp => now - timestamp < windowMs);

  const totalRequests = entry.requests.length;
  const remaining = Math.max(0, maxRequests - totalRequests);

  // Check if limit exceeded
  const success = totalRequests < maxRequests;

  if (success) {
    // Add current request timestamp
    entry.requests.push(now);
  }

  // Calculate reset time (when the oldest request will expire)
  const resetTime = entry.requests.length > 0
    ? new Date(entry.requests[0] + windowMs)
    : new Date(now + windowMs);

  return {
    success,
    remaining: Math.max(0, remaining - (success ? 1 : 0)),
    resetTime,
    totalRequests,
  };
}

/**
 * Rate limiting middleware for API routes
 */
export function withRateLimit(
  handler: (request: Request, ...args: any[]) => Promise<Response>,
  options: RateLimitOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // 100 requests per 15 minutes
  }
) {
  return async (request: Request, ...args: any[]): Promise<Response> => {
    const key = getRateLimitKey(request);

    // Periodic cleanup (every 100 requests)
    if (Math.random() < 0.01) {
      cleanupStore();
    }

    const result = checkRateLimit(key, options);

    // Set rate limit headers
    const response = await handler(request, ...args);

    // Clone response to add headers
    const rateLimitResponse = new Response(response.body, {
      status: result.success ? response.status : 429,
      statusText: result.success ? response.statusText : 'Too Many Requests',
      headers: {
        ...Object.fromEntries(response.headers.entries()),
        'X-RateLimit-Limit': options.maxRequests.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': Math.floor(result.resetTime.getTime() / 1000).toString(),
        'X-RateLimit-Used': result.totalRequests.toString(),
      },
    });

    if (!result.success) {
      // Return rate limit exceeded response
      return new Response(JSON.stringify({
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.floor((result.resetTime.getTime() - Date.now()) / 1000),
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': Math.floor((result.resetTime.getTime() - Date.now()) / 1000).toString(),
          ...Object.fromEntries(rateLimitResponse.headers.entries()),
        },
      });
    }

    return rateLimitResponse;
  };
}

/**
 * Predefined rate limit configurations
 */
export const rateLimitConfigs = {
  // Strict limits for authentication endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per 15 minutes
  },

  // Moderate limits for general API endpoints
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // 100 requests per 15 minutes
  },

  // Generous limits for chat endpoints (AI calls are expensive)
  chat: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 50, // 50 messages per hour
  },

  // Very generous limits for public endpoints
  public: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 1000, // 1000 requests per hour
  },
} as const;
