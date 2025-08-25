import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IHelp extends Document {
  role: string;
  name: string;
  email: string;
  phone: string;
  state: string;
  subject: string;
  details: string;
  isActive: boolean;
  isDeleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IHelpModel extends Model<IHelp> {
  findByEmail(email: string): Promise<IHelp[]>;
}

const helpSchema = new Schema<IHelp>({
  role: {
    type: String,
    required: [true, 'Role is required'],
    trim: true,
    enum: ['pet_parent', 'veterinarian', 'technician', 'admin']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true,
    maxlength: [100, 'State cannot exceed 100 characters']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  details: {
    type: String,
    required: [true, 'Details are required'],
    trim: true,
    maxlength: [2000, 'Details cannot exceed 2000 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
helpSchema.index({ email: 1 });
helpSchema.index({ isActive: 1 });
helpSchema.index({ isDeleted: 1 });
helpSchema.index({ createdAt: -1 });
helpSchema.index({ subject: 'text', details: 'text' }); // Text search index

// Static methods
helpSchema.statics.findByEmail = function(email: string) {
  return this.find({ 
    email: email.toLowerCase(), 
    isActive: true, 
    isDeleted: { $ne: true } 
  }).sort({ createdAt: -1 });
};

export default mongoose.models.Help || mongoose.model<IHelp, IHelpModel>('Help', helpSchema);
