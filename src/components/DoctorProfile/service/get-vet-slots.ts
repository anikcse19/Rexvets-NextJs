import config from "@/config/env.config";

export const getVetSlots = async ({
  id,
  startDate,
  endDate,
  timezone,
}: {
  id: string;
  startDate: string;
  endDate: string;
  timezone: string;
}) => {
  // Fetch only available slots (excludes booked, blocked, and past slots)
  const res = await fetch(
    `${config.BASE_URL}/api/appointments/booking/slot/todays-slot?vetId=${id}&startDate=${startDate}&endDate=${endDate}&timezone=${encodeURIComponent(timezone)}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch vets: ${res.statusText}`);
  }

  const data = await res.json();

  return data?.data;
};
