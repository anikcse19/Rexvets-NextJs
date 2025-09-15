import { authOptions } from "@/lib/auth";
import { sendVetProfileInfoEmail } from "@/lib/email";
import { connectToDatabase } from "@/lib/mongoose";
import { IErrorResponse, sendResponse, throwAppError } from "@/lib/utils/send.response";
import { NotificationModel, NotificationType, UserModel, VeterinarianModel } from "@/models";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

// Creates a notification to a vet requesting profile info and sends an email
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      const err: IErrorResponse = {
        success: false,
        message: "Unauthorized",
        errorCode: "UNAUTHORIZED",
        errors: null,
      };
      return throwAppError(err, 401);
    }

    const body = await req.json();
    const { vetId, reason, missingFields } = body as {
      vetId?: string;
      reason?: string;
      missingFields?: string[];
    };

    if (!vetId || !Types.ObjectId.isValid(vetId)) {
      const err: IErrorResponse = {
        success: false,
        message: "Invalid veterinarian ID",
        errorCode: "INVALID_VET_ID",
        errors: null,
      };
      return throwAppError(err, 400);
    }

    // Load vet and associated user
    const [vetDoc, vetUserRaw] = await Promise.all([
      VeterinarianModel.findById(vetId).lean(),
      UserModel.findOne({
        veterinarianRef: new Types.ObjectId(vetId),
        isActive: true,
        isDeleted: false,
      })
        .select("_id email name")
        .lean(),
    ]);

    const vetUser = (vetUserRaw || null) as unknown as
      | { _id: Types.ObjectId; email?: string; name?: string }
      | null;

    if (!vetDoc || !vetUser) {
      const err: IErrorResponse = {
        success: false,
        message: "Veterinarian or user not found",
        errorCode: "VET_OR_USER_NOT_FOUND",
        errors: null,
      };
      return throwAppError(err, 404);
    }

    const notification = await NotificationModel.create({
      type: NotificationType.VET_PROFILE_INFO_REQUEST,
      title: "Action required: complete your profile",
      subTitle: reason || "Missing information",
      body: reason || "Please update your profile information.",
      recipientId: new Types.ObjectId(vetUser._id),
      actorId: new Types.ObjectId((session.user as any)._id),
      vetId: new Types.ObjectId(vetId),
      data: { reason },
    });

    // Send email to vet using dedicated template
    if (vetUser && vetUser.email) {
      try {
        await sendVetProfileInfoEmail({
          to: vetUser.email as unknown as string,
          doctorName: vetUser.name || "Doctor",
          missingFields: Array.isArray(missingFields) ? missingFields : [],
        });
      } catch (e) {
        console.warn("Failed to send vet profile info email:", e);
      }
    }

    return sendResponse({
      statusCode: 201,
      success: true,
      message: "Profile info request notification sent to veterinarian",
      data: notification,
    });
  } catch (error: any) {
    console.error("Error creating vet profile info notification:", error);
    return throwAppError(
      {
        success: false,
        message: error?.message || "Internal Server Error",
        errorCode: "VET_PROFILE_INFO_REQUEST_ERROR",
        errors: null,
      },
      500
    );
  }
}


