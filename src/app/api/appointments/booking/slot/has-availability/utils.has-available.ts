import { AppointmentSlot, VeterinarianModel } from "@/models";
import type { IVeterinarian } from "@/models/Veterinarian";
import moment from "moment-timezone";
import mongoose from "mongoose";

export async function checkVetAvailability(vetId: string): Promise<boolean> {
  try {
    // Validate the vetId
    if (!mongoose.Types.ObjectId.isValid(vetId)) {
      return false;
    }

    // Find the veterinarian to get their timezone and basic info
    const veterinarian = await VeterinarianModel.findById(vetId)
      .select("timezone isActive isApproved isDeleted available")
      .lean<Pick<IVeterinarian, "timezone" | "isActive" | "isApproved" | "isDeleted" | "available">>();

    // Check if vet exists and is active/approved/available
    if (
      !veterinarian
      //   !veterinarian.isActive ||
      //   !veterinarian.isApproved ||
      //   veterinarian.isDeleted ||
      //   !veterinarian.available
    ) {
      throw new Error("Veterinarian not found");
    }

    const vetTimezone = veterinarian?.timezone || "UTC";
    console.log("vetTimezone", vetTimezone);
    // Get current date in vet's timezone (start of today)
    const todayStart = moment().tz(vetTimezone).startOf("day").toDate();

    // Check for any available slots from today onward
    const availableSlot = await AppointmentSlot.findOne({
      vetId: new mongoose.Types.ObjectId(vetId),
      date: { $gte: todayStart },
      status: "available",
    })
      .select("_id")
      .lean();

    return !!availableSlot;
  } catch (error) {
    console.error("Error checking veterinarian availability:", error);
      return false;
  }
}
