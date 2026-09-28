import { NextRequest, NextResponse } from "next/server";
import { createRateLimitMiddleware, RateLimitConfig } from "./rate-limit";

/**
 * Wrapper function to apply rate limiting to Next.js API routes
 */
export function withRateLimit(
  handler: (request: NextRequest, ...args: unknown[]) => Promise<NextResponse>,
  config?: RateLimitConfig
) {
  return async (request: NextRequest, ...args: unknown[]): Promise<NextResponse> => {
    const rateLimiter = createRateLimitMiddleware(config);
    const path = new URL(request.url).pathname;
    const result = await rateLimiter(request, path);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Too many requests",
          message: "Rate limit exceeded. Please try again later.",
          limit: result.limit,
          remaining: result.remaining,
          resetTime: new Date(result.resetTime).toISOString(),
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": result.limit.toString(),
            "X-RateLimit-Remaining": result.remaining.toString(),
            "X-RateLimit-Reset": new Date(result.resetTime).toISOString(),
            "Retry-After": Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
          },
        },
      );
    }

    // Add rate limit headers to successful responses
    const response = await handler(request, ...args);
    response.headers.set("X-RateLimit-Limit", result.limit.toString());
    response.headers.set("X-RateLimit-Remaining", result.remaining.toString());
    response.headers.set("X-RateLimit-Reset", new Date(result.resetTime).toISOString());

    return response;
  };
}
