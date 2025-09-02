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
  licenses: License[];
  bio: string;
  education: any[]; // if you know structure, replace `any[]` with proper type
  experience: any[]; // same here
  certifications: any[]; // same here
  languages: string[];
  timezone: string;
  isEmailVerified: boolean;
  isActive: boolean;
  isDeleted: boolean;
  isApproved: boolean;
  locale: string;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  __v: number;
  lastLogin: string; // ISO date
  isLocked: boolean;
  id: string;
}
