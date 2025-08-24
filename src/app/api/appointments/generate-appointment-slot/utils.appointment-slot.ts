import { IVeterinarian } from "@/models";
import { AppointmentSlot, SlotStatus } from "@/models/AppointmentSlot";
import Veterinarian from "@/models/Veterinarian";
import moment from "moment-timezone";
import mongoose from "mongoose";

export interface GenerateSlotsOptions {
  startDate?: Date; // Start date for slot generation (inclusive)
  endDate?: Date; // End date for slot generation (inclusive)
  slotDuration?: number; // in minutes
  bufferBetweenSlots?: number; // in minutes
  excludeDates?: Date[];
  includeDates?: Date[];
  forceRegenerate?: boolean; // If true, will regenerate slots even if they exist
}

export interface DaySchedule {
  start: string;
  end: string;
  available: boolean;
}

export interface SlotGenerationResult {
  veterinarianId: string;
  veterinarianName: string;
  totalDaysProcessed: number;
  totalSlotsGenerated: number;
  totalSlotsSkipped: number;
  dateRange: {
    start: Date;
    end: Date;
    timezone: string;
  };
  days: Array<{
    date: Date;
    day: string;
    slotsGenerated: number;
    slotsSkipped: number;
  }>;
}

/**
 * Get date range for slot generation - if no range provided, use next 7 days
 */
function getDateRange(
  options: GenerateSlotsOptions,
  timezone: string = "UTC"
): { start: Date; end: Date } {
  let startDate: moment.Moment;
  let endDate: moment.Moment;

  if (options.startDate && options.endDate) {
    // Use provided date range
    startDate = moment(options.startDate).tz(timezone).startOf("day");
    endDate = moment(options.endDate).tz(timezone).endOf("day");
  } else {
    // Default to next 7 days (including today)
    startDate = moment().tz(timezone).startOf("day");
    endDate = startDate.clone().add(6, "days").endOf("day"); // 7 days total
  }

  return {
    start: startDate.toDate(),
    end: endDate.toDate(),
  };
}

/**
 * Enhanced function to check for existing slots in bulk for better performance
 */
async function checkExistingSlotsBulk(
  vetId: mongoose.Types.ObjectId,
  slotsToCheck: Array<{ utcDate: Date; startTime: string; endTime: string }>
): Promise<Set<string>> {
  if (slotsToCheck.length === 0) {
    return new Set();
  }

  try {
    const existingSlotsQuery = {
      vetId,
      $or: slotsToCheck.map((slot) => ({
        date: slot.utcDate,
        startTime: slot.startTime,
        endTime: slot.endTime,
      })),
    };

    const existingSlots = await AppointmentSlot.find(existingSlotsQuery)
      .select("date startTime endTime")
      .lean();

    const existingSlotIdentifiers = new Set(
      existingSlots.map(
        (slot) =>
          `${moment(slot.date).format("YYYY-MM-DD")}_${slot.startTime}_${
            slot.endTime
          }`
      )
    );

    return existingSlotIdentifiers;
  } catch (error) {
    console.error("Error checking existing slots in bulk:", error);
    return new Set();
  }
}

/**
 * Generate time slots for a specific available day
 */
export function generateSlotsForDay(
  veterinarian: IVeterinarian,
  date: Date,
  daySchedule: DaySchedule,
  slotDuration: number = 30,
  bufferBetweenSlots: number = 0
): { startTime: string; endTime: string; utcDate: Date }[] {
  const timezone = veterinarian.timezone || "UTC";
  const dateMoment = moment(date).tz(timezone).startOf("day");

  const slots: { startTime: string; endTime: string; utcDate: Date }[] = [];

  // Parse schedule times
  const [startHours, startMinutes] = daySchedule.start.split(":").map(Number);
  const [endHours, endMinutes] = daySchedule.end.split(":").map(Number);

  let currentSlotStart = dateMoment.clone().set({
    hour: startHours,
    minute: startMinutes,
    second: 0,
    millisecond: 0,
  });

  const dayEnd = dateMoment.clone().set({
    hour: endHours,
    minute: endMinutes,
    second: 0,
    millisecond: 0,
  });

  while (currentSlotStart.isBefore(dayEnd)) {
    const slotEnd = currentSlotStart.clone().add(slotDuration, "minutes");

    if (slotEnd.isAfter(dayEnd)) {
      break;
    }

    const utcDate = currentSlotStart.clone().utc();
    const startTime = currentSlotStart.clone().utc().format("HH:mm");
    const endTime = slotEnd.clone().utc().format("HH:mm");

    slots.push({
      startTime,
      endTime,
      utcDate: utcDate.toDate(),
    });

    currentSlotStart = slotEnd.clone().add(bufferBetweenSlots, "minutes");
  }

  return slots;
}

