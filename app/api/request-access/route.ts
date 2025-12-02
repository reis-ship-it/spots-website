import { NextRequest, NextResponse } from 'next/server';
import { requestAccessSchema } from '@/lib/utils/validation';
import { supabaseAdmin } from '@/lib/supabase/server';
import { generateAccessToken, getTokenExpiration } from '@/lib/utils/tokens';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = requestAccessSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid input', errors: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { name, email, company } = validationResult.data;

    // Check for existing record (use maybeSingle to handle "not found" gracefully)
    const { data: existing, error: existingError } = await supabaseAdmin
      .from('nda_access')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    
    // If there's an error (other than "not found"), throw it
    if (existingError) {
      throw existingError;
    }

    // If exists and completed, return error
    if (existing && existing.status === 'completed') {
      return NextResponse.json(
        { success: false, message: 'Access already granted for this email' },
        { status: 400 }
      );
    }

    // Create or update record
    const recordData = {
      email,
      name,
      company: company || null,
      status: 'pending',
      nda_version: process.env.NDA_VERSION || '2',
    };

    let record;
    if (existing) {
      // Update existing record
      const { data, error } = await supabaseAdmin
        .from('nda_access')
        .update(recordData)
        .eq('email', email)
        .select()
        .single();
      
      if (error) throw error;
      record = data;
    } else {
      // Create new record
      const { data, error } = await supabaseAdmin
        .from('nda_access')
        .insert(recordData)
        .select()
        .single();
      
      if (error) throw error;
      record = data;
    }

    // Generate access token for signing page (temporary token for signing)
    const signingToken = generateAccessToken();
    const tokenExpiresAt = getTokenExpiration(0.04); // ~1 hour for signing

    await supabaseAdmin
      .from('nda_access')
      .update({ 
        access_token: signingToken, // Temporarily use for signing
        token_expires_at: tokenExpiresAt.toISOString(),
      })
      .eq('id', record.id);

    // Generate signing page URL
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    const signUrl = `${baseUrl}/sign-nda?token=${signingToken}`;

    return NextResponse.json({
      success: true,
      message: 'Redirecting to sign the NDA...',
      signUrl, // Frontend will redirect to this URL
    });
  } catch (error: any) {
    console.error('Request access error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred. Please try again.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

