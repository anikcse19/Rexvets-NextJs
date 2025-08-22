import { NextRequest, NextResponse } from "next/server";

import { uploadToCloudinary } from "@/lib/cloudinary";
import { IMessage, MessageSenderType } from "@/lib/interfaces";
import { connectToDatabase } from "@/lib/mongoose";
import { pusher } from "@/lib/pusher";
import { MessageModel } from "@/models/Message";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const receiverId = searchParams.get("receiverId");

    if (!receiverId) {
      return NextResponse.json(
        { success: false, error: "Receiver ID is required" },
        { status: 400 }
      );
    }

    const messages = await MessageModel.find({
      $or: [
        { isAdmin: true, vetParent: receiverId },
        { isAdmin: false, vetParent: receiverId },
      ],
    })
      .populate("vetParent")
      .sort({ createdAt: 1 });

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const formData = await req.formData();
    const senderType = formData.get("senderType") as MessageSenderType;
    const isAdmin = senderType === MessageSenderType.Admin;
    const vetParentId = formData.get("vetParentId") as string | null;
    const content = formData.get("content") as string;
    const files = formData.getAll("files") as File[];

    // Upload files to Cloudinary
    const attachments = [];
    for (const file of files) {
      const result = await uploadToCloudinary(file, { resource_type: "auto" });
      attachments.push({
        url: result.secure_url,
        public_id: result.public_id,
        type: result.resource_type as "image" | "video" | "audio" | "other",
      });
    }

    // Create message
    const message = await MessageModel.create({
      isAdmin,
      senderType,
      vetParent: !isAdmin ? vetParentId : undefined,
      content,
      attachments,
    });

    // Trigger Pusher
    if (isAdmin && vetParentId) {
      // Notify specific PetParent
      pusher.trigger(`petParent-${vetParentId}`, "new-message", message);
    } else if (!isAdmin) {
      // Notify all admins
      pusher.trigger("admins", "new-message", message);
    }

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
