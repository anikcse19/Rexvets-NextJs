import { connectToDatabase } from "@/lib/mongoose";
import { ISubscription, SubscriptionModel } from "@/models/Subscription";
import { ClientSession, Types } from "mongoose";

export interface CreateSubscriptionInput {
  petParentId: string;
  subscriptionId: string;
  donationId: string;
  stripeCustomerId: string;
  paymentIntentId: string;
  startDate?: Date;
  transactionID?: string;
  metadata?: Record<string, unknown>;
}

const validateObjectId = (id: string): Types.ObjectId => {
  const objectId = new Types.ObjectId(id);
  if (objectId.toString() !== id) {
    throw new Error("Invalid ObjectId format");
  }
  return objectId;
};

const getCurrentYear = (date?: Date): number => {
  return (date || new Date()).getFullYear();
};

const calculateEndDate = (startDate: Date): Date => {
  const endDate = new Date(startDate);
  endDate.setFullYear(endDate.getFullYear() + 1);
  return endDate;
};

const checkExistingActiveSubscription = async (
  petParentId: string,
  calendarYear: number
): Promise<boolean> => {
  await connectToDatabase();
  const subscription = await SubscriptionModel.findOne({
    petParent: validateObjectId(petParentId),
    calendarYear,
    isActive: true,
  });
  return subscription !== null;
};
export const checkSubscriptionQuota = async (
  petParentId: string,
  calendarYear: number
): Promise<boolean> => {
  await connectToDatabase();
  const subscription = await SubscriptionModel.findOne({
    petParent: validateObjectId(petParentId),
    calendarYear,
    isActive: true,
  });

  if (!subscription) {
    // No active subscription = quota available
    return false;
  }

  return subscription.remainingAppointments <= 4;
};
const createSubscriptionDocument = (
  input: CreateSubscriptionInput & { calendarYear: number; endDate: Date }
): Partial<ISubscription> => ({
  petParent: validateObjectId(input.petParentId),
  subscriptionId: input.subscriptionId,
  donationId: validateObjectId(input.donationId),
  subscriptionAmount: 120,
  startDate: input.startDate,
  endDate: input.endDate,
  maxAppointments: 4,
  remainingAppointments: 4,
  appointmentIds: [],
  isActive: true,
  calendarYear: input.calendarYear,
  isResubscription: false,
  resubscriptionCount: 0,
  stripeCustomerId: input.stripeCustomerId,
  paymentIntentId: input.paymentIntentId,
  transactionID: input.transactionID,
  metadata: input.metadata,
});

/**
 * Creates a new subscription
 * Returns the created subscription document
 */
export const createSubscription = async (
  input: CreateSubscriptionInput
): Promise<ISubscription> => {
  await connectToDatabase();

  const {
    petParentId,
    subscriptionId,
    donationId,
    stripeCustomerId,
    paymentIntentId,
    startDate = new Date(),
    transactionID,
    metadata,
  } = input;

  const calendarYear = getCurrentYear(startDate);
  const endDate = calculateEndDate(startDate);

  // Check for existing active subscription for the same pet parent and year
  const existingSubscription = await checkExistingActiveSubscription(
    petParentId,
    calendarYear
  );

  if (existingSubscription) {
    throw new Error(
      "Active subscription already exists for this pet parent in the current year"
    );
  }

  // Create and save the subscription document
  const subscriptionData = createSubscriptionDocument({
    petParentId,
    subscriptionId,
    donationId,
    stripeCustomerId,
    paymentIntentId,
    startDate,
    transactionID,
    metadata,
    calendarYear,
    endDate,
  });

  const subscription = new SubscriptionModel(subscriptionData);
  return await subscription.save();
};

/**
 * Creates a new subscription using a provided MongoDB session
 * Ensures all related operations can be committed/rolled back atomically
 */
