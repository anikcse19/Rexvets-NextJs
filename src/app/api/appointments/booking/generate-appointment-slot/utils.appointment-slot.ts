import { connectToDatabase } from "@/lib/mongoose";
import { AppointmentSlot } from "@/models/AppointmentSlot";
import Veterinarian from "@/models/Veterinarian";
import {
  addDays,
  addMinutes,
  eachDayOfInterval,
  endOfDay,
  format,
  getDay,
  isAfter,
  isBefore,
  isSameDay,
  parse,
  setHours,
  setMinutes,
  startOfDay,
} from "date-fns";

function generateTimeSlots(startTime: string, endTime: string, baseDate: Date) {
  const slots: {
    start: Date;
    end: Date;
    startTime: string;
    endTime: string;
  }[] = [];

  // Parse start and end times
  const start = parse(startTime, "HH:mm", baseDate);
  const end = parse(endTime, "HH:mm", baseDate);

  // If end time is before start time, assume it's next day
  const adjustedEnd = isBefore(end, start) ? addDays(end, 1) : end;

  let currentTime = start;

  // Generate 30-minute slots
  while (isBefore(currentTime, adjustedEnd)) {
    const slotEnd = addMinutes(currentTime, 30);

    // Stop if slot would exceed end time
    if (isAfter(slotEnd, adjustedEnd)) {
      break;
    }

    slots.push({
      start: new Date(currentTime),
      end: new Date(slotEnd),
      startTime: format(currentTime, "HH:mm"),
      endTime: format(slotEnd, "HH:mm"),
    });

    currentTime = slotEnd;
  }

  return slots;
}

// Main function to generate appointment slots for all vets
export const generateVeterinarianSlots = async () => {
  try {
    await connectToDatabase();

    // Get all active veterinarians
    const veterinarians = await Veterinarian.find({ isActive: true });

    if (veterinarians.length === 0) {
      return {
        success: false,
        message: "No active veterinarians found",
        slotsCreated: 0,
      };
    }

    // Calculate date range (next 7 days)
    const today = new Date();
    const oneWeekLater = addDays(today, 7);
    const dateRange = eachDayOfInterval({ start: today, end: oneWeekLater });

    let slotsCreated = 0;
    let slotsSkipped = 0;

    // Process each veterinarian
    for (const vet of veterinarians) {
      console.log(`Processing slots for veterinarian: ${vet.name}`);

      // Process each day in the date range
      for (const date of dateRange) {
        // Get day of week (0 = Sunday, 1 = Monday, etc.)
        const dayOfWeek = getDay(date);
        const dayNames = [
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
        ];
        const dayName = dayNames[dayOfWeek];

        // Get vet's schedule for this day
        const daySchedule = vet.schedule[dayName as keyof typeof vet.schedule];

        // Skip if vet is not available this day
        if (!daySchedule.available) {
          console.log(`Skipping ${dayName} - ${vet.name} is not available`);
          continue;
        }

        // Check if slots already exist for this vet and date
        const existingSlots = await AppointmentSlot.find({
          vetId: vet._id,
          date: {
            $gte: startOfDay(date),
            $lte: endOfDay(date),
          },
        });

        // If slots already exist, skip to next date
        if (existingSlots.length > 0) {
          console.log(
            `Skipping ${format(date, "yyyy-MM-dd")} - ${
              existingSlots.length
            } slots already exist for ${vet.name}`
          );
          slotsSkipped += existingSlots.length;
          continue;
        }

        // Generate time slots for this day
        const timeSlots = generateTimeSlots(
          daySchedule.start,
          daySchedule.end,
          date
        );

        // Prepare slots for database insertion
        const slotsToInsert = timeSlots.map((slot) => {
          // Create proper date object for the slot
          const [hours, minutes] = slot.startTime.split(":").map(Number);
          const slotDate = new Date(date);
          slotDate.setHours(hours, minutes, 0, 0);

          return {
            vetId: vet._id,
            date: slotDate, // Use the actual slot date/time
            startTime: slot.startTime,
            endTime: slot.endTime,
            status: "available",
          };
        });

        // Insert slots into database
        if (slotsToInsert.length > 0) {
          await AppointmentSlot.insertMany(slotsToInsert);
          slotsCreated += slotsToInsert.length;
          console.log(
            `Created ${slotsToInsert.length} slots for ${vet.name} on ${format(
              date,
              "yyyy-MM-dd"
            )} (${dayName})`
          );
        }
      }
    }

    return {
      success: true,
      message: `Successfully generated ${slotsCreated} appointment slots. ${slotsSkipped} existing slots skipped.`,
      slotsCreated,
      slotsSkipped,
    };
  } catch (error) {
    console.error("Error generating appointment slots:", error);
    throw error;
  }
};

// API Route Handler for Next.js
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed. Use POST.",
    });
  }

  try {
    const result = await generateVeterinarianSlots();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in API route:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate appointment slots",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
