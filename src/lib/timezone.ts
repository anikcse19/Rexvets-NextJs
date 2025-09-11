import moment from "moment-timezone";
import { DateRange } from "./types";

export const getTimezones = () => {
  return moment.tz.names().map((tz) => ({
    value: tz,
    label: tz.replace(/_/g, " "),
    offset: moment.tz(tz).format("Z"),
  }));
};

export const formatTimeForTimezone = (time: string, timezone: string) => {
  return moment.tz(time, timezone).format("h:mm A");
};

export const convertTimeToTimezone = (
  time: string,
  fromTimezone: string,
  toTimezone: string
) => {
  return moment.tz(time, fromTimezone).tz(toTimezone).format();
};

export const getUserTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const formatTimeToUserTimezone = (
  time: string,
  timezone?: string
): string => {
  const userTz = timezone || getUserTimezone();
  const date = new Date(`2024-01-01 ${time}`);

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: userTz,
  }).format(date);
};

// New functions for appointment slot timezone handling

/**
 * Convert a time from one timezone to another for a specific date
 * @param time - Time in HH:mm format
 * @param date - Date object
 * @param fromTimezone - Source timezone
 * @param toTimezone - Target timezone
 * @returns Time in HH:mm format in target timezone
 */
export const convertTimeBetweenTimezones = (
  time: string,
  date: Date,
  fromTimezone: string,
  toTimezone: string
): string => {
  const dateStr = moment(date).format("YYYY-MM-DD");
  const fullDateTime = moment.tz(`${dateStr} ${time}`, fromTimezone);
  return fullDateTime.tz(toTimezone).format("HH:mm");
};

/**
 * Get the current time in a specific timezone
 * @param timezone - Timezone identifier
 * @returns Current time in HH:mm format
 */
export const getCurrentTimeInTimezone = (timezone: string): string => {
  return moment.tz(timezone).format("HH:mm");
};

/**
 * Check if a time is in the past for a specific date and timezone
 * @param time - Time in HH:mm format
 * @param date - Date object
 * @param timezone - Timezone identifier
 * @returns boolean
 */
export const isTimeInPast = (
  time: string,
  date: Date,
  timezone: string
): boolean => {
  const dateStr = moment(date).format("YYYY-MM-DD");
  const slotDateTime = moment.tz(`${dateStr} ${time}`, timezone);
  const now = moment.tz(timezone);
  return slotDateTime.isBefore(now);
};

/**
 * Validate if a timezone is valid
 * @param timezone - Timezone identifier
 * @returns boolean
 */
export const isValidTimezone = (timezone: string): boolean => {
  return moment.tz.names().includes(timezone);
};

/**
 * Format a slot time for display in user's timezone
 * @param time - Time in HH:mm format
 * @param date - Date object
 * @param slotTimezone - Timezone of the slot
 * @param userTimezone - Timezone of the user
 * @returns Formatted time string
 */
export const formatSlotTimeForUser = (
  time: string,
  date: Date,
  slotTimezone: string,
  userTimezone: string
): string => {
  if (slotTimezone === userTimezone) {
    return moment(`2000-01-01 ${time}`).format("hh:mm A");
  }

  const dateStr = moment(date).format("YYYY-MM-DD");
  const slotDateTime = moment.tz(`${dateStr} ${time}`, slotTimezone);
  return slotDateTime.tz(userTimezone).format("hh:mm A");
};

/**
 * Get timezone offset string (e.g., "UTC-5")
 * @param timezone - Timezone identifier
 * @returns Timezone offset string
 */
export const getTimezoneOffset = (timezone: string): string => {
  return moment.tz(timezone).format("Z");
};

/**
 * Check if a date is today in a timezone-agnostic way
 * This function compares dates without considering timezone differences
 * @param date - Date to check
 * @returns boolean
 */
export const isDateToday = (date: Date): boolean => {
  const today = new Date();
  const dateToCheck = new Date(date);

  return (
    dateToCheck.getFullYear() === today.getFullYear() &&
    dateToCheck.getMonth() === today.getMonth() &&
    dateToCheck.getDate() === today.getDate()
  );
};

/**
 * Get a timezone-agnostic today's date
 * This ensures consistent date handling regardless of user's timezone
 * @returns Date object representing today in UTC
 */
