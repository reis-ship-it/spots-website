import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { generateAccessToken, getTokenExpiration } from '@/lib/utils/tokens';
import { sendAccessEmail } from '@/lib/email/client';
import crypto from 'crypto';

/**
 * Verify Inkless webhook signature using HMAC (if provided)
 */
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  if (!secret || !signature) {
    // If no secret configured, skip verification (not recommended for production)
    console.warn('Webhook signature verification skipped - no secret configured');
    return true;
  }

  try {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    const computedSignature = hmac.digest('hex'); // or 'base64' depending on Inkless format
    return computedSignature === signature;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const body = await request.text();
    
    // Get signature from headers (Inkless may use different header names)
    const signature = request.headers.get('x-inkless-signature') || 
                     request.headers.get('x-signature') ||
                     request.headers.get('x-webhook-signature') || 
                     '';
    const secret = process.env.INKLESS_WEBHOOK_SECRET || '';

    // Verify webhook signature if secret is configured
    if (secret && signature) {
      const isValid = verifyWebhookSignature(body, signature, secret);
      if (!isValid) {
        console.error('Invalid webhook signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    }

    // Parse webhook payload (Inkless typically sends JSON)
    let webhookData: any;
    
    try {
      webhookData = JSON.parse(body);
    } catch (parseError) {
      console.error('Failed to parse webhook payload as JSON:', parseError);
      return NextResponse.json(
        { error: 'Invalid webhook payload format' },
        { status: 400 }
      );
    }

    // Extract document information (adjust field names based on Inkless webhook format)
    // Common webhook event types: document.signed, document.completed, envelope.completed
    const documentId = webhookData.documentId || 
                      webhookData.document?.id || 
                      webhookData.id ||
                      webhookData.envelopeId;
    
    const status = webhookData.status || 
                  webhookData.event || 
                  webhookData.document?.status;
    
    const eventType = webhookData.event || 
                     webhookData.type || 
                     webhookData.eventType;

    // Extract signer email if available
    const signerEmail = webhookData.signer?.email || 
                       webhookData.recipient?.email ||
                       webhookData.email;

    if (!documentId) {
      console.error('No document ID in webhook payload:', webhookData);
      return NextResponse.json(
        { error: 'Missing document ID' }, 
        { status: 400 }
      );
    }

    // Only process completed/signed documents
    // Adjust these statuses based on Inkless webhook event names
    const completedStatuses = ['completed', 'signed', 'finished', 'finalized'];
    const isCompleted = completedStatuses.includes(status?.toLowerCase() || '') ||
                       eventType?.includes('signed') ||
                       eventType?.includes('completed');

    if (!isCompleted) {
      console.log(`Document ${documentId} status: ${status || eventType} - skipping`);
      return NextResponse.json({ 
        message: 'Document not completed yet, skipping',
        status: status || eventType 
      });
    }

    // Find record by document_id (we store it as envelope_id in the database)
    const { data: record, error: findError } = await supabaseAdmin
      .from('nda_access')
      .select('*')
      .eq('envelope_id', documentId)
      .single();

    if (findError || !record) {
      console.error('Record not found for document:', documentId);
      // Return 200 to avoid webhook retries
      return NextResponse.json({ message: 'Record not found' });
    }

    // Check if already processed
    if (record.status === 'completed') {
      console.log(`Document ${documentId} already processed`);
      return NextResponse.json({ message: 'Already processed' });
    }

    // Generate access token
    const accessToken = generateAccessToken();
    const tokenExpiresAt = getTokenExpiration(
      parseInt(process.env.ACCESS_TOKEN_EXPIRY_DAYS || '30')
    );

    // Update record
    const { error: updateError } = await supabaseAdmin
      .from('nda_access')
      .update({
        status: 'completed',
        access_token: accessToken,
        token_expires_at: tokenExpiresAt.toISOString(),
        signed_at: new Date().toISOString(),
      })
      .eq('id', record.id);

    if (updateError) {
      console.error('Error updating record:', updateError);
      throw updateError;
    }

    // Send access email
    try {
      await sendAccessEmail({
        to: record.email,
        name: record.name || 'there',
        accessToken,
      });
    } catch (emailError) {
      console.error('Error sending access email:', emailError);
      // Don't fail the webhook if email fails - token is already generated
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    // Return 200 to Inkless even on error to avoid retries
    return NextResponse.json(
      { error: 'Processing failed', message: error.message },
      { status: 200 }
    );
  }
}

// Inkless webhooks may also send GET requests for verification
export async function GET() {
  return NextResponse.json({ 
    message: 'Inkless webhook endpoint',
    status: 'active'
  });
}

