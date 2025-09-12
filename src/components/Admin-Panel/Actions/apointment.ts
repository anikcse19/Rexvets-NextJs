import { db } from "@/lib/firebase"; // your Firebase init
import { format, isValid } from "date-fns";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

export async function fetchDoctorSchedule(doctorRefId: string) {
  const doctorDoc = await getDoc(
    doc(db, "Doctors", "Veterinarian", "Veterinarian", doctorRefId)
  );
  return doctorDoc.data()?.Schedule ?? [];
}

export async function saveRescheduledAppointment(appointment: any) {
  // Save to RescheduledAppointments
  await addDoc(collection(db, "RescheduledAppointments"), appointment);

  // Remove from Appointments
  await deleteDoc(doc(db, "Appointments", appointment.id));
}

export async function updateRescheduledAppointment(
  id: string,
  appointment: any
) {
  const q = query(
    collection(db, "RescheduledAppointments"),
    where("id", "==", id)
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error("No appointment found with the given field id");
  }

  // 2. Get the Firestore document ID
  const docId = snapshot.docs[0].id;
  const appointmentRef = doc(db, "RescheduledAppointments", docId);

  // 3. Update the document
  await updateDoc(appointmentRef, appointment);
}

export async function fetchDoctorBookedTimeSlots(
  doctorRefId: string,
  selectedDate: any
) {
  if (!selectedDate || !isValid(selectedDate)) {
    console.warn(
      "Invalid or missing selectedDate passed to fetchDoctorBookedTimeSlots"
    );
    return [];
  }

  const formatted = format(selectedDate, "yyyy-MM-dd");

  const snapshot = await getDocs(collection(db, "BookedTimeslots"));
  const matching = snapshot.docs
    .map((doc) => doc.data())
    .filter((item) => item.doctorId === doctorRefId && item.date === formatted);

  return matching ?? [];
}

export async function createNewBookedSlot(data: any) {
  try {
    await addDoc(collection(db, "BookedTimeslots"), data);

    return { status: "success" };
  } catch (error) {
    return { status: "failed" };
  }
}
