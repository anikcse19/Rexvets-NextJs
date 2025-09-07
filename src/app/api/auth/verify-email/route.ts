import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import UserModel, { IUserModel } from "@/models/User";
import { sendWelcomeEmail } from "@/lib/email";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    console.log('Email verification attempt with token:', token);

    if (!token) {
      console.log('No token provided');
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find user with this token in User collection
    const user = await (UserModel as IUserModel).findByEmailVerificationToken(token);

    if (!user) {
      console.log('Token not found in User collection');
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    console.log('User found:', { email: user.email, name: user.name, role: user.role });

    // Check if account is active
    if (!user.isActive) {
      console.log('Account is deactivated');
      return NextResponse.json(
        { error: "Account is deactivated. Please contact support." },
        { status: 400 }
      );
    }

    // Verify email
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();
    console.log('Email verified successfully for:', user.email);

    // Send welcome email (non-blocking for user experience)
    try {
      console.log('Starting welcome email process...');
      console.log('User email:', user.email);
      console.log('User name:', user.name);
      
      if (user.email && user.name) {
        console.log('Calling sendWelcomeEmail function...');
        await sendWelcomeEmail(user.email, user.name);
        console.log('Welcome email dispatched successfully to:', user.email);
      } else {
        console.log('Cannot send welcome email - missing email or name:', {
          hasEmail: !!user.email,
          hasName: !!user.name,
          email: user.email,
          name: user.name
        });
      }
    } catch (welcomeErr) {
      console.error('Failed to send welcome email after verification:', welcomeErr);
      console.error('Welcome email error details:', {
        message: welcomeErr.message,
        stack: welcomeErr.stack,
        userEmail: user.email,
        userName: user.name
      });
      // Do not fail the verification flow if email sending fails
    }

    // Return success response
    return NextResponse.json({
      message: "Email verified successfully",
      email: user.email,
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
