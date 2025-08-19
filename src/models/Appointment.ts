import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IAppointment extends Document {
  // Basic appointment details
  appointmentDate: string;
  appointmentTime: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  
  // Pet information
  petName: string;
  moreDetails?: string;
  
  // Video call details
  meetingLink?: string;
  monitorLink?: string;
  roomId: string;
  callStatus?: string;
  callDuration?: string;
  videoCallCompleted?: boolean;
  
  // References to other models
  veterinarianId?: mongoose.Types.ObjectId;
  parentId?: mongoose.Types.ObjectId;
  
  // Medical data
  prescription?: string[];
  dataAssementPlan?: string[];
  followUpDate?: Date;
  followUpRequired?: boolean;
  
  // Soft delete flag
  isDeleted?: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

// Static methods interface
export interface IAppointmentModel extends Model<IAppointment> {
  findByVeterinarianId(veterinarianId: mongoose.Types.ObjectId): Promise<IAppointment[]>;
  findByParentId(parentId: mongoose.Types.ObjectId): Promise<IAppointment[]>;
  findUpcomingAppointments(userId: mongoose.Types.ObjectId, userType: 'veterinarian' | 'petParent'): Promise<IAppointment[]>;
  findPastAppointments(userId: mongoose.Types.ObjectId, userType: 'veterinarian' | 'petParent'): Promise<IAppointment[]>;
  findTodayAppointments(userId: mongoose.Types.ObjectId, userType: 'veterinarian' | 'petParent'): Promise<IAppointment[]>;
  findAppointmentsByDateRange(userId: mongoose.Types.ObjectId, userType: 'veterinarian' | 'petParent', startDate: string, endDate: string): Promise<IAppointment[]>;
  findAppointmentsByStatus(userId: mongoose.Types.ObjectId, userType: 'veterinarian' | 'petParent', status: string): Promise<IAppointment[]>;
}

const appointmentSchema = new Schema<IAppointment>({
  // Basic appointment details
  appointmentDate: {
    type: String,
    required: [true, 'Appointment date is required'],
    trim: true,
    validate: {
      validator: function(v: string) {
        // Validate date format (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(v)) return false;
        
        const date = new Date(v);
        return date instanceof Date && !isNaN(date.getTime());
      },
      message: 'Appointment date must be a valid date in YYYY-MM-DD format'
    }
  },
  appointmentTime: {
    type: String,
    required: [true, 'Appointment time is required'],
    trim: true,
    validate: {
      validator: function(v: string) {
        // Validate time format (HH:MM or HH:MM AM/PM)
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](\s?(AM|PM|am|pm))?$/;
        return timeRegex.test(v);
      },
      message: 'Appointment time must be a valid time format (HH:MM or HH:MM AM/PM)'
    }
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
    default: 'scheduled',
    required: true
  },
  
  // Pet information
  petName: {
    type: String,
    required: [true, 'Pet name is required'],
    trim: true,
    minlength: [1, 'Pet name cannot be empty'],
    maxlength: [100, 'Pet name cannot exceed 100 characters']
  },
  moreDetails: {
    type: String,
    trim: true,
    maxlength: [1000, 'More details cannot exceed 1000 characters']
  },
  
  // Video call details
  meetingLink: {
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        if (!v) return true; // Optional field
        try {
          new URL(v);
          return true;
        } catch {
          return false;
        }
      },
      message: 'Meeting link must be a valid URL'
    }
  },
  monitorLink: {
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        if (!v) return true; // Optional field
        try {
          new URL(v);
          return true;
        } catch {
          return false;
        }
      },
      message: 'Monitor link must be a valid URL'
    }
  },
  roomId: {
    type: String,
    required: [true, 'Room ID is required'],
    trim: true,
    minlength: [1, 'Room ID cannot be empty']
  },
  callStatus: {
    type: String,
    trim: true,
    enum: ['not-started', 'in-progress', 'completed', 'failed', 'cancelled', '']
  },
  callDuration: {
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        if (!v) return true; // Optional field
        // Validate duration format (e.g., "0m 9s", "1h 30m", "45m")
        const durationRegex = /^(\d+h\s*)?(\d+m\s*)?(\d+s\s*)?$/;
        return durationRegex.test(v);
      },
      message: 'Call duration must be in format like "0m 9s", "1h 30m", or "45m"'
    }
  },
  videoCallCompleted: {
    type: Boolean,
    default: false
  },
  
  // References to other models
  veterinarianId: {
    type: Schema.Types.ObjectId,
    ref: 'Veterinarian',
    required: false,
    validate: {
      validator: function(v: mongoose.Types.ObjectId) {
        if (!v) return true; // Optional field
        return mongoose.Types.ObjectId.isValid(v);
      },
      message: 'Invalid veterinarian ID'
    }
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'PetParent',
    required: false,
    validate: {
      validator: function(v: mongoose.Types.ObjectId) {
        if (!v) return true; // Optional field
        return mongoose.Types.ObjectId.isValid(v);
      },
      message: 'Invalid parent ID'
    }
  },

  // Medical data
  prescription: [{
    type: String,
    trim: true,
    maxlength: [5000, 'Prescription cannot exceed 5000 characters']
  }],
  dataAssementPlan: [{
    type: String,
    trim: true,
    maxlength: [5000, 'Data assessment plan cannot exceed 5000 characters']
  }],
  followUpDate: {
    type: Date,
    validate: {
      validator: function(v: Date) {
        if (!v) return true; // Optional field
        return v instanceof Date && !isNaN(v.getTime());
      },
      message: 'Follow-up date must be a valid date'
    }
  },
  followUpRequired: {
    type: Boolean,
    default: false
  },
  
  // Soft delete flag
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
appointmentSchema.index({ veterinarianId: 1 });
appointmentSchema.index({ parentId: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ appointmentDate: 1 });
appointmentSchema.index({ roomId: 1 });
appointmentSchema.index({ followUpDate: 1 });
appointmentSchema.index({ createdAt: 1 });

