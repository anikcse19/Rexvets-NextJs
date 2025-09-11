import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import UserModel from "@/models/User";
import VeterinarianModel from "@/models/Veterinarian";
import mongoose from "mongoose";
import type { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schema for timezone update
const timezoneUpdateSchema = z.object({
  timezone: z
    .string()
    .min(1, "Timezone is required")
    .max(100, "Timezone must be less than 100 characters")
    .regex(
      /^[A-Za-z_]+\/[A-Za-z_]+$/,
      "Invalid timezone format. Use format like 'America/New_York' or 'UTC'"
    ),
});

/**
 * PUT /api/veterinarian/timezone/update
 * 
 * Updates the timezone for the authenticated veterinarian
 * 
 * Request body:
 * - timezone: string (required) - IANA timezone identifier (e.g., "America/New_York", "UTC")
 * 
 * Response:
 * - success: boolean
 * - message: string
 * - data: { veterinarian: updated veterinarian object }
 */
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session: Session | null = await getServerSession(authOptions as any);
    if (!(session as any)?.user?.email) {
      return NextResponse.json(
        { 
          success: false,
          error: "Unauthorized. Please sign in to update your timezone." 
        },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedFields = timezoneUpdateSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { 
          success: false,
          error: "Validation failed", 
          details: validatedFields.error.issues 
        },
        { status: 400 }
      );
    }

    const { timezone } = validatedFields.data;

    // Connect to database
    await connectToDatabase();

    // Start a mongoose session for transaction
    const dbSession = await mongoose.startSession();
    
    try {
      await dbSession.withTransaction(async () => {
        // Find the veterinarian by email
        const veterinarian = await VeterinarianModel.findOne({
          email: (session as any).user.email.toLowerCase(),
          isActive: true,
          isDeleted: { $ne: true }
        }).session(dbSession);

        if (!veterinarian) {
          throw new Error("Veterinarian profile not found");
        }

        // Find the associated user
        const user = await UserModel.findOne({
          veterinarianRef: veterinarian._id,
          isActive: true,
          isDeleted: { $ne: true }
        }).session(dbSession);

        if (!user) {
          throw new Error("User profile not found");
        }

        // Update veterinarian timezone
        const updatedVeterinarian = await VeterinarianModel.findByIdAndUpdate(
          veterinarian._id,
          { 
            $set: { 
              timezone: timezone,
              updatedAt: new Date()
            } 
          },
          {
            new: true,
            runValidators: true,
            session: dbSession,
            select: "-password -emailVerificationToken -emailVerificationExpires -passwordResetToken -passwordResetExpires -googleAccessToken -googleRefreshToken"
          }
        );

        if (!updatedVeterinarian) {
          throw new Error("Failed to update veterinarian timezone");
        }

        // Update user timezone
        const updatedUser = await UserModel.findByIdAndUpdate(
          user._id,
          { 
            $set: { 
              timezone: timezone,
              updatedAt: new Date()
            } 
          },
          {
            new: true,
            runValidators: true,
            session: dbSession
          }
        );

        if (!updatedUser) {
          throw new Error("Failed to update user timezone");
        }

        return { updatedVeterinarian, updatedUser };
      });

      // If we reach here, transaction was successful
      // Get the updated veterinarian for response
      const updatedVeterinarian = await VeterinarianModel.findOne({
        email: (session as any).user.email.toLowerCase(),
        isActive: true,
        isDeleted: { $ne: true }
      }).select("-password -emailVerificationToken -emailVerificationExpires -passwordResetToken -passwordResetExpires -googleAccessToken -googleRefreshToken");

      if (!updatedVeterinarian) {
        return NextResponse.json(
          { 
            success: false,
            error: "Failed to retrieve updated veterinarian" 
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Timezone updated successfully",
          data: {
            veterinarian: updatedVeterinarian,
          },
        },
        { status: 200 }
      );

    } catch (transactionError: any) {
      console.error("Transaction error:", transactionError);
      
      // Handle specific transaction errors
      if (transactionError.message === "Veterinarian profile not found") {
        return NextResponse.json(
          { 
            success: false,
            error: "Veterinarian profile not found" 
          },
          { status: 404 }
        );
      }
      
      if (transactionError.message === "User profile not found") {
        return NextResponse.json(
          { 
            success: false,
            error: "User profile not found" 
          },
          { status: 404 }
        );
      }
      
      if (transactionError.message.includes("Failed to update")) {
        return NextResponse.json(
          { 
            success: false,
            error: "Failed to update timezone" 
          },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { 
          success: false,
          error: "Failed to update timezone. Please try again." 
        },
        { status: 500 }
      );
    } finally {
      // Always end the session
      await dbSession.endSession();
    }

  } catch (error: any) {
    console.error("Error updating timezone:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false,
          error: "Validation failed", 
          details: error.issues 
        },
        { status: 400 }
      );
    }

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        { 
          success: false,
          error: "Validation failed", 
          details: validationErrors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false,
        error: "Failed to update timezone. Please try again." 
      },
      { status: 500 }
    );
  }
}

