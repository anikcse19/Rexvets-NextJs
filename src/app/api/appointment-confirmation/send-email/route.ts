import { NextRequest, NextResponse } from 'next/server';
import { sendAppointmentConfirmationEmails } from '@/lib/email';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    console.log("Email API endpoint called");
    
    // Check authentication
    const session = await getServerSession(authOptions);
    console.log("Session check:", { hasSession: !!session, hasUser: !!session?.user });
    if (!session?.user) {
      console.log("Unauthorized access attempt");
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("Email API request body:", body);
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
      console.log("Missing required fields:", { doctorEmail, doctorName, parentEmail, parentName, petName, appointmentDate, appointmentTime, meetingLink });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log("All required fields present, sending emails...");

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

    console.log("Emails sent successfully");
    return NextResponse.json({
      success: true,
      message: 'Appointment confirmation emails sent successfully',
    });

  } catch (error) {
    console.error('Error sending appointment confirmation emails:', error);
    return NextResponse.json(
      { error: 'Failed to send confirmation emails' },
      { status: 500 }
    );
  }
}
