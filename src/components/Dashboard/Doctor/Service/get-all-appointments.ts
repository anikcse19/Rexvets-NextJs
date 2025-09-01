import config from "@/config/env.config";

export const getVeterinarianAppointments = async (veterinarianIdId: string) => {
  const res = await fetch(
    config.BASE_URL + "/api/appointments?veterinarian=" + veterinarianIdId
  );

  if (!res.ok) {
    throw new Error("Failed to fetch appointments");
  }

  const data = await res.json();
  return data;
};
