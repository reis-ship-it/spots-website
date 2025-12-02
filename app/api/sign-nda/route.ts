import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { getNDAPDF, overlaySignatureOnPDF, overlayTextSignatureOnPDF, base64ToUint8Array } from '@/lib/pdf/signature';
import { sendSignedNDAToViewer, sendSignedNDAToOwner } from '@/lib/email/signed-nda';
import { generateAccessToken, getTokenExpiration } from '@/lib/utils/tokens';
import { sendAccessEmail } from '@/lib/email/client';
import { getBaseUrl } from '@/lib/utils/url';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, signature, signatureType } = body;

    if (!token || !signature) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user record
    const { data: record, error: findError } = await supabaseAdmin
      .from('nda_access')
      .select('*')
      .eq('access_token', token)
      .single();

    if (findError || !record) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
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

    // Get NDA PDF
    const ndaPdfBytes = await getNDAPDF();

    // Overlay signature on PDF
    let signedPdfBytes: Uint8Array;

    // Signature coordinates - adjust these based on where signature should go on your NDA
    const signatureX = 100; // X position on PDF
    const signatureY = 150; // Y position on PDF (from top)
    const signatureWidth = 200;
    const signatureHeight = 60;

    if (signatureType === 'draw') {
      // Image signature
      const signatureImageBytes = base64ToUint8Array(signature);
      signedPdfBytes = await overlaySignatureOnPDF(
        ndaPdfBytes,
        signatureImageBytes,
        signatureX,
        signatureY,
        0, // First page
        signatureWidth,
        signatureHeight
      );
    } else {
      // Text signature
      signedPdfBytes = await overlayTextSignatureOnPDF(
        ndaPdfBytes,
        signature,
        signatureX,
        signatureY,
        0, // First page
        16 // Font size
      );
    }

    // Store signed PDF (optional - you could also store in Supabase Storage)
    // For now, we'll just mark as completed and email the PDFs

    // Generate new access token for pitch deck
    const accessToken = generateAccessToken();
    const tokenExpiresAt = getTokenExpiration(
      parseInt(process.env.ACCESS_TOKEN_EXPIRY_DAYS || '30')
    );

    // Update record
    await supabaseAdmin
      .from('nda_access')
      .update({
        status: 'completed',
        access_token: accessToken,
        token_expires_at: tokenExpiresAt.toISOString(),
        signed_at: new Date().toISOString(),
      })
      .eq('id', record.id);

    // Send signed PDFs via email
    try {
      // Send to viewer (person who signed)
      await sendSignedNDAToViewer({
        to: record.email,
        name: record.name || 'there',
        signedPdfBytes,
      });

      // Send to owner (you) - get owner email from env
      const ownerEmail = process.env.OWNER_EMAIL || process.env.RESEND_FROM_EMAIL;
      if (ownerEmail) {
        await sendSignedNDAToOwner({
          signedPdfBytes,
          signerName: record.name || 'Unknown',
          signerEmail: record.email,
          ownerEmail,
        });
      }
    } catch (emailError) {
      console.error('Error sending signed NDA emails:', emailError);
      // Don't fail the request - signature is processed
    }

    // Send access email
    try {
      // Get base URL from request
      const baseUrl = getBaseUrl(request);
      
      await sendAccessEmail({
        to: record.email,
        name: record.name || 'there',
        accessToken,
        baseUrl,
      });
    } catch (emailError) {
      console.error('Error sending access email:', emailError);
      // Log error details for debugging
      console.error('Email error details:', {
        message: emailError instanceof Error ? emailError.message : 'Unknown error',
        stack: emailError instanceof Error ? emailError.stack : undefined,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'NDA signed successfully. Check your email for the signed copy and access link.',
    });
  } catch (error: any) {
    console.error('Sign NDA error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process signature. Please try again.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

