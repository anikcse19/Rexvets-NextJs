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
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  specialization: string;
  consultationFee: number;
  available: boolean;
  profileImage?: string;
  cv?: string;
  signatureImage?: string;
  signature?: string;
  licenses?: Array<{
    licenseNumber: string;
    deaNumber?: string;
    state: string;
    licenseFile?: string;
  }>;
  bio?: string;
  education: Array<{
    degree: string;
    institution: string;
    year: number;
  }>;
  experience: Array<{
    position: string;
    institution: string;
    startDate: Date;
    endDate?: Date;
    description?: string;
  }>;
  // New optional fields
  treatedSpecies?: string[];
  specialities?: string[];
  interests?: string[];
  researchAreas?: string[];
  monthlyGoal?: number;
  experienceYears?: string;
  certifications: string[];
  languages: string[];
  timezone: string;
  schedule: {
    monday: { start: string; end: string; available: boolean };
    tuesday: { start: string; end: string; available: boolean };
    wednesday: { start: string; end: string; available: boolean };
    thursday: { start: string; end: string; available: boolean };
    friday: { start: string; end: string; available: boolean };
    saturday: { start: string; end: string; available: boolean };
    sunday: { start: string; end: string; available: boolean };
  };
  isActive: boolean;
  isApproved: boolean;
  approvalDate?: Date;
  approvedBy?: string;
  // Soft delete flag
  isDeleted?: boolean;

  // Additional profile fields
  firstName?: string;
  lastName?: string;
  locale?: string;
  dob?: Date;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: number;
  country?: string;
  yearsOfExperience?: string;
  clinic?: {
    name: string;
    address: string;
  };
  gender?: "male" | "female";
  noticePeriod?: number;

  // Reviews reference - veterinarians receive reviews from pet parents
  reviews?: string[];

  fcmTokens: {
    web?: string;
    mobile?: string;
  };
  averageRating?: number;
  ratingCount?: number;
  reviewCount?: number;
  createdAt: Date;
  updatedAt: Date;
}
