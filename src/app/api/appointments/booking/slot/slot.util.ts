import {
  AppointmentSlot,
  IAvailabilitySlot,
  SlotStatus,
} from "@/models/AppointmentSlot";
import Veterinarian from "@/models/Veterinarian";
import moment from "moment-timezone";
import { Types } from "mongoose";

export interface GetVetSlotsOptions {
  date?: Date; // Specific date
  page?: number; // Page number for pagination
  limit?: number; // Items per page
  status?: SlotStatus | "all"; // Filter by slot status
  timezone?: string; // Timezone for date filtering
}

export interface GetVetSlotsResult {
  slots: IAvailabilitySlot[];
  meta: {
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function getVeterinarianSlots(
  vetId: string,
  options: GetVetSlotsOptions = {}
): Promise<GetVetSlotsResult> {
  try {
    const {
      date,
      page = 1,
      limit = 20,
      status = "all",
      timezone = "UTC",
    } = options;

    // Validate pagination
    const validatedPage = Math.max(1, page);
    const validatedLimit = Math.max(1, Math.min(limit, 100));
    const skip = (validatedPage - 1) * validatedLimit;

    // Convert date to UTC range
    const targetDate = moment.tz(date as any, "YYYY-MM-DD", timezone);
    const startOfDay = targetDate.clone().startOf("day").utc().toDate();
    const endOfDay = targetDate.clone().endOf("day").utc().toDate();

    // Build query
    const query: any = {
      vetId: new Types.ObjectId(vetId),
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    };
    console.log("ST", status);
    if (status !== "all") {
      query.status = status;
    }

    const veterinarian = await Veterinarian.findById(vetId)
      .select("name timezone")
      .lean();

    if (!veterinarian) {
      throw new Error("Veterinarian not found");
    }

    // Query slots
    const totalCount = await AppointmentSlot.countDocuments(query);
    const slots = await AppointmentSlot.find(query)
      .sort({ date: 1, startTime: 1 })
      .skip(skip)
      .limit(validatedLimit)
      .lean();

    const totalPages = Math.ceil(totalCount / validatedLimit);

    return {
      slots: slots as IAvailabilitySlot[],
      meta: {
        page: validatedPage,
        limit: validatedLimit,
        totalPages,
      },
    };
  } catch (error) {
    console.error("Error getting veterinarian slots:", error);
    throw new Error("Failed to fetch veterinarian slots");
  }
}
