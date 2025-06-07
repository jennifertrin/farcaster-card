import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple in-memory store for rate limiting
const rateLimit = new Map<string, { count: number; timestamp: number }>();
const WINDOW_SIZE = 60 * 1000; // 1 minute
const MAX_REQUESTS = 60; // 60 requests per minute

export function middleware(request: NextRequest) {
  // Only apply rate limiting to API routes
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Get IP from X-Forwarded-For header or fallback to connection remote address
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 
             request.headers.get('x-real-ip') ?? 
             'anonymous';
             
  const now = Date.now();
  const windowStart = now - WINDOW_SIZE;

  // Clean up old entries
  for (const [key, value] of rateLimit.entries()) {
    if (value.timestamp < windowStart) {
      rateLimit.delete(key);
    }
  }

  // Get or create rate limit entry for this IP
  const currentLimit = rateLimit.get(ip) ?? { count: 0, timestamp: now };

  // Reset if outside window
  if (currentLimit.timestamp < windowStart) {
    currentLimit.count = 0;
    currentLimit.timestamp = now;
  }

  // Increment count
  currentLimit.count++;
  rateLimit.set(ip, currentLimit);

  // Check if over limit
  if (currentLimit.count > MAX_REQUESTS) {
    return new NextResponse(
      JSON.stringify({
        error: 'Too many requests',
        retryAfter: Math.ceil((currentLimit.timestamp + WINDOW_SIZE - now) / 1000)
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': Math.ceil((currentLimit.timestamp + WINDOW_SIZE - now) / 1000).toString()
        }
      }
    );
  }

  // Add rate limit headers
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', MAX_REQUESTS.toString());
  response.headers.set('X-RateLimit-Remaining', (MAX_REQUESTS - currentLimit.count).toString());
  response.headers.set('X-RateLimit-Reset', (currentLimit.timestamp + WINDOW_SIZE).toString());

  return response;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: '/api/:path*',
} 