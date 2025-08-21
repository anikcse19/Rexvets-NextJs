import mongoose, { Document, Schema, Model } from 'mongoose';

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
  // Soft delete flag
  isDeleted?: boolean;
  
  // Additional profile fields
  firstName?: string;
  lastName?: string;
  locale?: string;
  
  // Reviews reference - veterinarians receive reviews from pet parents
  reviews?: mongoose.Types.ObjectId[];
  
  fcmTokens: {
    web?: string;
    mobile?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  
  // Authentication methods removed - now handled by User model
  // comparePassword(candidatePassword: string): Promise<boolean>;
  // generateEmailVerificationToken(): string;
  // generatePasswordResetToken(): string;
  // checkIfLocked(): boolean;
  // incrementLoginAttempts(): Promise<void>;
  // resetLoginAttempts(): Promise<void>;
}

// Static methods interface
export interface IVeterinarianModel extends Model<IVeterinarian> {
  // Authentication methods removed - now handled by User model
  // findByEmailForAuth(email: string): Promise<IVeterinarian | null>;
  // findByEmailVerificationToken(token: string): Promise<IVeterinarian | null>;
  // findByPasswordResetToken(token: string): Promise<IVeterinarian | null>;
}

const veterinarianSchema = new Schema<IVeterinarian>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  // Password field removed - now handled by User model
  // password: { ... },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    trim: true
  },

  consultationFee: {
    type: Number,
    required: [false, 'Consultation fee is required'],
    min: [0, 'Consultation fee cannot be negative']
  },
  available: {
    type: Boolean,
    default: true
  },
  profileImage: {
    type: String,
    trim: true
  },
  cv: {
    type: String,
    trim: true
  },
  signatureImage: {
    type: String,
    trim: true
  },
  signature: {
    type: String,
    trim: true
  },
  licenses: [{
    licenseNumber: {
      type: String,
      required: true,
      trim: true
    },
    deaNumber: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    licenseFile: {
      type: String,
      trim: true
    }
  }],
  bio: {
    type: String,
    trim: true,
    maxlength: [1000, 'Bio cannot exceed 1000 characters']
  },
  education: [{
    degree: {
      type: String,
      required: true,
      trim: true
    },
    institution: {
      type: String,
      required: true,
      trim: true
    },
    year: {
      type: Number,
      required: true,
      min: 1900,
      max: new Date().getFullYear()
    }
  }],
  experience: [{
    position: {
      type: String,
      required: true,
      trim: true
    },
    institution: {
      type: String,
      required: true,
      trim: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date
    },
    description: {
      type: String,
      trim: true
    }
  }],
  // New optional fields
  treatedSpecies: [{
    type: String,
    trim: true
  }],
  specialities: [{
    type: String,
    trim: true
  }],
  interests: [{
    type: String,
    trim: true
  }],
  researchAreas: [{
    type: String,
    trim: true
  }],
  monthlyGoal: {
    type: Number,
    min: [0, 'Monthly goal cannot be negative']
  },
  experienceYears: {
    type: String,
    trim: true
  },
  certifications: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    issuingOrganization: {
      type: String,
      required: true,
      trim: true
    },
    issueDate: {
      type: Date,
      required: true
    },
    expiryDate: {
      type: Date
    }
  }],
  languages: [{
    type: String,
    trim: true
  }],
  timezone: {
    type: String,
    default: 'UTC'
  },
  schedule: {
    monday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      available: { type: Boolean, default: false }
    },
    tuesday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      available: { type: Boolean, default: false }
    },
    wednesday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      available: { type: Boolean, default: false }
    },
    thursday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      available: { type: Boolean, default: false }
    },
    friday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      available: { type: Boolean, default: false }
    },
    saturday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      available: { type: Boolean, default: false }
    },
    sunday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      available: { type: Boolean, default: false }
    }
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
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  approvalDate: {
    type: Date
  },
  approvedBy: {
    type: String,
    trim: true
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
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  locale: {
    type: String,
    default: 'en'
  },
  
  // Reviews reference - veterinarians receive reviews from pet parents
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Review'
  }],
  
  fcmTokens: {
    web: String,
    mobile: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes (email is auto-created by unique)
veterinarianSchema.index({ isActive: 1 });
veterinarianSchema.index({ isApproved: 1 });
veterinarianSchema.index({ specialization: 1 });
veterinarianSchema.index({ available: 1 });

// Performance indexes for list API queries
veterinarianSchema.index({ isActive: 1, isDeleted: 1, isApproved: 1 });
veterinarianSchema.index({ specialization: 1, available: 1 });
veterinarianSchema.index({ specialities: 1 });
veterinarianSchema.index({ treatedSpecies: 1 });
veterinarianSchema.index({ interests: 1 });
veterinarianSchema.index({ researchAreas: 1 });
veterinarianSchema.index({ isDeleted: 1 });
veterinarianSchema.index({ name: 'text' }); // Text search index
veterinarianSchema.index({ reviews: 1 }); // Index for reviews queries

// Unique index for license numbers to prevent duplicates
veterinarianSchema.index({ 'licenses.licenseNumber': 1 }, { unique: true, sparse: true });

// Authentication methods removed - now handled by User model
// veterinarianSchema.virtual('isLocked').get(function() { ... });
// veterinarianSchema.pre('save', async function(next) { ... });
// veterinarianSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> { ... };
// veterinarianSchema.methods.generateEmailVerificationToken = function(): string { ... };
// veterinarianSchema.methods.generatePasswordResetToken = function(): string { ... };
// veterinarianSchema.methods.checkIfLocked = function(): boolean { ... };
// veterinarianSchema.methods.incrementLoginAttempts = async function(): Promise<void> { ... };
// veterinarianSchema.methods.resetLoginAttempts = async function(): Promise<void> { ... };

// Authentication static methods removed - now handled by User model
// veterinarianSchema.statics.findByEmailForAuth = function(email: string) { ... };
// veterinarianSchema.statics.findByEmailVerificationToken = function(token: string) { ... };
// veterinarianSchema.statics.findByPasswordResetToken = function(token: string) { ... };

export default mongoose.models.Veterinarian || mongoose.model<IVeterinarian, IVeterinarianModel>('Veterinarian', veterinarianSchema);
