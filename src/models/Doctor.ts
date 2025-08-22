// lib/models/Doctor.ts
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IDoctor {
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
  treatedSpecies?: string[];
  specialities?: string[];
  interests?: string[];
  researchAreas?: string[];
  monthlyGoal?: number;
  experienceYears?: string;
  certifications: Array<{
    name: string;
    issuingOrganization: string;
    issueDate: Date;
    expiryDate?: Date;
  }>;
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
  isDeleted?: boolean;
  firstName?: string;
  lastName?: string;
  locale?: string;
  reviews?: mongoose.Types.ObjectId[];
  fcmTokens: {
    web?: string;
    mobile?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IDoctorDocument extends IDoctor, Document {}

const DoctorSchema = new Schema<IDoctorDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    specialization: { type: String, required: true },
    consultationFee: { type: Number, required: true },
    available: { type: Boolean, required: true, default: true },
    profileImage: String,
    cv: String,
    signatureImage: String,
    signature: String,
    licenses: [
      {
        licenseNumber: { type: String, required: true },
        deaNumber: String,
        state: { type: String, required: true },
        licenseFile: String,
      },
    ],
    bio: String,
    education: [
      {
        degree: { type: String, required: true },
        institution: { type: String, required: true },
        year: { type: Number, required: true },
      },
    ],
    experience: [
      {
        position: { type: String, required: true },
        institution: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: Date,
        description: String,
      },
    ],
    treatedSpecies: [String],
    specialities: [String],
    interests: [String],
    researchAreas: [String],
    monthlyGoal: Number,
    experienceYears: String,
    certifications: [
      {
        name: { type: String, required: true },
        issuingOrganization: { type: String, required: true },
        issueDate: { type: Date, required: true },
        expiryDate: Date,
      },
    ],
    languages: { type: [String], required: true },
    timezone: { type: String, required: true },
    schedule: {
      monday: { start: String, end: String, available: Boolean },
      tuesday: { start: String, end: String, available: Boolean },
      wednesday: { start: String, end: String, available: Boolean },
      thursday: { start: String, end: String, available: Boolean },
      friday: { start: String, end: String, available: Boolean },
      saturday: { start: String, end: String, available: Boolean },
      sunday: { start: String, end: String, available: Boolean },
    },
    isActive: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: false },
    approvalDate: Date,
    approvedBy: String,
    isDeleted: { type: Boolean, default: false },
    firstName: String,
    lastName: String,
    locale: String,
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    fcmTokens: {
      web: String,
      mobile: String,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite in dev
export const DoctorModel: Model<IDoctorDocument> =
  mongoose.models.Doctor ||
  mongoose.model<IDoctorDocument>("Doctor", DoctorSchema);