/**
 * Check if a specific day is available in veterinarian's schedule
 */
export function checkDayAvailability(
  veterinarian: IVeterinarian,
  date: Date
): { isAvailable: boolean; schedule: DaySchedule; day: string } {
  const timezone = veterinarian.timezone || "UTC";
  const dateMoment = moment(date).tz(timezone);
  const dayOfWeek = dateMoment
    .format("dddd")
    .toLowerCase() as keyof typeof veterinarian.schedule;

  const daySchedule = veterinarian.schedule[dayOfWeek] as DaySchedule;

  if (!veterinarian.available || !daySchedule.available) {
    return {
      isAvailable: false,
      schedule: daySchedule,
      day: dayOfWeek,
    };
  }

  return {
    isAvailable: true,
    schedule: daySchedule,
    day: dayOfWeek,
  };
}

/**
 * Get all available days within a date range
 */
export function getAvailableDaysInRange(
  veterinarian: IVeterinarian,
  startDate: Date,
  endDate: Date
): { date: Date; day: string; schedule: DaySchedule }[] {
  const availableDays: { date: Date; day: string; schedule: DaySchedule }[] =
    [];
  const timezone = veterinarian.timezone || "UTC";

  let currentDate = moment(startDate).tz(timezone).startOf("day");
  const endDateMoment = moment(endDate).tz(timezone).endOf("day");

  while (currentDate.isSameOrBefore(endDateMoment)) {
    const availability = checkDayAvailability(
      veterinarian,
      currentDate.toDate()
    );

    if (availability.isAvailable) {
      availableDays.push({
        date: currentDate.toDate(),
        day: availability.day,
        schedule: availability.schedule,
      });
    }

    currentDate = currentDate.add(1, "day");
  }

  return availableDays;
}

/**
 * Enhanced slot generation with date range support
 */
