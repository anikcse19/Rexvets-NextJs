import config from "@/config/env.config";
import { SlotStatus } from "@/lib";

export const getVetSlots = async ({
  id,
  startDate,
  endDate,
}: {
  id: string;
  startDate: string;
  endDate: string;
}) => {
  // Fetch only available slots (excludes booked, blocked, and past slots)
  const res = await fetch(
    `${config.BASE_URL}/api/appointments/booking/slot/${id}?limit=1000&status=${SlotStatus.AVAILABLE}&startDate=${startDate}&endDate=${endDate}`,
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
