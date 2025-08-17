export interface PharmacyRequest {
  id: string;
  pharmacyName: string;
  phoneNumber: string;
  street: string;
  city: string;
  state: string;
  appointmentId: string;
  appointmentDate: string;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: string;
  paymentStatus: "unpaid" | "paid" | "failed";
  amount: number;
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  petName: string;
  veterinarian: string;
  service: string;
}

export interface PharmacyFormData {
  pharmacyName: string;
  phoneNumber: string;
  street: string;
  city: string;
  state: string;
  appointmentId: string;
}
