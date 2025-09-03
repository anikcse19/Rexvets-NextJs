import { Appointment, PetParent } from ".";

export interface PharmacyRequest {
  _id: string;
  pharmacyName: string;
  phoneNumber: string;
  street: string;
  city: string;
  state: string;
  appointment: Appointment;
  petParentId: PetParent;
  status: "pending" | "approved" | "rejected" | "completed";
  paymentStatus: "unpaid" | "paid" | "refunded";
  amount: number;
  isDeleted: boolean;
  transactionID: string;
  paymentIntentId: string;
  stripeCustomerId: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PharmacyFormData {
  pharmacyName: string;
  phoneNumber: string;
  street: string;
  city: string;
  state: string;
  appointmentId: string;
}