export const getTodayUTC = (): Date => {
  const today = new Date();
  return new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  );
};
export const getMonthRange = (timezone?: string) => {
  const startOfMonth = moment
    .tz(timezone || getUserTimezone())
    .startOf("month");
  const endOfMonth = moment.tz(timezone || getUserTimezone()).endOf("month");

  return {
    start: startOfMonth.format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ"),
    end: endOfMonth.format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ"),
  };
};

export const getWeekRange = (timezone?: string) => {
  const tz = timezone || moment.tz.guess();

  const startOfRange = moment.tz(tz).startOf("day"); // today start
  const endOfRange = moment.tz(tz).add(6, "days").endOf("day"); // +6 days = total 7 days

  return {
    start: startOfRange.format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ"),
    end: endOfRange.format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ"),
  };
};
export const getSpecificWeekRange = (
  weekOffset: number = 0,
  timezone?: string
) => {
  const startOfWeek = moment
    .tz(timezone || getUserTimezone())
    .add(weekOffset, "weeks")
    .startOf("week");
  const endOfWeek = moment
    .tz(timezone || getUserTimezone())
    .add(weekOffset, "weeks")
    .endOf("week");

  return {
    start: startOfWeek.format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ"),
    end: endOfWeek.format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ"),
  };
};
export const adjustDateRange = (
  range: DateRange,
  timezone: string
): DateRange => {
  if (!range || !range.start || !range.end || !timezone) {
    throw Error("Invalid date range or timezone");
  }

  // Normalize anchors in the provided timezone
  const tzNow = moment.tz(timezone);
  const todayStart = tzNow.clone().startOf("day");

  const inputStart = moment.tz(range.start, timezone).startOf("day");
  const inputEnd = moment.tz(range.end, timezone).endOf("day");

  // If the entire range is in the past, clamp to today as a single-day range
  if (inputEnd.isBefore(todayStart)) {
    return {
      start: todayStart.format("YYYY-MM-DD"),
      end: todayStart.format("YYYY-MM-DD"),
    };
  }

  // Trim past portion only. If start is today, keep it. If start is in the past, shift to today.
  const effectiveStart = inputStart.isBefore(todayStart) ? todayStart : inputStart;

  // Ensure end is not before effectiveStart
  const effectiveEnd = inputEnd.isBefore(effectiveStart)
    ? effectiveStart.clone().endOf("day")
    : inputEnd;

  return {
    start: effectiveStart.format("YYYY-MM-DD"),
    end: effectiveEnd.format("YYYY-MM-DD"),
  };
};
// API Utility Functions for Timezone Management

/**
 * API Response types for timezone operations
 */
export interface TimezoneApiResponse {
  success: boolean;
  message: string;
  data?: {
    timezone: string;
    source?: string;
    veterinarian?: any;
  };
  error?: string;
  details?: any;
}

/**
 * Get the current timezone for the authenticated veterinarian
 * @returns Promise<TimezoneApiResponse>
 */
