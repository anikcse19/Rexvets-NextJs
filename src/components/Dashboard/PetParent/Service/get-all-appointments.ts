import config from "@/config/env.config";

export const getParentAppointments = async (parentId: string) => {
  const res = await fetch(
    config.BASE_URL + "/api/appointments?petParent=" + parentId
  );

  if (!res.ok) {
    throw new Error("Failed to fetch appointments");
  }

  const data = await res.json();
  return data;
};
