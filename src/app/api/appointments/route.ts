import { authOptions } from "@/lib/auth";
import { sendAppointmentConfirmationEmails } from "@/lib/email";
import { sendPushNotification } from "@/lib/firebase/sendPush";
import { connectToDatabase } from "@/lib/mongoose";
import { generateDonationReceiptPdf } from "@/lib/pdf/generatePdf";
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
import DonationModel from "@/models/Donation";
import { PetModel } from "@/models/Pet";
import PetParent from "@/models/PetParent";
import User from "@/models/User";
import "@/models/Veterinarian";
import moment from "moment-timezone";
import mongoose, { Types } from "mongoose";
import { getServerSession } from "next-auth/next";
import { NextRequest } from "next/server";
import z from "zod";

const appointmentSchema = z.object({
  veterinarian: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid veterinarian ID",
  }),
  petParent: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid pet owner ID",
  }),
  pet: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid pet ID",
  }),

  notes: z.string().optional(),
  feeUSD: z.number().min(0).default(0),
  status: z.string().optional(),
  isFollowUp: z.boolean().optional(),
  appointmentType: z.string().optional(),
  paymentStatus: z.string().optional(),
  reminderSent: z.boolean().optional(),
  slotId: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid slot ID",
  }),
  concerns: z.array(z.string()).min(1, "At least one concern is required"),
});
// This is the appointment creation route
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
    // Note: current user's token is not used for notifying the vet; we will fetch vet's user token later
    const body = await req.json();
    console.log("Body:---------------------------****", body);
    const parsed = appointmentSchema.safeParse(body);
    console.log("Parsed:---------------------------*****", parsed);
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
    const slotId = body.slotId;
    const existingSlot = await AppointmentSlot.findOne({
      _id: slotId,
      status: SlotStatus.AVAILABLE,
      vetId: body.veterinarian,
    }).session(sessionDb);

    if (!existingSlot) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Slot not available",
        errorCode: "SLOT_NOT_AVAILABLE",
        errors: null,
      };
      await sessionDb.abortTransaction();
      sessionDb.endSession();
      return throwAppError(errResp, 404);
    }
    // First try to find by the provided veterinarian ID
    let existingVet = await VeterinarianModel.findOne({
      _id: body.veterinarian,
      isActive: true,
    }).session(sessionDb);

    // If not found and user is a veterinarian, try to find by session user's refId
    if (
      !existingVet &&
      (session.user as any)?.refId &&
      session.user.role === "veterinarian"
    ) {
      existingVet = await VeterinarianModel.findOne({
        _id: (session.user as any).refId,
        isActive: true,
      });

      if (existingVet) {
        // Update the body to use the correct Veterinarian ID
        body.veterinarian = (session.user as any).refId;
      }
    }
    if (!existingVet) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Veterinarian not found or inactive",
        errorCode: "VET_NOT_FOUND",
        errors: null,
      };
      await sessionDb.abortTransaction();
      sessionDb.endSession();
      return throwAppError(errResp, 404);
    }
    // First try to find by the provided petParent ID
    let existingPetOwner = await PetParent.findOne({
      _id: body.petParent,
    }).session(sessionDb);

    // If not found, try to find by the session user's refId (PetParent ID)
    if (!existingPetOwner && (session.user as any)?.refId) {
      existingPetOwner = await PetParent.findOne({
        _id: (session.user as any).refId,
      }).session(sessionDb);

      if (existingPetOwner) {
        // Update the body to use the correct PetParent ID
        body.petParent = (session.user as any).refId;
      }
    }
    if (!existingPetOwner) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Pet owner not found or inactive",
        errorCode: "PET_OWNER_NOT_FOUND",
        errors: null,
      };
      await sessionDb.abortTransaction();
      sessionDb.endSession();
      return throwAppError(errResp, 404);
    }
    const {
      veterinarian,
      petParent,
      pet,
      notes,
      feeUSD,
      isFollowUp,
      appointmentType,
      paymentStatus,
      reminderSent,
      slotId: appointmentSlotId,
      concerns,
    } = parsed.data;
    console.log("existingSlot.date", existingSlot.date);
    console.log("existingSlot.startTime", existingSlot.startTime);

    // Create appointment document with proper timezone handling
    const slotDate = new Date(existingSlot.date);
    const timezone = existingSlot.timezone || "UTC";

    // Convert the slot date to the slot's timezone to get the correct local date
    const slotDateInTimezone = moment.tz(slotDate, timezone);
    const dateString = slotDateInTimezone.format("YYYY-MM-DD");

    // Create the appointment date in the slot's timezone
    const appointmentDateTime = moment
      .tz(`${dateString}T${existingSlot.startTime}:00`, timezone)
      .toDate();

    console.log("Slot date in timezone:", slotDateInTimezone.format());
    console.log("Slot date string:", dateString);
    console.log("Created appointment date:", appointmentDateTime);
    console.log("Slot timezone:", timezone);
    console.log("Current time:", new Date());

    const appointment = new AppointmentModel({
      veterinarian: new Types.ObjectId(veterinarian),
      petParent: new Types.ObjectId(petParent),
      pet: new Types.ObjectId(pet),
      appointmentDate: appointmentDateTime,
      notes,
      feeUSD,
      isFollowUp,
      appointmentType,
      paymentStatus,
      reminderSent,
      slotId: new Types.ObjectId(appointmentSlotId),
      concerns,
    });
    await appointment.validate();
    const newAppointment = await appointment.save({ session: sessionDb });
    const link_URL =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://rexvets-nextjs.vercel.app";

    // Generate meeting link
    const meetingLink = `${link_URL}/video-call/?appointmentId=${encodeURIComponent(
      newAppointment._id
    )}&vetId=${encodeURIComponent(veterinarian)}&petId=${encodeURIComponent(
      pet
    )}&petParentId=${encodeURIComponent(petParent)}`;

    // Save meetingLink to the appointment
    newAppointment.meetingLink = meetingLink;
    await newAppointment.save({ validateBeforeSave: true, session: sessionDb });
    existingSlot.status = SlotStatus.BOOKED;
    await existingSlot.save({ validateBeforeSave: false, session: sessionDb });
    // Fire-and-forget confirmation emails with donation receipt PDF (do not block response)
    (async () => {
      try {
        const [vetDoc, parentDoc, petDoc] = await Promise.all([
          VeterinarianModel.findById(veterinarian).lean(),
          PetParent.findById(petParent).lean(),
          PetModel.findById(pet).lean(),
        ]);

        const vetEmail = (vetDoc as any)?.email;
        const parentEmail = (parentDoc as any)?.email;
        if (vetEmail && parentEmail) {
          const apptDate = moment(appointmentDateTime).format("YYYY-MM-DD");
          const apptTime = moment(appointmentDateTime).format("HH:mm");

          // Find the latest donation for this pet parent to generate receipt
          let donationPdfBuffer: Buffer | undefined = undefined;
          try {
            console.log("Looking for donation with parentId:", petParent);

            // Try to find by parentId first
            let latestDonation = await DonationModel.findOne(
              { parentId: petParent, status: "succeeded" },
              {},
              { sort: { timestamp: -1 } }
            ).lean();

            // If not found, try to find by email
            if (!latestDonation && parentEmail) {
              console.log(
                "No donation found by parentId, trying email:",
                parentEmail
              );
              latestDonation = await DonationModel.findOne(
                { donorEmail: parentEmail, status: "succeeded" },
                {},
                { sort: { timestamp: -1 } }
              ).lean();
            }

            // If still not found, try any recent successful donation
            if (!latestDonation) {
              console.log(
                "No donation found by parentId or email, trying any recent donation"
              );
              latestDonation = await DonationModel.findOne(
                { status: "succeeded" },
                {},
                { sort: { timestamp: -1 } }
              ).lean();
            }

            console.log("Found donation:", latestDonation ? "Yes" : "No");

            if (latestDonation) {
              // Generate donation receipt PDF
              const donation = latestDonation as any;
              const paymentMethod = donation.paymentMethodLast4
                ? `Card ending in ${donation.paymentMethodLast4}`
                : "Credit Card";

              // Log full donation object to debug
              console.log(
                "Full donation object:",
                JSON.stringify(donation, null, 2)
              );

              // Log donation details to verify isRecurring flag
              console.log("Donation details for PDF:", {
                donorName: donation.donorName,
                amount: donation.donationAmount,
                isRecurring: donation.isRecurring,
                isRecurringType: typeof donation.isRecurring,
                isRecurringStringified: String(donation.isRecurring),
              });

              // Force isRecurring to be explicitly false unless it's explicitly true
              // This is a temporary fix for existing donations that might have incorrect isRecurring values
              const hasSubscriptionId = !!donation.subscriptionId;
              const isRecurringDonation = hasSubscriptionId;

              console.log("Subscription ID:", donation.subscriptionId);
              console.log("Has subscription:", hasSubscriptionId);
              console.log("Original isRecurring value:", donation.isRecurring);
              console.log(
                "Final isRecurring value being used:",
                isRecurringDonation
              );

              donationPdfBuffer = await generateDonationReceiptPdf({
                donorName: donation.donorName,
                amount: donation.donationAmount,
                receiptNumber:
                  donation.transactionID || donation._id.toString(),
                isRecurring: isRecurringDonation,
                badgeName: "Supporter",
                date: moment(donation.timestamp).format("YYYY-MM-DD"),
                paymentMethod,
              });
            }
          } catch (pdfError) {
            console.error("Failed to generate donation receipt PDF:", pdfError);
            // Continue without PDF if generation fails
          }

          console.log(
            "Donation PDF buffer:",
            donationPdfBuffer ? "Generated successfully" : "Not available"
          );

          await sendAppointmentConfirmationEmails({
            doctorEmail: vetEmail,
            doctorName: (vetDoc as any).name || "Doctor",
            parentEmail: parentEmail,
            parentName: (parentDoc as any).name || "Pet Parent",
            petName: (petDoc as any)?.name || "Pet",
            appointmentDate: apptDate,
            appointmentTime: apptTime,
            meetingLink,
            donationPdfBuffer, // Add PDF attachment if available
          });
        }
      } catch (e) {
        console.error("Failed to send appointment confirmation emails:", e);
      }
    })();
    // Find the veterinarian's user to target notification correctly
    const vetUser = (await UserModel.findOne({
      veterinarianRef: new Types.ObjectId(veterinarian),
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
      type: NotificationType.NEW_APPOINTMENT,
      title: "New Appointment",
      body: `You have a new appointment with ${
        existingPetOwner?.name || "Pet Parent"
      }`,
      recipientId: new Types.ObjectId(vetUser?._id),
      actorId: new Types.ObjectId(petParent),
      data: {
        appointmentId: newAppointment._id,
      },
    };
    await NotificationModel.create([notificationPayload], {
      session: sessionDb,
    });

    // Commit DB work before attempting external calls
    await sessionDb.commitTransaction();
    sessionDb.endSession();

    // After commit: try sending web push notification to the veterinarian, if token exists
    if (vetUser?.fcmTokens?.web) {
      try {
        await sendPushNotification({
          token: vetUser.fcmTokens.web as unknown as string,
          title: "New Appointment",
          body: `You have a new appointment with ${
            existingPetOwner?.name || "Pet Parent"
          }`,
          page: `/dashboard/doctor/appointments?appointmentId=${newAppointment._id}`,
        });
      } catch (pushErr) {
        console.error("Failed to send web push notification:", pushErr);
      }
    }
    const response: ISendResponse<any> = {
      success: true,
      data: newAppointment,
      statusCode: 201,
      message: "Appointment created successfully",
    };
    return sendResponse(response);
  } catch (err: any) {
    console.error("Error creating appointment:", err.message);
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

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    // Filters
    const status = searchParams.get("status"); // scheduled, completed, etc.
    const appointmentType = searchParams.get("appointmentType");
    const paymentStatus = searchParams.get("paymentStatus");
    const vet = searchParams.get("veterinarian");
    const owner = searchParams.get("petParent");
    const isFollowUp = searchParams.get("isFollowUp");
    const search = searchParams.get("search");
    const minFee = parseFloat(searchParams.get("minFee") || "0");
    const maxFee = parseFloat(searchParams.get("maxFee") || "3000");

    // Build query
    const query: any = {
      isDeleted: false,
      feeUSD: { $gte: minFee, $lte: maxFee },
    };

    if (status) query.status = status;
    if (appointmentType) query.appointmentType = appointmentType;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (vet) query.veterinarian = vet;
    if (owner) query.petParent = owner;
    if (isFollowUp !== null && isFollowUp !== undefined)
      query.isFollowUp = isFollowUp === "true";
    if (search) query.concerns = { $regex: search, $options: "i" };

    // Fetch data with pagination and sorting
    const [appointments, total] = await Promise.all([
      AppointmentModel.find(query)
        .populate("veterinarian pet petParent")
        .skip(skip)
        .limit(limit)
        .sort({ appointmentDate: -1 })
        .exec(),
      AppointmentModel.countDocuments(query),
    ]);

    return sendResponse({
      statusCode: 200,
      success: true,
      message: "Appointments fetched successfully",
      data: appointments,
      meta: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching appointments:", error);
    return throwAppError(
      {
        success: false,
        message: "Failed to fetch appointments",
        errorCode: "APPOINTMENT_FETCH_ERROR",
        errors: error?.errors || null,
      },
      500
    );
  }
}
