import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { AppointmentChatModel } from "@/models/AppointmentChat";
import type { Session } from "next-auth";

export async function POST(req: NextRequest) {
  try {
    const session: Session | null = await getServerSession(authOptions as any);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // Delete all chat documents
    const result = await AppointmentChatModel.deleteMany({});
    
    console.log(`Cleaned up ${result.deletedCount} chat documents`);

    return NextResponse.json({
      success: true,
      message: `Cleanup completed. Deleted ${result.deletedCount} chat documents.`,
    });

  } catch (error: any) {
    console.error("Cleanup error:", error);
    return NextResponse.json(
      { error: "Cleanup failed", details: error.message },
      { status: 500 }
    );
  }
}
