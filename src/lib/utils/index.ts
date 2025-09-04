import { type ClassValue, clsx } from "clsx";
import {
  differenceInCalendarDays,
  endOfDay,
  format,
  formatDistanceToNowStrict,
  startOfDay,
} from "date-fns";
import { twMerge } from "tailwind-merge";

/**
 * The function `cn` in TypeScript merges multiple class values using `clsx` and `twMerge`.
 * @param {ClassValue[]} inputs - The `inputs` parameter in the `cn` function is a rest parameter that
 * allows you to pass any number of arguments of type `ClassValue`. These arguments can be strings,
 * arrays, or objects representing CSS class names or class name mappings. The function then merges and
 * processes these class values using the
 * @returns The `cn` function is returning the result of merging the class names passed as arguments
 * using the `clsx` function and then applying Tailwind CSS utility classes using the `twMerge`
 * function.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
/**
 * The `toSlug` function takes a string input, converts it to lowercase, removes leading and trailing
 * spaces, splits it by spaces, and joins the parts with hyphens to create a slug.
 * @param {string} input - The `toSlug` function takes a string input and converts it into a slug
 * format. The input string is first converted to lowercase, trimmed of any leading or trailing
 * whitespace, and then any consecutive whitespace characters are replaced with a single hyphen `-`.
 * @returns The `toSlug` function is being returned.
 */
export const toSlug = (input: string): string => {
  return input.toLowerCase().trim().split(/\s+/).join("-");
};

export const calculatePetAge = (dateOfBirth: string) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += lastMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
};

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
export const formatDateTime = (
  dateString: string,
  timeZone = "Asia/Dhaka"
): string => {
  const formattedDate = format(dateString, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
  return formattedDate;
};

export const formatDateForAPI = (date: Date): string => {
  return date.toISOString();
};

export const formatDateRange = (start: Date, end: Date) => {
  return {
    start: startOfDay(start).toISOString(),
    end: endOfDay(end).toISOString(),
  };
};

export const formatTimeSlot = (date: Date, timeString: string): string => {
  const [hours, minutes] = timeString.split(":").map(Number);
  const slotDate = new Date(date);
  slotDate.setHours(hours, minutes, 0, 0);
  return slotDate.toISOString();
};

export const generateTimeOptions = (): string[] => {
  const times: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      times.push(timeString);
    }
  }
  return times;
};

export const formatDisplayTime = (time: string): string => {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minutes} ${ampm}`;
};
export const getDaysBetween = (dateRange: {
  start: Date;
  end: Date;
}): string => {
  const days = differenceInCalendarDays(dateRange.end, dateRange.start);
  const totalDays = days === 0 ? 1 : days + 1;

  return totalDays === 1 ? "1 day" : `${totalDays} days`;
};
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const result = formatDistanceToNowStrict(date, { addSuffix: false });

  // Example outputs from formatDistanceToNowStrict:
  // "1 minute", "2 hours", "3 days"
  const [value, unit] = result.split(" ");

  switch (unit) {
    case "second":
    case "seconds":
      return `${value}s ago`;
    case "minute":
    case "minutes":
      return `${value}m ago`;
    case "hour":
    case "hours":
      return `${value}h ago`;
    case "day":
    case "days":
      return `${value}d ago`;
    case "month":
    case "months":
      return `${value}mo ago`;
    case "year":
    case "years":
      return `${value}y ago`;
    default:
      return result + " ago";
  }
};
