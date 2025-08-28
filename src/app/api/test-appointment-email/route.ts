import { NextRequest, NextResponse } from 'next/server';
import { sendAppointmentConfirmationEmails } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      doctorEmail,
      doctorName,
      parentEmail,
      parentName,
      petName,
      appointmentDate,
      appointmentTime,
      meetingLink,
    } = body;

    // Validate required fields
    if (!doctorEmail || !doctorName || !parentEmail || !parentName || !petName || !appointmentDate || !appointmentTime || !meetingLink) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send confirmation emails
    await sendAppointmentConfirmationEmails({
      doctorEmail,
      doctorName,
      parentEmail,
      parentName,
      petName,
      appointmentDate,
      appointmentTime,
      meetingLink,
    });

    return NextResponse.json({
      success: true,
      message: 'Test appointment confirmation emails sent successfully',
    });

  } catch (error) {
    console.error('Error sending test appointment confirmation emails:', error);
    return NextResponse.json(
      { error: 'Failed to send test confirmation emails' },
      { status: 500 }
    );
  }
}
