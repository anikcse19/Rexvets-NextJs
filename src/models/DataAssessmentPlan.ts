import mongoose, { Document, model, Schema, Types } from "mongoose";
import { DataAssessmentPlanStatus } from "@/lib/types/dataAssessmentPlan";

export { DataAssessmentPlanStatus };

export interface IDataAssessmentPlan extends Document {
  data: string;
  assessment: string;
  plan: string;
  veterinarian: Types.ObjectId;
  appointment: Types.ObjectId;
  status: DataAssessmentPlanStatus;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

const DataAssessmentPlanSchema = new Schema<IDataAssessmentPlan>(
  {
    data: {
      type: String,
      required: [true, "Data is required"],
      trim: true,
      maxlength: [40000, "Data cannot exceed 20000 characters"],
    },
    assessment: {
      type: String,
      required: [true, "Assessment is required"],
      trim: true,
      maxlength: [40000, "Assessment cannot exceed 20000 characters"],
    },
    plan: {
      type: String,
      required: [true, "Plan is required"],
      trim: true,
      maxlength: [40000, "Plan cannot exceed 20000 characters"],
    },

    veterinarian: {
      type: Schema.Types.ObjectId,
      ref: "Veterinarian",
      required: [true, "Veterinarian is required"],
    },
    appointment: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      required: [true, "Appointment is required"],
      index: true, // fast filter by appointment
    },

    status: {
      type: String,
      enum: Object.values(DataAssessmentPlanStatus),
      default: DataAssessmentPlanStatus.DRAFT,
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

// helpful compound index for lists
DataAssessmentPlanSchema.index({ appointment: 1, createdAt: -1 });

export const DataAssessmentPlanModel =
  mongoose.models.DataAssessmentPlan ||
  model<IDataAssessmentPlan>("DataAssessmentPlan", DataAssessmentPlanSchema);
