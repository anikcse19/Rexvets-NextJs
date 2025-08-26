import config from "@/config/env.config";

export const getVetSlots = async ({
  id,
  startDate,
  endDate,
}: {
  id: string;
  startDate: string;
  endDate: string;
}) => {
  const res = await fetch(
    `${config.BASE_URL}/api/appointments/booking/slot/${id}?limit=1000&status=available&startDate=${startDate}&endDate=${endDate}`,
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
