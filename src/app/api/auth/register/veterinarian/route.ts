import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import VeterinarianModel from "@/models/Veterinarian";
import { veterinarianProfileSchema } from "@/lib/validation/veterinarian";
import { uploadToCloudinary, validateFile } from "@/lib/cloudinary";
import { sendEmailVerification } from "@/lib/email";
import { registerRateLimiter } from "@/lib/rate-limit";
import { z } from "zod";

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

    // Parse form data
    const formData = await request.formData();
    
    // Extract basic info
    const basicInfo = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      postNominalLetters: formData.get('postNominalLetters') as string,
      gender: formData.get('gender') as string,
      email: formData.get('email') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      countryCode: formData.get('countryCode') as string,
      phone: formData.get('phone') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };

    // Extract schedule
    const scheduleData = formData.get('schedule') as string;
    const schedule = scheduleData ? JSON.parse(scheduleData) : {};

    // Extract files
    const profilePicture = formData.get('profilePicture') as File;
    const signatureImage = formData.get('signatureImage') as File;
    const cv = formData.get('cv') as File;
    
    // Extract licenses
    const licensesData = formData.get('licenses') as string;
    const licenses = licensesData ? JSON.parse(licensesData) : [];
    const licenseFiles = formData.getAll('licenseFiles') as File[];

    // Validate basic info
    const basicInfoValidation = veterinarianProfileSchema.pick({
      firstName: true,
      lastName: true,
      postNominalLetters: true,
      gender: true,
      email: true,
      city: true,
      state: true,
      countryCode: true,
      phone: true,
      password: true,
      confirmPassword: true,
    }).safeParse(basicInfo);

    if (!basicInfoValidation.success) {
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: basicInfoValidation.error.issues 
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Check if veterinarian already exists
    const existingVet = await VeterinarianModel.findOne({ 
      email: basicInfo.email.toLowerCase() 
    });
    
    if (existingVet) {
      return NextResponse.json(
        { error: "Veterinarian with this email already exists" },
        { status: 409 }
      );
    }

    // Upload files to Cloudinary
    const uploadPromises: Promise<any>[] = [];
    const uploadedFiles: Record<string, any> = {};

    // Upload profile picture
    if (profilePicture && profilePicture.size > 0) {
      const validation = validateFile(profilePicture, { 
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        max_bytes: 5 * 1024 * 1024 // 5MB for images
      });
      
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        );
      }

      uploadPromises.push(
        uploadToCloudinary(profilePicture, { 
          folder: 'rexvets/profiles',
          transformation: { width: 400, height: 400, crop: 'fill' }
        }).then(result => {
          uploadedFiles.profileImage = result.secure_url;
        })
      );
    }

    // Upload signature image
    if (signatureImage && signatureImage.size > 0) {
      const validation = validateFile(signatureImage, { 
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        max_bytes: 2 * 1024 * 1024 // 2MB for signature
      });
      
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        );
      }

      uploadPromises.push(
        uploadToCloudinary(signatureImage, { 
          folder: 'rexvets/signatures',
          transformation: { width: 300, height: 100, crop: 'fill' }
        }).then(result => {
          uploadedFiles.signatureImage = result.secure_url;
        })
      );
    }

    // Upload CV
    if (cv && cv.size > 0) {
      const validation = validateFile(cv, { 
        allowed_formats: ['pdf', 'doc', 'docx'],
        max_bytes: 10 * 1024 * 1024 // 10MB for documents
      });
      
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        );
      }

      uploadPromises.push(
        uploadToCloudinary(cv, { 
          folder: 'rexvets/cv',
          resource_type: 'raw'
        }).then(result => {
          uploadedFiles.cv = result.secure_url;
        })
      );
    }

    // Upload license files
    const licenseUploadPromises = licenseFiles.map(async (file, index) => {
      if (file && file.size > 0) {
        const validation = validateFile(file, { 
          allowed_formats: ['pdf', 'jpg', 'jpeg', 'png'],
          max_bytes: 5 * 1024 * 1024
        });
        
        if (!validation.valid) {
          throw new Error(`License file ${index + 1}: ${validation.error}`);
        }

        const result = await uploadToCloudinary(file, { 
          folder: 'rexvets/licenses'
        });
        
        return { index, url: result.secure_url };
      }
      return null;
    });

    uploadPromises.push(
      Promise.all(licenseUploadPromises).then(results => {
        results.forEach(result => {
          if (result) {
            uploadedFiles[`licenseFile_${result.index}`] = result.url;
          }
        });
      })
    );

    // Wait for all uploads to complete
    await Promise.all(uploadPromises);

    // Update licenses with file URLs
    const updatedLicenses = licenses.map((license: any, index: number) => ({
      ...license,
      licenseFile: uploadedFiles[`licenseFile_${index}`] || null
    }));

    // Create veterinarian document
    const veterinarianData = {
      name: `${basicInfo.firstName} ${basicInfo.lastName}`,
      email: basicInfo.email.toLowerCase(),
      password: basicInfo.password,
      phoneNumber: basicInfo.phone,
      specialization: "General Practice", // Default, can be updated later
      licenseNumber: updatedLicenses[0]?.licenseNumber || "",
      licenseState: updatedLicenses[0]?.state || "",
      licenseExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Default 1 year
      consultationFee: 50, // Default fee, can be updated later
      available: true,
      profileImage: uploadedFiles.profileImage,
      bio: "",
      education: [],
      experience: [],
      certifications: [],
      languages: ["English"],
      timezone: "UTC",
      workingHours: {
        monday: { start: "09:00", end: "17:00", available: true },
        tuesday: { start: "09:00", end: "17:00", available: true },
        wednesday: { start: "09:00", end: "17:00", available: true },
        thursday: { start: "09:00", end: "17:00", available: true },
        friday: { start: "09:00", end: "17:00", available: true },
        saturday: { start: "09:00", end: "17:00", available: false },
        sunday: { start: "09:00", end: "17:00", available: false },
      },
      isEmailVerified: false,
      isActive: true,
      isApproved: false,
      loginAttempts: 0,
    };

    const veterinarian = new VeterinarianModel(veterinarianData);
    
    // Generate email verification token
    const verificationToken = veterinarian.generateEmailVerificationToken();
    
    await veterinarian.save();

    // Send email verification
    try {
      await sendEmailVerification(
        veterinarian.email,
        veterinarian.name,
        verificationToken
      );
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Don't fail the registration if email fails
    }

    return NextResponse.json({
      message: "Veterinarian registered successfully",
      veterinarianId: veterinarian._id,
      email: veterinarian.email,
      requiresEmailVerification: true,
    }, { status: 201 });

  } catch (error) {
    console.error("Veterinarian registration error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
