import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export interface IVeterinarian extends Document {
  name: string;
  email: string;
  password?: string;
  phoneNumber: string;
  specialization: string;
  licenseNumber: string;
  licenseState: string;
  licenseExpiryDate: Date;
  consultationFee: number;
  available: boolean;
  profileImage?: string;
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
  certifications: Array<{
    name: string;
    issuingOrganization: string;
    issueDate: Date;
    expiryDate?: Date;
  }>;
  languages: string[];
  timezone: string;
  workingHours: {
    monday: { start: string; end: string; available: boolean };
    tuesday: { start: string; end: string; available: boolean };
    wednesday: { start: string; end: string; available: boolean };
    thursday: { start: string; end: string; available: boolean };
    friday: { start: string; end: string; available: boolean };
    saturday: { start: string; end: string; available: boolean };
    sunday: { start: string; end: string; available: boolean };
  };
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  isActive: boolean;
  isApproved: boolean;
  approvalDate?: Date;
  approvedBy?: string;
  fcmTokens: {
    web?: string;
    mobile?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateEmailVerificationToken(): string;
  generatePasswordResetToken(): string;
  checkIfLocked(): boolean;
  incrementLoginAttempts(): Promise<void>;
  resetLoginAttempts(): Promise<void>;
}

// Static methods interface
export interface IVeterinarianModel extends Model<IVeterinarian> {
  findByEmailForAuth(email: string): Promise<IVeterinarian | null>;
  findByEmailVerificationToken(token: string): Promise<IVeterinarian | null>;
  findByPasswordResetToken(token: string): Promise<IVeterinarian | null>;
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
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false
  },
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
  licenseNumber: {
    type: String,
    required: [true, 'License number is required'],
    unique: true,
    trim: true
  },
  licenseState: {
    type: String,
    required: [true, 'License state is required'],
    trim: true
  },
  licenseExpiryDate: {
    type: Date,
    required: [true, 'License expiry date is required']
  },
  consultationFee: {
    type: Number,
    required: [true, 'Consultation fee is required'],
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
  workingHours: {
    monday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      available: { type: Boolean, default: true }
    },
    tuesday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      available: { type: Boolean, default: true }
    },
    wednesday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      available: { type: Boolean, default: true }
    },
    thursday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      available: { type: Boolean, default: true }
    },
    friday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      available: { type: Boolean, default: true }
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
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    select: false
  },
  emailVerificationExpires: {
    type: Date,
    select: false
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  lastLogin: {
    type: Date
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
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
  fcmTokens: {
    web: String,
    mobile: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
veterinarianSchema.index({ email: 1 });
veterinarianSchema.index({ licenseNumber: 1 });
veterinarianSchema.index({ isActive: 1 });
veterinarianSchema.index({ isApproved: 1 });
veterinarianSchema.index({ specialization: 1 });
veterinarianSchema.index({ available: 1 });
veterinarianSchema.index({ emailVerificationToken: 1 });
veterinarianSchema.index({ passwordResetToken: 1 });

// Virtual for checking if account is locked
veterinarianSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > new Date());
});

// Pre-save middleware to hash password
veterinarianSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password!, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Instance method to compare password
veterinarianSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to generate email verification token
veterinarianSchema.methods.generateEmailVerificationToken = function(): string {
  const token = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  this.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  return token;
};

// Instance method to generate password reset token
veterinarianSchema.methods.generatePasswordResetToken = function(): string {
  const token = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return token;
};

// Instance method to check if account is locked
veterinarianSchema.methods.checkIfLocked = function(): boolean {
  return !!(this.lockUntil && this.lockUntil > new Date());
};

// Instance method to increment login attempts
veterinarianSchema.methods.incrementLoginAttempts = async function(): Promise<void> {
  if (this.lockUntil && this.lockUntil < new Date()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates: any = { $inc: { loginAttempts: 1 } };
  
  if (this.loginAttempts + 1 >= 5 && !this.checkIfLocked()) {
    updates.$set = { lockUntil: new Date(Date.now() + 2 * 60 * 60 * 1000) };
  }
  
  return this.updateOne(updates);
};

// Instance method to reset login attempts
veterinarianSchema.methods.resetLoginAttempts = async function(): Promise<void> {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
    $set: { lastLogin: new Date() }
  });
};

// Static method to find user by email (including password for auth)
veterinarianSchema.statics.findByEmailForAuth = function(email: string) {
  return this.findOne({ email, isActive: true }).select('+password +emailVerificationToken +passwordResetToken');
};

// Static method to find user by email verification token
veterinarianSchema.statics.findByEmailVerificationToken = function(token: string) {
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  
  return this.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: new Date() }
  });
};

// Static method to find user by password reset token
veterinarianSchema.statics.findByPasswordResetToken = function(token: string) {
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  
  return this.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() }
  }).select('+password');
};

export default mongoose.models.Veterinarian || mongoose.model<IVeterinarian, IVeterinarianModel>('Veterinarian', veterinarianSchema);
