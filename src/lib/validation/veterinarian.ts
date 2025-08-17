import { z } from "zod";

// File validation schema
const fileSchema = z.object({
  name: z.string(),
  size: z.number().max(10 * 1024 * 1024, "File size must be less than 10MB"),
  type: z.string().refine(
    (type) => {
      const allowedTypes = [
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      return allowedTypes.includes(type);
    },
    "File type not allowed. Allowed types: JPG, PNG, GIF, WEBP, PDF, DOC, DOCX"
  ),
});

// Time slot validation
const timeSlotSchema = z.object({
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
}).refine(
  (data) => {
    const start = new Date(`2000-01-01T${data.startTime}`);
    const end = new Date(`2000-01-01T${data.endTime}`);
    return start < end;
  },
  {
    message: "End time must be after start time",
    path: ["endTime"],
  }
);

// Internal schedule validation (for individual days)
const internalScheduleSchema = z.record(z.string(), z.array(timeSlotSchema));

// License validation
const licenseSchema = z.object({
  licenseNumber: z.string().min(1, "License number is required"),
  deaNumber: z.string().optional(),
  state: z.string().min(1, "State is required"),
  licenseFile: fileSchema.nullable(),
});

// Basic info step validation
export const basicInfoSchema = z.object({
  firstName: z.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),
  
  lastName: z.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),
  
  postNominalLetters: z.string().optional(),
  
  gender: z.enum(["male", "female", "other"]),
  
  email: z.string()
    .email("Invalid email address")
    .min(1, "Email is required"),
  
  city: z.string()
    .min(2, "City must be at least 2 characters")
    .max(100, "City cannot exceed 100 characters"),
  
  state: z.string()
    .min(2, "State must be at least 2 characters")
    .max(100, "State cannot exceed 100 characters"),
  
  countryCode: z.string()
    .min(2, "Country code is required")
    .max(3, "Country code cannot exceed 3 characters"),
  
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits")
    .regex(/^[\+]?[1-9][\d]{0,15}$/, "Invalid phone number format"),
  
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  
  confirmPassword: z.string()
    .min(1, "Please confirm your password"),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
);

// Schedule step validation
export const scheduleSchema = z.object({
  schedule: internalScheduleSchema,
});

// Profile step validation
export const profileSchema = z.object({
  profilePicture: fileSchema.nullable(),
  signature: z.string().optional(),
  signatureImage: fileSchema.nullable(),
  cv: fileSchema.nullable(),
  licenses: z.array(licenseSchema).min(1, "At least one license is required"),
});

// Complete veterinarian profile validation
export const veterinarianProfileSchema = basicInfoSchema
  .merge(scheduleSchema)
  .merge(profileSchema);

// Type exports
export type BasicInfoData = z.infer<typeof basicInfoSchema>;
export type ScheduleData = z.infer<typeof scheduleSchema>;
export type ProfileData = z.infer<typeof profileSchema>;
export type VeterinarianProfileData = z.infer<typeof veterinarianProfileSchema>;
export type LicenseData = z.infer<typeof licenseSchema>;
export type TimeSlotData = z.infer<typeof timeSlotSchema>;
export type FileData = z.infer<typeof fileSchema>;
