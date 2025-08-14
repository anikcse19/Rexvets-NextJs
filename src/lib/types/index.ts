export interface User {
  id: string;
  email: string;
  name?: string;
  role: "pet_parent" | "veterinarian" | "technician";
  timezone?: string;
}

export interface PetParent extends User {
  phone?: string;
  state?: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export interface Schedule {
  [key: string]: TimeSlot[];
}

export interface License {
  licenseNumber: string;
  deaNumber?: string;
  state: string;
  licenseFile: File | null;
}

export interface VeterinarianProfile {
  firstName: string;
  lastName: string;
  postNominalLetters?: string;
  gender: "male" | "female" | "other";
  email: string;
  city: string;
  state: string;
  countryCode: string;
  phone: string;
  password: string;
  confirmPassword: string;
  schedule: Schedule;
  profilePicture: File | null;
  signature?: string;
  signatureImage?: File | null;
  cv: File | null;
  licenses: License[];
}

export interface RegistrationStep {
  step: number;
  title: string;
  description: string;
}

export interface MenuItems {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  badge?: string | number;
  external_href?: string;
}

export interface Appointment {
  id: string;
  petName: string;
  petImage: string;
  petType: string;
  parentName: string;
  parentImage: string;
  appointmentDate: string;
  appointmentTime: string;
  timezone: string;
  status:
    | "confirmed"
    | "completed"
    | "cancelled"
    | "pending"
    | "in-progress"
    | "no-show"
    | "rescheduled";
  bookingTime: string;
  seenBefore: boolean;
  service: string;
  notes?: string;
}
