import { Gender, VeterinarianStatus } from "@/lib/constants/veterinarian";
import mongoose, { Document, Model, Schema } from "mongoose";

// Re-export for backward compatibility
export { Gender, VeterinarianStatus };

export interface IVeterinarian extends Document {
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
    licenseNumber?: string;
    deaNumber?: string;
    state?: string;
    licenseFile?: string;
  }>;
  bio?: string;
  // education: Array<{
  //   degree: string;
  //   institution: string;
  //   year: number;
  // }>;
  education: string;
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
  status?: VeterinarianStatus;
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
  zipCode?: string;
  country?: string;
  yearsOfExperience?: string;
  clinic?: {
    name: string;
    address: string;
  };
  gender?: Gender;
  noticePeriod?: number;

  // Reviews reference - veterinarians receive reviews from pet parents
  reviews?: mongoose.Types.ObjectId[];

  fcmTokens: {
    web?: string;
    mobile?: string;
  };
  averageRating?: number;
  ratingCount?: number;
  reviewCount?: number;
  createdAt: Date;
  updatedAt: Date;

  // Methods
  recalculateReviewStats(): Promise<{
    reviewCount: number;
    ratingCount: number;
    averageRating: number;
  }>;

  // Authentication methods removed - now handled by User model
  // comparePassword(candidatePassword: string): Promise<boolean>;
  // generateEmailVerificationToken(): string;
  // generatePasswordResetToken(): string;
  // checkIfLocked(): boolean;
  // incrementLoginAttempts(): Promise<void>;
  // resetLoginAttempts(): Promise<void>;
}

// Static methods interface
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IVeterinarianModel extends Model<IVeterinarian> {
  // Authentication methods removed - now handled by User model
  // findByEmailForAuth(email: string): Promise<IVeterinarian | null>;
  // findByEmailVerificationToken(token: string): Promise<IVeterinarian | null>;
  // findByPasswordResetToken(token: string): Promise<IVeterinarian | null>;
}

