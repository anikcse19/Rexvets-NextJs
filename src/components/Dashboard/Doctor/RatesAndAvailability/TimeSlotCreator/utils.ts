import moment from "moment";
import { TimeBlock, TimeSlot } from "./types";

export const isValidSlot = (slot: TimeSlot): boolean => {
  return (
    typeof slot.startTime === "string" &&
    slot.startTime !== "" &&
    typeof slot.endTime === "string" &&
    slot.endTime !== "" &&
    slot.startTime < slot.endTime
  );
};

export const getTotalHours = (slots: TimeSlot[]): number => {
  return slots.reduce((total, slot) => {
    if (!isValidSlot(slot)) return total;
    const [sh, sm] = slot.startTime.split(":").map(Number);
    const [eh, em] = slot.endTime.split(":").map(Number);

    const start = new Date(
      `2000-01-01T${String(sh).padStart(2, "0")}:${String(sm).padStart(
        2,
        "0"
      )}:00`
    );
    const end = new Date(
      `2000-01-01T${String(eh).padStart(2, "0")}:${String(em).padStart(
        2,
        "0"
      )}:00`
    );

    return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }, 0);
};

export const formatDuration = (hours: number): string => {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  return `${wholeHours}h ${minutes}m`;
};

export const formatDate = (date: Date | string | undefined, timezone?: string) => {
  if (!date) return "";

  if (timezone && typeof date === "string") {
    // Convert the date to user's timezone
    const { convertTimesToUserTimezone } = require("@/lib/timezone/index");
    const { formattedDate } = convertTimesToUserTimezone(
      "00:00", // dummy time for date conversion
      "00:00", // dummy time for date conversion
      date,
      timezone
    );
    return moment(formattedDate).format("dddd, MMM DD, YYYY");
  }

  const dateObj = typeof date === "string" ? new Date(date) : date;
  return moment(dateObj).format("dddd, MMM DD, YYYY");
};

export const formatTime = (timeStr: string, dateStr: string, timezone?: string) => {
  if (timezone) {
    // Use convertTimesToUserTimezone for proper timezone conversion
    const { convertTimesToUserTimezone } = require("@/lib/timezone/index");
    const { formattedStartTime } = convertTimesToUserTimezone(
      timeStr,
      timeStr, // same time for start and end since we only need start
      dateStr,
      timezone
    );
    return formattedStartTime;
  }
  return moment(`2000-01-01 ${timeStr}`).format("h:mm A");
};

export const formatDateRange = (
  startDate: Date,
  endDate: Date,
  timezone?: string
) => {
  const { getUserTimezone } = require("@/lib/timezone");
  const userTz = timezone || getUserTimezone();

  if (timezone) {
    // Convert dates to user's timezone
    const startMoment = moment.tz(startDate, userTz);
    const endMoment = moment.tz(endDate, userTz);

    if (startMoment.format("YYYY-MM-DD") === endMoment.format("YYYY-MM-DD")) {
      // Same date
      return startMoment.format("dddd, MMMM DD, YYYY");
    } else {
      // Different dates
      return `${startMoment.format("MMM DD")} - ${endMoment.format(
        "MMM DD, YYYY"
      )}`;
    }
  }

  // Fallback to moment without timezone
  const startMoment = moment(startDate);
  const endMoment = moment(endDate);

  if (startMoment.format("YYYY-MM-DD") === endMoment.format("YYYY-MM-DD")) {
    return startMoment.format("dddd, MMMM DD, YYYY");
  } else {
    return `${startMoment.format("MMM DD")} - ${endMoment.format(
      "MMM DD, YYYY"
    )}`;
  }
};

export const generateAvailableTimeBlocks = (slots: TimeSlot[], currentSlotId: string): TimeBlock[] => {
  const currentSlot = slots.find((slot) => slot.id === currentSlotId);
  if (!currentSlot) return [];

  // Get all other slots (both existing and new periods) to filter out conflicts
  const otherSlots = slots.filter(
    (slot) => slot.id !== currentSlotId && isValidSlot(slot)
  );

  // Create blocked time ranges with 1-hour buffer
  const blockedRanges: Array<{
    start: moment.Moment;
    end: moment.Moment;
    type: string;
  }> = [];

  otherSlots.forEach((slot) => {
    const startMoment = moment(
      `2000-01-01 ${slot.startTime}`,
      "YYYY-MM-DD HH:mm"
    );
    const endMoment = moment(
      `2000-01-01 ${slot.endTime}`,
      "YYYY-MM-DD HH:mm"
    );

    // Add 1-hour buffer before and after each period
    const bufferStart = startMoment.clone().subtract(1, "hour");
    const bufferEnd = endMoment.clone().add(1, "hour");

    blockedRanges.push({
      start: bufferStart,
      end: bufferEnd,
      type: slot.isExisting ? "existing" : "new",
    });
  });

  // Generate available time blocks (2-hour minimum periods)
  const availableBlocks: TimeBlock[] = [];

  for (let hour = 6; hour <= 22; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const startTime = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      const endTime = moment(`2000-01-01 ${startTime}`, "YYYY-MM-DD HH:mm")
        .add(2, "hours")
        .format("HH:mm");

      // Skip if end time goes past midnight
      if (endTime === "00:00") continue;

      const blockStartMoment = moment(
        `2000-01-01 ${startTime}`,
        "YYYY-MM-DD HH:mm"
      );
      const blockEndMoment = moment(
        `2000-01-01 ${endTime}`,
        "YYYY-MM-DD HH:mm"
      );

      // Check if this 2-hour block conflicts with any blocked ranges
      const hasConflict = blockedRanges.some((blockedRange) => {
        // Check for overlap: block overlaps with blocked range
        return (
          blockStartMoment.isBefore(blockedRange.end) &&
          blockEndMoment.isAfter(blockedRange.start)
        );
      });

      if (!hasConflict) {
        const startFormatted = blockStartMoment.format("h:mm A");
        const endFormatted = blockEndMoment.format("h:mm A");

        availableBlocks.push({
          start: startTime,
          end: endTime,
          label: `${startFormatted} - ${endFormatted}`,
        });
      }
    }
  }

  // Add custom time option
  availableBlocks.push({
    start: "custom",
    end: "custom",
    label: "Custom Time",
  });

  // Sort available blocks by start time (custom time at the end)
  return availableBlocks.sort((a, b) => {
    if (a.start === "custom") return 1; // Custom time at the end
    if (b.start === "custom") return -1;
    const aMoment = moment(`2000-01-01 ${a.start}`, "YYYY-MM-DD HH:mm");
    const bMoment = moment(`2000-01-01 ${b.start}`, "YYYY-MM-DD HH:mm");
    return aMoment.diff(bMoment);
  });
};
