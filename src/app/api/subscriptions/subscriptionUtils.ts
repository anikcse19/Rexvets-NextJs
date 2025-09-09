import Subscription, { ISubscription } from '@/models/Subscription';
import { Types } from 'mongoose';

/**
 * Subscription Utility Functions
 * 
 * Comprehensive CRUD operations for subscription management
 * Includes appointment tracking, validation, and business logic
 */

// ==================== CREATE OPERATIONS ====================

export interface CreateSubscriptionData {
  petParent: Types.ObjectId;
  subscriptionId: string;
  donationId: Types.ObjectId;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  subscriptionAmount?: number;
  metadata?: Record<string, unknown>;
}

/**
 * Create a new subscription
 */
export const createSubscription = async (data: CreateSubscriptionData): Promise<ISubscription> => {
  try {
    // Check if subscription already exists
    const existingSubscription = await Subscription.findOne({ 
      subscriptionId: data.subscriptionId 
    });
    
    if (existingSubscription) {
      throw new Error(`Subscription with ID ${data.subscriptionId} already exists`);
    }
    
    // Check if pet parent already has an active subscription for current year
    const currentYear = new Date().getFullYear();
    const activeSubscription = await Subscription.findOne({
      petParent: data.petParent,
      calendarYear: currentYear,
      isActive: true,
      endDate: { $gt: new Date() }
    });
    
    if (activeSubscription) {
      throw new Error('Pet parent already has an active subscription for this year');
    }
    
    const subscription = await Subscription.createSubscription(data);
    return subscription;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

// ==================== READ OPERATIONS ====================

/**
 * Get subscription by ID
 */
export const getSubscriptionById = async (subscriptionId: string): Promise<ISubscription | null> => {
  try {
    return await Subscription.findOne({ subscriptionId }).populate('petParent donationId');
  } catch (error) {
    console.error('Error getting subscription by ID:', error);
    throw error;
  }
};

/**
 * Get active subscription for a pet parent
 */
export const getActiveSubscription = async (
  petParentId: Types.ObjectId, 
  year?: number
): Promise<ISubscription | null> => {
  try {
    return await Subscription.getActiveSubscription(petParentId, year);
  } catch (error) {
    console.error('Error getting active subscription:', error);
    throw error;
  }
};

/**
 * Get all subscriptions for a pet parent
 */
export const getSubscriptionsByPetParent = async (
  petParentId: Types.ObjectId,
  includeInactive: boolean = false
): Promise<ISubscription[]> => {
  try {
    const query: any = { petParent: petParentId };
    
    if (!includeInactive) {
      query.isActive = true;
    }
    
    return await Subscription.find(query)
      .populate('petParent donationId')
      .sort({ createdAt: -1 });
  } catch (error) {
    console.error('Error getting subscriptions by pet parent:', error);
    throw error;
  }
};

/**
 * Get subscriptions by status
 */
export const getSubscriptionsByStatus = async (
  status: 'active' | 'expired' | 'inactive' | 'appointments_exhausted'
): Promise<ISubscription[]> => {
  try {
    const now = new Date();
    let query: any = {};
    
    switch (status) {
      case 'active':
        query = {
          isActive: true,
          endDate: { $gt: now },
          remainingAppointments: { $gt: 0 }
        };
        break;
      case 'expired':
        query = {
          isActive: true,
          endDate: { $lte: now }
        };
        break;
      case 'inactive':
        query = { isActive: false };
        break;
      case 'appointments_exhausted':
        query = {
          isActive: true,
          endDate: { $gt: now },
          remainingAppointments: 0
        };
        break;
    }
    
    return await Subscription.find(query)
      .populate('petParent donationId')
      .sort({ createdAt: -1 });
  } catch (error) {
    console.error('Error getting subscriptions by status:', error);
    throw error;
  }
};

/**
 * Get all subscriptions with pagination
 */
export const getAllSubscriptions = async (
  page: number = 1,
  limit: number = 10,
  filters?: {
    isActive?: boolean;
    calendarYear?: number;
    remainingAppointments?: { $gte?: number; $lte?: number };
  }
): Promise<{
  subscriptions: ISubscription[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  try {
    const query: any = {};
    
    if (filters) {
      if (filters.isActive !== undefined) query.isActive = filters.isActive;
      if (filters.calendarYear) query.calendarYear = filters.calendarYear;
      if (filters.remainingAppointments) query.remainingAppointments = filters.remainingAppointments;
    }
    
    const skip = (page - 1) * limit;
    
    const [subscriptions, total] = await Promise.all([
      Subscription.find(query)
        .populate('petParent donationId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Subscription.countDocuments(query)
    ]);
    
    return {
      subscriptions,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error('Error getting all subscriptions:', error);
    throw error;
  }
};

// ==================== UPDATE OPERATIONS ====================

export interface UpdateSubscriptionData {
  subscriptionAmount?: number;
  isActive?: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * Update subscription details
 */
export const updateSubscription = async (
  subscriptionId: string,
  data: UpdateSubscriptionData
): Promise<ISubscription | null> => {
  try {
    const subscription = await Subscription.findOne({ subscriptionId });
    
    if (!subscription) {
      throw new Error(`Subscription with ID ${subscriptionId} not found`);
    }
    
    // Update fields
    if (data.subscriptionAmount !== undefined) {
      subscription.subscriptionAmount = data.subscriptionAmount;
    }
    if (data.isActive !== undefined) {
      subscription.isActive = data.isActive;
    }
    if (data.metadata !== undefined) {
      subscription.metadata = { ...subscription.metadata, ...data.metadata };
    }
    
    return await subscription.save();
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
};

/**
 * Activate subscription
 */
export const activateSubscription = async (subscriptionId: string): Promise<ISubscription | null> => {
  try {
    return await updateSubscription(subscriptionId, { isActive: true });
  } catch (error) {
    console.error('Error activating subscription:', error);
    throw error;
  }
};

/**
 * Deactivate subscription
 */
export const deactivateSubscription = async (subscriptionId: string): Promise<ISubscription | null> => {
  try {
    return await updateSubscription(subscriptionId, { isActive: false });
  } catch (error) {
    console.error('Error deactivating subscription:', error);
    throw error;
  }
};

/**
 * Reset yearly appointments for a subscription
 */
export const resetYearlyAppointments = async (
  subscriptionId: string,
  newYear?: number
): Promise<ISubscription | null> => {
  try {
    const year = newYear || new Date().getFullYear();
    return await Subscription.resetYearlyAppointments(subscriptionId, year);
  } catch (error) {
    console.error('Error resetting yearly appointments:', error);
    throw error;
  }
};

// ==================== APPOINTMENT MANAGEMENT ====================

/**
 * Decrement appointment count when appointment is booked
 */
export const decrementAppointmentCount = async (subscriptionId: string): Promise<ISubscription | null> => {
  try {
    return await Subscription.decrementAppointmentCount(subscriptionId);
  } catch (error) {
    console.error('Error decrementing appointment count:', error);
    throw error;
  }
};

/**
 * Check if pet parent can book an appointment
 */
export const canBookAppointment = async (petParentId: Types.ObjectId): Promise<{
  canBook: boolean;
  subscription?: ISubscription;
  reason?: string;
}> => {
  try {
    const subscription = await getActiveSubscription(petParentId);
    
    if (!subscription) {
      return {
        canBook: false,
        reason: 'No active subscription found'
      };
    }
    
    if (!subscription.isActive) {
      return {
        canBook: false,
        subscription,
        reason: 'Subscription is inactive'
      };
    }
    
    if (subscription.endDate <= new Date()) {
      return {
        canBook: false,
        subscription,
        reason: 'Subscription has expired'
      };
    }
    
    if (subscription.remainingAppointments <= 0) {
      return {
        canBook: false,
        subscription,
        reason: 'No appointments remaining'
      };
    }
    
    return {
      canBook: true,
      subscription
    };
  } catch (error) {
    console.error('Error checking if can book appointment:', error);
    throw error;
  }
};

/**
 * Book appointment (decrements count and returns updated subscription)
 */
export const bookAppointment = async (subscriptionId: string): Promise<{
  success: boolean;
  subscription?: ISubscription;
  error?: string;
}> => {
  try {
    const subscription = await decrementAppointmentCount(subscriptionId);
    
    if (!subscription) {
      return {
        success: false,
        error: 'No appointments remaining or subscription not found'
      };
    }
    
    return {
      success: true,
      subscription
    };
  } catch (error) {
    console.error('Error booking appointment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// ==================== DELETE OPERATIONS ====================

/**
 * Soft delete subscription (set isActive to false)
 */
export const softDeleteSubscription = async (subscriptionId: string): Promise<ISubscription | null> => {
  try {
    return await deactivateSubscription(subscriptionId);
  } catch (error) {
    console.error('Error soft deleting subscription:', error);
    throw error;
  }
};

/**
 * Hard delete subscription (permanently remove from database)
 */
export const deleteSubscription = async (subscriptionId: string): Promise<boolean> => {
  try {
    const result = await Subscription.deleteOne({ subscriptionId });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting subscription:', error);
    throw error;
  }
};

// ==================== ANALYTICS & REPORTING ====================

/**
 * Get subscription analytics
 */
export const getSubscriptionAnalytics = async (year?: number): Promise<{
  totalSubscriptions: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  appointmentsExhausted: number;
  totalRevenue: number;
  averageAppointmentsUsed: number;
}> => {
  try {
    const currentYear = year || new Date().getFullYear();
    const now = new Date();
    
    const [
      totalSubscriptions,
      activeSubscriptions,
      expiredSubscriptions,
      appointmentsExhausted,
      revenueData,
      appointmentsData
    ] = await Promise.all([
      Subscription.countDocuments({ calendarYear: currentYear }),
      Subscription.countDocuments({
        calendarYear: currentYear,
        isActive: true,
        endDate: { $gt: now },
        remainingAppointments: { $gt: 0 }
      }),
      Subscription.countDocuments({
        calendarYear: currentYear,
        isActive: true,
        endDate: { $lte: now }
      }),
      Subscription.countDocuments({
        calendarYear: currentYear,
        isActive: true,
        endDate: { $gt: now },
        remainingAppointments: 0
      }),
      Subscription.aggregate([
        { $match: { calendarYear: currentYear } },
        { $group: { _id: null, total: { $sum: '$subscriptionAmount' } } }
      ]),
      Subscription.aggregate([
        { $match: { calendarYear: currentYear } },
        { $group: { _id: null, total: { $sum: { $subtract: ['$maxAppointments', '$remainingAppointments'] } } } }
      ])
    ]);
    
    const totalRevenue = revenueData[0]?.total || 0;
    const totalAppointmentsUsed = appointmentsData[0]?.total || 0;
    const averageAppointmentsUsed = totalSubscriptions > 0 ? totalAppointmentsUsed / totalSubscriptions : 0;
    
    return {
      totalSubscriptions,
      activeSubscriptions,
      expiredSubscriptions,
      appointmentsExhausted,
      totalRevenue,
      averageAppointmentsUsed: Math.round(averageAppointmentsUsed * 100) / 100
    };
  } catch (error) {
    console.error('Error getting subscription analytics:', error);
    throw error;
  }
};

/**
 * Get subscriptions expiring soon
 */
export const getSubscriptionsExpiringSoon = async (days: number = 30): Promise<ISubscription[]> => {
  try {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    return await Subscription.find({
      isActive: true,
      endDate: { $lte: futureDate, $gt: new Date() }
    })
      .populate('petParent donationId')
      .sort({ endDate: 1 });
  } catch (error) {
    console.error('Error getting subscriptions expiring soon:', error);
    throw error;
  }
};
