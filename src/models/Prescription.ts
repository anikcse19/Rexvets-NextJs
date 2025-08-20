import mongoose, { Document, Schema, Types } from "mongoose";

export interface IPrescription extends Document {
  medication: {
    medicationDetails: {
      medicationName: string;
      form: string;
      medicationQuantity: number;
      quantityUnit:
        | "count"
        | "gram"
        | "liter"
        | "milliliter"
        | "microgram"
        | "pound"
        | "gallon"
        | "ounce";
      strength: number;
      strengthUnit: string;
    };
    usageInstruction: {
      refills: number;
      refillGap: number;
      direction: string;
    };
  }[];
  pharmacyPermission: {
    canUseGenericSubstitution: boolean;
    canFilledByPharmacy: boolean;
    noteToPharmacist: string;
  };
  pet: Types.ObjectId;
  parent: Types.ObjectId;
  doctor: Types.ObjectId;
  isDeleted: boolean;
}

const prescriptionSchema = new Schema<IPrescription>(
  {
    medication: [
      {
        medicationDetails: {
          medicationName: { type: String, required: true },
          form: { type: String, required: true },
          medicationQuantity: { type: Number, required: true },
          quantityUnit: {
            type: String,
            enum: [
              "count",
              "gram",
              "liter",
              "milliliter",
              "microgram",
              "pound",
              "gallon",
              "ounce",
            ],
            required: true,
          },
          strength: { type: Number, required: true },
          strengthUnit: { type: String, required: true },
        },
        usageInstruction: {
          refills: { type: Number, required: true },
          refillGap: { type: Number, required: true },
          direction: { type: String, required: true },
        },
      },
    ],
    pharmacyPermission: {
      canUseGenericSubstitution: { type: Boolean, default: false },
      canFilledByPharmacy: { type: Boolean, default: false },
      noteToPharmacist: { type: String, default: "" },
    },
    pet: { type: Schema.Types.ObjectId, ref: "Pet", required: true },
    parent: { type: Schema.Types.ObjectId, ref: "PetParent", required: true },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "Veterinarian",
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Prescription =
  mongoose.models.Prescription ||
  mongoose.model<IPrescription>("Prescription", prescriptionSchema);
