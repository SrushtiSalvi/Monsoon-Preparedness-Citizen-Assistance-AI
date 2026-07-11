import { headers } from 'next/headers';
import { getAuthenticatedUser } from './auth';

interface SessionSecurityConfig {
  maxAge: number; // Session max age in seconds
  idleTimeout: number; // Idle timeout in seconds
  requireHttps: boolean;
  sameSiteCookie: 'Strict' | 'Lax' | 'None';
}

const DEFAULT_CONFIG: SessionSecurityConfig = {
  maxAge: 7 * 24 * 60 * 60, // 7 days
  idleTimeout: 4 * 60 * 60, // 4 hours
  requireHttps: process.env.NODE_ENV === 'production',
  sameSiteCookie: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax',
};

export async function getSecureSession() {
  const headersList = await headers();
  const user = await getAuthenticatedUser();

  if (!user) {
    return null;
  }

  // Additional security checks
  const userAgent = headersList.get('user-agent');
  const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip');

  return {
    user,
    userAgent,
    ip,
    timestamp: new Date(),
  };
}

export function validateSessionSecurity(config: Partial<SessionSecurityConfig> = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  return finalConfig;
}

export function getSessionCookieAttributes(config: Partial<SessionSecurityConfig> = {}) {
  const finalConfig = validateSessionSecurity(config);

  return {
    httpOnly: true,
    secure: finalConfig.requireHttps,
    sameSite: finalConfig.sameSiteCookie,
    maxAge: finalConfig.maxAge,
    path: '/',
  };
}

// Detect suspicious session activity
export function detectSuspiciousActivity(
  previousSession: { userAgent?: string; ip?: string },
  currentSession: { userAgent?: string; ip?: string }
): boolean {
  // Check if user agent changed significantly
  if (previousSession.userAgent !== currentSession.userAgent) {
    return true;
  }

  // Check if IP changed (but allow some variance for mobile users)
  if (previousSession.ip && currentSession.ip && previousSession.ip !== currentSession.ip) {
    // Extract country code from IP if available
    // This is a simplified check - in production, use GeoIP service
    return false; // Allow IP changes for now
  }

  return false;
}

// Implement device fingerprinting
export async function generateDeviceFingerprint(req: Request): Promise<string> {
  const userAgent = req.headers.get('user-agent') || '';
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const acceptLanguage = req.headers.get('accept-language') || '';

  // Create a simple fingerprint
  const fingerprint = `${userAgent}::${ip}::${acceptLanguage}`;

  // In production, use SHA256 hash
  const hash = await hashFingerprint(fingerprint);
  return hash;
}

async function hashFingerprint(input: string): Promise<string> {
  // Using Node.js crypto
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}
