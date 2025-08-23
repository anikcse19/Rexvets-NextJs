import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import PetParentModel from "@/models/PetParent";
import { z } from "zod";

// Validation schemas for different update types
const basicInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name cannot exceed 50 characters").optional(),
  firstName: z.string().min(1, "First name must be at least 1 character").max(25, "First name cannot exceed 25 characters").optional(),
  lastName: z.string().min(1, "Last name must be at least 1 character").max(25, "Last name cannot exceed 25 characters").optional(),
  phoneNumber: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number").optional(),
  state: z.string().min(1, "State is required").optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  zipCode: z.string().optional(),
  locale: z.string().min(2, "Locale must be at least 2 characters").max(5, "Locale cannot exceed 5 characters").optional(),
});

const petSchema = z.object({
  name: z.string().min(1, "Pet name is required").max(30, "Pet name cannot exceed 30 characters"),
  type: z.enum(['dog', 'cat', 'bird', 'fish', 'reptile', 'other']),
  breed: z.string().max(50, "Breed cannot exceed 50 characters").optional(),
  age: z.number().min(0, "Age cannot be negative").max(30, "Age cannot exceed 30 years").optional(),
  weight: z.number().min(0, "Weight cannot be negative").max(200, "Weight cannot exceed 200 kg").optional(),
  medicalHistory: z.array(z.string().max(200, "Medical history item cannot exceed 200 characters")).optional(),
});

const emergencyContactSchema = z.object({
  name: z.string().min(2, "Emergency contact name must be at least 2 characters").max(50, "Emergency contact name cannot exceed 50 characters"),
  phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"),
  relationship: z.string().min(2, "Relationship must be at least 2 characters").max(30, "Relationship cannot exceed 30 characters"),
});

const preferencesSchema = z.object({
  notifications: z.object({
    email: z.boolean().optional(),
    sms: z.boolean().optional(),
    push: z.boolean().optional(),
  }).optional(),
  language: z.string().min(2, "Language code must be at least 2 characters").max(5, "Language code cannot exceed 5 characters").optional(),
  timezone: z.string().min(1, "Timezone is required").max(50, "Timezone cannot exceed 50 characters").optional(),
});

const fcmTokensSchema = z.object({
  web: z.string().optional(),
  mobile: z.string().optional(),
});

// Main update schema that allows partial updates
const updatePetParentSchema = z.object({
  // Basic info
  name: basicInfoSchema.shape.name,
  firstName: basicInfoSchema.shape.firstName,
  lastName: basicInfoSchema.shape.lastName,
  phoneNumber: basicInfoSchema.shape.phoneNumber,
  state: basicInfoSchema.shape.state,
  city: basicInfoSchema.shape.city,
  address: basicInfoSchema.shape.address,
  zipCode: basicInfoSchema.shape.zipCode,
  locale: basicInfoSchema.shape.locale,
  
  // Profile image
  profileImage: z.string().url("Profile image must be a valid URL").optional(),
  
  // Pets management
  pets: z.array(petSchema).optional(),
  addPet: petSchema.optional(),
  updatePet: z.object({
    index: z.number().min(0, "Pet index must be 0 or greater"),
    pet: petSchema
  }).optional(),
  removePet: z.number().min(0, "Pet index must be 0 or greater").optional(),
  
  // Emergency contact
  emergencyContact: emergencyContactSchema.optional(),
  
  // Preferences
  preferences: preferencesSchema.optional(),
  
  // FCM tokens
  fcmTokens: fcmTokensSchema.optional(),
}).refine((data) => {
  // Ensure at least one field is provided for update
  const hasUpdateFields = Object.keys(data).some(key => data[key as keyof typeof data] !== undefined);
  return hasUpdateFields;
}, {
  message: "At least one field must be provided for update"
});