export const getVeterinarianTimezone =
  async (): Promise<TimezoneApiResponse> => {
    try {
      const response = await fetch("/api/veterinarian/timezone", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching veterinarian timezone:", error);
      return {
        success: false,
        message: "Failed to fetch timezone",
        error: "Network error",
      };
    }
  };

/**
 * Update the timezone for the authenticated veterinarian
 * @param timezone - IANA timezone identifier (e.g., 'America/New_York')
 * @returns Promise<TimezoneApiResponse>
 */
export const updateVeterinarianTimezone = async (
  timezone: string
): Promise<TimezoneApiResponse> => {
  try {
    // Validate timezone before making the request
    if (!isValidTimezone(timezone)) {
      return {
        success: false,
        message: "Invalid timezone format",
        error: "Timezone validation failed",
      };
    }

    const response = await fetch("/api/veterinarian/timezone/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ timezone }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating veterinarian timezone:", error);
    return {
      success: false,
      message: "Failed to update timezone",
      error: "Network error",
    };
  }
};

/**
 * Get timezone with fallback to user's browser timezone
 * @returns Promise<string> - The timezone identifier
 */
export const getVeterinarianTimezoneWithFallback =
  async (): Promise<string> => {
    try {
      const response = await getVeterinarianTimezone();

      if (response.success && response.data?.timezone) {
        return response.data.timezone;
      }

      // Fallback to user's browser timezone
      return getUserTimezone();
    } catch (error) {
      console.error("Error getting timezone with fallback:", error);
      return getUserTimezone();
    }
  };

/**
 * Update timezone with validation and error handling
 * @param timezone - IANA timezone identifier
 * @returns Promise<{ success: boolean; message: string; error?: string }>
 */
export const updateTimezoneWithValidation = async (
  timezone: string
): Promise<{ success: boolean; message: string; error?: string }> => {
  try {
    // Validate timezone format
    if (!timezone || typeof timezone !== "string") {
      return {
        success: false,
        message: "Timezone is required",
        error: "Invalid timezone input",
      };
    }

    // Check if timezone is valid
    if (!isValidTimezone(timezone)) {
      return {
        success: false,
        message:
          "Invalid timezone format. Please use IANA timezone format (e.g., America/New_York)",
        error: "Invalid timezone format",
      };
    }

    // Update timezone
    const response = await updateVeterinarianTimezone(timezone);

    if (response.success) {
      return {
        success: true,
        message: "Timezone updated successfully",
      };
    } else {
      return {
        success: false,
        message: response.message || "Failed to update timezone",
        error: response.error || "Update failed",
      };
    }
  } catch (error) {
    console.error("Error in updateTimezoneWithValidation:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
      error: "Validation error",
    };
  }
};

/**
 * Get timezone information with detailed metadata
 * @returns Promise<{ timezone: string; source: string; offset: string; isValid: boolean }>
 */
export const getTimezoneInfo = async (): Promise<{
  timezone: string;
  source: string;
  offset: string;
  isValid: boolean;
}> => {
  try {
    const response = await getVeterinarianTimezone();

    if (response.success && response.data?.timezone) {
      const timezone = response.data.timezone;
      return {
        timezone,
        source: response.data.source || "unknown",
        offset: getTimezoneOffset(timezone),
        isValid: isValidTimezone(timezone),
      };
    }

    // Fallback to user's browser timezone
    const userTimezone = getUserTimezone();
    return {
      timezone: userTimezone,
      source: "browser",
      offset: getTimezoneOffset(userTimezone),
      isValid: isValidTimezone(userTimezone),
    };
  } catch (error) {
    console.error("Error getting timezone info:", error);
    const userTimezone = getUserTimezone();
    return {
      timezone: userTimezone,
      source: "browser",
      offset: getTimezoneOffset(userTimezone),
      isValid: isValidTimezone(userTimezone),
    };
  }
};

/**
 * Sync timezone between Veterinarian and User models
 * This function ensures both models have the same timezone
 * @param timezone - IANA timezone identifier
 * @returns Promise<{ success: boolean; message: string; error?: string }>
 */
export const syncTimezone = async (
  timezone: string
): Promise<{ success: boolean; message: string; error?: string }> => {
  try {
    // Validate timezone first
    if (!isValidTimezone(timezone)) {
      return {
        success: false,
        message: "Invalid timezone format",
        error: "Timezone validation failed",
      };
    }

    // Update timezone (this will update both Veterinarian and User models)
    const response = await updateVeterinarianTimezone(timezone);

    if (response.success) {
      return {
        success: true,
        message: "Timezone synchronized successfully across all models",
      };
    } else {
      return {
        success: false,
        message: response.message || "Failed to synchronize timezone",
        error: response.error || "Sync failed",
      };
    }
  } catch (error) {
    console.error("Error syncing timezone:", error);
    return {
      success: false,
      message: "An unexpected error occurred during timezone sync",
      error: "Sync error",
    };
  }
};

/**
 * Get available timezones with their offsets for dropdown/selection
 * @returns Array of timezone objects with value, label, and offset
 */
export const getAvailableTimezones = () => {
  return getTimezones().map((tz) => ({
    ...tz,
    isValid: isValidTimezone(tz.value),
  }));
};

/**
 * Format current time in veterinarian's timezone
 * @returns Promise<string> - Formatted current time
 */
export const getCurrentTimeInVeterinarianTimezone =
  async (): Promise<string> => {
    try {
      const timezoneInfo = await getTimezoneInfo();
      return getCurrentTimeInTimezone(timezoneInfo.timezone);
    } catch (error) {
      console.error(
        "Error getting current time in veterinarian timezone:",
        error
      );
      return getCurrentTimeInTimezone(getUserTimezone());
    }
  };
