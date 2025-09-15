import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { connectToDatabase } from "@/lib/mongoose";
import VeterinarianModel from "@/models/Veterinarian";
import { uploadToCloudinary, validateFile } from "@/lib/cloudinary";
import { z } from "zod";

// Validation schemas
const basicInfoSchema = z.object({
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
  postNominalLetters: z.string().transform(val => val === "" ? undefined : val).optional(),
  gender: z.enum(["male", "female"]).optional(),
  city: z.string().min(2).max(100).optional(),
  state: z.string().min(2).max(100).optional(),
  phoneNumber: z.string().optional(),
  bio: z.string().max(1000, "Bio must be at most 1000 characters").transform(val => val === "" ? undefined : val).optional(),
  specialization: z.string().min(2).optional(),
  consultationFee: z.number().min(0).optional(),
  available: z.boolean().optional(),
  timezone: z.string().optional(),
  languages: z.array(z.string()).optional(),
  // New optional fields
  treatedSpecies: z.array(z.string()).optional(),
  specialities: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  researchAreas: z.array(z.string()).optional(),
  monthlyGoal: z.number().min(0).optional(),
  experienceYears: z.string().optional(),
  // Additional new fields
  dob: z.coerce.date().optional(),
  address: z.string().min(1).max(200).transform(val => val === "" ? undefined : val).optional(),
  zipCode: z.string().transform(val => val === "" ? undefined : val).optional(),
  country: z.string().min(2).max(100).transform(val => val === "" ? undefined : val).optional(),
  yearsOfExperience: z.number().optional(),
  noticePeriod: z.number().min(0).optional(),
  clinic: z
    .object({
      name: z.string().min(1).max(100),
      address: z.string().min(1).max(200),
    })
    .optional(),
});

const licenseSchema = z.object({
  licenseNumber: z.string().min(1),
  deaNumber: z.string().optional(),
  state: z.string().min(1),
  licenseFile: z.string().optional(),
});

// Main update schema
const updateVeterinarianWithFilesSchema = z.object({
  ...basicInfoSchema.shape,
  licenses: z.array(licenseSchema).optional(),
});

