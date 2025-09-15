// Appointment types that can be safely used on both client and server
export enum AppointmentStatus {
  UPCOMING = "upcoming",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  RESCHEDULED = "rescheduled",
}

export enum AppointmentType {
  GENERAL_CHECKUP = "general_checkup",
  VACCINATION = "vaccination",
  EMERGENCY = "emergency",
  SURGERY_CONSULTATION = "surgery_consultation",
  FOLLOW_UP = "follow_up",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  REFUNDED = "refunded",
  FAILED = "failed",
}

// Client-safe appointment interface (without mongoose Document)
export interface AppointmentData {
  _id: string;
  veterinarian: string; // ObjectId as string
  petParent: string; // ObjectId as string
  pet: string; // ObjectId as string
  appointmentDate: Date | string;
  durationMinutes?: number;
  meetingLink?: string;
  notes?: string;
  reasonForVisit: string;
  feeUSD: number;
  status: AppointmentStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
  isFollowUp: boolean;
  appointmentType: AppointmentType;
  paymentStatus: PaymentStatus;
  reminderSent: boolean;
  isDeleted: boolean;
  slotId: string; // ObjectId as string
}
