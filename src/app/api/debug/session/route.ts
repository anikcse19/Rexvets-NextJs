import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import VeterinarianModel from "@/models/Veterinarian";
import PetParentModel from "@/models/PetParent";
import VetTechModel from "@/models/VetTech";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({
        error: "No session found",
        session: null,
        userType: null,
        accountStatus: null
      });
    }

    if (!session.user?.email) {
      return NextResponse.json({
        error: "Session found but no email",
        session: {
          user: session.user,
          expires: session.expires
        },
        userType: null,
        accountStatus: null
      });
    }

    await connectToDatabase();

    // Check all collections for this email
    const petParent = await PetParentModel.findOne({ email: session.user.email.toLowerCase() });
    const veterinarian = await VeterinarianModel.findOne({ email: session.user.email.toLowerCase() });
    const vetTech = await VetTechModel.findOne({ email: session.user.email.toLowerCase() });

    let userType = null;
    let accountStatus = null;
    let userData = null;

    if (petParent) {
      userType = 'pet_parent';
      accountStatus = {
        isActive: petParent.isActive,
        isEmailVerified: petParent.isEmailVerified,
        isLocked: petParent.checkIfLocked ? petParent.checkIfLocked() : false,
        loginAttempts: petParent.loginAttempts,
        lockUntil: petParent.lockUntil
      };
      userData = {
        id: petParent._id,
        name: petParent.name,
        email: petParent.email,
        role: 'pet_parent'
      };
    } else if (veterinarian) {
      userType = 'veterinarian';
      accountStatus = {
        isActive: veterinarian.isActive,
        isEmailVerified: veterinarian.isEmailVerified,
        isApproved: veterinarian.isApproved,
        isLocked: veterinarian.checkIfLocked ? veterinarian.checkIfLocked() : false,
        loginAttempts: veterinarian.loginAttempts,
        lockUntil: veterinarian.lockUntil
      };
      userData = {
        id: veterinarian._id,
        name: veterinarian.name,
        email: veterinarian.email,
        role: 'veterinarian',
        specialization: veterinarian.specialization,
        licenseNumber: veterinarian.licenseNumber
      };
    } else if (vetTech) {
      userType = 'vet_tech';
      accountStatus = {
        isActive: vetTech.isActive,
        isEmailVerified: vetTech.isEmailVerified,
        isLocked: vetTech.checkIfLocked ? vetTech.checkIfLocked() : false,
        loginAttempts: vetTech.loginAttempts,
        lockUntil: vetTech.lockUntil
      };
      userData = {
        id: vetTech._id,
        name: vetTech.name,
        email: vetTech.email,
        role: 'vet_tech'
      };
    }

    return NextResponse.json({
      success: true,
      session: {
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          role: session.user.role,
          emailVerified: session.user.emailVerified
        },
        expires: session.expires
      },
      userType,
      accountStatus,
      userData,
      databaseCheck: {
        petParentFound: !!petParent,
        veterinarianFound: !!veterinarian,
        vetTechFound: !!vetTech
      }
    });

  } catch (error: any) {
    console.error("Debug session error:", error);
    return NextResponse.json({
      error: "Debug failed",
      message: error.message,
      session: null,
      userType: null,
      accountStatus: null
    }, { status: 500 });
  }
}
