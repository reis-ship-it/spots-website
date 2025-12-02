import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { getNDAPDF, overlaySignatureOnPDF, overlayTextSignatureOnPDF, base64ToUint8Array } from '@/lib/pdf/signature';
import { sendSignedNDAToViewer, sendSignedNDAToOwner } from '@/lib/email/signed-nda';
import { generateAccessToken, getTokenExpiration } from '@/lib/utils/tokens';
import { sendAccessEmail } from '@/lib/email/client';
import { getBaseUrl } from '@/lib/utils/url';
import { delay } from '@/lib/utils/delay';
import { resend } from '@/lib/email/client';

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
    // Resend rate limit: 2 requests per second, so we need delays between emails
    const emailErrors: string[] = [];
    
    // Email 1: Send to viewer (person who signed)
    try {
      await sendSignedNDAToViewer({
        to: record.email,
        name: record.name || 'there',
        signedPdfBytes,
      });
      console.log(`✅ Signed NDA email sent to viewer: ${record.email}`);
    } catch (emailError: any) {
      const errorMsg = emailError?.message || 'Unknown error';
      console.error('❌ Error sending signed NDA to viewer:', errorMsg);
      emailErrors.push(`Viewer email failed: ${errorMsg}`);
      // Don't fail the request - signature is processed
    }

    // Wait 600ms to respect Resend rate limit (2 requests/second)
    await delay(600);

    // Email 2: Send to owner (you)
    try {
      const ownerEmail = process.env.OWNER_EMAIL || process.env.RESEND_FROM_EMAIL;
      if (!ownerEmail) {
        console.warn('⚠️ OWNER_EMAIL not set - skipping owner notification');
        emailErrors.push('OWNER_EMAIL not configured');
      } else {
        await sendSignedNDAToOwner({
          signedPdfBytes,
          signerName: record.name || 'Unknown',
          signerEmail: record.email,
          ownerEmail,
        });
        console.log(`✅ Signed NDA email sent to owner: ${ownerEmail}`);
      }
    } catch (emailError: any) {
      const errorMsg = emailError?.message || 'Unknown error';
      console.error('❌ Error sending signed NDA to owner:', errorMsg);
      emailErrors.push(`Owner email failed: ${errorMsg}`);
      // Don't fail the request - signature is processed
    }

    // Wait 600ms to respect Resend rate limit
    await delay(600);

    // Email 3: Send access email
    try {
      // Get base URL from request
      const baseUrl = getBaseUrl(request);
      console.log(`📧 Preparing to send access email to: ${record.email}`);
      console.log(`🔗 Using base URL: ${baseUrl}`);
      
      await sendAccessEmail({
        to: record.email,
        name: record.name || 'there',
        accessToken,
        baseUrl,
      });
      console.log(`✅ Access email sent successfully to: ${record.email}`);
    } catch (emailError: any) {
      const errorMsg = emailError?.message || 'Unknown error';
      const errorDetails = emailError?.response?.data || emailError;
      const isValidationError = errorMsg.includes('validation_error') || 
                                errorMsg.includes('testing emails') ||
                                errorDetails?.name === 'validation_error';
      
      console.error('❌ Error sending access email:', errorMsg);
      console.error('📋 Email error details:', JSON.stringify(errorDetails, null, 2));
      emailErrors.push(`Access email failed: ${errorMsg}`);
      
      // If domain validation error, send access email to owner as fallback
      if (isValidationError) {
        const ownerEmail = process.env.OWNER_EMAIL || process.env.RESEND_FROM_EMAIL;
        if (ownerEmail) {
          try {
            console.log(`⚠️ Domain not verified. Sending access email to owner (${ownerEmail}) as fallback...`);
            const baseUrl = getBaseUrl(request);
            const accessLink = `${baseUrl}/access?token=${accessToken}`;
            
            // Send to owner with instructions to forward
            await resend.emails.send({
              from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
              to: ownerEmail,
              subject: `🔗 Forward: Access Link for ${record.name || record.email}`,
              html: `
                <h2>Please Forward This Access Link</h2>
                <p><strong>To:</strong> ${record.name || 'User'} (${record.email})</p>
                <p><strong>Message:</strong> Here is your access link to the SPOTS pitch deck:</p>
                <p><a href="${accessLink}">${accessLink}</a></p>
                <p><em>Note: This is a temporary workaround until domain verification is complete.</em></p>
              `,
            });
            console.log(`✅ Access link sent to owner (${ownerEmail}) for forwarding`);
          } catch (fallbackError: any) {
            console.error('❌ Failed to send fallback email to owner:', fallbackError?.message);
          }
        }
      }
      
      // Log Resend-specific errors
      if (emailError?.response) {
        console.error('📧 Resend API Response:', emailError.response);
      }
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

