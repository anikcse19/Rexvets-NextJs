import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { AppointmentModel } from "@/models/Appointment";
import { uploadToCloudinary, validateFile } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    // Validate session
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to database
    await connectToDatabase();

    // Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const appointmentId = formData.get("appointmentId") as string;
    const messageType = formData.get("messageType") as string;

    if (!file || !appointmentId || !messageType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify appointment exists and user has access
    const appointment = await AppointmentModel.findById(appointmentId);
    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    // Check authorization
    const userRefId = (session.user as any).refId;
    const isAuthorized = 
      appointment.petParent.toString() === userRefId ||
      appointment.veterinarian.toString() === userRefId;

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Not authorized to access this appointment" },
        { status: 403 }
      );
    }

    // Validate file based on message type
    let fileValidation;
    let uploadConfig: any;

    switch (messageType) {
      case "image":
        fileValidation = validateFile(file, {
          allowed_formats: ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "ico"],
          max_bytes: 5 * 1024 * 1024, // 5MB for images
        });
        uploadConfig = {
          folder: "rexvets/chat/images",
          resource_type: "image" as const,
          transformation: { width: 800, height: 800, crop: "limit" },
        };
        break;
      
      case "video":
        fileValidation = validateFile(file, {
          allowed_formats: ["mp4", "avi", "mov", "wmv", "flv", "webm", "mkv", "m4v", "3gp"],
          max_bytes: 50 * 1024 * 1024, // 50MB for videos
        });
        uploadConfig = {
          folder: "rexvets/chat/videos",
          resource_type: "video" as const,
        };
        break;
      
      case "file":
      default:
        fileValidation = validateFile(file, {
          allowed_formats: ["pdf", "doc", "docx", "txt", "xls", "xlsx", "ppt", "pptx", "zip", "rar", "7z"],
          max_bytes: 10 * 1024 * 1024, // 10MB for files
        });
        uploadConfig = {
          folder: "rexvets/chat/files",
          resource_type: "raw" as const,
          access_mode: "public" as const,
          delivery_type: "upload" as const,
          type: "upload" as const,
        };
        break;
    }

    if (!fileValidation.valid) {
      return NextResponse.json({ error: fileValidation.error }, { status: 400 });
    }

    // Create prefixed filename for better organization
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    
    // Get file extension safely
    const lastDotIndex = file.name.lastIndexOf('.');
    const fileExtension = lastDotIndex !== -1 ? file.name.substring(lastDotIndex + 1).toLowerCase() : '';
    
    // Create filename with extension for signed uploads
    const baseFilename = `chat_${appointmentId}_${timestamp}`;
    const prefixedFilename = fileExtension ? `${baseFilename}.${fileExtension}` : baseFilename;

    try {
      const uploadResult = await uploadToCloudinary(file, {
        ...uploadConfig,
        public_id: prefixedFilename,
      });

      return NextResponse.json({
        success: true,
        fileUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        fileName: file.name,
        fileSize: file.size,
        messageType: messageType,
      });

    } catch (uploadError) {
      console.error('❌ Cloudinary upload failed:', uploadError);
      return NextResponse.json(
        { error: `Upload failed: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}` },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error("❌ Error uploading chat file:", error);
    return NextResponse.json(
      { error: `Failed to upload file: ${error.message}` },
      { status: 500 }
    );
  }
}
