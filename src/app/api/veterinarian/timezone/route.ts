import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import UserModel from "@/models/User";
import VeterinarianModel from "@/models/Veterinarian";
import mongoose from "mongoose";
import type { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

/**
 * GET /api/veterinarian/timezone
 * 
 * Gets the current timezone for the authenticated veterinarian
 * 
 * Response:
 * - success: boolean
 * - message: string
 * - data: { timezone: string, source: string }
 */
export async function GET() {
  try {
    // Check authentication
    const session: Session | null = await getServerSession(authOptions as any);
    if (!(session as any)?.user?.email) {
      return NextResponse.json(
        { 
          success: false,
          error: "Unauthorized. Please sign in to view your timezone." 
        },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Start a mongoose session for transaction
    const dbSession = await mongoose.startSession();
    
    try {
      // Find the veterinarian by email
      const veterinarian = await VeterinarianModel.findOne({
        email: (session as any).user.email.toLowerCase(),
        isActive: true,
        isDeleted: { $ne: true }
      }).select("timezone").session(dbSession);

      if (!veterinarian) {
        return NextResponse.json(
          { 
            success: false,
            error: "Veterinarian profile not found" 
          },
          { status: 404 }
        );
      }

      // Find the associated user to get their timezone as well
      const user = await UserModel.findOne({
        veterinarianRef: veterinarian._id,
        isActive: true,
        isDeleted: { $ne: true }
      }).select("timezone").session(dbSession);

      // Use veterinarian timezone as primary, fallback to user timezone, then UTC
      const timezone = veterinarian.timezone || user?.timezone || "UTC";

      return NextResponse.json({
        success: true,
        message: "Timezone retrieved successfully",
        data: {
          timezone: timezone,
          source: veterinarian.timezone ? "veterinarian" : user?.timezone ? "user" : "default"
        },
      });

    } catch (error: any) {
      console.error("Error fetching timezone:", error);
      return NextResponse.json(
        { 
          success: false,
          error: "Internal server error" 
        },
        { status: 500 }
      );
    } finally {
      // Always end the session
      await dbSession.endSession();
    }

  } catch (error: any) {
    console.error("Error fetching timezone:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Internal server error" 
      },
      { status: 500 }
    );
  }
}
