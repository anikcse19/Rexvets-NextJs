import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export async function updateDoctorStatus(
  id: string,
  status: "approved" | "pending" | "suspended"
) {
  try {
    const res = await fetch(`/api/veterinarian/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    return await res.json();
  } catch (error) {
    console.error("Failed to update status:", error);
    return { success: false };
  }
}

export async function updateTechnicianStatus(
  doctorId: string,
  newStatus: "pending" | "yes" | "suspended" | "no"
) {
  try {
    const doctorRef = doc(db, "Doctors", "Technician", "Technician", doctorId);

    await updateDoc(doctorRef, {
      Approved: newStatus,
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating status:", error);
    return { success: false, error };
  }
}

export async function getVetSlots(
  vetId: string,
  startDate: string,
  endDate: string
) {
  try {
    const res = await fetch(
      `/api/appointments/booking/slot/${vetId}?limit=1000&status=available&startDate=${startDate}&endDate=${endDate}`
    );
    return await res.json();
  } catch (error) {
    console.error("Failed to update status:", error);
    return { success: false };
  }
}
