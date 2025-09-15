import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { AnnouncementModel } from "@/models/Announcement";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { value } = await req.json();

    console.log("Reaction API - User:", session.user.id, "Role:", session.user.role, "Value:", value);

    if (!value || !["positive", "negative", "neutral"].includes(value)) {
      return NextResponse.json(
        { success: false, message: "Invalid reaction value" },
        { status: 400 }
      );
    }

    const announcement = await AnnouncementModel.findById(id);
    
    if (!announcement) {
      return NextResponse.json(
        { success: false, message: "Announcement not found" },
        { status: 404 }
      );
    }

    // Remove existing reaction from this user
    announcement.reactions = announcement.reactions.filter(
      (reaction: any) => 
        !(reaction.user.toString() === session.user.id && reaction.role === session.user.role)
    );

    // Add new reaction
    announcement.reactions.push({
      user: session.user.id,
      role: session.user.role,
      value: value,
      reactedAt: new Date(),
    });

    await announcement.save();

    return NextResponse.json({ 
      success: true, 
      message: "Reaction updated successfully",
      data: announcement 
    });
  } catch (err: any) {
    console.error("Error updating reaction:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 400 }
    );
  }
}