// Compound indexes for better query performance
appointmentSchema.index({ veterinarianId: 1, appointmentDate: 1 });
appointmentSchema.index({ parentId: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1, appointmentDate: 1 });

// Virtual for checking if appointment is upcoming
appointmentSchema.virtual('isUpcoming').get(function() {
  const now = new Date();
  const appointmentDateTime = new Date(`${this.appointmentDate}T${this.appointmentTime}`);
  return appointmentDateTime > now && this.status === 'scheduled';
});

// Virtual for checking if appointment is today
appointmentSchema.virtual('isToday').get(function() {
  const today = new Date().toISOString().split('T')[0];
  return this.appointmentDate === today;
});

// Virtual for appointment duration in minutes
appointmentSchema.virtual('durationMinutes').get(function() {
  if (this.callDuration) {
    // Parse duration like "0m 9s", "1h 30m", "45m" to minutes
    const match = this.callDuration.match(/(?:(\d+)h\s*)?(?:(\d+)m\s*)?(?:(\d+)s\s*)?/);
    if (match) {
      const hours = parseInt(match[1]) || 0;
      const minutes = parseInt(match[2]) || 0;
      const seconds = parseInt(match[3]) || 0;
      return hours * 60 + minutes + (seconds / 60);
    }
  }
  return 0;
});

// Virtual for formatted appointment date and time
appointmentSchema.virtual('formattedDateTime').get(function() {
  const date = new Date(this.appointmentDate);
  const formattedDate = date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  return `${formattedDate} at ${this.appointmentTime}`;
});

// Static method to find appointments by veterinarian ID
appointmentSchema.statics.findByVeterinarianId = function(veterinarianId: mongoose.Types.ObjectId) {
  return this.find({ veterinarianId }).sort({ appointmentDate: 1, appointmentTime: 1 });
};

// Static method to find appointments by parent ID
appointmentSchema.statics.findByParentId = function(parentId: mongoose.Types.ObjectId) {
  return this.find({ parentId }).sort({ appointmentDate: 1, appointmentTime: 1 });
};

// Static method to find upcoming appointments
appointmentSchema.statics.findUpcomingAppointments = function(userId: mongoose.Types.ObjectId, userType: 'veterinarian' | 'petParent') {
  const query = userType === 'veterinarian' ? { veterinarianId: userId } : { parentId: userId };
  
  return this.find({
    ...query,
    status: { $in: ['scheduled', 'rescheduled'] }
  }).sort({ appointmentDate: 1, appointmentTime: 1 });
};

// Static method to find past appointments
appointmentSchema.statics.findPastAppointments = function(userId: mongoose.Types.ObjectId, userType: 'veterinarian' | 'petParent') {
  const query = userType === 'veterinarian' ? { veterinarianId: userId } : { parentId: userId };
  
  return this.find({
    ...query,
    status: { $in: ['completed', 'cancelled'] }
  }).sort({ appointmentDate: -1, appointmentTime: -1 });
};

// Static method to find today's appointments
appointmentSchema.statics.findTodayAppointments = function(userId: mongoose.Types.ObjectId, userType: 'veterinarian' | 'petParent') {
  const query = userType === 'veterinarian' ? { veterinarianId: userId } : { parentId: userId };
  const today = new Date().toISOString().split('T')[0];
  
  return this.find({
    ...query,
    appointmentDate: today,
    status: { $in: ['scheduled', 'rescheduled'] }
  }).sort({ appointmentTime: 1 });
};

// Static method to find appointments by date range
appointmentSchema.statics.findAppointmentsByDateRange = function(userId: mongoose.Types.ObjectId, userType: 'veterinarian' | 'petParent', startDate: string, endDate: string) {
  const query = userType === 'veterinarian' ? { veterinarianId: userId } : { parentId: userId };
  
  return this.find({
    ...query,
    appointmentDate: { $gte: startDate, $lte: endDate }
  }).sort({ appointmentDate: 1, appointmentTime: 1 });
};

// Static method to find appointments by status
appointmentSchema.statics.findAppointmentsByStatus = function(userId: mongoose.Types.ObjectId, userType: 'veterinarian' | 'petParent', status: string) {
  const query = userType === 'veterinarian' ? { veterinarianId: userId } : { parentId: userId };
  
  return this.find({
    ...query,
    status: status
  }).sort({ appointmentDate: 1, appointmentTime: 1 });
};

// Pre-save middleware to validate appointment date is not in the past for new appointments
appointmentSchema.pre('save', function(next) {
  if (this.isNew && this.status === 'scheduled') {
    const appointmentDateTime = new Date(`${this.appointmentDate}T${this.appointmentTime}`);
    const now = new Date();
    
    if (appointmentDateTime < now) {
      return next(new Error('Cannot schedule appointments in the past'));
    }
  }
  next();
});

export default mongoose.models.Appointment || mongoose.model<IAppointment, IAppointmentModel>('Appointment', appointmentSchema);
