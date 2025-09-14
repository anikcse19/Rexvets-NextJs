// app/api/help-request/update-status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { HelpModel } from "@/models";
import { sendHelpAskingReplyFromAdmin } from "@/lib/email";

export async function PATCH(req: NextRequest) {
  try {
    await connectToDatabase();

    const { id, status, reply } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing id or status" },
        { status: 400 }
      );
    }

    // Update the help request status
    const updatedRequest = await HelpModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return NextResponse.json(
        { error: "Help request not found" },
        { status: 404 }
      );
    }

    // Send email notification to the user
    await sendHelpAskingReplyFromAdmin({
      name: updatedRequest.name,
      email: updatedRequest.email,
      subject: updatedRequest.subject,
      details: updatedRequest.details,
      status: updatedRequest.status,
      reply: updatedRequest.reply,
    });

    return NextResponse.json({
      message: "Status updated successfully and email sent",
      helpRequest: updatedRequest,
    });
  } catch (error) {
    console.error("Failed to update help request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
