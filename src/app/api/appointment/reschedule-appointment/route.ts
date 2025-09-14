import { authOptions } from "@/lib/auth";
import { sendAppointmentConfirmationEmails } from "@/lib/email";
import { sendPushNotification } from "@/lib/firebase/sendPush";
import { connectToDatabase } from "@/lib/mongoose";
import {
    IErrorResponse,
    ISendResponse,
    sendResponse,
    throwAppError,
} from "@/lib/utils/send.response";
import {
    INotification,
    NotificationModel,
    NotificationType,
    UserModel,
    VeterinarianModel,
} from "@/models";
import { AppointmentModel } from "@/models/Appointment";
import { AppointmentSlot, SlotStatus } from "@/models/AppointmentSlot";
import { PetModel } from "@/models/Pet";
import PetParent from "@/models/PetParent";
import moment from "moment-timezone";
import mongoose, { Types } from "mongoose";
import { getServerSession } from "next-auth/next";
import { NextRequest } from "next/server";
import z from "zod";

// Validation schema for reschedule request
const rescheduleAppointmentSchema = z.object({
  appointmentId: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid appointment ID",
  }),
  selectedSlot: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid slot ID",
  }),
});

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const sessionDb = await mongoose.startSession();
    sessionDb.startTransaction();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Unauthorized",
        errorCode: "UNAUTHORIZED",
        errors: null,
      };
      await sessionDb.abortTransaction();
      sessionDb.endSession();
      return throwAppError(errResp, 401);
    }

    const body = await req.json();
    console.log("Reschedule request body:", body);
    
    const parsed = rescheduleAppointmentSchema.safeParse(body);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((e) => {
        if (e.path[0]) errors[e.path[0].toString()] = e.message;
      });
      
      const errResp: IErrorResponse = {
        success: false,
        message: "Validation failed",
        errorCode: "VALIDATION_ERROR",
        errors,
      };
      await sessionDb.abortTransaction();
      sessionDb.endSession();
      return throwAppError(errResp, 400);
    }

    const { appointmentId, selectedSlot } = parsed.data;

    // Find the existing appointment
    const existingAppointment = await AppointmentModel.findOne({
      _id: appointmentId,
      isDeleted: false,
    })
      .populate("veterinarian", "name email specialization")
      .populate("petParent", "name email phone")
      .populate("pet", "name species breed gender weight age")
      .session(sessionDb);

    if (!existingAppointment) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Appointment not found",
        errorCode: "APPOINTMENT_NOT_FOUND",
        errors: null,
      };
      await sessionDb.abortTransaction();
      sessionDb.endSession();
      return throwAppError(errResp, 404);
    }

    // Find the new slot
    const newSlot = await AppointmentSlot.findOne({
      _id: selectedSlot,
      status: SlotStatus.AVAILABLE,
      vetId: existingAppointment.veterinarian._id,
    }).session(sessionDb);

    if (!newSlot) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Selected slot is not available",
        errorCode: "SLOT_NOT_AVAILABLE",
        errors: null,
      };
      await sessionDb.abortTransaction();
      sessionDb.endSession();
      return throwAppError(errResp, 404);
    }

    // Check if the slot date is in the past
    const newSlotDate = new Date(newSlot.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
    
    if (newSlotDate < today) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Cannot reschedule to a past date",
        errorCode: "PAST_DATE_SLOT",
        errors: null,
      };
      await sessionDb.abortTransaction();
      sessionDb.endSession();
      return throwAppError(errResp, 400);
    }

    // Additional check: if it's today, check if the time has passed
    if (newSlotDate.getTime() === today.getTime()) {
      const currentTime = new Date();
      const slotDateTime = moment
        .tz(`${moment(newSlotDate).format("YYYY-MM-DD")}T${newSlot.startTime}:00`, newSlot.timezone || "UTC")
        .toDate();
      
      if (slotDateTime < currentTime) {
        const errResp: IErrorResponse = {
          success: false,
          message: "Cannot reschedule to a time that has already passed",
          errorCode: "PAST_TIME_SLOT",
          errors: null,
        };
        await sessionDb.abortTransaction();
        sessionDb.endSession();
        return throwAppError(errResp, 400);
      }
    }

    // Find the old slot to free it up
    const oldSlot = await AppointmentSlot.findOne({
      _id: existingAppointment.slotId,
    }).session(sessionDb);

    if (oldSlot) {
      oldSlot.status = SlotStatus.AVAILABLE;
      await oldSlot.save({ validateBeforeSave: false, session: sessionDb });
    }

    // Update the appointment with new slot details
    const appointmentSlotDate = new Date(newSlot.date);
    const timezone = newSlot.timezone || "UTC";

    // Convert the slot date to the slot's timezone to get the correct local date
    const slotDateInTimezone = moment.tz(appointmentSlotDate, timezone);
    const dateString = slotDateInTimezone.format("YYYY-MM-DD");

    // Create the appointment date in the slot's timezone
    const appointmentDateTime = moment
      .tz(`${dateString}T${newSlot.startTime}:00`, timezone)
      .toDate();

    // Update appointment with new details
    existingAppointment.appointmentDate = appointmentDateTime;
    existingAppointment.slotId = new Types.ObjectId(selectedSlot);
    existingAppointment.updatedAt = new Date();

    // Generate new meeting link
    const link_URL =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://rexvets-nextjs.vercel.app";

    const meetingLink = `${link_URL}/video-call/?appointmentId=${encodeURIComponent(
      existingAppointment._id
    )}&vetId=${encodeURIComponent(
      existingAppointment.veterinarian._id
    )}&petId=${encodeURIComponent(
      existingAppointment.pet._id
    )}&petParentId=${encodeURIComponent(existingAppointment.petParent._id)}`;

    existingAppointment.meetingLink = meetingLink;
    await existingAppointment.save({ validateBeforeSave: true, session: sessionDb });

    // Mark new slot as booked
    newSlot.status = SlotStatus.BOOKED;
    await newSlot.save({ validateBeforeSave: false, session: sessionDb });

    // Create notification for the veterinarian
    const vetUser = (await UserModel.findOne({
      veterinarianRef: new Types.ObjectId(existingAppointment.veterinarian._id),
      isActive: true,
      isDeleted: false,
    })
      .select("_id fcmTokens name")
      .session(sessionDb)
      .lean()) as unknown as {
      _id: Types.ObjectId;
      fcmTokens?: { web?: string };
    } | null;

    const notificationPayload: INotification = {
      type: NotificationType.APPOINTMENT_RESCHEDULED,
      title: "APPOINTMENT RESCHEDULED",
      subTitle: "Schedule Update",
      body: `Your appointment with ${
        existingAppointment.petParent?.name || "Pet Parent"
      } has been rescheduled`,
      recipientId: new Types.ObjectId(vetUser?._id),
      actorId: new Types.ObjectId(existingAppointment.petParent._id),
      data: {
        appointmentId: existingAppointment._id,
        vetId: new Types.ObjectId(existingAppointment.veterinarian._id),
        petId: new Types.ObjectId(existingAppointment.pet._id),
        petParentId: new Types.ObjectId(existingAppointment.petParent._id),
        rescheduledAt: new Date().toISOString(),
        newAppointmentDate: appointmentDateTime.toISOString(),
      },
    };

    await NotificationModel.create([notificationPayload], {
      session: sessionDb,
    });

    // Commit DB work before attempting external calls
    await sessionDb.commitTransaction();
    sessionDb.endSession();

    // Send confirmation emails (fire-and-forget)
    (async () => {
      try {
        const apptDate = moment(appointmentDateTime).format("YYYY-MM-DD");
        const apptTime = moment(appointmentDateTime).format("HH:mm");

        await sendAppointmentConfirmationEmails({
          doctorEmail: (existingAppointment.veterinarian as any)?.email,
          doctorName: (existingAppointment.veterinarian as any)?.name || "Doctor",
          parentEmail: (existingAppointment.petParent as any)?.email,
          parentName: (existingAppointment.petParent as any)?.name || "Pet Parent",
          petName: (existingAppointment.pet as any)?.name || "Pet",
          appointmentDate: apptDate,
          appointmentTime: apptTime,
          meetingLink,
        });
      } catch (e) {
        console.error("Failed to send reschedule confirmation emails:", e);
      }
    })();

  
    const response: ISendResponse<any> = {
      success: true,
      data: {
        appointment: existingAppointment,
        rescheduledAt: new Date().toISOString(),
        newAppointmentDate: appointmentDateTime,
        newSlot: {
          id: newSlot._id,
          date: newSlot.date,
          startTime: newSlot.startTime,
          endTime: newSlot.endTime,
          timezone: newSlot.timezone,
        },
      },
      statusCode: 200,
      message: "Appointment rescheduled successfully",
    };

    return sendResponse(response);
  } catch (err: any) {
    console.error("Error rescheduling appointment:", err.message);
    
    // Best-effort rollback if session exists
    try {
      const currentSession = (mongoose as any).connection?.clientSession;
      if (currentSession) {
        await currentSession.abortTransaction();
        currentSession.endSession();
      }
    } catch {}

    if (err.name === "ValidationError") {
      const errors: Record<string, string | undefined> = {};
      for (const key in err.errors) {
        errors[key] = err.errors[key].message;
      }
      const errResp: IErrorResponse = {
        success: false,
        message: "Validation failed",
        errorCode: "VALIDATION_ERROR",
        errors,
      };
      return throwAppError(errResp, 400);
    }

    const errResp: IErrorResponse = {
      success: false,
      message: "Internal server error",
      errorCode: "INTERNAL_SERVER_ERROR",
      errors: null,
    };
    return throwAppError(errResp, 500);
  }
}
