import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const emailConfig = {
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      hasUser: !!process.env.EMAIL_USER,
      hasPass: !!process.env.EMAIL_PASS,
    };

    return NextResponse.json({
      success: true,
      emailConfig,
      message: emailConfig.hasUser && emailConfig.hasPass 
        ? 'Email service is configured' 
        : 'Email service is not configured - will use development mode',
    });

  } catch (error) {
    console.error('Error checking email configuration:', error);
    return NextResponse.json(
      { error: 'Failed to check email configuration' },
      { status: 500 }
    );
  }
}
