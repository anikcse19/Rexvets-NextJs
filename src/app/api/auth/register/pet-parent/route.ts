import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import PetParentModel, { IPetParentModel } from "@/models/PetParent";
import { z } from "zod";
import { sendEmailVerification } from "@/lib/email";

// Validation schema for pet parent registration
const petParentRegistrationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name cannot exceed 50 characters"),
  email: z.string().min(1, "Email is required").regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  ),
  phoneNumber: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"),
  state: z.string().min(1, "State is required"),
  city: z.string().optional(),
  address: z.string().optional(),
  zipCode: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    console.log("Starting pet parent registration...");
    
    const body = await request.json();
    console.log("Request body received:", { ...body, password: "[REDACTED]" });
    
    const validatedFields = petParentRegistrationSchema.safeParse(body);

    if (!validatedFields.success) {
      console.log("Validation failed:", validatedFields.error.issues);
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: validatedFields.error.issues 
        },
        { status: 400 }
      );
    }

    const { name, email, password, phoneNumber, state, city, address, zipCode } = validatedFields.data;
    console.log("Validation passed for:", { name, email, state, phoneNumber });

    // Connect to database
    try {
      console.log("Connecting to database...");
      await connectToDatabase();
      console.log("Database connected successfully");
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json(
        { error: "Database connection failed. Please try again later." },
        { status: 503 }
      );
    }

    // Check if user already exists
    try {
      console.log("Checking for existing user...");
      const existingUser = await PetParentModel.findOne({ email });
      if (existingUser) {
        console.log("User already exists:", email);
        return NextResponse.json(
          { error: "An account with this email address already exists. Please use a different email or try signing in." },
          { status: 409 }
        );
      }
      console.log("No existing user found");
    } catch (findError) {
      console.error("Error checking existing user:", findError);
      return NextResponse.json(
        { error: "Unable to verify email availability. Please try again." },
        { status: 500 }
      );
    }

    // Create new pet parent
    console.log("Creating new pet parent...");
    const petParent = new PetParentModel({
      name,
      email,
      password,
      phoneNumber,
      state,
      city,
      address,
      zipCode,
      pets: [], // Empty array initially
      preferences: {
        notifications: {
          email: true,
          sms: true,
          push: true,
        },
        language: 'en',
        timezone: 'UTC',
      },
    });

    // Generate email verification token
    console.log("Generating email verification token...");
    const verificationToken = petParent.generateEmailVerificationToken();

    // Save the user
    try {
      console.log("Saving pet parent to database...");
      await petParent.save();
      console.log("Pet parent saved successfully");
    } catch (saveError: any) {
      console.error("Error saving pet parent:", saveError);
      console.error("Save error details:", {
        name: saveError.name,
        message: saveError.message,
        code: saveError.code,
        keyPattern: saveError.keyPattern,
        errors: saveError.errors
      });
      
      // Handle specific MongoDB errors
      if (saveError.code === 11000) {
        if (saveError.keyPattern?.email) {
          return NextResponse.json(
            { error: "An account with this email address already exists. Please use a different email or try signing in." },
            { status: 409 }
          );
        }
        return NextResponse.json(
          { error: "A user with this information already exists. Please check your details." },
          { status: 409 }
        );
      }
      
      if (saveError.name === 'ValidationError') {
        const validationErrors = Object.values(saveError.errors).map((err: any) => err.message);
        console.log("Validation errors:", validationErrors);
        return NextResponse.json(
          { error: "Validation error", details: validationErrors },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: "Failed to create account. Please check your information and try again." },
        { status: 500 }
      );
    }

    // Send email verification
    try {
      console.log("Sending email verification...");
      await sendEmailVerification(email, verificationToken, name);
      console.log("Email verification sent");
    } catch (emailError) {
      console.error("Email verification failed:", emailError);
      // Don't fail the registration if email fails, but log it
      // User can request email verification later
    }

    console.log("Registration completed successfully");
    // Return success response (without sensitive data)
    return NextResponse.json(
      {
        message: "Pet parent registered successfully. Please check your email to verify your account.",
        user: {
          id: petParent._id,
          name: petParent.name,
          email: petParent.email,
          state: petParent.state,
          isEmailVerified: petParent.isEmailVerified,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Pet parent registration error:", error);
    console.error("Error details:", {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    
    // Handle specific errors
    if (error instanceof Error) {
      // Database connection errors
      if (error.message.includes("ECONNREFUSED") || error.message.includes("ENOTFOUND")) {
        return NextResponse.json(
          { error: "Database connection failed. Please try again later." },
          { status: 503 }
        );
      }
      
      // Network errors
      if (error.message.includes("fetch") || error.message.includes("network")) {
        return NextResponse.json(
          { error: "Network error. Please check your internet connection and try again." },
          { status: 503 }
        );
      }
      
      // JSON parsing errors
      if (error.message.includes("JSON") || error.message.includes("Unexpected token")) {
        return NextResponse.json(
          { error: "Invalid request data. Please check your information and try again." },
          { status: 400 }
        );
      }
      
      // Duplicate key errors
      if (error.message.includes("duplicate key error") || error.message.includes("E11000")) {
        return NextResponse.json(
          { error: "An account with this email address already exists. Please use a different email or try signing in." },
          { status: 409 }
        );
      }
    }
    
    // Generic error for unexpected issues
    return NextResponse.json(
      { error: "Registration failed. Please try again later. If the problem persists, contact support." },
      { status: 500 }
    );
  }
}
