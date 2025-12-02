/**
 * Email utilities for sending signed NDAs
 */

import { resend } from './client';

export interface SendSignedNDAParams {
  to: string; // Recipient email
  name: string;
  signedPdfBytes: Uint8Array;
  recipientType: 'viewer' | 'owner'; // Who is receiving this email
  ownerEmail?: string; // Your email (for owner emails)
}

/**
 * Send signed NDA PDF to the viewer (person who signed)
 */
export async function sendSignedNDAToViewer({
  to,
  name,
  signedPdfBytes,
}: Omit<SendSignedNDAParams, 'recipientType' | 'ownerEmail'>) {
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@yourdomain.com';

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to,
    subject: 'Your Signed SPOTS NDA - Copy',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Signed NDA</title>
        </head>
        <body style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #121212; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #FFFFFF; padding: 40px 20px; border-radius: 12px;">
            <h1 style="color: #000000; font-size: 28px; font-weight: 700; margin-bottom: 20px;">Thank you, ${name}!</h1>
            
            <p style="color: #121212; font-size: 16px; margin-bottom: 20px;">
              Your NDA has been signed successfully. Please find a copy of your signed NDA attached to this email.
            </p>
            
            <p style="color: #121212; font-size: 16px; margin-bottom: 30px;">
              Your access to the SPOTS pitch deck is now active. Check your email for the access link.
            </p>
            
            <p style="color: #6E6E6E; font-size: 14px; margin-top: 40px; border-top: 1px solid #E5E5E5; padding-top: 20px;">
              If you have any questions, please contact us.
            </p>
          </div>
        </body>
      </html>
    `,
    attachments: [
      {
        filename: `SPOTS_NDA_Signed_${name.replace(/\s+/g, '_')}.pdf`,
        content: Buffer.from(signedPdfBytes),
      },
    ],
  });

  if (error) {
    console.error('Error sending signed NDA to viewer:', error);
    throw error;
  }

  return data;
}

/**
 * Send signed NDA PDF to the owner (you)
 */
export async function sendSignedNDAToOwner({
  signedPdfBytes,
  signerName,
  signerEmail,
  ownerEmail,
}: {
  signedPdfBytes: Uint8Array;
  signerName: string;
  signerEmail: string;
  ownerEmail: string;
}) {
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@yourdomain.com';

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: ownerEmail,
    subject: `Signed NDA Received from ${signerName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Signed NDA Received</title>
        </head>
        <body style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #121212; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #FFFFFF; padding: 40px 20px; border-radius: 12px;">
            <h1 style="color: #000000; font-size: 28px; font-weight: 700; margin-bottom: 20px;">New Signed NDA Received</h1>
            
            <p style="color: #121212; font-size: 16px; margin-bottom: 10px;">
              <strong>Signer:</strong> ${signerName}
            </p>
            
            <p style="color: #121212; font-size: 16px; margin-bottom: 10px;">
              <strong>Email:</strong> ${signerEmail}
            </p>
            
            <p style="color: #121212; font-size: 16px; margin-bottom: 20px;">
              <strong>Signed:</strong> ${new Date().toLocaleString()}
            </p>
            
            <p style="color: #121212; font-size: 16px; margin-bottom: 30px;">
              Please find the signed NDA attached to this email.
            </p>
            
            <p style="color: #6E6E6E; font-size: 14px; margin-top: 40px; border-top: 1px solid #E5E5E5; padding-top: 20px;">
              This is an automated notification from the SPOTS pitch deck website.
            </p>
          </div>
        </body>
      </html>
    `,
    attachments: [
      {
        filename: `SPOTS_NDA_Signed_${signerName.replace(/\s+/g, '_')}_${signerEmail}.pdf`,
        content: Buffer.from(signedPdfBytes),
      },
    ],
  });

  if (error) {
    console.error('Error sending signed NDA to owner:', error);
    throw error;
  }

  return data;
}

