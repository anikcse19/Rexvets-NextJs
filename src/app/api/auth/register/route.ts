import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import UserModel from "@/models/User";
import { z } from "zod";
import { sendEmailVerification } from "@/lib/email";
import { registerRateLimiter } from "@/lib/rate-limit";

// Registration validation schema
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name cannot exceed 50 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  ),
  role: z.enum(["pet_parent", "veterinarian", "technician"]),
  phoneNumber: z.string().optional(),
  specialization: z.string().optional(),
  licenseNumber: z.string().optional(),
  consultationFee: z.number().min(0).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimit = registerRateLimiter(request);
    if (!rateLimit.success) {
      return NextResponse.json(
        { 
          error: "Too many registration attempts. Please try again later.",
          resetTime: rateLimit.resetTime 
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': rateLimit.resetTime.toString(),
          }
        }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedFields = registerSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: validatedFields.error.issues 
        },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      password,
      role,
      phoneNumber,
      specialization,
      licenseNumber,
      consultationFee,
    } = validatedFields.data;

    // Connect to database
    await connectToDatabase();

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Validate veterinarian-specific fields
    if (role === "veterinarian") {
      if (!specialization) {
        return NextResponse.json(
          { error: "Specialization is required for veterinarians" },
          { status: 400 }
        );
      }
      if (!licenseNumber) {
        return NextResponse.json(
          { error: "License number is required for veterinarians" },
          { status: 400 }
        );
      }
    }

    // Create new user
    const user = new UserModel({
      name,
      email: email.toLowerCase(),
      password,
      role,
      phoneNumber,
      specialization,
      licenseNumber,
      consultationFee,
      isEmailVerified: false,
    });

    // Generate email verification token
    const verificationToken = user.generateEmailVerificationToken();

    // Save user to database
    await user.save();

    // Send verification email (implement this function)
    try {
      await sendEmailVerification(user.email, verificationToken, user.name);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Don't fail registration if email fails, but log it
    }

    // Return success response (without sensitive data)
    return NextResponse.json(
      {
        message: "User registered successfully. Please check your email to verify your account.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
        },
      },
      { 
        status: 201,
        headers: {
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': rateLimit.resetTime.toString(),
        }
      }
    );
  } catch (error) {
    console.error("Registration error:", error);
    
    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes("duplicate key")) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
