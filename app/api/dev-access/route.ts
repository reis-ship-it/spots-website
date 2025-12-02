import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/auth/session';

/**
 * Development-only route to create a test session
 * This allows you to access /deck without going through the full NDA flow
 * 
 * ONLY WORKS IN DEVELOPMENT MODE
 */
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'This route is only available in development mode' },
      { status: 403 }
    );
  }

  // Create a test session
  const response = NextResponse.redirect(new URL('/deck', request.url));
  createSession(response, {
    email: 'test@example.com',
    ndaVersion: '2',
    signedAt: new Date().toISOString(),
  });

  return response;
}

