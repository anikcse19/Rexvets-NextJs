import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import PetParentModel, { IPetParentModel } from "@/models/PetParent";
import VeterinarianModel, { IVeterinarianModel } from "@/models/Veterinarian";
import VetTechModel, { IVetTechModel } from "@/models/VetTech";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Try to find user with this token in all collections
    let user: any = await (PetParentModel as IPetParentModel).findByEmailVerificationToken(token);
    
    if (!user) {
      user = await (VeterinarianModel as IVeterinarianModel).findByEmailVerificationToken(token);
    }
    
    if (!user) {
      user = await (VetTechModel as IVetTechModel).findByEmailVerificationToken(token);
    }

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    // Check if account is active
    if (!user.isActive) {
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

    // Redirect to success page
    const successUrl = `${process.env.NEXTAUTH_URL}/auth/email-verified`;
    return NextResponse.redirect(successUrl);
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
