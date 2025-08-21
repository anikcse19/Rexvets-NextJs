import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import UserModel, { IUserModel } from "@/models/User";

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
