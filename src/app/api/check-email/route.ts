import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import VeterinarianModel from "@/models/Veterinarian";
import PetParentModel from "@/models/PetParent";

// GET /api/check-email?email=someone@example.com
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email')?.toLowerCase().trim();

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check across Users and legacy collections (Veterinarian/PetParent)
    const [existingUser, existingVet, existingPetParent] = await Promise.all([
      User.findOne({ email, isDeleted: { $ne: true } }).select('googleId password role'),
      VeterinarianModel.findOne({ email }).select('googleId password'),
      PetParentModel.findOne({ email }).select('googleId password')
    ]);

    const exists: any = existingUser || existingVet || existingPetParent;
    const isAvailable = !exists;
    
    // Check if it's a Google OAuth account (has googleId but no password)
    const isGoogleAccount = !!(exists && exists.googleId && !exists.password);

    return NextResponse.json({
      available: isAvailable,
      exists: !!exists,
      isGoogleAccount: isGoogleAccount,
      email: email
    });

  } catch (error) {
    console.error('Email check error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
