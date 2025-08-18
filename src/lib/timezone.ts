import moment from "moment-timezone";

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
