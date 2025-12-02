import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'spots_nda_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days in seconds

export interface SessionData {
  email: string;
  ndaVersion: string;
  signedAt: string;
}

/**
 * Create a session cookie
 */
export function createSession(response: NextResponse, data: SessionData): void {
  const cookieValue = JSON.stringify(data);
  
  response.cookies.set(SESSION_COOKIE_NAME, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

/**
 * Get session data from cookie (server-side)
 */
export function getSession(request: NextRequest): SessionData | null {
  const cookie = request.cookies.get(SESSION_COOKIE_NAME);
  
  if (!cookie?.value) {
    return null;
  }

  try {
    return JSON.parse(cookie.value) as SessionData;
  } catch {
    return null;
  }
}

/**
 * Get session from Next.js cookies (alternative method)
 */
export async function getSessionFromCookies(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE_NAME);
  
  if (!cookie?.value) {
    return null;
  }

  try {
    return JSON.parse(cookie.value) as SessionData;
  } catch {
    return null;
  }
}

/**
 * Verify session is valid
 */
export function isValidSession(session: SessionData | null): boolean {
  if (!session) return false;
  
  // Check required fields
  if (!session.email || !session.ndaVersion || !session.signedAt) {
    return false;
  }

  // Additional validation can be added here (e.g., check expiration)
  return true;
}
