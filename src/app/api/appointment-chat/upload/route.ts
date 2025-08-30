import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { uploadToCloudinary, validateFile } from "@/lib/cloudinary";
import { AppointmentModel } from "@/models/Appointment";
import { z } from "zod";
import type { Session } from "next-auth";

// Schema for file upload validation
const fileUploadSchema = z.object({
  appointmentId: z.string().min(1, "Appointment ID is required"),
  messageType: z.enum(["image", "video", "file"]).default("file"),
});

export async function POST(req: NextRequest) {
  try {
    const session: Session | null = await getServerSession(authOptions as any);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const appointmentId = formData.get('appointmentId') as string;
    const messageType = formData.get('messageType') as string;

    // Validate request data
    const validation = fileUploadSchema.safeParse({ appointmentId, messageType });
    if (!validation.success) {
      return NextResponse.json({ 
        error: "Invalid request data", 
        details: validation.error.issues 
      }, { status: 400 });
    }

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Verify appointment exists and user has access
    const appointment = await AppointmentModel.findById(appointmentId)
      .populate("petParent", "name email")
      .populate("veterinarian", "name email");

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    const userRefId = (session.user as any).refId;
    const appointmentPetParentId = appointment.petParent?._id?.toString();
    const appointmentVeterinarianId = appointment.veterinarian?._id?.toString();

    // Check if user is authorized to upload files for this appointment
    const isAuthorized = 
      (session.user.role === "pet_parent" && appointmentPetParentId === userRefId) ||
      (session.user.role === "veterinarian" && appointmentVeterinarianId === userRefId);

    if (!isAuthorized) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Validate file based on message type
    let fileValidation;
    let uploadConfig: any;

    switch (messageType) {
      case "image":
        fileValidation = validateFile(file, {
          allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
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
          allowed_formats: ["mp4", "avi", "mov", "wmv", "flv", "webm"],
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
          allowed_formats: ["pdf", "doc", "docx", "txt", "xls", "xlsx", "ppt", "pptx"],
          max_bytes: 10 * 1024 * 1024, // 10MB for files
        });
        uploadConfig = {
          folder: "rexvets/chat/files",
          resource_type: "raw" as const,
        };
        break;
    }

    if (!fileValidation.valid) {
      return NextResponse.json({ error: fileValidation.error }, { status: 400 });
    }

    // Create prefixed filename for better organization
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const fileExtension = file.name.split('.').pop();
    const prefixedFilename = `chat_${appointmentId}_${timestamp}.${fileExtension}`;

    // Upload to Cloudinary
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

  } catch (error: any) {
    console.error("Error uploading chat file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
