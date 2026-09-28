/**
 * Rate limiting middleware to protect API endpoints from abuse
 * Uses in-memory storage (for production, use Redis)
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  skipSuccessfulRequests?: boolean; // Don't count successful requests
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
}

/**
 * Check if request should be rate limited
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - config.windowMs;

  // Clean up old entries
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < windowStart) {
      delete store[key];
    }
  });

  // Get or create entry for this identifier
  const entry = store[identifier] || { count: 0, resetTime: now + config.windowMs };

  // Reset if window has expired
  if (entry.resetTime < now) {
    entry.count = 0;
    entry.resetTime = now + config.windowMs;
  }

  // Check if limit exceeded
  const success = entry.count < config.maxRequests;
  
  if (success) {
    entry.count++;
    store[identifier] = entry;
  }

  return {
    success,
    limit: config.maxRequests,
    remaining: Math.max(0, config.maxRequests - entry.count),
    resetTime: entry.resetTime,
  };
}

/**
 * Get rate limit identifier from request
 */
export function getRateLimitIdentifier(request: Request): string {
  // Try to get user ID from auth header
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    try {
      const token = authHeader.replace('Bearer ', '');
      // In production, decode JWT to get user ID
      // For now, use token as identifier
      return `user:${token}`;
    } catch {
      // Fall back to IP
    }
  }

  // Fall back to IP address
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  return `ip:${ip}`;
}

/**
 * Rate limit configurations for different endpoints
 */
export const rateLimitConfigs: Record<string, RateLimitConfig> = {
  // Auth endpoints - stricter limits
  'auth': { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 requests per 15 minutes
  
  // Chat endpoints - moderate limits
  'chat': { windowMs: 60 * 1000, maxRequests: 20 }, // 20 requests per minute
  
  // Document operations - moderate limits
  'documents': { windowMs: 60 * 1000, maxRequests: 30 }, // 30 requests per minute
  
  // Memory operations - higher limits
  'memories': { windowMs: 60 * 1000, maxRequests: 50 }, // 50 requests per minute
  
  // Search - moderate limits
  'search': { windowMs: 60 * 1000, maxRequests: 30 }, // 30 requests per minute
  
  // Upload - strict limits
  'upload': { windowMs: 60 * 1000, maxRequests: 10 }, // 10 requests per minute
  
  // Default - moderate limits
  'default': { windowMs: 60 * 1000, maxRequests: 100 }, // 100 requests per minute
};

/**
 * Get rate limit config for a path
 */
export function getRateLimitConfig(path: string): RateLimitConfig {
  if (path.includes('/auth')) return rateLimitConfigs.auth;
  if (path.includes('/chat')) return rateLimitConfigs.chat;
  if (path.includes('/documents')) return rateLimitConfigs.documents;
  if (path.includes('/memories')) return rateLimitConfigs.memories;
  if (path.includes('/search')) return rateLimitConfigs.search;
  if (path.includes('/upload')) return rateLimitConfigs.upload;
  return rateLimitConfigs.default;
}

/**
 * Create rate limit middleware for Next.js API routes
 */
export function createRateLimitMiddleware(config?: RateLimitConfig) {
  return async (request: Request, path?: string): Promise<RateLimitResult> => {
    const identifier = getRateLimitIdentifier(request);
    const limitConfig = config || (path ? getRateLimitConfig(path) : rateLimitConfigs.default);
    return checkRateLimit(identifier, limitConfig);
  };
}
