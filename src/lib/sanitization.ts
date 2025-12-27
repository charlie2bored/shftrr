/**
 * Input sanitization utilities for API security
 * Prevents XSS, injection attacks, and malicious input
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote'],
    ALLOWED_ATTR: [],
  });
}

/**
 * Sanitize text input (remove potentially dangerous characters)
 */
export function sanitizeText(input: string): string {
  if (typeof input !== 'string') return '';

  return input
    // Remove null bytes and other control characters
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Trim whitespace
    .trim()
    // Limit length to prevent DoS
    .substring(0, 10000);
}

/**
 * Sanitize email addresses
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') return '';

  return email
    .toLowerCase()
    .trim()
    // Remove any whitespace
    .replace(/\s+/g, '')
    // Basic email validation pattern (additional validation should be done elsewhere)
    .replace(/[<>'"&]/g, '');
}

/**
 * Sanitize usernames/names
 */
export function sanitizeName(name: string): string {
  if (typeof name !== 'string') return '';

  return name
    .trim()
    // Allow only letters, spaces, hyphens, and apostrophes
    .replace(/[^a-zA-Z\s\-']/g, '')
    // Normalize spaces
    .replace(/\s+/g, ' ')
    // Limit length
    .substring(0, 100);
}

/**
 * Sanitize file names
 */
export function sanitizeFilename(filename: string): string {
  if (typeof filename !== 'string') return '';

  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .substring(0, 255);
}

/**
 * Check if input contains suspicious patterns
 */
export function containsSuspiciousPatterns(input: string): boolean {
  if (typeof input !== 'string') return false;

  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /expression\s*\(/i,
    /vbscript:/i,
    /data:text\/html/i,
    /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/, // Control characters
  ];

  return suspiciousPatterns.some(pattern => pattern.test(input));
}

/**
 * Validate and sanitize request body
 */
export function sanitizeRequestBody(body: any): any {
  if (!body || typeof body !== 'object') return body;

  const sanitized: any = {};

  for (const [key, value] of Object.entries(body)) {
    if (typeof value === 'string') {
      // Skip sanitization for fields that might contain HTML/formatting
      if (key.includes('html') || key.includes('markdown') || key.includes('content')) {
        sanitized[key] = sanitizeHtml(value);
      } else if (key.includes('email')) {
        sanitized[key] = sanitizeEmail(value);
      } else if (key.includes('name') || key.includes('username')) {
        sanitized[key] = sanitizeName(value);
      } else {
        sanitized[key] = sanitizeText(value);
      }

      // Check for suspicious patterns
      if (containsSuspiciousPatterns(value)) {
        throw new Error(`Suspicious input detected in field: ${key}`);
      }
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item =>
        typeof item === 'string' ? sanitizeText(item) : item
      );
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Security headers for API responses
 */
export function getSecurityHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'none'; object-src 'none';",
  };
}

/**
 * CORS headers for API responses
 */
export function getCorsHeaders(origin?: string) {
  const allowedOrigins = [
    process.env.NEXTAUTH_URL,
    'http://localhost:3000',
    'https://localhost:3000',
  ].filter(Boolean);

  const isAllowedOrigin = origin && allowedOrigins.includes(origin);

  return {
    'Access-Control-Allow-Origin': isAllowedOrigin ? origin : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400', // 24 hours
  };
}