export async function generateSlotsForVeterinarian(
  veterinarian: IVeterinarian,
  options: GenerateSlotsOptions = {}
): Promise<SlotGenerationResult> {
  const {
    slotDuration = 30,
    bufferBetweenSlots = 0,
    excludeDates = [],
    includeDates = [],
    forceRegenerate = false,
  } = options;

  const timezone = veterinarian.timezone || "UTC";

  // Get date range - if not provided, default to next 7 days
  const dateRange = getDateRange(options, timezone);

  const result: SlotGenerationResult = {
    veterinarianId: (veterinarian as any)._id.toString(),
    veterinarianName: veterinarian.name,
    totalDaysProcessed: 0,
    totalSlotsGenerated: 0,
    totalSlotsSkipped: 0,
    dateRange: {
      start: dateRange.start,
      end: dateRange.end,
      timezone,
    },
    days: [],
  };

  console.log(
    `🔍 Checking availability for ${veterinarian.name} from ${moment(
      dateRange.start
    ).format("YYYY-MM-DD")} to ${moment(dateRange.end).format("YYYY-MM-DD")}...`
  );

  // First, check if veterinarian is globally available
  if (!veterinarian.available) {
    console.log(`❌ Skipping ${veterinarian.name} - not available globally`);
    return result;
  }

  // Get all available days in the range
  const availableDays = getAvailableDaysInRange(
    veterinarian,
    dateRange.start,
    dateRange.end
  );

  console.log(
    `📅 Found ${availableDays.length} available days for ${veterinarian.name} in the date range`
  );

  // Filter by include/exclude dates if specified
  let filteredDays = availableDays;

  if (excludeDates.length > 0) {
    filteredDays = filteredDays.filter(
      (day) =>
        !excludeDates.some((excludeDate) =>
          moment(excludeDate).tz(timezone).isSame(day.date, "day")
        )
    );
  }

  if (includeDates.length > 0) {
    filteredDays = filteredDays.filter((day) =>
      includeDates.some((includeDate) =>
        moment(includeDate).tz(timezone).isSame(day.date, "day")
      )
    );
  }

  result.totalDaysProcessed = filteredDays.length;

  // Process each available day
  for (const dayInfo of filteredDays) {
    const dayResult = {
      date: dayInfo.date,
      day: dayInfo.day,
      slotsGenerated: 0,
      slotsSkipped: 0,
    };

    try {
      // Generate potential slots for this day
      const potentialSlots = generateSlotsForDay(
        veterinarian,
        dayInfo.date,
        dayInfo.schedule,
        slotDuration,
        bufferBetweenSlots
      );

      console.log(
        `⏰ Found ${potentialSlots.length} potential slots for ${
          veterinarian.name
        } on ${moment(dayInfo.date).format("YYYY-MM-DD")} (${dayInfo.day})`
      );

      if (potentialSlots.length === 0) {
        result.days.push(dayResult);
        continue;
      }

      // Check for existing slots in bulk
      let existingSlotIdentifiers: Set<string>;

      if (!forceRegenerate) {
        existingSlotIdentifiers = await checkExistingSlotsBulk(
          (veterinarian as any)._id,
          potentialSlots.map((slot) => ({
            utcDate: slot.utcDate,
            startTime: slot.startTime,
            endTime: slot.endTime,
          }))
        );
      } else {
        existingSlotIdentifiers = new Set();
      }

      const slotsToCreate: typeof potentialSlots = [];

      for (const slot of potentialSlots) {
        const slotIdentifier = `${moment(slot.utcDate).format("YYYY-MM-DD")}_${
          slot.startTime
        }_${slot.endTime}`;

        if (existingSlotIdentifiers.has(slotIdentifier)) {
          dayResult.slotsSkipped++;
          result.totalSlotsSkipped++;
        } else {
          slotsToCreate.push(slot);
        }
      }

      console.log(
        `📊 Creating ${slotsToCreate.length} new slots, skipping ${dayResult.slotsSkipped} existing slots`
      );

      // Create new slots
      if (slotsToCreate.length > 0) {
        const bulkOperations = slotsToCreate.map((slot) => ({
          insertOne: {
            document: {
              vetId: veterinarian._id,
              date: slot.utcDate,
              startTime: slot.startTime,
              endTime: slot.endTime,
              status: SlotStatus.AVAILABLE,
              notes: `Auto-generated slot for ${veterinarian.name} on ${moment(
                dayInfo.date
              ).format("YYYY-MM-DD")}`,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        }));

        try {
          const bulkResult = await AppointmentSlot.bulkWrite(bulkOperations, {
            ordered: false,
          });
          dayResult.slotsGenerated = bulkResult.insertedCount;
          result.totalSlotsGenerated += bulkResult.insertedCount;

          console.log(
            `✅ Successfully created ${
              bulkResult.insertedCount
            } slots for ${moment(dayInfo.date).format("YYYY-MM-DD")}`
          );
        } catch (bulkError) {
          console.error(
            `❌ Bulk insert error for ${moment(dayInfo.date).format(
              "YYYY-MM-DD"
            )}:`,
            bulkError
          );
          // Fallback to individual inserts
          for (const slot of slotsToCreate) {
            try {
              const newSlot = new AppointmentSlot({
                vetId: veterinarian._id,
                date: slot.utcDate,
                startTime: slot.startTime,
                endTime: slot.endTime,
                status: SlotStatus.AVAILABLE,
                notes: `Auto-generated slot for ${
                  veterinarian.name
                } on ${moment(dayInfo.date).format("YYYY-MM-DD")}`,
              });

              await newSlot.save();
              dayResult.slotsGenerated++;
              result.totalSlotsGenerated++;
            } catch (slotError) {
              console.error("Error creating individual slot:", slotError);
            }
          }
        }
      }
    } catch (dayError) {
      console.error(
        `❌ Error processing day ${moment(dayInfo.date).format(
          "YYYY-MM-DD"
        )} for ${veterinarian.name}:`,
        dayError
      );
    } finally {
      result.days.push(dayResult);
    }
  }

  console.log(
    `🎯 Completed for ${veterinarian.name}: ${result.totalSlotsGenerated} slots generated, ${result.totalSlotsSkipped} slots skipped for ${result.totalDaysProcessed} days`
  );

  return result;
}

/**
 * Get all available veterinarians
 */
export async function getAllAvailableVeterinarians(): Promise<IVeterinarian[]> {
  try {
    const veterinarians = await Veterinarian.find({
      // available: true,
      // isActive: true,
      // isApproved: true,
      // isDeleted: false,
    }).exec();

    return veterinarians;
  } catch (error) {
    console.error("Error fetching veterinarians:", error);
    throw new Error("Failed to fetch veterinarians");
  }
}

/**
 * Enhanced function to generate slots for all veterinarians with date range support
 */
export async function generateSlotsForAllVeterinarians(
  options?: GenerateSlotsOptions
): Promise<{
  results: { [vetId: string]: SlotGenerationResult };
  summary: {
    totalVeterinarians: number;
    totalSlotsGenerated: number;
    totalSlotsSkipped: number;
    totalDaysProcessed: number;
    successfulVeterinarians: number;
    failedVeterinarians: number;
    dateRange: {
      start: Date;
      end: Date;
      timezone: string;
    };
  };
}> {
  const results: { [vetId: string]: SlotGenerationResult } = {};
  let totalSlotsGenerated = 0;
  let totalSlotsSkipped = 0;
  let totalDaysProcessed = 0;
  let successfulVeterinarians = 0;
  let failedVeterinarians = 0;

  // Get all available veterinarians
  const veterinarians: any = await getAllAvailableVeterinarians();

  console.log(`👥 Found ${veterinarians.length} available veterinarians`);

  // Use first vet's timezone for date range consistency (or default to UTC)
  const defaultTimezone = veterinarians[0]?.timezone || "UTC";
  const dateRange = getDateRange(options || {}, defaultTimezone);

  for (const vet of veterinarians) {
    try {
      console.log(`\n🚀 Processing veterinarian: ${vet.name}`);
      const result = await generateSlotsForVeterinarian(vet, options);

      results[vet._id.toString()] = result;
      totalSlotsGenerated += result.totalSlotsGenerated;
      totalSlotsSkipped += result.totalSlotsSkipped;
      totalDaysProcessed += result.totalDaysProcessed;
      successfulVeterinarians++;

      console.log(
        `✅ Completed ${vet.name}: ${result.totalSlotsGenerated} slots generated`
      );
    } catch (error) {
      console.error(
        `❌ Error generating slots for veterinarian ${vet.name}:`,
        error
      );
      failedVeterinarians++;

      results[vet._id.toString()] = {
        veterinarianId: vet._id.toString(),
        veterinarianName: vet.name,
        totalDaysProcessed: 0,
        totalSlotsGenerated: 0,
        totalSlotsSkipped: 0,
        dateRange: {
          start: dateRange.start,
          end: dateRange.end,
          timezone: vet.timezone || defaultTimezone,
        },
        days: [],
      };
    }
  }

  return {
    results,
    summary: {
      totalVeterinarians: veterinarians.length,
      totalSlotsGenerated,
      totalSlotsSkipped,
      totalDaysProcessed,
      successfulVeterinarians,
      failedVeterinarians,
      dateRange: {
        start: dateRange.start,
        end: dateRange.end,
        timezone: defaultTimezone,
      },
    },
  };
}

/**
 * Generate slots for a specific date range (main entry point)
 */
export async function generateSlotsForDateRange(
  startDate: Date,
  endDate: Date,
  options: Omit<GenerateSlotsOptions, "startDate" | "endDate"> = {}
): Promise<{
  results: { [vetId: string]: SlotGenerationResult };
  summary: {
    totalVeterinarians: number;
    totalSlotsGenerated: number;
    totalSlotsSkipped: number;
    totalDaysProcessed: number;
    successfulVeterinarians: number;
    failedVeterinarians: number;
  };
}> {
  return generateSlotsForAllVeterinarians({
    ...options,
    startDate,
    endDate,
  });
}

/**
 * Generate slots for next 7 days (backward compatibility)
 */
export async function generateSlotsForNextWeek(
  options: Omit<GenerateSlotsOptions, "startDate" | "endDate"> = {}
): Promise<{
  results: { [vetId: string]: SlotGenerationResult };
  summary: {
    totalVeterinarians: number;
    totalSlotsGenerated: number;
    totalSlotsSkipped: number;
    totalDaysProcessed: number;
    successfulVeterinarians: number;
    failedVeterinarians: number;
  };
}> {
  return generateSlotsForAllVeterinarians(options);
}
