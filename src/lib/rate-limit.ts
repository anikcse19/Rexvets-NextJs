import { NextRequest } from "next/server";

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore: RateLimitStore = {};

export function createRateLimiter(config: RateLimitConfig) {
  return function rateLimit(request: NextRequest): { success: boolean; remaining: number; resetTime: number } {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const key = `rate_limit:${ip}`;
    const now = Date.now();
    
    // Clean up expired entries
    if (rateLimitStore[key] && rateLimitStore[key].resetTime <= now) {
      delete rateLimitStore[key];
    }
    
    // Initialize or get existing entry
    if (!rateLimitStore[key]) {
      rateLimitStore[key] = {
        count: 0,
        resetTime: now + config.windowMs,
      };
    }
    
    // Check if limit exceeded
    if (rateLimitStore[key].count >= config.maxRequests) {
      return {
        success: false,
        remaining: 0,
        resetTime: rateLimitStore[key].resetTime,
      };
    }
    
    // Increment count
    rateLimitStore[key].count++;
    
    return {
      success: true,
      remaining: config.maxRequests - rateLimitStore[key].count,
      resetTime: rateLimitStore[key].resetTime,
    };
  };
}

// Predefined rate limiters
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts per 15 minutes
});

export const registerRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3, // 3 registrations per hour
});

export const passwordResetRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3, // 3 password reset requests per hour
});

export const generalRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
});

