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
  timezone: string = "Asia/Dhaka"
): DateRange => {
  if (!range || !range.start || !range.end || !timezone) {
    throw Error("Invalid date range or timezone");
  }
  const today = moment.tz(timezone).startOf("day");
  const startDate = moment.tz(range.start, timezone).startOf("day");
  const endDate = moment.tz(range.end, timezone).endOf("day");

  // If start < today, shift it to today
  const effectiveStart = startDate.isBefore(today) ? today : startDate;

  return {
    start: effectiveStart.format("YYYY-MM-DD"),
    end: endDate.format("YYYY-MM-DD"),
  };
};
