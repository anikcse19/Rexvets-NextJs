import moment from "moment";

interface Slot {
  _id: string;
  vetId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
  __v: number;
  updatedAt: string;
  formattedDate: string;
  formattedStartTime: string;
  formattedEndTime: string;
}

interface Period {
  startTime: string;
  endTime: string;
  totalHours: number;
}

interface DateGroup {
  date: {
    start: Date;
    end: Date;
  };
  periods: Period[];
  numberOfPeriods: number;
  numberOfDays: number;
}

export const groupSlotsIntoPeriods = (slots: Slot[]): DateGroup[] => {
  // Group slots by date
  const groups: { [key: string]: Slot[] } = {};

  slots.forEach((slot) => {
    const key = moment(slot.date).format("YYYY-MM-DD");
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(slot);
  });

  const result: DateGroup[] = [];

  // Process each date group
  Object.keys(groups).forEach((date) => {
    const dateSlots = groups[date];
    // Sort slots by startTime
    dateSlots.sort(
      (a, b) => moment(a.startTime).valueOf() - moment(b.startTime).valueOf()
    );

    const periods: Period[] = [];
    if (dateSlots.length === 0) return;

    // Initialize first period
    let currentStart = dateSlots[0].startTime;
    let currentEnd = dateSlots[0].endTime;

    // Group slots into periods based on 50-minute gap
    for (let i = 1; i < dateSlots.length; i++) {
      const nextStart = dateSlots[i].startTime;
      const gap = moment(nextStart).diff(moment(currentEnd), "minutes");

      if (gap > 50) {
        const totalHours = moment(currentEnd).diff(
          moment(currentStart),
          "hours",
          true
        );
        periods.push({
          startTime: currentStart,
          endTime: currentEnd,
          totalHours,
        });
        currentStart = nextStart;
        currentEnd = dateSlots[i].endTime;
      } else {
        currentEnd = dateSlots[i].endTime;
      }
    }

    // Add the last period
    const totalHours = moment(currentEnd).diff(
      moment(currentStart),
      "hours",
      true
    );
    periods.push({ startTime: currentStart, endTime: currentEnd, totalHours });

    // Calculate date range for the group
    const startDate = moment(date).startOf("day").toDate();
    const endDate = moment(date).endOf("day").toDate();

    // Calculate number of days (should be 1 since we're grouping by single dates)
    const numberOfDays = 1;

    // Add to result
    result.push({
      date: { start: startDate, end: endDate },
      periods,
      numberOfPeriods: periods.length,
      numberOfDays,
    });
  });

  // Sort results by date
  result.sort(
    (a, b) => moment(a.date.start).valueOf() - moment(b.date.start).valueOf()
  );

  return result;
};
