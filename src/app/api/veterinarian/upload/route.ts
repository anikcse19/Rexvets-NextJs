import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { connectToDatabase } from "@/lib/mongoose";
import VeterinarianModel from "@/models/Veterinarian";
import { uploadToCloudinary, validateFile } from "@/lib/cloudinary";
import { z } from "zod";

// File type validation schema
const fileUploadSchema = z.object({
  fileType: z.enum(['profileImage', 'cv', 'signatureImage', 'licenseFile']),
  licenseIndex: z.number().min(0).optional(), // For license files
});

export async function POST(request: NextRequest) {
  try {
    const session: Session | null = await getServerSession(authOptions as any);
    if (!(session as any)?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to upload files." },
        { status: 401 }
      );
    }

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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileType = formData.get('fileType') as string;
    const licenseIndex = formData.get('licenseIndex') ? parseInt(formData.get('licenseIndex') as string) : undefined;

    // Validate file type
    const validation = fileUploadSchema.safeParse({ fileType, licenseIndex });
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid file type or license index", details: validation.error.issues },
        { status: 400 }
      );
    }

    if (!file || file.size === 0) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file based on type
    let fileValidation;
    let uploadConfig: any = {};
    let folder = '';

    switch (fileType) {
      case 'profileImage':
        fileValidation = validateFile(file, { 
          allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
          max_bytes: 5 * 1024 * 1024 // 5MB
        });
        folder = 'rexvets/profiles';
        uploadConfig = { 
          transformation: { width: 400, height: 400, crop: 'fill' }
        };
        break;

      case 'cv':
        fileValidation = validateFile(file, { 
          allowed_formats: ['pdf', 'doc', 'docx'],
          max_bytes: 10 * 1024 * 1024 // 10MB
        });
        folder = 'rexvets/cv';
        uploadConfig = { resource_type: 'raw' };
        break;

      case 'signatureImage':
        fileValidation = validateFile(file, { 
          allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
          max_bytes: 2 * 1024 * 1024 // 2MB
        });
        folder = 'rexvets/signatures';
        uploadConfig = { 
          transformation: { width: 300, height: 100, crop: 'fill' }
        };
        break;

      case 'licenseFile':
        fileValidation = validateFile(file, { 
          allowed_formats: ['pdf', 'jpg', 'jpeg', 'png'],
          max_bytes: 5 * 1024 * 1024 // 5MB
        });
        folder = 'rexvets/licenses';
        break;

      default:
        return NextResponse.json(
          { error: "Invalid file type" },
          { status: 400 }
        );
    }

    if (!fileValidation.valid) {
      return NextResponse.json(
        { error: fileValidation.error },
        { status: 400 }
      );
    }

    // Create prefixed filename
    const vetName = veterinarian.name || `${veterinarian.firstName || ''} ${veterinarian.lastName || ''}`.trim();
    const cleanVetName = vetName
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .toLowerCase();
    
    const lastDotIndex = file.name.lastIndexOf('.');
    const extension = lastDotIndex !== -1 ? file.name.substring(lastDotIndex) : '';
    const nameWithoutExtension = lastDotIndex !== -1 ? file.name.substring(0, lastDotIndex) : file.name;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const prefixedFilename = `${cleanVetName}_${timestamp}_${nameWithoutExtension}${extension}`;

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(file, {
      folder,
      public_id: prefixedFilename,
      ...uploadConfig
    });

    // Update veterinarian document
    const updateObject: any = {};
    
    if (fileType === 'licenseFile' && licenseIndex !== undefined) {
      // Update specific license file
      const licenses = [...(veterinarian.licenses || [])];
      if (licenseIndex >= licenses.length) {
        return NextResponse.json(
          { error: `License index ${licenseIndex} is out of bounds` },
          { status: 400 }
        );
      }
      licenses[licenseIndex].licenseFile = uploadResult.secure_url;
      updateObject.licenses = licenses;
    } else {
      // Update direct file field
      updateObject[fileType] = uploadResult.secure_url;
    }

    updateObject.updatedAt = new Date();

    const updatedVeterinarian = await VeterinarianModel.findByIdAndUpdate(
      veterinarian._id,
      { $set: updateObject },
      { 
        new: true,
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
      message: "File uploaded successfully",
      fileUrl: uploadResult.secure_url,
      veterinarian: updatedVeterinarian
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error uploading file:", error);
    
    if (error.message && error.message.includes('File')) {
      return NextResponse.json(
        { error: "File upload failed. Please check your file and try again." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to upload file. Please try again." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session: Session | null = await getServerSession(authOptions as any);
    if (!(session as any)?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to remove files." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const fileType = searchParams.get('fileType');
    const licenseIndex = searchParams.get('licenseIndex') ? parseInt(searchParams.get('licenseIndex')!) : undefined;

    if (!fileType) {
      return NextResponse.json(
        { error: "File type is required" },
        { status: 400 }
      );
    }

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
    
    if (fileType === 'licenseFile' && licenseIndex !== undefined) {
      const licenses = [...(veterinarian.licenses || [])];
      if (licenseIndex >= licenses.length) {
        return NextResponse.json(
          { error: `License index ${licenseIndex} is out of bounds` },
          { status: 400 }
        );
      }
      licenses[licenseIndex].licenseFile = null;
      updateObject.licenses = licenses;
    } else if (['profileImage', 'cv', 'signatureImage'].includes(fileType)) {
      updateObject[fileType] = null;
    } else {
      return NextResponse.json(
        { error: "Invalid file type" },
        { status: 400 }
      );
    }

    updateObject.updatedAt = new Date();

    const updatedVeterinarian = await VeterinarianModel.findByIdAndUpdate(
      veterinarian._id,
      { $set: updateObject },
      { 
        new: true,
        select: '-password -emailVerificationToken -emailVerificationExpires -passwordResetToken -passwordResetExpires -googleAccessToken -googleRefreshToken'
      }
    );

    if (!updatedVeterinarian) {
      return NextResponse.json(
        { error: "Failed to remove file" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "File removed successfully",
      veterinarian: updatedVeterinarian
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error removing file:", error);
    return NextResponse.json(
      { error: "Failed to remove file. Please try again." },
      { status: 500 }
    );
  }
}
