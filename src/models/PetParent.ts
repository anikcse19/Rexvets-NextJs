import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export interface IPetParent extends Document {
  name: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  state?: string;
  city?: string;
  address?: string;
  zipCode?: string;
  profileImage?: string;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  isActive: boolean;
  // Soft delete flag
  isDeleted?: boolean;
  
  // Google OAuth fields
  googleId?: string;
  googleAccessToken?: string;
  googleRefreshToken?: string;
  googleExpiresAt?: number;
  googleTokenType?: string;
  googleScope?: string;
  
  // Additional profile fields
  firstName?: string;
  lastName?: string;
  locale?: string;
  
  pets: Array<{
    name: string;
    type: 'dog' | 'cat' | 'bird' | 'fish' | 'reptile' | 'other';
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
  preferences: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    language: string;
    timezone: string;
  };
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
export interface IPetParentModel extends Model<IPetParent> {
  findByEmailForAuth(email: string): Promise<IPetParent | null>;
  findByEmailVerificationToken(token: string): Promise<IPetParent | null>;
  findByPasswordResetToken(token: string): Promise<IPetParent | null>;
}

const petParentSchema = new Schema<IPetParent>({
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
    required: function(this: any) {
      // Password is required only if user is not signing up via Google OAuth
      return !this.googleId;
    },
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false
  },
  phoneNumber: {
    type: String,
    required: function(this: any) {
      // Phone number is required only if user is not signing up via Google OAuth
      return !this.googleId;
    },
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  state: {
    type: String,
    required: function(this: any) {
      // State is required only if user is not signing up via Google OAuth
      return !this.googleId;
    },
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  zipCode: {
    type: String,
    trim: true
  },
  profileImage: {
    type: String,
    trim: true
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
  
  // Soft delete flag
  isDeleted: {
    type: Boolean,
    default: false
  },
  
  // Google OAuth fields
  googleId: {
    type: String,
    sparse: true,
    index: true
  },
  googleAccessToken: {
    type: String,
    select: false
  },
  googleRefreshToken: {
    type: String,
    select: false
  },
  googleExpiresAt: {
    type: Number
  },
  googleTokenType: {
    type: String
  },
  googleScope: {
    type: String
  },
  
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
  
  pets: [{
    name: {
      type: String,
      trim: true
    },
    type: {
      type: String,
      enum: ['dog', 'cat', 'bird', 'fish', 'reptile', 'other']
    },
    breed: {
      type: String,
      trim: true
    },
    age: {
      type: Number,
      min: 0
    },
    weight: {
      type: Number,
      min: 0
    },
    medicalHistory: [{
      type: String,
      trim: true
    }]
  }],
  emergencyContact: {
    name: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    relationship: {
      type: String,
      trim: true
    }
  },
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    },
    language: {
      type: String,
      default: 'en'
    },
    timezone: {
      type: String,
      default: 'UTC'
    }
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

// Indexes (email and googleId are auto-created by unique/sparse)
petParentSchema.index({ isActive: 1 });
petParentSchema.index({ emailVerificationToken: 1 });
petParentSchema.index({ passwordResetToken: 1 });
petParentSchema.index({ state: 1 });

// Virtual for checking if account is locked
petParentSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > new Date());
});

// Pre-save middleware to hash password
petParentSchema.pre('save', async function(next) {
  // Skip password hashing if no password (Google OAuth users)
  if (!this.password || !this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Instance method to compare password
petParentSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to generate email verification token
petParentSchema.methods.generateEmailVerificationToken = function(): string {
  const token = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  this.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  return token;
};

// Instance method to generate password reset token
petParentSchema.methods.generatePasswordResetToken = function(): string {
  const token = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return token;
};

// Instance method to check if account is locked
petParentSchema.methods.checkIfLocked = function(): boolean {
  return !!(this.lockUntil && this.lockUntil > new Date());
};

// Instance method to increment login attempts
petParentSchema.methods.incrementLoginAttempts = async function(): Promise<void> {
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
petParentSchema.methods.resetLoginAttempts = async function(): Promise<void> {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
    $set: { lastLogin: new Date() }
  });
};

// Static method to find user by email (including password for auth)
petParentSchema.statics.findByEmailForAuth = function(email: string) {
  return this.findOne({ email, isActive: true }).select('+password +emailVerificationToken +passwordResetToken +googleAccessToken +googleRefreshToken');
};

// Static method to find user by email verification token
petParentSchema.statics.findByEmailVerificationToken = function(token: string) {
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
petParentSchema.statics.findByPasswordResetToken = function(token: string) {
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  
  return this.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() }
  }).select('+password');
};

export default mongoose.models.PetParent || mongoose.model<IPetParent, IPetParentModel>('PetParent', petParentSchema);
