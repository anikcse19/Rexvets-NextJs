import moment from "moment-timezone";

export interface TimeConversionResult {
  formattedStartTime: string;
  formattedEndTime: string;
  formattedDate: string;
}

/**
 * Converts given times and date to user's local timezone
 * @param startTime - start time in HH:mm format in the slot's timezone
 * @param endTime - end time in HH:mm format in the slot's timezone
 * @param slotDate - date string of the slot
 * @param slotTimezone - timezone of the slot (optional, defaults to UTC)
 */
export function convertTimesToUserTimezone(
  startTime: string,
  endTime: string,
  slotDate: string,
  slotTimezone: string = "UTC"
): TimeConversionResult {
  // Detect user timezone
  const userTimeZone = moment.tz.guess();

  // Parse the slot date and create full datetime strings in the slot's timezone
  const slotMoment = moment.tz(slotDate, slotTimezone);
  
  // Create the full datetime strings in the slot's timezone
  const slotStartDateTime = `${slotMoment.format("YYYY-MM-DD")}T${startTime}:00`;
  const slotEndDateTime = `${slotMoment.format("YYYY-MM-DD")}T${endTime}:00`;

  // Convert from slot timezone to user's local timezone
  const localStart = moment.tz(slotStartDateTime, slotTimezone).tz(userTimeZone);
  const localEnd = moment.tz(slotEndDateTime, slotTimezone).tz(userTimeZone);

  // Debug logging
  console.log("Timezone conversion:", {
    original: { startTime, endTime, slotDate, slotTimezone },
    converted: {
      startTime: localStart.format("hh:mm A"),
      endTime: localEnd.format("hh:mm A"),
      date: localStart.format("YYYY-MM-DD"),
      userTimezone: userTimeZone
    }
  });

  return {
    formattedStartTime: localStart.format("h:mm A"), // e.g. 11:30 PM (no leading zero)
    formattedEndTime: localEnd.format("h:mm A"), // e.g. 12:00 AM (no leading zero)
    formattedDate: localStart.format("YYYY-MM-DD"), // e.g. 2025-08-30
  };
}
