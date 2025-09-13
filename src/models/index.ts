// Export all models
export { default as DonationModel } from "./Donation";
export type { IDonation, IDonationModel } from "./Donation";

export { default as PetParentModel } from "./PetParent";
export type { IPetParent, IPetParentModel } from "./PetParent";

export { default as ReviewModel } from "./Review";
export type { IReview, IReviewModel } from "./Review";

export { default as VeterinarianModel } from "./Veterinarian";
export type { IVeterinarian, IVeterinarianModel } from "./Veterinarian";

export { default as VetTechModel } from "./VetTech";
export type { IVetTech, IVetTechModel } from "./VetTech";

export { default as HelpModel } from "./Help";
export type { IHelp, IHelpModel } from "./Help";

export {
  AppointmentModel,
  AppointmentStatus,
  AppointmentType,
  PaymentStatus,
} from "./Appointment";
export type { IAppointment } from "./Appointment";

export { PetModel } from "./Pet";

export { default as UserModel } from "./User";
export type { IUser, IUserModel, UserRole } from "./User";

// Add missing models that are needed for populate to work
export { PrescriptionModel } from "./Prescription";

export { AppointmentSlot, SlotStatus } from "./AppointmentSlot";
export type { IAvailabilitySlot } from "./AppointmentSlot";

export { DataAssessmentPlanModel } from "./DataAssessmentPlan";
export type { IDataAssessmentPlan } from "./DataAssessmentPlan";

export { BlockListModel } from "./BlockList";
export type { IBlockList } from "./BlockList";

export { ChatConversation } from "./ChatConversation";
export type { IChatBotMessage, IChatConversation } from "./ChatConversation";

export { DoctorModel } from "./Doctor";
export type { IDoctor, IDoctorDocument } from "./Doctor";

export { MessageModel } from "./Message";

export {
  AppointmentChatModel,
  AppointmentMessageModel,
} from "./AppointmentChat";
export type { IAppointmentChat, IAppointmentMessage } from "./AppointmentChat";

// Notifications
export { default as NotificationModel, NotificationType } from "./Notification";
export type { INotification, INotificationModel } from "./Notification";
