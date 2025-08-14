import { z } from "zod";

// Personal Information Schema
export const personalInfoSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"], {
    message: "Please select a gender",
  }),
  address: z.string().min(10, "Address must be at least 10 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(4, "ZIP code is required"),
  country: z.string().min(2, "Country is required"),
});

// Professional Information Schema
export const professionalInfoSchema = z.object({
  licenseNumber: z.string().min(5, "License number is required"),
  yearsOfExperience: z.number().min(0, "Years of experience must be positive"),
  education: z.string().min(10, "Education details are required"),
  certifications: z.array(z.string()).optional(),
  clinicName: z.string().min(2, "Clinic name is required"),
  clinicAddress: z.string().min(10, "Clinic address is required"),
  emergencyContact: z.string().min(10, "Emergency contact is required"),
});

// Areas of Interest Schema
export const areasOfInterestSchema = z.object({
  specialties: z
    .array(z.string())
    .min(1, "Please select at least one specialty"),
  interests: z.array(z.string()).optional(),
  researchAreas: z.array(z.string()).optional(),
});

// Species Treated Schema
export const speciesTreatedSchema = z.object({
  species: z
    .array(
      z.object({
        name: z.string(),
        experience: z.enum(["beginner", "intermediate", "advanced", "expert"]),
        yearsOfExperience: z.number().min(0),
      })
    )
    .min(1, "Please add at least one species"),
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
export type SpeciesTreatedFormData = z.infer<typeof speciesTreatedSchema>;
export type SecuritySettingsFormData = z.infer<typeof securitySettingsSchema>;