export const createSubscriptionWithSession = async (
  input: CreateSubscriptionInput,
  session: ClientSession
): Promise<ISubscription> => {
  await connectToDatabase();

  const {
    petParentId,
    subscriptionId,
    donationId,
    stripeCustomerId,
    paymentIntentId,
    startDate = new Date(),
    transactionID,
    metadata,
  } = input;

  const calendarYear = getCurrentYear(startDate);
  const endDate = calculateEndDate(startDate);

  // Check for existing active subscription within the same session
  const existing = await SubscriptionModel.findOne({
    petParent: validateObjectId(petParentId),
    calendarYear,
    isActive: true,
  })
    .session(session)
    .lean();

  if (existing) {
    throw new Error(
      "Active subscription already exists for this pet parent in the current year"
    );
  }

  const subscriptionData = createSubscriptionDocument({
    petParentId,
    subscriptionId,
    donationId,
    stripeCustomerId,
    paymentIntentId,
    startDate,
    transactionID,
    metadata,
    calendarYear,
    endDate,
  });

  const subscription = new SubscriptionModel(subscriptionData);
  return await subscription.save({ session });
};

/**
 * Finds active subscription by ID
 * Returns the subscription or throws an error if not found
 */
const findActiveSubscription = async (
  subscriptionId: string
): Promise<ISubscription> => {
  await connectToDatabase();
  const subscription = await SubscriptionModel.findOne({
    subscriptionId,
    isActive: true,
  });

  if (!subscription) {
    throw new Error("Active subscription not found");
  }

  return subscription;
};

/**
 * Validates and updates appointment count for decrement
 */
const validateAndDecrementAppointment = (subscription: ISubscription): void => {
  if (subscription.remainingAppointments <= 0) {
    throw new Error("No remaining appointments available");
  }
  subscription.remainingAppointments -= 1;
};

/**
 * Decrements remaining appointments when an appointment is booked
 * Returns the updated subscription document
 */
export const decrementAppointment = async (
  subscriptionId: string,
  appointmentId: string
): Promise<ISubscription> => {
  const subscription = await findActiveSubscription(subscriptionId);
  validateAndDecrementAppointment(subscription);
  subscription.appointmentIds.push(validateObjectId(appointmentId));
  return await subscription.save();
};

/**
 * Validates and updates appointment count for increment
 */
const validateAndIncrementAppointment = (subscription: ISubscription): void => {
  if (subscription.remainingAppointments >= subscription.maxAppointments) {
    throw new Error("Cannot increment beyond maximum appointments");
  }
  subscription.remainingAppointments += 1;
};

/**
 * Removes appointment ID from array if it exists
 */
const removeAppointmentId = (
  appointmentIds: Types.ObjectId[],
  appointmentId: string
): Types.ObjectId[] => {
  const idToRemove = validateObjectId(appointmentId);
  return appointmentIds.filter((id) => !id.equals(idToRemove));
};

/**
 * Increments remaining appointments when an appointment is cancelled
 * Returns the updated subscription document
 */
export const incrementAppointment = async (
  subscriptionId: string,
  appointmentId: string
): Promise<ISubscription> => {
  const subscription = await findActiveSubscription(subscriptionId);
  validateAndIncrementAppointment(subscription);
  subscription.appointmentIds = removeAppointmentId(
    subscription.appointmentIds,
    appointmentId
  );
  return await subscription.save();
};

/**
 * Checks if subscription has available appointment quota
 * Returns boolean indicating availability
 */
export const checkQuota = async (subscriptionId: string): Promise<boolean> => {
  const subscription = await findActiveSubscription(subscriptionId);
  return subscription.remainingAppointments > 0;
};

/**
 * Deactivates previous subscription
 */
const deactivatePreviousSubscription = async (
  petParentId: string,
  calendarYear: number
): Promise<void> => {
  const previousSubscription = await SubscriptionModel.findOne({
    petParent: validateObjectId(petParentId),
    calendarYear,
    isActive: true,
  });

  if (previousSubscription) {
    previousSubscription.isActive = false;
    await previousSubscription.save();
  }
};

/**
 * Creates resubscription document with updated flags
 */
const createResubscriptionDocument = (
  input: CreateSubscriptionInput,
  previousResubscriptionCount: number,
  calendarYear: number,
  endDate: Date
): Partial<ISubscription> => {
  const baseDocument = createSubscriptionDocument({
    ...input,
    calendarYear,
    endDate,
  });

  return {
    ...baseDocument,
    isResubscription: true,
    resubscriptionCount: previousResubscriptionCount + 1,
  };
};

