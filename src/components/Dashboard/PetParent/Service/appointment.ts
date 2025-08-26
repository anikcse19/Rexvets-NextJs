"use server";
import config from "@/config/env.config";
import { cookies } from "next/headers";

export const getAppointmentById = async (appointmentId: string) => {
  const cookieStore = cookies();

  console.log("appointmentId", appointmentId);
  const res = await fetch(
    config.BASE_URL + "/api/appointments/" + appointmentId,
    {
      headers: {
        Cookie: cookieStore.toString(), // forward cookies
      },
      cache: "no-store", // ensure fresh data
    }
  );

  console.log("res", res);

  if (!res.ok) {
    throw new Error("Failed to fetch appointment details");
  }

  const data = await res.json();
  return data;
};
