import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { PetParentModel } from "@/models";

export async function GET(req: NextRequest) {
  try {
    // Get session to verify authentication
    const session = await getServerSession(authOptions as any);
    
    if (!(session as any)?.user?.refId) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Authentication required",
          redirectTo: "/auth/signin"
        },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Check donation status
    const petParent = await PetParentModel.findOne({ 
      _id: (session as any).user.refId,
      isActive: true 
    }).select('donationPaid lastDonationDate');

    if (!petParent) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Pet parent not found",
          redirectTo: "/auth/signin"
        },
        { status: 404 }
      );
    }

    // Check if donation is paid
    if (!petParent.donationPaid) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Donation required to book appointments",
          redirectTo: "/donate",
          donationStatus: {
            donationPaid: false,
            lastDonationDate: petParent.lastDonationDate
          }
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Access granted",
      donationStatus: {
        donationPaid: true,
        lastDonationDate: petParent.lastDonationDate
      }
    });

  } catch (error) {
    console.error("Error checking appointment confirmation access:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal server error",
        redirectTo: "/"
      },
      { status: 500 }
    );
  }
}