/**
 * Gets previous resubscription count for a pet parent
 */
const getPreviousResubscriptionCount = async (
  petParentId: string,
  calendarYear: number
): Promise<number> => {
  const previousSubscriptions = await SubscriptionModel.find({
    petParent: validateObjectId(petParentId),
    calendarYear,
  }).sort({ createdAt: -1 });

  return previousSubscriptions.filter((sub) => sub.isResubscription).length;
};

/**
 * Creates a re-subscription when quota is exhausted
 * Returns the new subscription document
 */
export const resubscribe = async (
  input: CreateSubscriptionInput
): Promise<ISubscription> => {
  await connectToDatabase();

  const { petParentId, startDate = new Date(), ...restInput } = input;

  const calendarYear = getCurrentYear(startDate);
  const endDate = calculateEndDate(startDate);

  // Get previous resubscription count
  const previousResubscriptionCount = await getPreviousResubscriptionCount(
    petParentId,
    calendarYear
  );

  // Deactivate any existing active subscription
  await deactivatePreviousSubscription(petParentId, calendarYear);

  // Create new resubscription document
  const subscriptionData = createResubscriptionDocument(
    { ...restInput, petParentId, startDate },
    previousResubscriptionCount,
    calendarYear,
    endDate
  );

  const subscription = new SubscriptionModel(subscriptionData);
  return await subscription.save();
};

/**
 * Gets active subscription for a pet parent
 * Returns the current active subscription or null
 */
export const getActiveSubscription = async (
  petParentId: string
): Promise<ISubscription | null> => {
  await connectToDatabase();
  return SubscriptionModel.findOne({
    petParent: validateObjectId(petParentId),
    isActive: true,
  });
};

/**
 * Gets subscription history for a pet parent
 * Returns array of all subscriptions (active and inactive)
 */
export const getSubscriptionHistory = async (
  petParentId: string,
  calendarYear?: number
): Promise<ISubscription[]> => {
  await connectToDatabase();

  const query: any = {
    petParent: validateObjectId(petParentId),
  };

  if (calendarYear) {
    query.calendarYear = calendarYear;
  }

  return SubscriptionModel.find(query).sort({ createdAt: -1 });
};

/**
 * Updates subscription metadata
 * Returns the updated subscription document
 */
export const updateSubscriptionMetadata = async (
  subscriptionId: string,
  metadata: Record<string, unknown>
): Promise<ISubscription> => {
  const subscription = await findActiveSubscription(subscriptionId);
  subscription.metadata = { ...subscription.metadata, ...metadata };
  return await subscription.save();
};

/**
 * Deactivates a subscription
 * Returns the deactivated subscription document
 */
export const deactivateSubscription = async (
  subscriptionId: string
): Promise<ISubscription> => {
  const subscription = await findActiveSubscription(subscriptionId);
  subscription.isActive = false;
  return await subscription.save();
};

/**
 * Checks if subscription is expired
 * Returns boolean indicating expiration status
 */
export const isSubscriptionExpired = async (
  subscriptionId: string
): Promise<boolean> => {
  try {
    const subscription = await findActiveSubscription(subscriptionId);
    return new Date() > subscription.endDate;
  } catch {
    return true; // If not found, consider as expired
  }
};

/**
 * Gets remaining appointments for a pet parent
 * Returns the number of remaining appointments from active subscription
 */
export const getRemainingAppointments = async (
  petParentId: string
): Promise<number> => {
  const subscription = await getActiveSubscription(petParentId);
  return subscription?.remainingAppointments || 0;
};

/**
 * Resets subscription for new calendar year (admin function)
 * Returns the reset subscription document
 */
export const resetForNewYear = async (
  subscriptionId: string
): Promise<ISubscription> => {
  const subscription = await findActiveSubscription(subscriptionId);

  const newYear = getCurrentYear();
  if (subscription.calendarYear === newYear) {
    throw new Error("Subscription is already for the current year");
  }

  subscription.calendarYear = newYear;
  subscription.remainingAppointments = subscription.maxAppointments;
  subscription.appointmentIds = [];
  subscription.startDate = new Date();
  subscription.endDate = calculateEndDate(subscription.startDate);

  return await subscription.save();
};
