import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { connectToDatabase } from "@/lib/mongoose";
import VeterinarianModel from "@/models/Veterinarian";
import { z } from "zod";

// Validation schemas
const basicInfoSchema = z.object({
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
  postNominalLetters: z.string().optional(),
  gender: z.enum(["male", "female"]).optional(),
  city: z.string().min(2).max(100).optional(),
  state: z.string().min(2).max(100).optional(),
  countryCode: z.string().min(2).max(3).optional(),
  phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/).optional(),
  bio: z.string().max(1000).optional(),
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
  dob: z.string().datetime().optional(),
  address: z.string().min(1).max(200).optional(),
  zipCode: z.number().min(0).optional(),
  country: z.string().min(2).max(100).optional(),
  yearsOfExperience: z.string().optional(),
  clinic: z.object({
    name: z.string().min(1).max(100),
    address: z.string().min(1).max(200),
  }).optional(),
});

const educationSchema = z.object({
  degree: z.string().min(2),
  institution: z.string().min(2),
  year: z.number().min(1900).max(new Date().getFullYear()),
});

const experienceSchema = z.object({
  position: z.string().min(2),
  institution: z.string().min(2),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  description: z.string().optional(),
});

// Certifications is now a simple string array
const certificationSchema = z.string().min(1);

const licenseSchema = z.object({
  licenseNumber: z.string().min(1),
  deaNumber: z.string().optional(),
  state: z.string().min(1),
  licenseFile: z.string().url().optional(),
});

const workingHoursSchema = z.object({
  start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  available: z.boolean(),
});

const fcmTokensSchema = z.object({
  web: z.string().optional(),
  mobile: z.string().optional(),
});

