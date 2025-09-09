import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { connectToDatabase } from "@/lib/mongoose";
import PetParentModel from "@/models/PetParent";
import { uploadToCloudinary, validateFile } from "@/lib/cloudinary";
import { z } from "zod";

// Validation schemas
const basicInfoSchema = z.object({
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
  gender: z.enum(["male", "female"]).optional(),
  city: z.string().min(2).max(100).optional(),
  state: z.string().min(2).max(100).optional(),
  phoneNumber: z.string().optional(),
  dob: z.coerce.date().optional(),
  address: z.string().min(1).max(200).transform(val => val === "" ? undefined : val).optional(),
  zipCode: z.string().transform(val => val === "" ? undefined : val).optional(),
  country: z.string().min(2).max(100).transform(val => val === "" ? undefined : val).optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session: Session | null = await getServerSession(authOptions as any);
    if (!(session as any)?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to update your profile." },
        { status: 401 }
      );
    }

    // Await params
    const { id } = await params;

    // Parse form data
    const formData = await request.formData();
    console.log("Form data received for PetParent update:", formData);

    // Helper function to handle form data extraction
    const getFormValue = (key: string): string | undefined => {
      const value = formData.get(key) as string;
      return value && value.trim() !== "" ? value : undefined;
    };

    // Extract basic info
    const basicInfo = {
      firstName: getFormValue("firstName"),
      lastName: getFormValue("lastName"),
      gender: getFormValue("gender"),
      city: getFormValue("city"),
      state: getFormValue("state"),
      phoneNumber: getFormValue("phoneNumber"),
      dob: getFormValue("dob"),
      address: getFormValue("address"),
      zipCode: getFormValue("zipCode"),
      country: getFormValue("country"),
    };

    // Extract files
    const profileImage = formData.get("profileImage") as File;

    console.log("Profile image file:", profileImage);
    console.log("Profile image size:", profileImage?.size);
    console.log("Profile image type:", profileImage?.type);

    // Validate basic info
    const basicInfoValidation = basicInfoSchema.safeParse(basicInfo);

    if (!basicInfoValidation.success) {
      console.error("Validation failed:", basicInfoValidation.error.issues);
      return NextResponse.json(
        {
          error: "Validation failed",
          details: basicInfoValidation.error.issues,
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const petParent = await PetParentModel.findById(id);

    if (!petParent) {
      return NextResponse.json(
        { error: "Pet parent profile not found" },
        { status: 404 }
      );
    }

    const updateObject: any = {};

    // Handle basic info updates
    Object.keys(basicInfoValidation.data).forEach((key) => {
      if (basicInfoValidation.data[key as keyof typeof basicInfoValidation.data] !== undefined) {
        updateObject[key] = basicInfoValidation.data[key as keyof typeof basicInfoValidation.data];
      }
    });

    // Handle name update
    if (updateObject.firstName || updateObject.lastName) {
      const firstName = updateObject.firstName || petParent.firstName || "";
      const lastName = updateObject.lastName || petParent.lastName || "";
      updateObject.name = `${firstName} ${lastName}`.trim();
    }

    // Upload files to Cloudinary
    const uploadPromises: Promise<any>[] = [];
    const uploadedFiles: Record<string, any> = {};

    // Helper function to create prefixed filename
    const createPrefixedFilename = (originalName: string, petParentName: string) => {
      if (!petParentName) return originalName;

      // Clean the pet parent name (remove special characters, spaces to underscores)
      const cleanPetParentName = petParentName
        .replace(/[^a-zA-Z0-9\s]/g, "") // Remove special characters
        .replace(/\s+/g, "_") // Replace spaces with underscores
        .toLowerCase();

      // Get file extension
      const lastDotIndex = originalName.lastIndexOf(".");
      const extension =
        lastDotIndex !== -1 ? originalName.substring(lastDotIndex) : "";
      const nameWithoutExtension =
        lastDotIndex !== -1
          ? originalName.substring(0, lastDotIndex)
          : originalName;

      // Create timestamp for uniqueness
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .slice(0, -5);

      // Return prefixed filename: petparentname_timestamp_originalname.extension
      return `${cleanPetParentName}_${timestamp}_${nameWithoutExtension}${extension}`;
    };

    // Get pet parent name for file prefixing
    const petParentName = `${petParent.firstName || ""} ${petParent.lastName || ""}`.trim() || petParent.name;

    // Upload profile image
    if (profileImage && profileImage.size > 0) {
      const validation = validateFile(profileImage, {
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
        max_bytes: 5 * 1024 * 1024, // 5MB for images
      });

      if (!validation.valid) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }

      const prefixedFilename = createPrefixedFilename(
        profileImage.name,
        petParentName
      );

      uploadPromises.push(
        uploadToCloudinary(profileImage, {
          folder: "rexvets/pet-parents/profiles",
          transformation: { width: 400, height: 400, crop: "fill" },
          public_id: prefixedFilename,
        }).then((result) => {
          uploadedFiles.profileImage = result.secure_url;
        })
      );
    }

    // Wait for all uploads to complete
    await Promise.all(uploadPromises);

    // Add uploaded files to update object
    if (uploadedFiles.profileImage) {
      updateObject.profileImage = uploadedFiles.profileImage;
    }

    updateObject.updatedAt = new Date();

    console.log("Update object:", updateObject);

    const updatedPetParent = await PetParentModel.findByIdAndUpdate(
      id,
      { $set: updateObject },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedPetParent) {
      return NextResponse.json(
        { error: "Failed to update pet parent profile" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Pet parent profile updated successfully",
        data: {
          petParent: updatedPetParent,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating pet parent with files:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      let errorMessage = "A record with this information already exists.";

      if (field === "phoneNumber") {
        errorMessage = "A pet parent with this phone number already exists.";
      }

      return NextResponse.json({ error: errorMessage, field }, { status: 409 });
    }

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        { error: "Validation failed", details: validationErrors },
        { status: 400 }
      );
    }

    // Handle file upload errors
    if (error.message && error.message.includes("File")) {
      return NextResponse.json(
        { error: "File upload failed. Please check your files and try again." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update profile. Please try again." },
      { status: 500 }
    );
  }
}
