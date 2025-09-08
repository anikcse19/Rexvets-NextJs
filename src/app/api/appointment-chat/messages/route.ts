import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { 
  AppointmentChatModel, 
  AppointmentModel, 
  PetModel, 
  PetParentModel, 
  VeterinarianModel 
} from "@/models";
import { z } from "zod";
import NotificationModel, { NotificationType } from "@/models/Notification";
import UserModel from "@/models/User";
import { pusher } from "@/lib/pusher";
import type { Session } from "next-auth";
import { sendChatNotificationEmail } from "@/lib/email";

// Schema for sending messages
const sendMessageSchema = z.object({
  appointmentId: z.string().min(1, "Appointment ID is required"),
  content: z.string().min(1, "Message content is required"),
  messageType: z.enum(["text", "image", "video", "assessment", "prescription", "file"]).default("text"),
  attachments: z.array(z.object({
    url: z.string(),
    fileName: z.string(),
    fileSize: z.number().optional(),
  })).optional(),
});

// GET - Fetch messages for an appointment
export async function GET(req: NextRequest) {
  try {
    const session: Session | null = await getServerSession(authOptions as any);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const appointmentId = searchParams.get("appointmentId");

    if (!appointmentId) {
      return NextResponse.json({ error: "Appointment ID is required" }, { status: 400 });
    }

    // Validate appointmentId format (MongoDB ObjectId)
    if (!appointmentId.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ 
        error: "Invalid appointment ID format. Must be a valid MongoDB ObjectId (24 characters)" 
      }, { status: 400 });
    }

    // Get appointment data
    const appointment = await AppointmentModel.findById(appointmentId)
      .populate("petParent", "name email profileImage")
      .populate("veterinarian", "name email profileImage")
      .populate("pet", "name");

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    const userRole = session.user.role;
    const userRefId = (session.user as any).refId;
    
    // Extract IDs from populated objects or raw IDs
    const appointmentPetParentId = appointment.petParent?._id?.toString() || appointment.petParent?.toString();
    const appointmentVeterinarianId = appointment.veterinarian?._id?.toString() || appointment.veterinarian?.toString();

    // Check if user is authorized to access this appointment
    const isAuthorized = 
      (userRole === "pet_parent" && appointmentPetParentId === userRefId) ||
      (userRole === "veterinarian" && appointmentVeterinarianId === userRefId);

    if (!isAuthorized) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Get or create chat for this appointment
    let chat = await AppointmentChatModel.findOne({ appointmentId })
      .populate("messages.senderId")
      .sort({ "messages.createdAt": 1 });

    if (!chat) {
      // Create new chat if it doesn't exist
      chat = await AppointmentChatModel.create({
        appointmentId,
        petParentId: appointmentPetParentId,
        veterinarianId: appointmentVeterinarianId,
        messages: [],
      });
    }

    // Mark messages as read for the other party
    if (chat.messages.length > 0) {
      const updatedMessages = chat.messages.map((message: any) => {
        if (message.senderId.toString() !== userRefId && !message.isRead) {
          return { ...message.toObject(), isRead: true };
        }
        return message;
      });
      
      chat.messages = updatedMessages;
      await chat.save();
    }

    return NextResponse.json({
      messages: chat.messages,
      appointment: {
        id: appointment._id,
        petParentName: "Pet Parent",
        veterinarianName: "Veterinarian",
        petName: appointment.pet?.name || "Pet",
        appointmentDate: appointment.appointmentDate,
      },
    });

  } catch (error: any) {
    console.error("Error fetching appointment messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST - Send a new message
export async function POST(req: NextRequest) {
  try {
    const session: Session | null = await getServerSession(authOptions as any);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const body = await req.json();
    const validatedData = sendMessageSchema.parse(body);

    const { appointmentId, content, messageType, attachments } = validatedData;
    const userRole = session.user.role;

    // Validate appointmentId format (MongoDB ObjectId)
    if (!appointmentId.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ 
        error: "Invalid appointment ID format. Must be a valid MongoDB ObjectId (24 characters)" 
      }, { status: 400 });
    }

    // Verify appointment exists and user has access
    const appointment = await AppointmentModel.findById(appointmentId)
      .populate("petParent", "name email profileImage")
      .populate("veterinarian", "name email profileImage")
      .populate("pet", "name");

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    const userRefId = (session.user as any).refId;
    
    // Extract IDs from populated objects or raw IDs
    const appointmentPetParentId = appointment.petParent?._id?.toString() || appointment.petParent?.toString();
    const appointmentVeterinarianId = appointment.veterinarian?._id?.toString() || appointment.veterinarian?.toString();

    // Check if user is authorized to send messages for this appointment
    const isAuthorized = 
      (userRole === "pet_parent" && appointmentPetParentId === userRefId) ||
      (userRole === "veterinarian" && appointmentVeterinarianId === userRefId);

    if (!isAuthorized) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Get user details for the message from session
    let senderName = "";
    let senderImage = "";

    if (userRole === "pet_parent") {
      senderName = session.user.name || "Pet Parent";
      senderImage = session.user.image || "";
    } else if (userRole === "veterinarian") {
      senderName = session.user.name || "Veterinarian";
      senderImage = session.user.image || "";
    }

    // Get or create chat
    let chat = await AppointmentChatModel.findOne({ appointmentId });
    if (!chat) {
      chat = await AppointmentChatModel.create({
        appointmentId,
        petParentId: appointmentPetParentId,
        veterinarianId: appointmentVeterinarianId,
        messages: [],
      });
    }

    // Create new message
    const newMessage = {
      appointmentId,
      senderId: userRefId,
      senderType: userRole as "pet_parent" | "veterinarian",
      senderName,
      senderImage,
      content,
      messageType,
      attachments: validatedData.attachments || [],
      isRead: false,
      isDelivered: true,
    };

    // Add message to chat
    chat.messages.push(newMessage);
    chat.lastMessageAt = new Date();
    await chat.save();

    // Return the new message
    const savedMessage = chat.messages[chat.messages.length - 1];

    // Trigger Pusher event for real-time chat update
    try {
      await pusher.trigger(`appointment-${appointmentId}`, "new-message", {
        message: savedMessage
      });
    } catch (pusherErr) {
      console.error("[PUSHER] Failed to trigger chat event", pusherErr);
    }

    // Create notification for receiver
    try {
      const receiverRefId =
        userRole === "pet_parent" ? appointmentVeterinarianId : appointmentPetParentId;

      // Map refId -> User _id (one-time lookup)
      const receiverUser = await UserModel.findOne({
        $or: [
          { veterinarianRef: receiverRefId },
          { petParentRef: receiverRefId },
          { vetTechRef: receiverRefId },
        ],
      }).select({ _id: 1, email: 1, name: 1, isOnline: 1 });

      if (receiverUser) {
        await NotificationModel.create({
          type: NotificationType.NEW_MESSAGE,
          title: "New chat message--",
          subTitle: `${appointment.pet?.name || "Pet"}: ${content}`,
          recipientId: receiverUser._id,
          actorId: session.user.id,
          appointmentId: appointmentId,
          data: { appointmentId },
        });

        // Push realtime notification event
        await pusher.trigger(`user-${receiverUser._id.toString()}`, "new-notification", {
          appointmentId,
        });

        // Send email notification ONLY if user is offline
        if (receiverUser.email && (!receiverUser.isOnline)) {
          await sendChatNotificationEmail({
            to: receiverUser.email,
            recipientName: receiverUser.name || "there",
            senderName: senderName,
            isToDoctor: userRole === "pet_parent",
            appointmentId: appointmentId,
          });
        }
      }
    } catch (notifErr) {
      console.error("[NOTIFICATION] Failed to create notification", notifErr);
    }

    return NextResponse.json({
      message: savedMessage,
      success: true,
    });

  } catch (error: any) {
    console.error("Error sending message:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
