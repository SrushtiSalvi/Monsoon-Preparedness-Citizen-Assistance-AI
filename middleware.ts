import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { securityHeaders } from '@/lib/security';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/health',
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  // Create response
  const response = NextResponse.next();

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  // Add request ID for tracing
  const requestId = Math.random().toString(36).substring(2, 11);
  response.headers.set('X-Request-ID', requestId);

  return response;
}, {
  // Let Clerk inject a CSP that includes its dynamic Frontend API host.
  contentSecurityPolicy: {},
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
};
