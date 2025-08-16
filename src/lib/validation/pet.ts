import { z } from "zod";

// Pet registration validation schema
export const petRegistrationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Pet name must be at least 2 characters").optional(),
  image: z.string().url("Must be a valid image URL").optional(),

  species: z
    .enum(
      [
        "dog",
        "cat",
        "bird",
        "rabbit",
        "hamster",
        "guinea-pig",
        "ferret",
        "reptile",
        "fish",
        "other",
      ],
      { message: "Please select a species" }
    )
    .optional(),

  breed: z.string().min(2, "Breed is required").optional(),
  gender: z
    .enum(["male", "female"], { message: "Please select gender" })
    .optional(),
  primaryColor: z.string().min(2, "Primary color is required").optional(),

  spayedNeutered: z
    .enum(["spayed", "neutered", "intact"], {
      message: "Please select spay/neuter status",
    })
    .optional(),

  weight: z.number().min(0.1, "Weight must be greater than 0").optional(),
  weightUnit: z
    .enum(["kg", "lbs"], { message: "Please select weight unit" })
    .optional(),

  dateOfBirth: z.string().min(1, "Date of birth is required").optional(),
  microchipId: z.string().optional(),

  allergies: z.array(z.string()).optional(),
  medicalConditions: z.array(z.string()).optional(),
  currentMedications: z.array(z.string()).optional(),

  emergencyContact: z.string().optional(),
  veterinarianNotes: z.string().optional(),

  lastVisit: z.string().optional(), // ISO date string
  nextVaccination: z.string().optional(), // ISO date string

  healthStatus: z
    .enum(["Healthy", "Under Treatment", "Critical", "Recovering", "Unknown"], {
      message: "Please select a health status",
    })
    .optional(),
});
// Type export
export type PetRegistrationData = z.infer<typeof petRegistrationSchema>;
