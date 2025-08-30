import crypto from "crypto";
import mongoose, { Document, Model, Schema } from "mongoose";

export type UserRole = "pet_parent" | "veterinarian" | "technician" | "admin";

export interface IUser extends Document {
  // Authentication fields only
  email: string;
  password?: string;
  role: UserRole;

  // References to existing models
  petParentRef?: mongoose.Types.ObjectId;
  veterinarianRef?: mongoose.Types.ObjectId;
  vetTechRef?: mongoose.Types.ObjectId;

  // Authentication & Security
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  isActive: boolean;
  isDeleted?: boolean;

  // Google OAuth
  googleId?: string;
  googleAccessToken?: string;
  googleRefreshToken?: string;
  googleExpiresAt?: number;
  googleTokenType?: string;
  googleScope?: string;
  timezone?: string;
  // Common fields for session
  name?: string;
  profileImage?: string;
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

export interface IUserModel extends Model<IUser> {
  findByEmailForAuth(email: string): Promise<IUser | null>;
  findByEmailVerificationToken(token: string): Promise<IUser | null>;
  findByPasswordResetToken(token: string): Promise<IUser | null>;
}

const userSchema = new Schema<IUser>(
  {
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
    password: {
      type: String,
      required: function (this: any) {
        return !this.googleId;
      },
      minlength: [8, "Password must be at least 8 characters long"],
      select: false,
    },
    role: {
      type: String,
      enum: ["pet_parent", "veterinarian", "technician", "admin"],
      required: [true, "Role is required"],
    },

    // References to existing models
    petParentRef: {
      type: Schema.Types.ObjectId,
      ref: "PetParent",
      sparse: true,
    },
    veterinarianRef: {
      type: Schema.Types.ObjectId,
      ref: "Veterinarian",
      sparse: true,
    },
    vetTechRef: {
      type: Schema.Types.ObjectId,
      ref: "VetTech",
      sparse: true,
    },

    // Authentication & Security
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    lastLogin: {
      type: Date,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },

    // Google OAuth
    googleId: {
      type: String,
      sparse: true,
    },
    googleAccessToken: {
      type: String,
      select: false,
    },
    googleRefreshToken: {
      type: String,
      select: false,
    },
    googleExpiresAt: {
      type: Number,
    },
    googleTokenType: {
      type: String,
    },
    googleScope: {
      type: String,
    },

    // Common fields for session
    name: {
      type: String,
      trim: true,
    },
    profileImage: {
      type: String,
      trim: true,
    },
    fcmTokens: {
      web: String,
      mobile: String,
    },
    timezone: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
// Note: email index is automatically created by unique: true constraint
// Note: googleId index is automatically created by sparse: true constraint
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ isDeleted: 1 });
userSchema.index({ emailVerificationToken: 1 });
userSchema.index({ passwordResetToken: 1 });

// Virtual for checking if account is locked
userSchema.virtual("isLocked").get(function () {
  return !!(this.lockUntil && this.lockUntil > new Date());
});

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  if (!this.password || !this.isModified("password")) return next();

  try {
    const bcrypt = await import("bcryptjs");
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Instance methods
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  const bcrypt = await import("bcryptjs");
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateEmailVerificationToken = function (): string {
  const token = crypto.randomBytes(32).toString("hex");
  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return token;
};

userSchema.methods.generatePasswordResetToken = function (): string {
  const token = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
  return token;
};

userSchema.methods.checkIfLocked = function (): boolean {
  return !!(this.lockUntil && this.lockUntil > new Date());
};

userSchema.methods.incrementLoginAttempts = async function (): Promise<void> {
  if (this.lockUntil && this.lockUntil < new Date()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 },
    });
  }

  const updates: any = { $inc: { loginAttempts: 1 } };

  if (this.loginAttempts + 1 >= 5 && !this.checkIfLocked()) {
    updates.$set = { lockUntil: new Date(Date.now() + 2 * 60 * 60 * 1000) };
  }

  return this.updateOne(updates);
};

userSchema.methods.resetLoginAttempts = async function (): Promise<void> {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
    $set: { lastLogin: new Date() },
  });
};

// Static methods
userSchema.statics.findByEmailForAuth = function (email: string) {
  return this.findOne({ email, isActive: true, isDeleted: false }).select(
    "+password +emailVerificationToken +passwordResetToken +googleAccessToken +googleRefreshToken"
  );
};

userSchema.statics.findByEmailVerificationToken = function (token: string) {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  return this.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: new Date() },
  });
};

userSchema.statics.findByPasswordResetToken = function (token: string) {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  return this.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
  }).select("+password");
};

export default mongoose.models.User ||
  mongoose.model<IUser, IUserModel>("User", userSchema);
