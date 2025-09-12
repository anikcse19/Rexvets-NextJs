import { format } from "date-fns";
import { DateTime } from "luxon";

export const convertNYToLocal = (time: string, date: any) => {
  const formatted = format(date, "yyyy-MM-dd");

  const nyTime = DateTime.fromFormat(
    `${formatted} ${time}`,
    "yyyy-MM-dd hh:mm a",
    {
      zone: "America/New_York",
    }
  );

  const userTime = nyTime.setZone(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  return userTime.toFormat("hh:mm a");
};