// Main update schema
const updateVeterinarianSchema = z.object({
  ...basicInfoSchema.shape,
  
  // Array operations
  education: z.array(educationSchema).optional(),
  addEducation: educationSchema.optional(),
  updateEducation: z.object({
    index: z.number().min(0),
    education: educationSchema,
  }).optional(),
  removeEducation: z.number().min(0).optional(),
  
  experience: z.array(experienceSchema).optional(),
  addExperience: experienceSchema.optional(),
  updateExperience: z.object({
    index: z.number().min(0),
    experience: experienceSchema,
  }).optional(),
  removeExperience: z.number().min(0).optional(),
  
  certifications: z.array(certificationSchema).optional(),
  addCertification: certificationSchema.optional(),
  updateCertification: z.object({
    index: z.number().min(0),
    certification: certificationSchema,
  }).optional(),
  removeCertification: z.number().min(0).optional(),
  
  licenses: z.array(licenseSchema).optional(),
  addLicense: licenseSchema.optional(),
  updateLicense: z.object({
    index: z.number().min(0),
    license: licenseSchema,
  }).optional(),
  removeLicense: z.number().min(0).optional(),
  
  schedule: z.object({
    monday: workingHoursSchema.optional(),
    tuesday: workingHoursSchema.optional(),
    wednesday: workingHoursSchema.optional(),
    thursday: workingHoursSchema.optional(),
    friday: workingHoursSchema.optional(),
    saturday: workingHoursSchema.optional(),
    sunday: workingHoursSchema.optional(),
  }).optional(),
  
  fcmTokens: fcmTokensSchema.optional(),
  
  profileImage: z.string().url().optional(),
  cv: z.string().url().optional(),
  signatureImage: z.string().url().optional(),
  signature: z.string().optional(),
});
// update veterinarian profile
export async function PUT(request: NextRequest) {
  try {
    const session: Session | null = await getServerSession(authOptions as any);
    if (!(session as any)?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to update your profile." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedFields = updateVeterinarianSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validatedFields.error.issues },
        { status: 400 }
      );
    }

    const updateData = validatedFields.data;
    await connectToDatabase();

    const veterinarian = await VeterinarianModel.findOne({ 
      email: (session as any).user.email.toLowerCase(), 
      isActive: true 
    });

    if (!veterinarian) {
      return NextResponse.json(
        { error: "Veterinarian profile not found" },
        { status: 404 }
      );
    }

    const updateObject: any = {};
    const educationArray = [...(veterinarian.education || [])];
    const experienceArray = [...(veterinarian.experience || [])];
    const certificationsArray = [...(veterinarian.certifications || [])];
    const licensesArray = [...(veterinarian.licenses || [])];

    // Handle basic info updates
    Object.keys(updateData).forEach(key => {
      if (key !== 'education' && key !== 'addEducation' && key !== 'updateEducation' && key !== 'removeEducation' &&
          key !== 'experience' && key !== 'addExperience' && key !== 'updateExperience' && key !== 'removeExperience' &&
          key !== 'certifications' && key !== 'addCertification' && key !== 'updateCertification' && key !== 'removeCertification' &&
          key !== 'licenses' && key !== 'addLicense' && key !== 'updateLicense' && key !== 'removeLicense' &&
          key !== 'schedule' && key !== 'fcmTokens' &&
          updateData[key as keyof typeof updateData] !== undefined) {
        updateObject[key] = updateData[key as keyof typeof updateData];
      }
    });

    // Handle name update
    if (updateData.firstName || updateData.lastName) {
      const firstName = updateData.firstName || veterinarian.firstName || '';
      const lastName = updateData.lastName || veterinarian.lastName || '';
      updateObject.name = `${firstName} ${lastName}`.trim();
    }

    // Handle education array operations
    if (updateData.education !== undefined) {
      updateObject.education = updateData.education;
    } else if (updateData.addEducation) {
      educationArray.push(updateData.addEducation);
      updateObject.education = educationArray;
    } else if (updateData.updateEducation) {
      const { index, education } = updateData.updateEducation;
      if (index >= educationArray.length) {
        return NextResponse.json(
          { error: `Education index ${index} is out of bounds` },
          { status: 400 }
        );
      }
      educationArray[index] = education;
      updateObject.education = educationArray;
    } else if (updateData.removeEducation !== undefined) {
      const index = updateData.removeEducation;
      if (index >= educationArray.length) {
        return NextResponse.json(
          { error: `Education index ${index} is out of bounds` },
          { status: 400 }
        );
      }
      educationArray.splice(index, 1);
      updateObject.education = educationArray;
    }

    // Handle experience array operations
    if (updateData.experience !== undefined) {
      updateObject.experience = updateData.experience;
    } else if (updateData.addExperience) {
      experienceArray.push(updateData.addExperience);
      updateObject.experience = experienceArray;
    } else if (updateData.updateExperience) {
      const { index, experience } = updateData.updateExperience;
      if (index >= experienceArray.length) {
        return NextResponse.json(
          { error: `Experience index ${index} is out of bounds` },
          { status: 400 }
        );
      }
      experienceArray[index] = experience;
      updateObject.experience = experienceArray;
    } else if (updateData.removeExperience !== undefined) {
      const index = updateData.removeExperience;
      if (index >= experienceArray.length) {
        return NextResponse.json(
          { error: `Experience index ${index} is out of bounds` },
          { status: 400 }
        );
      }
      experienceArray.splice(index, 1);
      updateObject.experience = experienceArray;
    }

    // Handle certifications array operations
    if (updateData.certifications !== undefined) {
      updateObject.certifications = updateData.certifications;
    } else if (updateData.addCertification) {
      certificationsArray.push(updateData.addCertification);
      updateObject.certifications = certificationsArray;
    } else if (updateData.updateCertification) {
      const { index, certification } = updateData.updateCertification;
      if (index >= certificationsArray.length) {
        return NextResponse.json(
          { error: `Certification index ${index} is out of bounds` },
          { status: 400 }
        );
      }
      certificationsArray[index] = certification;
      updateObject.certifications = certificationsArray;
    } else if (updateData.removeCertification !== undefined) {
      const index = updateData.removeCertification;
      if (index >= certificationsArray.length) {
        return NextResponse.json(
          { error: `Certification index ${index} is out of bounds` },
          { status: 400 }
        );
      }
      certificationsArray.splice(index, 1);
      updateObject.certifications = certificationsArray;
    }

    // Handle licenses array operations
    if (updateData.licenses !== undefined) {
      updateObject.licenses = updateData.licenses;
    } else if (updateData.addLicense) {
      licensesArray.push(updateData.addLicense);
      updateObject.licenses = licensesArray;
    } else if (updateData.updateLicense) {
      const { index, license } = updateData.updateLicense;
      if (index >= licensesArray.length) {
        return NextResponse.json(
          { error: `License index ${index} is out of bounds` },
          { status: 400 }
        );
      }
      licensesArray[index] = license;
      updateObject.licenses = licensesArray;
    } else if (updateData.removeLicense !== undefined) {
      const index = updateData.removeLicense;
      if (index >= licensesArray.length) {
        return NextResponse.json(
          { error: `License index ${index} is out of bounds` },
          { status: 400 }
        );
      }
      licensesArray.splice(index, 1);
      updateObject.licenses = licensesArray;
    }

    // Handle schedule updates
    if (updateData.schedule) {
      const currentSchedule = { ...(veterinarian as any).schedule };
      Object.keys(updateData.schedule).forEach(day => {
        if (updateData.schedule![day as keyof typeof updateData.schedule]) {
          currentSchedule[day as keyof typeof currentSchedule] = {
            ...currentSchedule[day as keyof typeof currentSchedule],
            ...updateData.schedule![day as keyof typeof updateData.schedule]
          };
        }
      });
      updateObject.schedule = currentSchedule;
    }

    // Handle FCM tokens updates
    if (updateData.fcmTokens) {
      const currentFcmTokens = { ...veterinarian.fcmTokens };
      updateObject.fcmTokens = {
        ...currentFcmTokens,
        ...updateData.fcmTokens
      };
    }

    updateObject.updatedAt = new Date();

    const updatedVeterinarian = await VeterinarianModel.findByIdAndUpdate(
      veterinarian._id,
      { $set: updateObject },
      { 
        new: true, 
        runValidators: true,
        select: '-password -emailVerificationToken -emailVerificationExpires -passwordResetToken -passwordResetExpires -googleAccessToken -googleRefreshToken'
      }
    );

    if (!updatedVeterinarian) {
      return NextResponse.json(
        { error: "Failed to update veterinarian profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Veterinarian profile updated successfully",
      data: {
        veterinarian: updatedVeterinarian
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error updating veterinarian:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      let errorMessage = "A record with this information already exists.";
      
      if (field === 'licenseNumber') {
        errorMessage = "A veterinarian with this license number already exists.";
      } else if (field === 'phoneNumber') {
        errorMessage = "A veterinarian with this phone number already exists.";
      }
      
      return NextResponse.json(
        { error: errorMessage, field },
        { status: 409 }
      );
    }

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: "Validation failed", details: validationErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update profile. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session: Session | null = await getServerSession(authOptions as any);
    if (!(session as any)?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to view your profile." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const veterinarian = await VeterinarianModel.findOne({ 
      email: (session as any).user.email.toLowerCase(), 
      isActive: true 
    }).select('-password -emailVerificationToken -emailVerificationExpires -passwordResetToken -passwordResetExpires -googleAccessToken -googleRefreshToken');

    if (!veterinarian) {
      return NextResponse.json(
        { error: "Veterinarian profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Veterinarian profile retrieved successfully",
      data: {
        veterinarian
      }
    });

  } catch (error: any) {
    console.error("Error fetching veterinarian:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