export async function PUT(request: NextRequest) {
  try {
    // Get session to verify authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in to update your profile." },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedFields = updatePetParentSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: validatedFields.error.issues 
        },
        { status: 400 }
      );
    }

    const updateData = validatedFields.data;

    // Connect to database
    try {
      await connectToDatabase();
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json(
        { error: "Database connection failed. Please try again later." },
        { status: 503 }
      );
    }

    // Find the pet parent by email
    const petParent = await PetParentModel.findOne({ 
      email: session.user.email,
      isActive: true 
    });

    if (!petParent) {
      return NextResponse.json(
        { error: "Pet parent account not found or inactive." },
        { status: 404 }
      );
    }

    // Prepare update object
    const updateObject: any = {};
    const petsArray = [...(petParent.pets || [])];

    // Handle basic info updates
    Object.keys(updateData).forEach(key => {
      if (key !== 'pets' && key !== 'addPet' && key !== 'updatePet' && key !== 'removePet' && updateData[key as keyof typeof updateData] !== undefined) {
        updateObject[key] = updateData[key as keyof typeof updateData];
      }
    });

    // Handle pets array operations
    if (updateData.pets !== undefined) {
      // Replace entire pets array
      updateObject.pets = updateData.pets;
    } else if (updateData.addPet) {
      // Add new pet
      petsArray.push(updateData.addPet);
      updateObject.pets = petsArray;
    } else if (updateData.updatePet) {
      // Update specific pet
      const { index, pet } = updateData.updatePet;
      if (index >= petsArray.length) {
        return NextResponse.json(
          { error: `Pet at index ${index} does not exist.` },
          { status: 400 }
        );
      }
      petsArray[index] = pet;
      updateObject.pets = petsArray;
    } else if (updateData.removePet !== undefined) {
      // Remove specific pet
      const index = updateData.removePet;
      if (index >= petsArray.length) {
        return NextResponse.json(
          { error: `Pet at index ${index} does not exist.` },
          { status: 400 }
        );
      }
      petsArray.splice(index, 1);
      updateObject.pets = petsArray;
    }

    // Add timestamp
    updateObject.updatedAt = new Date();

    // Update the pet parent
    try {
      const updatedPetParent = await PetParentModel.findByIdAndUpdate(
        petParent._id,
        { $set: updateObject },
        { 
          new: true, 
          runValidators: true,
          select: '-password -emailVerificationToken -passwordResetToken -googleAccessToken -googleRefreshToken'
        }
      );

      if (!updatedPetParent) {
        return NextResponse.json(
          { error: "Failed to update profile. Please try again." },
          { status: 500 }
        );
      }

      // Return success response with updated data
      return NextResponse.json({
        message: "Profile updated successfully",
        user: {
          id: updatedPetParent._id,
          name: updatedPetParent.name,
          firstName: updatedPetParent.firstName,
          lastName: updatedPetParent.lastName,
          email: updatedPetParent.email,
          phoneNumber: updatedPetParent.phoneNumber,
          state: updatedPetParent.state,
          city: updatedPetParent.city,
          address: updatedPetParent.address,
          zipCode: updatedPetParent.zipCode,
          profileImage: updatedPetParent.profileImage,
          locale: updatedPetParent.locale,
          pets: updatedPetParent.pets,
          emergencyContact: updatedPetParent.emergencyContact,
          preferences: updatedPetParent.preferences,
          fcmTokens: updatedPetParent.fcmTokens,
          isEmailVerified: updatedPetParent.isEmailVerified,
          createdAt: updatedPetParent.createdAt,
          updatedAt: updatedPetParent.updatedAt,
        }
      }, { status: 200 });

    } catch (updateError: any) {
      console.error("Update error:", updateError);
      
      // Handle specific MongoDB errors
      if (updateError.code === 11000) {
        return NextResponse.json(
          { error: "A user with this information already exists. Please check your details." },
          { status: 409 }
        );
      }
      
      if (updateError.name === 'ValidationError') {
        const validationErrors = Object.values(updateError.errors).map((err: any) => err.message);
        return NextResponse.json(
          { error: "Validation error", details: validationErrors },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: "Failed to update profile. Please try again." },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error("Pet parent update error:", error);
    
    // Handle specific errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON format in request body." },
        { status: 400 }
      );
    }
    
    if (error.message.includes("ECONNREFUSED") || error.message.includes("ENOTFOUND")) {
      return NextResponse.json(
        { error: "Database connection failed. Please try again later." },
        { status: 503 }
      );
    }
    
    // Generic error for unexpected issues
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}

// GET method to retrieve current pet parent data
export async function GET() {
  try {
    // Get session to verify authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in to view your profile." },
        { status: 401 }
      );
    }

    // Connect to database
    try {
      await connectToDatabase();
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json(
        { error: "Database connection failed. Please try again later." },
        { status: 503 }
      );
    }

    // Find the pet parent by email
    const petParent = await PetParentModel.findOne({ 
      email: session.user.email,
      isActive: true 
    }).select('-password -emailVerificationToken -passwordResetToken -googleAccessToken -googleRefreshToken');

    if (!petParent) {
      return NextResponse.json(
        { error: "Pet parent account not found or inactive." },
        { status: 404 }
      );
    }

    // Return pet parent data
    return NextResponse.json({
      user: {
        id: petParent._id,
        name: petParent.name,
        firstName: petParent.firstName,
        lastName: petParent.lastName,
        email: petParent.email,
        phoneNumber: petParent.phoneNumber,
        state: petParent.state,
        city: petParent.city,
        address: petParent.address,
        zipCode: petParent.zipCode,
        profileImage: petParent.profileImage,
        locale: petParent.locale,
        pets: petParent.pets,
        emergencyContact: petParent.emergencyContact,
        preferences: petParent.preferences,
        fcmTokens: petParent.fcmTokens,
        isEmailVerified: petParent.isEmailVerified,
        createdAt: petParent.createdAt,
        updatedAt: petParent.updatedAt,
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("Pet parent retrieval error:", error);
    
    if (error.message.includes("ECONNREFUSED") || error.message.includes("ENOTFOUND")) {
      return NextResponse.json(
        { error: "Database connection failed. Please try again later." },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
