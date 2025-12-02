import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

// Force dynamic rendering (uses searchParams)
export const dynamic = 'force-dynamic';

/**
 * Get user info for signing page based on token
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Missing token' },
        { status: 400 }
      );
    }

    // Find record by access_token (used temporarily for signing)
    const { data: record, error } = await supabaseAdmin
      .from('nda_access')
      .select('name, email, status')
      .eq('access_token', token)
      .single();

    if (error || !record) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    // Check if already signed
    if (record.status === 'completed') {
      return NextResponse.json(
        { success: false, message: 'NDA already signed' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      name: record.name,
      email: record.email,
    });
  } catch (error: any) {
    console.error('Get signing info error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
}

