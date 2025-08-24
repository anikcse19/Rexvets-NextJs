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

export interface License {
  licenseNumber: string;
  deaNumber: string;
  state: string;
  licenseFile: string | null;
  _id: string;
  id: string;
}

export interface Veterinarian {
  schedule: Schedule;
  loginAttempts?: number;
  _id: string;
  name: string;
  email: string;
  state?: string;
  phoneNumber: string;
  specialization: string;
  consultationFee: number;
  available: boolean;
  signature?: string | null;
  licenses: License[];
  bio: string;
  education: string[];
  experience: string[];
  certifications: string[];
  languages: string[];
  timezone: string;
  isEmailVerified: boolean;
  isActive: boolean;
  isDeleted?: boolean;
  isApproved: boolean;
  locale: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  lastLogin?: string;
  firstName?: string;
  lastName?: string;
  treatedSpecies?: string[];
  profileImage?: string;
  cv?: string;
  signatureImage?: string;
  workingHours?: Schedule;
  isLocked?: boolean;
  noticePeriod?: number;
  id: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface GetAllVetsResponse {
  veterinarians: Veterinarian[];
  pagination: Pagination;
}
