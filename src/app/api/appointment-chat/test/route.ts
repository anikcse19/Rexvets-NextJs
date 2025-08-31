import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { AppointmentChatModel } from "@/models/AppointmentChat";
import { AppointmentModel } from "@/models/Appointment";
import type { Session } from "next-auth";

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

    // Check if appointment exists
    const appointment = await AppointmentModel.findById(appointmentId);
    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    // Check if chat exists
    const chat = await AppointmentChatModel.findOne({ appointmentId });
    
    return NextResponse.json({
      appointmentExists: !!appointment,
      chatExists: !!chat,
      appointmentId,
      userId: session.user.id,
      userRole: session.user.role,
      message: "Appointment chat system is working correctly"
    });

  } catch (error) {
    console.error("Test endpoint error:", error);
    return NextResponse.json(
      { error: "Test failed", details: error },
      { status: 500 }
    );
  }
}
