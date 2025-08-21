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

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const {
      receiverId,
      message,
    }: { receiverId: string; message: Partial<IMessage> } =
      await request.json();

    if (!receiverId || !message.content) {
      return NextResponse.json(
        {
          success: false,
          error: "Receiver ID and message content are required",
        },
        { status: 400 }
      );
    }

    const newMessage = new MessageModel({
      ...message,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newMessage.save();

    // Trigger Pusher event
    await pusher.trigger(`chat-${receiverId}`, "new-message", newMessage);

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}

export async function POST_upload(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    const result = await uploadToCloudinary(file, { resource_type: "auto" });

    return NextResponse.json({ success: true, url: result.secure_url });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
