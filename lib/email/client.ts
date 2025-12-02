import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@yourdomain.com';

if (!resendApiKey) {
  throw new Error('Missing RESEND_API_KEY environment variable');
}

export const resend = new Resend(resendApiKey);

export interface SendAccessEmailParams {
  to: string;
  name: string;
  accessToken: string;
  baseUrl?: string; // Optional: provide URL from request if available
}

import { getBaseUrl as getSiteBaseUrl } from '@/lib/utils/url';

/**
 * Send access email with token link
 */
export async function sendAccessEmail({ to, name, accessToken, baseUrl: providedUrl }: SendAccessEmailParams) {
  // Get base URL - use provided URL or detect from environment
  const baseUrl = providedUrl || getSiteBaseUrl();
  const accessLink = `${baseUrl}/access?token=${accessToken}`;
  
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@yourdomain.com';
  
  console.log(`📧 Sending access email:`, {
    from: fromEmail,
    to,
    baseUrl,
    accessLink,
    hasApiKey: !!process.env.RESEND_API_KEY,
  });

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to,
    subject: 'Access to SPOTS Pitch Deck',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Access to SPOTS Pitch Deck</title>
        </head>
        <body style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #121212; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #FFFFFF; padding: 40px 20px; border-radius: 12px;">
            <h1 style="color: #000000; font-size: 28px; font-weight: 700; margin-bottom: 20px;">Welcome, ${name}!</h1>
            
            <p style="color: #121212; font-size: 16px; margin-bottom: 20px;">
              Thank you for signing the NDA. Your access to the SPOTS pitch deck is ready.
            </p>
            
            <p style="color: #121212; font-size: 16px; margin-bottom: 30px;">
              Click the button below to view the pitch deck:
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${accessLink}" 
                 style="display: inline-block; background-color: #00FF66; color: #000000; text-decoration: none; 
                        padding: 12px 24px; border-radius: 10px; font-weight: 600; font-size: 16px;">
                View Pitch Deck
              </a>
            </div>
            
            <p style="color: #6E6E6E; font-size: 14px; margin-top: 30px;">
              Or copy and paste this link into your browser:<br>
              <a href="${accessLink}" style="color: #00FF66; word-break: break-all;">${accessLink}</a>
            </p>
            
            <p style="color: #6E6E6E; font-size: 12px; margin-top: 40px; border-top: 1px solid #E5E5E5; padding-top: 20px;">
              This link will expire in 30 days. If you have any questions, please contact us.
            </p>
          </div>
        </body>
      </html>
    `,
  });

  if (error) {
    console.error('❌ Resend API error:', error);
    console.error('📧 Email details:', {
      from: resendFromEmail,
      to,
      subject: 'Access to SPOTS Pitch Deck',
    });
    throw error;
  }

  console.log(`✅ Email sent successfully: ${data?.id}`);
  return data;
}