const veterinarianSchema = new Schema<IVeterinarian>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    // Password field removed - now handled by User model
    // password: { ... },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
      trim: true,
    },

    consultationFee: {
      type: Number,
      required: [false, "Consultation fee is required"],
      min: [0, "Consultation fee cannot be negative"],
    },
    available: {
      type: Boolean,
      default: true,
    },
    profileImage: {
      type: String,
      trim: true,
    },
    cv: {
      type: String,
      trim: true,
    },
    signatureImage: {
      type: String,
      trim: true,
    },
    signature: {
      type: String,
      trim: true,
    },
    licenses: [
      {
        licenseNumber: {
          type: String,
          required: true,
          trim: true,
        },
        deaNumber: {
          type: String,
          trim: true,
        },
        state: {
          type: String,
          required: true,
          trim: true,
        },
        licenseFile: { type: mongoose.Schema.Types.Mixed, default: null },
      },
    ],
    bio: {
      type: String,
      trim: true,
      maxlength: [1000, "Bio cannot exceed 1000 characters"],
    },
    // education: [
    //   {
    //     degree: {
    //       type: String,
    //       required: true,
    //       trim: true,
    //     },
    //     institution: {
    //       type: String,
    //       required: true,
    //       trim: true,
    //     },
    //     year: {
    //       type: Number,
    //       required: true,
    //       min: 1900,
    //       max: new Date().getFullYear(),
    //     },
    //   },
    // ],
    education: {
      type: String,
    },
    experience: [
      {
        position: {
          type: String,
          required: true,
          trim: true,
        },
        institution: {
          type: String,
          required: true,
          trim: true,
        },
        startDate: {
          type: Date,
          required: true,
        },
        endDate: {
          type: Date,
        },
        description: {
          type: String,
          trim: true,
        },
      },
    ],
    // New optional fields
    treatedSpecies: [
      {
        type: String,
        trim: true,
      },
    ],
    specialities: [
      {
        type: String,
        trim: true,
      },
    ],
    interests: [
      {
        type: String,
        trim: true,
      },
    ],
    researchAreas: [
      {
        type: String,
        trim: true,
      },
    ],
    monthlyGoal: {
      type: Number,
      min: [0, "Monthly goal cannot be negative"],
    },
    experienceYears: {
      type: String,
      trim: true,
    },
    certifications: [
      {
        type: String,
        trim: true,
      },
    ],
    languages: [
      {
        type: String,
        trim: true,
      },
    ],
    timezone: {
      type: String,
      default: "UTC",
    },
    schedule: {
      monday: {
        start: { type: String, default: "09:00" },
        end: { type: String, default: "17:00" },
        available: { type: Boolean, default: false },
      },
      tuesday: {
        start: { type: String, default: "09:00" },
        end: { type: String, default: "17:00" },
        available: { type: Boolean, default: false },
      },
      wednesday: {
        start: { type: String, default: "09:00" },
        end: { type: String, default: "17:00" },
        available: { type: Boolean, default: false },
      },
      thursday: {
        start: { type: String, default: "09:00" },
        end: { type: String, default: "17:00" },
        available: { type: Boolean, default: false },
      },
      friday: {
        start: { type: String, default: "09:00" },
        end: { type: String, default: "17:00" },
        available: { type: Boolean, default: false },
      },
      saturday: {
        start: { type: String, default: "09:00" },
        end: { type: String, default: "17:00" },
        available: { type: Boolean, default: false },
      },
      sunday: {
        start: { type: String, default: "09:00" },
        end: { type: String, default: "17:00" },
        available: { type: Boolean, default: false },
      },
    },
    // Authentication fields removed - now handled by User model
    // isEmailVerified: { ... },
    // emailVerificationToken: { ... },
    // emailVerificationExpires: { ... },
    // passwordResetToken: { ... },
    // passwordResetExpires: { ... },
    // lastLogin: { ... },
    // loginAttempts: { ... },
    // lockUntil: { ... },
    status: {
      type: String,
      enum: Object.values(VeterinarianStatus),
      default: VeterinarianStatus.PENDING,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    approvalDate: {
      type: Date,
    },
    approvedBy: {
      type: String,
      trim: true,
    },

    // Google OAuth fields removed - now handled by User model
    // googleId: { ... },
    // googleAccessToken: { ... },
    // googleRefreshToken: { ... },
    // googleExpiresAt: { ... },
    // googleTokenType: { ... },
    // googleScope: { ... },

    // Additional profile fields
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    locale: {
      type: String,
      default: "en",
    },
    dob: {
      type: Date,
    },
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    zipCode: {
      type: String,
    },
    country: {
      type: String,
      trim: true,
      required: false,
    },
    yearsOfExperience: {
      type: String,
      trim: true,
    },
    clinic: {
      name: {
        type: String,
        trim: true,
      },
      address: {
        type: String,
        trim: true,
      },
    },
    gender: {
      type: String,
      enum: Object.values(Gender),
      lowercase: true,
      required: true,
      default: Gender.MALE,
    },
    noticePeriod: {
      type: Number,
      min: [0, "Notice period cannot be negative"],
    },
    // need all reviews for a veterinarian: now make a api:
    // Reviews reference - veterinarians receive reviews from pet parents
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    reviewCount: {
      type: Number,
      default: 0,
      min: [0, "Review count cannot be negative"],
    },
    averageRating: {
      type: Number,
      default: 0,
      min: [0, "Average rating cannot be negative"],
      max: [5, "Average rating cannot exceed 5"],
    },

    ratingCount: {
      type: Number,
      default: 0,
      min: [0, "Rating count cannot be negative"],
    },
    fcmTokens: {
      web: String,
      mobile: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes (email is auto-created by unique)
veterinarianSchema.index({ isDeleted: 1 });
veterinarianSchema.index({ isActive: 1 });
veterinarianSchema.index({ isApproved: 1 });
veterinarianSchema.index({ city: 1 }); // Index for location-based queries// no need to index city
veterinarianSchema.index({ state: 1 }); // Index for state-based queries

// Unique index for license numbers to prevent duplicates
veterinarianSchema.index(
  { "licenses.licenseNumber": 1 },
  { unique: true, sparse: true }
);

// Virtual for calculated average rating
veterinarianSchema.virtual("calculatedAverageRating").get(function () {
  return this.averageRating || 0;
});

// Method to recalculate review statistics
veterinarianSchema.methods.recalculateReviewStats = async function () {
  try {
    const ReviewModel = mongoose.model("Review");
    const stats = await ReviewModel.aggregate([
      { $match: { vetId: this._id, visible: true, isDeleted: { $ne: true } } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    if (stats.length > 0) {
      this.reviewCount = stats[0].totalReviews;
      this.ratingCount = stats[0].totalReviews;
      this.averageRating = Math.round(stats[0].averageRating * 10) / 10;
    } else {
      this.reviewCount = 0;
      this.ratingCount = 0;
      this.averageRating = 0;
    }

    await this.save();
    return {
      reviewCount: this.reviewCount,
      ratingCount: this.ratingCount,
      averageRating: this.averageRating,
    };
  } catch (error) {
    console.error("Error recalculating review stats:", error);
    throw error;
  }
};

export default mongoose.models.Veterinarian ||
  mongoose.model<IVeterinarian, IVeterinarianModel>(
    "Veterinarian",
    veterinarianSchema
  );
