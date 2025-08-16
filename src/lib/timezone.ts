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
