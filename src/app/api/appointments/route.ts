import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import {
  IErrorResponse,
  ISendResponse,
  sendResponse,
  throwAppError,
} from "@/lib/utils/send.response";
import { VeterinarianModel } from "@/models";
import { AppointmentModel } from "@/models/Appointment";
import { AppointmentSlot, SlotStatus } from "@/models/AppointmentSlot";
import PetParent from "@/models/PetParent";
import { Types } from "mongoose";
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

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Unauthorized",
        errorCode: "UNAUTHORIZED",
        errors: null,
      };
      return throwAppError(errResp, 401);
    }

    const body = await req.json();
    const parsed = appointmentSchema.safeParse(body);
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
      return throwAppError(errResp, 400);
    }
    const slotId = body.slotId;
    const existingSlot = await AppointmentSlot.findOne({
      _id: slotId,
      status: SlotStatus.AVAILABLE,
      vetId: body.veterinarian,
    });
    console.log("existingSlot", existingSlot);
    if (!existingSlot) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Slot not available",
        errorCode: "SLOT_NOT_AVAILABLE",
        errors: null,
      };
      return throwAppError(errResp, 404);
    }
    const existingVet = await VeterinarianModel.findOne({
      _id: body.veterinarian,
      isActive: true,
    });
    if (!existingVet) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Veterinarian not found or inactive",
        errorCode: "VET_NOT_FOUND",
        errors: null,
      };
      return throwAppError(errResp, 404);
    }
    const existingPetOwner = await PetParent.findOne({
      _id: body.petParent,
    });
    if (!existingPetOwner) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Pet owner not found or inactive",
        errorCode: "PET_OWNER_NOT_FOUND",
        errors: null,
      };
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
    // Create appointment document
    const appointment = new AppointmentModel({
      veterinarian: new Types.ObjectId(veterinarian),
      petParent: new Types.ObjectId(petParent),
      pet: new Types.ObjectId(pet),
      appointmentDate: existingSlot.date,
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
    const newAppointment = await appointment.save();

    // Generate meeting link
    const meetingLink = `https://rexvets-nextjs.vercel.app/video-call/?${encodeURIComponent(
      newAppointment._id
    )}`;

    // Save meetingLink to the appointment
    newAppointment.meetingLink = meetingLink;
    await newAppointment.save({ validateBeforeSave: true });
    existingSlot.status = SlotStatus.BOOKED;
    await existingSlot.save({ validateBeforeSave: false });
    const response: ISendResponse<any> = {
      success: true,
      data: newAppointment,
      statusCode: 201,
      message: "Appointment created successfully",
    };
    return sendResponse(response);
  } catch (err: any) {
    console.error("Error creating appointment:", err);

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
        .populate("veterinarian petParent pet") // Populate related data if needed
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
