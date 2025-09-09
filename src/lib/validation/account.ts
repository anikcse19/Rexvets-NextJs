import { z } from "zod";

// Personal Information Schema
export const personalInfoSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().optional(),
  dob: z.string().optional(),
  gender: z.string(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  bio: z.string().min(150, "Bio must be at most 1000 characters").optional(),
  profileImage: z.string().url("Please provide a valid URL").optional(),
});

export const professionalInfoSchema = z.object({
  licenseNumber: z
    .string()
    .transform((val) => (val === "" ? undefined : val))
    .optional()
    .refine((val) => !val || val.length >= 5, {
      message: "License number must be at least 5 characters",
    }),
  yearsOfExperience: z.number().min(0, "Years of experience must be positive"),
  education: z.string().min(10, "Education details are required").optional(),
  certifications: z.array(z.string()).optional(),
  clinicName: z.string().min(2, "Clinic name is required"),
  clinicAddress: z.string().min(10, "Clinic address is required"),
  licenses: z
    .array(
      z.object({
        licenseNumber: z.string().min(5, "License number is required"),
        deaNumber: z.string().optional(),
        state: z.string().optional(),
        licenseFile: z.any().optional(), // File or null
      })
    )
    .optional(),
});

// Areas of Interest Schema
export const areasOfInterestSchema = z.object({
  specialties: z
    .array(z.string())
    .min(1, "Please select at least one specialty"),
  interests: z.array(z.string()).optional(),
  researchAreas: z.array(z.string()).optional(),
  speciesTreated: z
    .array(z.string())
    .min(1, "Please select at least one species"),
});

// Security Settings Schema
export const securitySettingsSchema = z
  .object({
    currentPassword: z.string().min(8, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
    twoFactorEnabled: z.boolean().optional(),
    emailNotifications: z.boolean().optional(),
    smsNotifications: z.boolean().optional(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Type exports
export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type ProfessionalInfoFormData = z.infer<typeof professionalInfoSchema>;
export type AreasOfInterestFormData = z.infer<typeof areasOfInterestSchema>;
export type SecuritySettingsFormData = z.infer<typeof securitySettingsSchema>;
