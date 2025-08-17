import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import VeterinarianModel from "@/models/Veterinarian";
import PetParentModel from "@/models/PetParent";
import VetTechModel from "@/models/VetTech";
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
    
    console.log('Received schedule data:', schedule);
    
    // Convert schedule format to workingHours format for database
    const convertScheduleToWorkingHours = (scheduleData: any) => {
      const workingHours: any = {};
      
      // Initialize all days with default values
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      days.forEach(day => {
        workingHours[day] = { start: "09:00", end: "17:00", available: false };
      });
      
      // Update with actual schedule data
      Object.keys(scheduleData).forEach(day => {
        const dayKey = day.toLowerCase();
        if (scheduleData[day] && scheduleData[day].length > 0) {
          // Use the first time slot for the day
          const firstSlot = scheduleData[day][0];
          workingHours[dayKey] = {
            start: firstSlot.startTime,
            end: firstSlot.endTime,
            available: true
          };
        }
      });
      
      console.log('Converted workingHours:', workingHours);
      return workingHours;
    };

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

    // Check if user already exists in any collection
    console.log("Checking for existing user across all collections...");
    
    const existingPetParent = await PetParentModel.findOne({ 
      email: basicInfo.email.toLowerCase() 
    });
    const existingVet = await VeterinarianModel.findOne({ 
      email: basicInfo.email.toLowerCase() 
    });
    const existingVetTech = await VetTechModel.findOne({ 
      email: basicInfo.email.toLowerCase() 
    });
    
    // Count how many accounts exist with this email
    const existingAccounts = [existingPetParent, existingVet, existingVetTech].filter(Boolean);
    
    if (existingAccounts.length > 0) {
      console.log("Account already exists:", basicInfo.email);
      console.log("Existing accounts:", {
        petParent: !!existingPetParent,
        veterinarian: !!existingVet,
        vetTech: !!existingVetTech
      });
      
      let accountType = "account";
      if (existingPetParent) accountType = "pet parent account";
      else if (existingVetTech) accountType = "vet technician account";
      else if (existingVet) accountType = "veterinarian account";
      
      return NextResponse.json(
        { error: `This email is already associated with a ${accountType}. Please use a different email or try signing in.` },
        { status: 409 }
      );
    }

    // Upload files to Cloudinary
    const uploadPromises: Promise<any>[] = [];
    const uploadedFiles: Record<string, any> = {};

    // Helper function to create prefixed filename
    const createPrefixedFilename = (originalName: string, vetName: string) => {
      if (!vetName) return originalName;
      
      // Clean the vet name (remove special characters, spaces to underscores)
      const cleanVetName = vetName
        .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
        .replace(/\s+/g, '_') // Replace spaces with underscores
        .toLowerCase();
      
      // Get file extension
      const lastDotIndex = originalName.lastIndexOf('.');
      const extension = lastDotIndex !== -1 ? originalName.substring(lastDotIndex) : '';
      const nameWithoutExtension = lastDotIndex !== -1 ? originalName.substring(0, lastDotIndex) : originalName;
      
      // Create timestamp for uniqueness
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      
      // Return prefixed filename: vetname_timestamp_originalname.extension
      return `${cleanVetName}_${timestamp}_${nameWithoutExtension}${extension}`;
    };

    // Get vet name for file prefixing
    const vetName = `${basicInfo.firstName} ${basicInfo.lastName}`.trim();

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

      const prefixedFilename = createPrefixedFilename(profilePicture.name, vetName);
      
      uploadPromises.push(
        uploadToCloudinary(profilePicture, { 
          folder: 'rexvets/profiles',
          transformation: { width: 400, height: 400, crop: 'fill' },
          public_id: prefixedFilename
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

      const prefixedFilename = createPrefixedFilename(signatureImage.name, vetName);
      
      uploadPromises.push(
        uploadToCloudinary(signatureImage, { 
          folder: 'rexvets/signatures',
          transformation: { width: 300, height: 100, crop: 'fill' },
          public_id: prefixedFilename
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

      const prefixedFilename = createPrefixedFilename(cv.name, vetName);
      
      uploadPromises.push(
        uploadToCloudinary(cv, { 
          folder: 'rexvets/cv',
          resource_type: 'raw',
          public_id: prefixedFilename
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

        const prefixedFilename = createPrefixedFilename(file.name, vetName);
        
        const result = await uploadToCloudinary(file, { 
          folder: 'rexvets/licenses',
          public_id: prefixedFilename
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

    console.log('Uploaded files:', uploadedFiles);
    console.log('Updated licenses:', updatedLicenses);

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
      cv: uploadedFiles.cv,
      signatureImage: uploadedFiles.signatureImage,
      signature: formData.get('signature') as string,
      licenses: updatedLicenses,
      bio: "",
      education: [],
      experience: [],
      certifications: [],
      languages: ["English"],
      timezone: "UTC",
      workingHours: convertScheduleToWorkingHours(schedule),
      isEmailVerified: false,
      isActive: true,
      isApproved: false,
      loginAttempts: 0,
    };

    console.log('Veterinarian data to save:', {
      name: veterinarianData.name,
      email: veterinarianData.email,
      profileImage: veterinarianData.profileImage,
      cv: veterinarianData.cv,
      signatureImage: veterinarianData.signatureImage,
      signature: veterinarianData.signature,
      licenses: veterinarianData.licenses
    });

    const veterinarian = new VeterinarianModel(veterinarianData);
    
    // Generate email verification token
    const verificationToken = veterinarian.generateEmailVerificationToken();
    
    console.log('Generated verification token:', verificationToken);
    console.log('Token length:', verificationToken.length);
    
    await veterinarian.save();

    // Send email verification
    try {
      await sendEmailVerification(
        veterinarian.email,
        verificationToken,
        veterinarian.name
      );
      console.log('Email verification sent successfully to:', veterinarian.email);
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

  } catch (error: any) {
    console.error("Veterinarian registration error:", error);
    
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      let errorMessage = "A record with this information already exists.";
      
      if (field === 'email') {
        errorMessage = "An account with this email address already exists. Please use a different email or try signing in.";
      } else if (field === 'licenseNumber') {
        errorMessage = "A veterinarian with this license number already exists. Please check your license number.";
      } else if (field === 'phoneNumber') {
        errorMessage = "A veterinarian with this phone number already exists. Please use a different phone number.";
      }
      
      return NextResponse.json(
        { error: errorMessage, field },
        { status: 409 }
      );
    }

    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: "Validation failed", details: validationErrors },
        { status: 400 }
      );
    }

    // Handle file upload errors
    if (error.message && error.message.includes('File')) {
      return NextResponse.json(
        { error: "File upload failed. Please check your files and try again." },
        { status: 400 }
      );
    }

    // Handle network or database connection errors
    if (error.name === 'MongoNetworkError' || error.name === 'MongoServerSelectionError') {
      return NextResponse.json(
        { error: "Database connection failed. Please try again later." },
        { status: 503 }
      );
    }

    // Generic error for everything else
    return NextResponse.json(
      { error: "Registration failed. Please try again or contact support if the problem persists." },
      { status: 500 }
    );
  }
}
