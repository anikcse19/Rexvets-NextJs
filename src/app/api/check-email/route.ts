import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import VeterinarianModel from "@/models/Veterinarian";
import PetParentModel from "@/models/PetParent";

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

    // Check in both Veterinarian and PetParent collections
    const [existingVet, existingPetParent] = await Promise.all([
      VeterinarianModel.findOne({ email }).select('googleId password'),
      PetParentModel.findOne({ email }).select('googleId password')
    ]);

    const isAvailable = !existingVet && !existingPetParent;
    const exists = existingVet || existingPetParent;
    
    // Check if it's a Google OAuth account (has googleId but no password)
    const isGoogleAccount = exists && exists.googleId && !exists.password;

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
