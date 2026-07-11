import { NextRequest } from 'next/server';
import { RateLimitError } from './errors';

// Simple in-memory rate limiter (for development/single-instance)
// For production with multiple instances, use Redis
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'); // 15 minutes
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100');
const AUTH_WINDOW_MS = 60000; // 1 minute for auth
const AUTH_MAX_REQUESTS = 5; // 5 attempts per minute

function getKey(ip: string, prefix: string): string {
  return `${prefix}:${ip}`;
}

function cleanupExpired() {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}

export function checkRateLimit(req: NextRequest, prefix: string = 'api'): boolean {
  // Clean up expired entries periodically
  if (Math.random() < 0.01) {
    cleanupExpired();
  }

  const ip = req.headers.get('x-forwarded-for') || 
             req.headers.get('x-real-ip') || 
             'unknown';
  const key = getKey(ip, prefix);
  const now = Date.now();
  const windowSize = prefix === 'auth' ? AUTH_WINDOW_MS : WINDOW_MS;
  const limit = prefix === 'auth' ? AUTH_MAX_REQUESTS : MAX_REQUESTS;

  const record = rateLimitStore.get(key);

  if (!record || record.resetTime < now) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowSize });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

export function getRateLimitHeaders(req: NextRequest, prefix: string = 'api') {
  const ip = req.headers.get('x-forwarded-for') || 
             req.headers.get('x-real-ip') || 
             'unknown';
  const key = getKey(ip, prefix);
  const windowSize = prefix === 'auth' ? AUTH_WINDOW_MS : WINDOW_MS;
  const limit = prefix === 'auth' ? AUTH_MAX_REQUESTS : MAX_REQUESTS;

  const record = rateLimitStore.get(key);
  const now = Date.now();

  if (!record || record.resetTime < now) {
    return {
      'RateLimit-Limit': limit.toString(),
      'RateLimit-Remaining': (limit - 1).toString(),
      'RateLimit-Reset': (now + windowSize).toString(),
    };
  }

  return {
    'RateLimit-Limit': limit.toString(),
    'RateLimit-Remaining': Math.max(0, limit - record.count).toString(),
    'RateLimit-Reset': record.resetTime.toString(),
  };
}

// Async rate limiter for server actions
export async function checkServerActionRateLimit(userId: string, action: string): Promise<boolean> {
  const key = `action:${action}:${userId}`;
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || record.resetTime < now) {
    rateLimitStore.set(key, { count: 1, resetTime: now + 60000 }); // 1 minute window
    return true;
  }

  // Allow 10 requests per minute per action
  if (record.count >= 10) {
    throw new RateLimitError(`Too many ${action} requests. Please try again in a moment.`);
  }

  record.count++;
  return true;
}
