import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { createSession } from '@/lib/auth/session';

// Force dynamic rendering (uses searchParams)
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/?error=missing_token', request.url));
    }

    // Find record by token
    const { data: record, error } = await supabaseAdmin
      .from('nda_access')
      .select('*')
      .eq('access_token', token)
      .single();

    if (error || !record) {
      return NextResponse.redirect(new URL('/?error=invalid_token', request.url));
    }

    // Validate token
    if (record.status !== 'completed') {
      return NextResponse.redirect(new URL('/?error=not_completed', request.url));
    }

    // Check expiration
    if (record.token_expires_at) {
      const expirationDate = new Date(record.token_expires_at);
      if (expirationDate < new Date()) {
        return NextResponse.redirect(new URL('/?error=token_expired', request.url));
      }
    }

    // Create session
    const response = NextResponse.redirect(new URL('/deck', request.url));
    createSession(response, {
      email: record.email,
      ndaVersion: record.nda_version || '1.0',
      signedAt: record.signed_at || new Date().toISOString(),
    });

    // Update accessed_at if not already set
    if (!record.accessed_at) {
      await supabaseAdmin
        .from('nda_access')
        .update({ accessed_at: new Date().toISOString() })
        .eq('id', record.id);
    }

    return response;
  } catch (error: any) {
    console.error('Access route error:', error);
    return NextResponse.redirect(new URL('/?error=server_error', request.url));
  }
}

