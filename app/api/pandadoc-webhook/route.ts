import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { generateAccessToken, getTokenExpiration } from '@/lib/utils/tokens';
import { sendAccessEmail } from '@/lib/email/client';
import crypto from 'crypto';

/**
 * Verify PandaDoc webhook signature using HMAC
 */
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  if (!secret || !signature) {
    console.warn('Webhook signature verification skipped - no secret configured');
    return true;
  }

  try {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    const computedSignature = hmac.digest('hex');
    return computedSignature === signature;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const body = await request.text();
    
    // PandaDoc webhook signature header
    const signature = request.headers.get('x-pandadoc-signature') || 
                     request.headers.get('x-signature') ||
                     '';
    const secret = process.env.PANDADOC_WEBHOOK_SECRET || '';

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

    // Parse webhook payload (PandaDoc sends JSON)
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

    // Extract document information
    // PandaDoc webhook events: document.status_changed, document.completed, etc.
    const documentId = webhookData.data?.document?.id || 
                      webhookData.document?.id ||
                      webhookData.data?.id ||
                      webhookData.id;
    
    const status = webhookData.data?.status || 
                  webhookData.status || 
                  webhookData.data?.document?.status;
    
    const eventType = webhookData.event || 
                     webhookData.type || 
                     webhookData.data?.event;

    if (!documentId) {
      console.error('No document ID in webhook payload:', webhookData);
      return NextResponse.json(
        { error: 'Missing document ID' }, 
        { status: 400 }
      );
    }

    // Only process completed/signed documents
    // PandaDoc statuses: document.completed, document_status_changed (with status: completed)
    const isCompleted = status === 'document.completed' ||
                       status === 'completed' ||
                       eventType === 'document.completed' ||
                       (eventType === 'document_status_changed' && status === 'completed');

    if (!isCompleted) {
      console.log(`Document ${documentId} status: ${status || eventType} - skipping`);
      return NextResponse.json({ 
        message: 'Document not completed yet, skipping',
        status: status || eventType 
      });
    }

    // Find record by document_id (stored as envelope_id in DB)
    const { data: record, error: findError } = await supabaseAdmin
      .from('nda_access')
      .select('*')
      .eq('envelope_id', documentId)
      .single();

    if (findError || !record) {
      console.error('Record not found for document:', documentId);
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
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Processing failed', message: error.message },
      { status: 200 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'PandaDoc webhook endpoint',
    status: 'active'
  });
}

