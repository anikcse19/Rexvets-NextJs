export enum DataAssessmentPlanStatus {
  DRAFT = "DRAFT",
  FINALIZED = "FINALIZED",
}

export interface DataAssessmentPlan {
  _id: string;
  appointment: string;
  veterinarian: {
    _id: string;
    name: string;
    email: string;
  };
  assessment: string;
  plan: string;
  data: string;
  status: "DRAFT" | "FINALIZED";
  isDeleted: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
