import { IAvailabilitySlot } from "@/models/AppointmentSlot";
import { getSlotsByNoticePeriodAndDateRangeByVetId } from "../slot.util";

interface IGetTodaysSlots {
  vetId: string;
  date: Date;
  timezone: string;
  noticePeriod: number; // in minutes
}

export const getTodaysSlots = async ({
  vetId,
  date,
  timezone,
  noticePeriod,
}: IGetTodaysSlots): Promise<IAvailabilitySlot[]> => {
  // Import the utility function

  // Get slots for the specific date (start and end are the same day)
  const slots = await getSlotsByNoticePeriodAndDateRangeByVetId({
    vetId,
    noticePeriod,
    startDate: date,
    endDate: date,
    timezone,
  });

  return slots;
};
