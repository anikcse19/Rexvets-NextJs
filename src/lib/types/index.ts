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

export interface License {
  licenseNumber: string;
  deaNumber: string;
  state: string;
  licenseFile: string | null;
  _id: string;
  id: string;
}

export interface ScheduleDay {
  start: string;
  end: string;
  available: boolean;
}

export interface Schedule {
  monday: ScheduleDay;
  tuesday: ScheduleDay;
  wednesday: ScheduleDay;
  thursday: ScheduleDay;
  friday: ScheduleDay;
  saturday: ScheduleDay;
  sunday: ScheduleDay;
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

export interface Doctor {
  schedule: Schedule;
  loginAttempts: number;
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  specialization: string;
  consultationFee: number;
  available: boolean;
  signature: string;
  profileImage: string;
  dob?: string;
  address: string;
  city: string;
  state: string;
  zipCode: number;
  country: string;
  yearsOfExperience: string;
  clinic: {
    name: string;
    address: string;
  };
  licenses: License[];
  bio: string;
  specialties: string[];
  interests: string[];
  researchAreas: string[];
  education: any[]; // if you know structure, replace `any[]` with proper type
  experience: any[]; // same here
  certifications: any[]; // same here
  languages: string[];
  timezone: string;
  isEmailVerified: boolean;
  isActive: boolean;
  isDeleted: boolean;
  isApproved: boolean;
  rating: number; // average rating
  reviewsCount: number;
  locale: string;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  __v: number;
  lastLogin: string; // ISO date
  isLocked: boolean;
  noticePeriod?: number;
  id: string;
}

export interface TimeSlots {
  id: string;
  date: string;
  time: string;
  available: boolean;
}

export interface Review {
  id: string;
  patientName: string;
  rating: number;
  comment: string;
  date: string;
  petType: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
}

export interface DonationAmount {
  value: number;
  label: string;
  description: string;
}

export interface Help {
  _id: string;
  role: "pet_parent" | "veterinarian" | "technician" | "admin";
  name: string;
  email: string;
  phone: string;
  state: string;
  subject: string;
  details: string;
  isActive: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
  id: string;
}

<<<<<<< HEAD
// Re-export appointment types
export * from './appointment';
=======
export interface DateRange {
  start: Date;
  end: Date;
}

export interface SlotPeriod {
  start: Date;
  end: Date;
}

export interface AvailabilitySlot {
  dateRange: DateRange;
  slotPeriods: SlotPeriod[];
}

export interface ExistsingAvailability {
  id: string;
  date: Date;
  dateRange?: DateRange;
  slots: SlotPeriod[];
}

export interface CreateAvailabilityRequest {
  dateRange: {
    start: string;
    end: string;
  };
  slotPeriods: {
    start: string;
    end: string;
  }[];
}
>>>>>>> 03b8514619876345614347ed396e86dcf1b86a68
