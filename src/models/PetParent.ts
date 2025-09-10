import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IPetParent extends Document {
  name: string;
  email: string;
  phoneNumber?: string;
  state?: string;
  city?: string;
  address?: string;
  zipCode?: string;
  country?: string;
  dob?: Date;
  profileImage?: string;
  gender?: string;
  isActive: boolean;
  // Soft delete flag
  isDeleted?: boolean;

  // Additional profile fields
  firstName?: string;
  lastName?: string;
  locale?: string;

  // Donation tracking for secure booking
  donationPaid: boolean;
  lastDonationDate?: Date;
  lastDonationAmount?: number;

  pets: Array<{
    name: string;
    type: "dog" | "cat" | "bird" | "fish" | "reptile" | "other";
    breed?: string;
    age?: number;
    weight?: number;
    medicalHistory?: string[];
  }>;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  timezone: string;
  fcmTokens: {
    web?: string;
    mobile?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  subscriptionId: Types.ObjectId;
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
export interface IPetParentModel extends Model<IPetParent> {
  // Authentication methods removed - now handled by User model
  // findByEmailForAuth(email: string): Promise<IPetParent | null>;
  // findByEmailVerificationToken(token: string): Promise<IPetParent | null>;
  // findByPasswordResetToken(token: string): Promise<IPetParent | null>;
}

const petParentSchema = new Schema<IPetParent>(
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
      required: function (this: any) {
        // Phone number is required only if user is not signing up via Google OAuth
        return !this.googleId;
      },
      trim: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"],
    },
    state: {
      type: String,
      required: function (this: any) {
        // State is required only if user is not signing up via Google OAuth
        return !this.googleId;
      },
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    zipCode: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    profileImage: {
      type: String,
      trim: true,
    },
    dob: {
      type: Date,
    },
    // isEmailVerified removed - now handled by User model
    // Authentication fields removed - now handled by User model
    // emailVerificationToken: { ... },
    // emailVerificationExpires: { ... },
    // passwordResetToken: { ... },
    // passwordResetExpires: { ... },
    // lastLogin: { ... },
    // loginAttempts: { ... },
    // lockUntil: { ... },
    isActive: {
      type: Boolean,
      default: true,
    },

    // Soft delete flag
    isDeleted: {
      type: Boolean,
      default: false,
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

    // Donation tracking for secure booking
    donationPaid: {
      type: Boolean,
      default: false,
    },
    lastDonationDate: {
      type: Date,
    },
    lastDonationAmount: {
      type: Number,
      min: 0,
    },

    pets: [
      {
        name: {
          type: String,
          trim: true,
        },
        type: {
          type: String,
          enum: ["dog", "cat", "bird", "fish", "reptile", "other"],
        },
        breed: {
          type: String,
          trim: true,
        },
        age: {
          type: Number,
          min: 0,
        },
        weight: {
          type: Number,
          min: 0,
        },
        medicalHistory: [
          {
            type: String,
            trim: true,
          },
        ],
      },
    ],
    emergencyContact: {
      name: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
      relationship: {
        type: String,
        trim: true,
      },
    },
    timezone: {
      type: String,
      default: "UTC",
    },
    fcmTokens: {
      web: String,
      mobile: String,
    },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes (email is auto-created by unique)
petParentSchema.index({ isActive: 1 });
petParentSchema.index({ state: 1 });

// Virtual for checking if account is locked - removed since lockUntil field was removed
// petParentSchema.virtual("isLocked").get(function () {
//   return !!(this.lockUntil && this.lockUntil > new Date());
// });

// Password hashing removed - now handled by User model
// petParentSchema.pre("save", async function (next) { ... });

// Password comparison removed - now handled by User model
// petParentSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> { ... };

// Authentication methods removed - now handled by User model
// petParentSchema.methods.generateEmailVerificationToken = function (): string { ... };
// petParentSchema.methods.generatePasswordResetToken = function (): string { ... };
// petParentSchema.methods.checkIfLocked = function (): boolean { ... };
// petParentSchema.methods.incrementLoginAttempts = async function (): Promise<void> { ... };
// petParentSchema.methods.resetLoginAttempts = async function (): Promise<void> { ... };

// Authentication static methods removed - now handled by User model
// petParentSchema.statics.findByEmailForAuth = function (email: string) { ... };
// petParentSchema.statics.findByEmailVerificationToken = function (token: string) { ... };
// petParentSchema.statics.findByPasswordResetToken = function (token: string) { ... };

export default mongoose.models.PetParent ||
  mongoose.model<IPetParent, IPetParentModel>("PetParent", petParentSchema);
