import config from "@/config/env.config";

export const getAppointmentById = async (appointmentId: string) => {
  const res = await fetch(
    config.BASE_URL + "/api/appointments/" + appointmentId
  );
  if (!res.ok) {
    throw new Error("Failed to fetch appointment details");
  }

  const data = await res.json();
  return data;
};
