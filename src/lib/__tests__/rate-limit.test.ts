import { checkRateLimit, getRateLimitKey } from '../rate-limit'

// Mock Request object
const createMockRequest = (ip = '127.0.0.1') => ({
  headers: {
    get: (name: string) => {
      if (name === 'x-forwarded-for') return ip;
      if (name === 'x-real-ip') return ip;
      return null;
    },
  },
}) as Request;

describe('Rate Limiting', () => {
  beforeEach(() => {
    // Clear rate limit store between tests
    jest.clearAllMocks();
  });

  describe('getRateLimitKey', () => {
    it('should generate key from IP address', () => {
      const request = createMockRequest('192.168.1.1');
      const key = getRateLimitKey(request);

      expect(key).toBe('192.168.1.1:anonymous');
    });

    it('should include user identifier when provided', () => {
      const request = createMockRequest('192.168.1.1');
      const key = getRateLimitKey(request, 'user123');

      expect(key).toBe('192.168.1.1:user123');
    });
  });

  describe('checkRateLimit', () => {
    it('should allow requests within limit', () => {
      const options = {
        windowMs: 1000, // 1 second
        maxRequests: 3,
      };

      // First request
      const result1 = checkRateLimit('test-key', options);
      expect(result1.success).toBe(true);
      expect(result1.remaining).toBe(2);
      expect(result1.totalRequests).toBe(1);

      // Second request
      const result2 = checkRateLimit('test-key', options);
      expect(result2.success).toBe(true);
      expect(result2.remaining).toBe(1);
      expect(result2.totalRequests).toBe(2);

      // Third request
      const result3 = checkRateLimit('test-key', options);
      expect(result3.success).toBe(true);
      expect(result3.remaining).toBe(0);
      expect(result3.totalRequests).toBe(3);
    });

    it('should block requests over limit', () => {
      const options = {
        windowMs: 1000,
        maxRequests: 2,
      };

      // Use up the limit
      checkRateLimit('test-key', options);
      checkRateLimit('test-key', options);

      // Third request should be blocked
      const result = checkRateLimit('test-key', options);
      expect(result.success).toBe(false);
      expect(result.remaining).toBe(0);
      expect(result.totalRequests).toBe(2);
    });

    it('should reset after window expires', () => {
      const options = {
        windowMs: 100, // Very short window
        maxRequests: 1,
      };

      // Use up the limit
      checkRateLimit('test-key', options);

      // Wait for window to expire
      return new Promise(resolve => {
        setTimeout(() => {
          const result = checkRateLimit('test-key', options);
          expect(result.success).toBe(true);
          expect(result.remaining).toBe(0);
          resolve(void 0);
        }, 150);
      });
    });
  });
})
