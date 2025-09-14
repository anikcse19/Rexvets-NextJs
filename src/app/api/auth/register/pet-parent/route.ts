import { createOrUpdateUserAuth, linkUserToModel } from "@/lib/auth-helpers";
import { sendEmailVerification } from "@/lib/email";
import { connectToDatabase } from "@/lib/mongoose";
import { NotificationType } from "@/models/Notification";
import PetParentModel from "@/models/PetParent";
import UserModel from "@/models/User";
import { createAdminNotification } from "@/services/notificationService";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schema for pet parent registration
const petParentRegistrationSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  phoneNumber: z
    .string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"),
  state: z.string().min(1, "State is required"),
  city: z.string().optional(),
  address: z.string().optional(),
  zipCode: z.string().optional(),
  timezone: z.string().optional(),
  preferences: z
    .object({
      language: z.string().optional(),
      notifications: z
        .object({
          email: z.boolean().optional(),
          sms: z.boolean().optional(),
          push: z.boolean().optional(),
        })
        .optional(),
    })
    .optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedFields = petParentRegistrationSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validatedFields.error.issues,
        },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      password,
      phoneNumber,
      state,
      city,
      address,
      zipCode,
      timezone,
      preferences: incomingPreferences,
    } = validatedFields.data;

    // Connect to database
    try {
      await connectToDatabase();
    } catch {
      return NextResponse.json(
        { error: "Database connection failed. Please try again later." },
        { status: 503 }
      );
    }

    // Check if user already exists in User collection
    try {
      const existingUser = await UserModel.findOne({ email });

      if (existingUser) {
        return NextResponse.json(
          {
            error:
              "This email is already associated with an account. Please use a different email or try signing in.",
          },
          { status: 409 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: "Unable to verify email availability. Please try again." },
        { status: 500 }
      );
    }

    // Build preferences by merging defaults with incoming values
    const mergedPreferences = {
      notifications: {
        email: true,
        sms: true,
        push: true,
        ...(incomingPreferences?.notifications ?? {}),
      },
      language: incomingPreferences?.language ?? "en",
      timezone: timezone ?? "UTC",
    };

    // Create new pet parent profile (without authentication fields)
    const petParent = new PetParentModel({
      name,
      email,
      phoneNumber,
      state,
      city,
      address,
      zipCode,
      timezone: timezone ?? "UTC",
      pets: [], // Empty array initially
      preferences: mergedPreferences,
    });

    // Save the pet parent profile
    try {
      await petParent.save();
    } catch (saveError: any) {
      // Handle specific MongoDB errors
      if (saveError.code === 11000) {
        if (saveError.keyPattern?.email) {
          return NextResponse.json(
            {
              error:
                "An account with this email address already exists. Please use a different email or try signing in.",
            },
            { status: 409 }
          );
        }
        return NextResponse.json(
          {
            error:
              "A user with this information already exists. Please check your details.",
          },
          { status: 500 }
        );
      }

      if (saveError.name === "ValidationError") {
        const validationErrors = Object.values(saveError.errors).map(
          (err: any) => err.message
        );
        return NextResponse.json(
          { error: "Validation error", details: validationErrors },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          error:
            "Failed to create account. Please check your information and try again.",
        },
        { status: 500 }
      );
    }

    // Create user authentication record
    try {
      const userAuth = await createOrUpdateUserAuth(
        email,
        "pet_parent",
        password
      );

      // Link the user auth to the pet parent profile
      await linkUserToModel(
        userAuth._id.toString(),
        petParent._id.toString(),
        "pet_parent"
      );

      // Generate email verification token
      const verificationToken = userAuth.generateEmailVerificationToken();
      await userAuth.save();

      // Send email verification
      try {
        await sendEmailVerification(email, verificationToken, name);
      } catch {
        // Don't fail the registration if email fails
        // User can request email verification later
      }

      // Create notification for all admin users about new pet parent signup
      try {
        await createAdminNotification({
          type: NotificationType.NEW_SIGNUP,
          title: "New Pet Parent Registration",
          body: `A new pet parent named ${petParent.name} has registered on RexVet.`,
          subTitle: "Pet Parent Signup",
          data: {
            petParentId: petParent._id.toString(),
            petParentName: petParent.name,
            petParentEmail: petParent.email,
            registrationType: "pet_parent",
          },
        });
        console.log("Admin notification created for new pet parent signup");
      } catch (notificationError) {
        console.error(
          "Failed to create admin notification:",
          notificationError
        );
        // Don't fail the registration if notification fails
      }

      // Return success response (without sensitive data)
      return NextResponse.json(
        {
          message:
            "Pet parent registered successfully. Please check your email to verify your account.",
          user: {
            id: petParent._id,
            name: petParent.name,
            email: petParent.email,
            state: petParent.state,
            isEmailVerified: userAuth.isEmailVerified,
          },
        },
        { status: 201 }
      );
    } catch (authError: any) {
      // If user auth creation fails, clean up the pet parent record
      try {
        await PetParentModel.findByIdAndDelete(petParent._id);
      } catch (cleanupError) {
        // Log cleanup error but don't expose it to user
        console.error("Failed to cleanup pet parent record:", cleanupError);
      }

      if (authError.code === 11000) {
        return NextResponse.json(
          {
            error:
              "An account with this email address already exists. Please use a different email or try signing in.",
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "Failed to create authentication account. Please try again." },
        { status: 500 }
      );
    }
  } catch (error) {
    // Handle specific errors
    if (error instanceof Error) {
      // Database connection errors
      if (
        error.message.includes("ECONNREFUSED") ||
        error.message.includes("ENOTFOUND")
      ) {
        return NextResponse.json(
          { error: "Database connection failed. Please try again later." },
          { status: 503 }
        );
      }

      // Network errors
      if (
        error.message.includes("fetch") ||
        error.message.includes("network")
      ) {
        return NextResponse.json(
          {
            error:
              "Network error. Please check your internet connection and try again.",
          },
          { status: 503 }
        );
      }

      // JSON parsing errors
      if (
        error.message.includes("JSON") ||
        error.message.includes("Unexpected token")
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid request data. Please check your information and try again.",
          },
          { status: 400 }
        );
      }

      // Duplicate key errors
      if (
        error.message.includes("duplicate key error") ||
        error.message.includes("E11000")
      ) {
        return NextResponse.json(
          {
            error:
              "An account with this email address already exists. Please use a different email or try signing in.",
          },
          { status: 409 }
        );
      }
    }

    // Generic error for unexpected issues
    return NextResponse.json(
      {
        error:
          "Registration failed. Please try again later. If the problem persists, contact support.",
      },
      { status: 500 }
    );
  }
}
