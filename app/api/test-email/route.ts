import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/email/client';

/**
 * Test endpoint to check email configuration
 * Only enable this in development or secure it with a secret token
 */
export async function GET(request: NextRequest) {
  // Simple security check - you can remove this or add proper auth
  const testEmail = request.nextUrl.searchParams.get('email') || process.env.OWNER_EMAIL;
  
  if (!testEmail) {
    return NextResponse.json({
      success: false,
      message: 'No email provided. Add ?email=your@email.com to the URL',
    }, { status: 400 });
  }

  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    
    console.log('📧 Testing email configuration...');
    console.log('From:', fromEmail);
    console.log('To:', testEmail);
    console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'Set ✅' : 'Missing ❌');
    
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: testEmail,
      subject: 'SPOTS Test Email',
      html: `
        <h1>Test Email from SPOTS</h1>
        <p>If you receive this, your email configuration is working!</p>
        <p>Sent at: ${new Date().toISOString()}</p>
      `,
    });

    if (error) {
      console.error('❌ Email test failed:', error);
      return NextResponse.json({
        success: false,
        message: 'Failed to send test email',
        error: error,
      }, { status: 500 });
    }

    console.log('✅ Test email sent successfully:', data);
    
    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully!',
      emailId: data?.id,
      from: fromEmail,
      to: testEmail,
    });
  } catch (error: any) {
    console.error('❌ Test email error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error sending test email',
      error: error?.message || 'Unknown error',
      details: error,
    }, { status: 500 });
  }
}

