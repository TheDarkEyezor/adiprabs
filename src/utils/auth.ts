import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'blog_admin_session';
const SESSION_SECRET = process.env.BLOG_ADMIN_PASSWORD || 'change-me-in-production';

export function createSession(): string {
  // Simple session token - in production, use a proper JWT or session library
  const sessionToken = Buffer.from(`${Date.now()}-${SESSION_SECRET}`).toString('base64');
  return sessionToken;
}

export function validateSession(sessionToken: string | undefined): boolean {
  if (!sessionToken) return false;
  
  try {
    const decoded = Buffer.from(sessionToken, 'base64').toString('utf8');
    const [timestamp, secret] = decoded.split('-');
    
    // Check if session is less than 24 hours old and secret matches
    const sessionAge = Date.now() - parseInt(timestamp);
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    return secret === SESSION_SECRET && sessionAge < maxAge;
  } catch {
    return false;
  }
}

export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  return session?.value || null;
}

export function isAuthenticated(sessionToken: string | null | undefined): boolean {
  return validateSession(sessionToken || undefined);
}

