import { NextRequest, NextResponse } from 'next/server';
import { getSession, isValidSession } from './lib/auth/session';

export function middleware(request: NextRequest) {
  // Only protect /deck route
  if (request.nextUrl.pathname.startsWith('/deck')) {
    const session = getSession(request);
    
    if (!isValidSession(session)) {
      // Redirect to home if no valid session
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/deck/:path*'],
};