export async function PUT(request: NextRequest) {
  try {
    const session: Session | null = await getServerSession(authOptions as any);
    if (!(session as any)?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to update your profile." },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    console.log("Form data received for update:", formData);

    // Helper function to handle form data extraction
    const getFormValue = (key: string): string | undefined => {
      const value = formData.get(key) as string;
      return value && value.trim() !== "" ? value : undefined;
    };

    // Extract basic info
    const basicInfo = {
      firstName: getFormValue("firstName"),
      lastName: getFormValue("lastName"),
      postNominalLetters: getFormValue("postNominalLetters"),
      gender: getFormValue("gender"),
      city: getFormValue("city"),
      state: getFormValue("state"),
      phoneNumber: getFormValue("phoneNumber"),
      bio: getFormValue("bio"),
      dob: getFormValue("dob"),
      address: getFormValue("address"),
      zipCode: getFormValue("zipCode"),
      country: getFormValue("country"),
    };

    // Extract files
    const profileImage = formData.get("profileImage") as File;
    
    const licensesData = formData.get("licenses") as string;
    const licenses = licensesData ? JSON.parse(licensesData) : [];
    
    // Extract license files with proper indexing
    const licenseFiles: { [key: number]: File } = {};
    for (let i = 0; i < licenses.length; i++) {
      const file = formData.get(`licenseFile_${i}`) as File;
      if (file && file.size > 0) {
        licenseFiles[i] = file;
      }
    }

    console.log("Profile image file:", profileImage);
    console.log("Profile image size:", profileImage?.size);
    console.log("Profile image type:", profileImage?.type);
    console.log("Extracted licenses:", licenses);
    console.log("License files found:", Object.keys(licenseFiles).length);
    console.log("License files mapping:", licenseFiles);

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

    const veterinarian = await VeterinarianModel.findOne({
      email: (session as any).user.email.toLowerCase(),
      isActive: true,
    });

    if (!veterinarian) {
      return NextResponse.json(
        { error: "Veterinarian profile not found" },
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
      const firstName = updateObject.firstName || veterinarian.firstName || "";
      const lastName = updateObject.lastName || veterinarian.lastName || "";
      updateObject.name = `${firstName} ${lastName}`.trim();
    }

    // Upload files to Cloudinary
    const uploadPromises: Promise<any>[] = [];
    const uploadedFiles: Record<string, any> = {};

    // Helper function to create prefixed filename
    const createPrefixedFilename = (originalName: string, vetName: string) => {
      if (!vetName) return originalName;

      // Clean the vet name (remove special characters, spaces to underscores)
      const cleanVetName = vetName
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

      // Return prefixed filename: vetname_timestamp_originalname.extension
      return `${cleanVetName}_${timestamp}_${nameWithoutExtension}${extension}`;
    };

    // Get vet name for file prefixing
    const vetName = `${veterinarian.firstName || ""} ${veterinarian.lastName || ""}`.trim() || veterinarian.name;

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
        vetName
      );

      uploadPromises.push(
        uploadToCloudinary(profileImage, {
          folder: "rexvets/profiles",
          transformation: { width: 400, height: 400, crop: "fill" },
          public_id: prefixedFilename,
        }).then((result) => {
          uploadedFiles.profileImage = result.secure_url;
        })
      );
    }

    // Upload license files and map them to licenses
    const licenseUploadPromises = Object.entries(licenseFiles).map(async ([index, file]) => {
      if (file && file.size > 0) {
        const validation = validateFile(file, {
          allowed_formats: ["pdf", "jpg", "jpeg", "png"],
          max_bytes: 5 * 1024 * 1024,
        });

        if (!validation.valid) {
          throw new Error(`License file ${parseInt(index) + 1}: ${validation.error}`);
        }

        const prefixedFilename = createPrefixedFilename(file.name, vetName);

        const result = await uploadToCloudinary(file, {
          folder: "rexvets/licenses",
          public_id: prefixedFilename,
        });

        return { index: parseInt(index), url: result.secure_url };
      }
      return null;
    });

    uploadPromises.push(
      Promise.all(licenseUploadPromises).then((results) => {
        results.forEach((result) => {
          if (result) {
            uploadedFiles[`licenseFile_${result.index}`] = result.url;
          }
        });
      })
    );

    // Wait for all uploads to complete
    await Promise.all(uploadPromises);

    // Update licenses with file URLs
    const updatedLicenses = licenses.map((license: any, index: number) => {
      // If this license has a new file uploaded, use the new URL
      if (uploadedFiles[`licenseFile_${index}`]) {
        return {
          ...license,
          licenseFile: uploadedFiles[`licenseFile_${index}`],
        };
      }
      
      // Otherwise, keep the existing file URL
      return {
        ...license,
        licenseFile: license.licenseFile,
      };
    });

    // Add uploaded files to update object
    if (uploadedFiles.profileImage) {
      updateObject.profileImage = uploadedFiles.profileImage;
    }

    if (updatedLicenses.length > 0) {
      updateObject.licenses = updatedLicenses;
    }

    updateObject.updatedAt = new Date();

    console.log("Updated licenses:", updatedLicenses);
    console.log("Update object:", updateObject);

    const updatedVeterinarian = await VeterinarianModel.findByIdAndUpdate(
      veterinarian._id,
      { $set: updateObject },
      {
        new: true,
        runValidators: true,
        select:
          "-password -emailVerificationToken -emailVerificationExpires -passwordResetToken -passwordResetExpires -googleAccessToken -googleRefreshToken",
      }
    );

    if (!updatedVeterinarian) {
      return NextResponse.json(
        { error: "Failed to update veterinarian profile" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Veterinarian profile updated successfully",
        data: {
          veterinarian: updatedVeterinarian,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating veterinarian with files:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      let errorMessage = "A record with this information already exists.";

      if (field === "licenseNumber") {
        errorMessage =
          "A veterinarian with this license number already exists.";
      } else if (field === "phoneNumber") {
        errorMessage = "A veterinarian with this phone number already exists.";
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
