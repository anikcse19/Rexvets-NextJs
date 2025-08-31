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

    // Only allow admin or specific users to run migration
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    await connectToDatabase();

    // Find all chat documents
    const chats = await AppointmentChatModel.find({});
    console.log(`Found ${chats.length} chat documents`);

    let migratedCount = 0;

    for (const chat of chats) {
      let needsUpdate = false;
      
      // Check each message in the chat
      for (const message of chat.messages) {
        if (message.attachments && Array.isArray(message.attachments)) {
          // Check if attachments are in the old string format
          const hasOldFormat = message.attachments.some((att: any) => typeof att === 'string');
          
          if (hasOldFormat) {
            console.log(`Found old format attachments in message ${message._id}`);
            // Convert old string format to new object format
            message.attachments = message.attachments.map((att: any) => {
              if (typeof att === 'string') {
                return {
                  url: att,
                  fileName: 'Unknown file',
                };
              }
              return att;
            });
            needsUpdate = true;
          }
        }
      }

      if (needsUpdate) {
        await chat.save();
        migratedCount++;
        console.log(`Migrated chat ${chat._id}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Migration completed. Updated ${migratedCount} chat documents.`,
      totalChats: chats.length,
      migratedChats: migratedCount,
    });

  } catch (error: any) {
    console.error("Migration error:", error);
    return NextResponse.json(
      { error: "Migration failed", details: error.message },
      { status: 500 }
    );
  }
}
