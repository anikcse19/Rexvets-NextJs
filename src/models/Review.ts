import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IReview extends Document {
  // Review details
  rating: number;
  comment: string;
  visible: boolean;
  
  // Appointment reference
  appointmentDate: string;
  
  // References to other models
  doctorId: mongoose.Types.ObjectId;
  parentId: mongoose.Types.ObjectId;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Static methods interface
export interface IReviewModel extends Model<IReview> {
  findByDoctorId(doctorId: mongoose.Types.ObjectId): Promise<IReview[]>;
  findByParentId(parentId: mongoose.Types.ObjectId): Promise<IReview[]>;
  findVisibleReviews(): Promise<IReview[]>;
  findReviewsByRating(rating: number): Promise<IReview[]>;
  findReviewsByDateRange(startDate: string, endDate: string): Promise<IReview[]>;
  getAverageRating(doctorId: mongoose.Types.ObjectId): Promise<number>;
  getReviewStats(doctorId: mongoose.Types.ObjectId): Promise<{
    totalReviews: number;
    averageRating: number;
    ratingDistribution: { [key: number]: number };
  }>;
}

const reviewSchema = new Schema<IReview>({
  // Review details
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    validate: {
      validator: function(v: number) {
        return Number.isInteger(v) && v >= 1 && v <= 5;
      },
      message: 'Rating must be a whole number between 1 and 5'
    }
  },
  reviewText: {
    type: String,
    required: [true, 'Review text is required'],
    trim: true,
    minlength: [1, 'Review text cannot be empty'],
    maxlength: [1000, 'Review text cannot exceed 1000 characters']
  },
  visible: {
    type: Boolean,
    default: true,
    required: true
  },
  
  // Appointment reference
  appointmentDate: {
    type: String,
    required: [true, 'Appointment date is required'],
    trim: true,
    validate: {
      validator: function(v: string) {
        // Validate date format (e.g., "August 6, 2025")
        const date = new Date(v);
        return date instanceof Date && !isNaN(date.getTime());
      },
      message: 'Appointment date must be a valid date'
    }
  },
  
  // References to other models
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: 'Veterinarian',
    required: [true, 'Doctor ID is required'],
    index: true
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'PetParent',
    required: [true, 'Parent ID is required'],
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
reviewSchema.index({ doctorId: 1, visible: 1 });
reviewSchema.index({ parentId: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ appointmentDate: 1 });

// Static methods
reviewSchema.statics.findByDoctorId = function(doctorId: mongoose.Types.ObjectId) {
  return this.find({ doctorId, visible: true }).sort({ createdAt: -1 });
};

reviewSchema.statics.findByParentId = function(parentId: mongoose.Types.ObjectId) {
  return this.find({ parentId }).sort({ createdAt: -1 });
};

reviewSchema.statics.findVisibleReviews = function() {
  return this.find({ visible: true }).sort({ createdAt: -1 });
};

reviewSchema.statics.findReviewsByRating = function(rating: number) {
  return this.find({ rating, visible: true }).sort({ createdAt: -1 });
};

reviewSchema.statics.findReviewsByDateRange = function(startDate: string, endDate: string) {
  return this.find({
    appointmentDate: {
      $gte: startDate,
      $lte: endDate
    },
    visible: true
  }).sort({ createdAt: -1 });
};

reviewSchema.statics.getAverageRating = async function(doctorId: mongoose.Types.ObjectId) {
  const result = await this.aggregate([
    { $match: { doctorId, visible: true } },
    { $group: { _id: null, averageRating: { $avg: '$rating' } } }
  ]);
  return result.length > 0 ? Math.round(result[0].averageRating * 10) / 10 : 0;
};

reviewSchema.statics.getReviewStats = async function(doctorId: mongoose.Types.ObjectId) {
  const result = await this.aggregate([
    { $match: { doctorId, visible: true } },
    {
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
        averageRating: { $avg: '$rating' },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    }
  ]);

  if (result.length === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }

  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  result[0].ratingDistribution.forEach((rating: number) => {
    ratingDistribution[rating as keyof typeof ratingDistribution]++;
  });

  return {
    totalReviews: result[0].totalReviews,
    averageRating: Math.round(result[0].averageRating * 10) / 10,
    ratingDistribution
  };
};

// Instance methods
reviewSchema.methods.toJSON = function() {
  const review = this.toObject();
  delete review.__v;
  return review;
};

// Pre-save middleware
reviewSchema.pre('save', function(next) {
  // Ensure review text is properly formatted
  if (this.reviewText) {
    this.reviewText = this.reviewText.trim();
  }
  next();
});

const ReviewModel = mongoose.model<IReview, IReviewModel>('Review', reviewSchema);

export default ReviewModel;
