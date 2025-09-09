/**
 * Subscription Utility Functions - Usage Examples
 * 
 * This file demonstrates how to use the subscription utility functions
 * in various scenarios within your application.
 */

import { Types } from 'mongoose';
import {
    bookAppointment,
    canBookAppointment,
    createSubscription,
    CreateSubscriptionData,
    getActiveSubscription,
    getSubscriptionAnalytics,
    getSubscriptionsExpiringSoon
} from '../../app/api/subscriptions/subscriptionUtils';

// ==================== EXAMPLE 1: Creating a Subscription ====================

export async function exampleCreateSubscription() {
  try {
    // When a pet parent purchases a $120 subscription
    const subscriptionData: CreateSubscriptionData = {
      petParent: new Types.ObjectId('507f1f77bcf86cd799439011'), // Pet parent ID
      subscriptionId: 'sub_1234567890', // Stripe subscription ID
      donationId: new Types.ObjectId('507f1f77bcf86cd799439012'), // Donation record ID
      stripeSubscriptionId: 'sub_stripe_1234567890', // Stripe subscription ID
      stripeCustomerId: 'cus_stripe_1234567890', // Stripe customer ID
      subscriptionAmount: 120, // $120 subscription
      metadata: {
        source: 'website',
        campaign: 'new_year_promo',
        referrer: 'google_ads'
      }
    };
    
    const subscription = await createSubscription(subscriptionData);
    
    console.log('Subscription created:', {
      id: subscription.subscriptionId,
      remainingAppointments: subscription.remainingAppointments, // Should be 4
      maxAppointments: subscription.maxAppointments, // Should be 4
      startDate: subscription.startDate,
      endDate: subscription.endDate
    });
    
    return subscription;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}

// ==================== EXAMPLE 2: Checking if Appointment Can Be Booked ====================

export async function exampleCheckAppointmentBooking(petParentId: string) {
  try {
    const petParentObjectId = new Types.ObjectId(petParentId);
    
    // Check if pet parent can book an appointment
    const result = await canBookAppointment(petParentObjectId);
    
    if (result.canBook) {
      console.log('✅ Can book appointment:', {
        remainingAppointments: result.subscription!.remainingAppointments,
        maxAppointments: result.subscription!.maxAppointments
      });
      return { canBook: true, subscription: result.subscription };
    } else {
      console.log('❌ Cannot book appointment:', result.reason);
      return { canBook: false, reason: result.reason };
    }
  } catch (error) {
    console.error('Error checking appointment booking:', error);
    throw error;
  }
}

// ==================== EXAMPLE 3: Booking an Appointment ====================

export async function exampleBookAppointment(subscriptionId: string, appointmentData: any) {
  try {
    // First check if appointment can be booked
    const subscription = await getActiveSubscription(new Types.ObjectId('507f1f77bcf86cd799439011'));
    
    if (!subscription) {
      throw new Error('No active subscription found');
    }
    
    if (!subscription.canBookAppointment()) {
      throw new Error('Cannot book appointment: ' + subscription.getStatus());
    }
    
    // Book the appointment
    const result = await bookAppointment(subscriptionId);
    
    if (result.success) {
      console.log('✅ Appointment booked successfully:', {
        subscriptionId: result.subscription!.subscriptionId,
        remainingAppointments: result.subscription!.remainingAppointments, // Now 3, 2, 1, or 0
        appointmentsUsed: result.subscription!.maxAppointments - result.subscription!.remainingAppointments
      });
      
      // Here you would typically create the actual appointment record
      // const appointment = await createAppointment({
      //   ...appointmentData,
      //   subscriptionId: subscriptionId,
      //   feeUSD: 0 // Free because it's covered by subscription
      // });
      
      return result.subscription;
    } else {
      throw new Error(result.error || 'Failed to book appointment');
    }
  } catch (error) {
    console.error('Error booking appointment:', error);
    throw error;
  }
}

// ==================== EXAMPLE 4: Complete Appointment Flow ====================

export async function exampleCompleteAppointmentFlow(petParentId: string, appointmentData: any) {
  try {
    console.log('🔄 Starting appointment booking flow...');
    
    // Step 1: Check if pet parent has active subscription
    const petParentObjectId = new Types.ObjectId(petParentId);
    const subscription = await getActiveSubscription(petParentObjectId);
    
    if (!subscription) {
      return {
        success: false,
        error: 'No active subscription found. Please purchase a subscription first.',
        action: 'redirect_to_subscription_purchase'
      };
    }
    
    // Step 2: Check if appointment can be booked
    const canBookResult = await canBookAppointment(petParentObjectId);
    
    if (!canBookResult.canBook) {
      return {
        success: false,
        error: canBookResult.reason,
        subscription: subscription,
        action: canBookResult.reason === 'No appointments remaining' ? 'upgrade_subscription' : 'contact_support'
      };
    }
    
    // Step 3: Book the appointment
    const bookingResult = await bookAppointment(subscription.subscriptionId);
    
    if (!bookingResult.success) {
      return {
        success: false,
        error: bookingResult.error,
        action: 'retry_booking'
      };
    }
    
    // Step 4: Create the actual appointment record (pseudo-code)
    // const appointment = await AppointmentModel.create({
    //   ...appointmentData,
    //   petParent: petParentObjectId,
    //   feeUSD: 0, // Free because covered by subscription
    //   paymentStatus: 'PAID', // Already paid via subscription
    //   subscriptionId: subscription.subscriptionId
    // });
    
    console.log('✅ Appointment flow completed successfully');
    
    return {
      success: true,
      appointment: {
        // id: appointment._id,
        subscriptionId: subscription.subscriptionId,
        remainingAppointments: bookingResult.subscription!.remainingAppointments,
        appointmentsUsed: bookingResult.subscription!.maxAppointments - bookingResult.subscription!.remainingAppointments
      },
      message: `Appointment booked! You have ${bookingResult.subscription!.remainingAppointments} appointments remaining.`
    };
    
  } catch (error) {
    console.error('Error in complete appointment flow:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
      action: 'contact_support'
    };
  }
}

// ==================== EXAMPLE 5: Dashboard Analytics ====================

export async function exampleDashboardAnalytics() {
  try {
    // Get subscription analytics for current year
    const analytics = await getSubscriptionAnalytics();
    
    console.log('📊 Subscription Analytics:', {
      totalSubscriptions: analytics.totalSubscriptions,
      activeSubscriptions: analytics.activeSubscriptions,
      expiredSubscriptions: analytics.expiredSubscriptions,
      appointmentsExhausted: analytics.appointmentsExhausted,
      totalRevenue: `$${analytics.totalRevenue}`,
      averageAppointmentsUsed: analytics.averageAppointmentsUsed
    });
    
    // Get subscriptions expiring in next 30 days
    const expiringSoon = await getSubscriptionsExpiringSoon(30);
    
    console.log('⏰ Subscriptions expiring soon:', expiringSoon.length);
    
    return {
      analytics,
      expiringSoon: expiringSoon.length
    };
  } catch (error) {
    console.error('Error getting analytics:', error);
    throw error;
  }
}

// ==================== EXAMPLE 6: API Route Usage ====================

export async function exampleApiUsage() {
  // Example of how to use in API routes
  
  // GET /api/subscriptions?petParentId=507f1f77bcf86cd799439011
  // Returns all subscriptions for a pet parent
  
  // GET /api/subscriptions?status=active
  // Returns all active subscriptions
  
  // GET /api/subscriptions?analytics=true&calendarYear=2024
  // Returns subscription analytics for 2024
  
  // POST /api/subscriptions
  // Creates a new subscription
  
  // POST /api/subscriptions/sub_1234567890/appointments
  // Books an appointment for a specific subscription
  
  // GET /api/subscriptions/sub_1234567890/appointments
  // Checks if appointment can be booked for a subscription
  
  console.log('📚 API endpoints available:');
  console.log('- GET /api/subscriptions - List subscriptions with filters');
  console.log('- POST /api/subscriptions - Create subscription');
  console.log('- PUT /api/subscriptions - Update subscription');
  console.log('- DELETE /api/subscriptions - Delete subscription');
  console.log('- GET /api/subscriptions/[id]/appointments - Check booking status');
  console.log('- POST /api/subscriptions/[id]/appointments - Book appointment');
}

// ==================== EXAMPLE 7: Error Handling ====================

export async function exampleErrorHandling() {
  try {
    // Example of proper error handling
    const subscription = await createSubscription({
      petParent: new Types.ObjectId('507f1f77bcf86cd799439011'),
      subscriptionId: 'sub_duplicate_test',
      donationId: new Types.ObjectId('507f1f77bcf86cd799439012'),
      stripeSubscriptionId: 'sub_stripe_test',
      stripeCustomerId: 'cus_stripe_test'
    });
    
    // Try to create duplicate subscription
    try {
      await createSubscription({
        petParent: new Types.ObjectId('507f1f77bcf86cd799439011'),
        subscriptionId: 'sub_duplicate_test', // Same ID
        donationId: new Types.ObjectId('507f1f77bcf86cd799439012'),
        stripeSubscriptionId: 'sub_stripe_test2',
        stripeCustomerId: 'cus_stripe_test2'
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.log('✅ Properly caught duplicate subscription error:', message);
    }
    
  } catch (error) {
    console.error('Error in error handling example:', error);
  }
}

// ==================== EXPORT ALL EXAMPLES ====================

export const subscriptionExamples = {
  createSubscription: exampleCreateSubscription,
  checkAppointmentBooking: exampleCheckAppointmentBooking,
  bookAppointment: exampleBookAppointment,
  completeAppointmentFlow: exampleCompleteAppointmentFlow,
  dashboardAnalytics: exampleDashboardAnalytics,
  apiUsage: exampleApiUsage,
  errorHandling: exampleErrorHandling
};
