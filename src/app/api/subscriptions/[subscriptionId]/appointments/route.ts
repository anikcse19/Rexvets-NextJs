import {
    bookAppointment,
    canBookAppointment,
    decrementAppointmentCount,
    getSubscriptionById,
    resetYearlyAppointments
} from '@/app/api/subscriptions/subscriptionUtils';
import { NextRequest, NextResponse } from 'next/server';

// ==================== GET OPERATIONS ====================

/**
 * GET /api/subscriptions/[subscriptionId]/appointments
 * Check if appointment can be booked for this subscription
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { subscriptionId: string } }
) {
  try {
    const { subscriptionId } = params;
    
    const subscription = await getSubscriptionById(subscriptionId);
    
    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }
    
    const canBook = subscription.canBookAppointment();
    const status = subscription.getStatus();
    
    return NextResponse.json({
      subscription: {
        id: subscription.subscriptionId,
        remainingAppointments: subscription.remainingAppointments,
        maxAppointments: subscription.maxAppointments,
        isActive: subscription.isActive,
        endDate: subscription.endDate,
        status
      },
      canBookAppointment: canBook,
      status
    });
    
  } catch (error) {
    console.error('Error in GET /api/subscriptions/[subscriptionId]/appointments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ==================== POST OPERATIONS ====================

/**
 * POST /api/subscriptions/[subscriptionId]/appointments
 * Book an appointment (decrement appointment count)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { subscriptionId: string } }
) {
  try {
    const { subscriptionId } = params;
    const body = await request.json();
    
    // Optional: validate appointment data
    const { appointmentId, notes } = body;
    
    // First check if appointment can be booked
    const subscription = await getSubscriptionById(subscriptionId);
    
    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }
    
    if (!subscription.canBookAppointment()) {
      const status = subscription.getStatus();
      return NextResponse.json(
        { 
          error: 'Cannot book appointment',
          reason: status === 'expired' ? 'Subscription has expired' :
                  status === 'appointments_exhausted' ? 'No appointments remaining' :
                  status === 'inactive' ? 'Subscription is inactive' :
                  'Unknown error',
          subscription: {
            id: subscription.subscriptionId,
            remainingAppointments: subscription.remainingAppointments,
            maxAppointments: subscription.maxAppointments,
            isActive: subscription.isActive,
            endDate: subscription.endDate,
            status
          }
        },
        { status: 400 }
      );
    }
    
    // Book the appointment
    const result = await bookAppointment(subscriptionId);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to book appointment' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      message: 'Appointment booked successfully',
      subscription: {
        id: result.subscription!.subscriptionId,
        remainingAppointments: result.subscription!.remainingAppointments,
        maxAppointments: result.subscription!.maxAppointments,
        appointmentsUsed: result.subscription!.maxAppointments - result.subscription!.remainingAppointments
      },
      appointmentData: {
        appointmentId,
        notes,
        bookedAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error in POST /api/subscriptions/[subscriptionId]/appointments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ==================== PUT OPERATIONS ====================

/**
 * PUT /api/subscriptions/[subscriptionId]/appointments
 * Reset yearly appointments (admin function)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { subscriptionId: string } }
) {
  try {
    const { subscriptionId } = params;
    const body = await request.json();
    const { newYear } = body;
    
    const subscription = await resetYearlyAppointments(subscriptionId, newYear);
    
    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Yearly appointments reset successfully',
      subscription: {
        id: subscription.subscriptionId,
        remainingAppointments: subscription.remainingAppointments,
        maxAppointments: subscription.maxAppointments,
        calendarYear: subscription.calendarYear
      }
    });
    
  } catch (error) {
    console.error('Error in PUT /api/subscriptions/[subscriptionId]/appointments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
