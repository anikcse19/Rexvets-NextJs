import {
    activateSubscription,
    bookAppointment,
    canBookAppointment,
    createSubscription,
    CreateSubscriptionData,
    deactivateSubscription,
    decrementAppointmentCount,
    deleteSubscription,
    getActiveSubscription,
    getAllSubscriptions,
    getSubscriptionAnalytics,
    getSubscriptionById,
    getSubscriptionsByPetParent,
    getSubscriptionsByStatus,
    getSubscriptionsExpiringSoon,
    resetYearlyAppointments,
    softDeleteSubscription,
    updateSubscription
} from '@/app/api/subscriptions/subscriptionUtils';
import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

// ==================== GET OPERATIONS ====================

/**
 * GET /api/subscriptions
 * Get all subscriptions with optional filters and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Filters
    const isActive = searchParams.get('isActive');
    const calendarYear = searchParams.get('calendarYear');
    const remainingAppointments = searchParams.get('remainingAppointments');
    const petParentId = searchParams.get('petParentId');
    const status = searchParams.get('status');
    const subscriptionId = searchParams.get('subscriptionId');
    
    // Handle specific subscription ID
    if (subscriptionId) {
      const subscription = await getSubscriptionById(subscriptionId);
      if (!subscription) {
        return NextResponse.json(
          { error: 'Subscription not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ subscription });
    }
    
    // Handle pet parent specific queries
    if (petParentId) {
      if (!Types.ObjectId.isValid(petParentId)) {
        return NextResponse.json(
          { error: 'Invalid pet parent ID' },
          { status: 400 }
        );
      }
      
      const subscriptions = await getSubscriptionsByPetParent(
        new Types.ObjectId(petParentId),
        isActive === 'false'
      );
      return NextResponse.json({ subscriptions });
    }
    
    // Handle status-based queries
    if (status && ['active', 'expired', 'inactive', 'appointments_exhausted'].includes(status)) {
      const subscriptions = await getSubscriptionsByStatus(status as any);
      return NextResponse.json({ subscriptions });
    }
    
    // Handle analytics request
    if (searchParams.get('analytics') === 'true') {
      const analytics = await getSubscriptionAnalytics(
        calendarYear ? parseInt(calendarYear) : undefined
      );
      return NextResponse.json({ analytics });
    }
    
    // Handle expiring subscriptions
    if (searchParams.get('expiring') === 'true') {
      const days = parseInt(searchParams.get('days') || '30');
      const subscriptions = await getSubscriptionsExpiringSoon(days);
      return NextResponse.json({ subscriptions });
    }
    
    // Default: get all subscriptions with filters
    const filters: any = {};
    if (isActive !== null) filters.isActive = isActive === 'true';
    if (calendarYear) filters.calendarYear = parseInt(calendarYear);
    if (remainingAppointments) {
      const [min, max] = remainingAppointments.split('-').map(Number);
      filters.remainingAppointments = {};
      if (!isNaN(min)) filters.remainingAppointments.$gte = min;
      if (!isNaN(max)) filters.remainingAppointments.$lte = max;
    }
    
    const result = await getAllSubscriptions(page, limit, filters);
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Error in GET /api/subscriptions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ==================== POST OPERATIONS ====================

/**
 * POST /api/subscriptions
 * Create a new subscription
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['petParent', 'subscriptionId', 'donationId', 'stripeSubscriptionId', 'stripeCustomerId'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Validate ObjectIds
    if (!Types.ObjectId.isValid(body.petParent)) {
      return NextResponse.json(
        { error: 'Invalid pet parent ID' },
        { status: 400 }
      );
    }
    
    if (!Types.ObjectId.isValid(body.donationId)) {
      return NextResponse.json(
        { error: 'Invalid donation ID' },
        { status: 400 }
      );
    }
    
    const subscriptionData: CreateSubscriptionData = {
      petParent: new Types.ObjectId(body.petParent),
      subscriptionId: body.subscriptionId,
      donationId: new Types.ObjectId(body.donationId),
      stripeSubscriptionId: body.stripeSubscriptionId,
      stripeCustomerId: body.stripeCustomerId,
      subscriptionAmount: body.subscriptionAmount || 120,
      metadata: body.metadata
    };
    
    const subscription = await createSubscription(subscriptionData);
    
    return NextResponse.json(
      { 
        message: 'Subscription created successfully',
        subscription 
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error in POST /api/subscriptions:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('already exists') || error.message.includes('already has an active subscription')) {
        return NextResponse.json(
          { error: error.message },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ==================== PUT OPERATIONS ====================

/**
 * PUT /api/subscriptions
 * Update subscription details
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscriptionId, ...updateData } = body;
    
    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      );
    }
    
    const subscription = await updateSubscription(subscriptionId, updateData);
    
    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Subscription updated successfully',
      subscription
    });
    
  } catch (error) {
    console.error('Error in PUT /api/subscriptions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ==================== DELETE OPERATIONS ====================

/**
 * DELETE /api/subscriptions
 * Delete subscription (soft delete by default, hard delete with ?hard=true)
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('subscriptionId');
    const hardDelete = searchParams.get('hard') === 'true';
    
    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      );
    }
    
    if (hardDelete) {
      const deleted = await deleteSubscription(subscriptionId);
      if (!deleted) {
        return NextResponse.json(
          { error: 'Subscription not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ message: 'Subscription permanently deleted' });
    } else {
      const subscription = await softDeleteSubscription(subscriptionId);
      if (!subscription) {
        return NextResponse.json(
          { error: 'Subscription not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ 
        message: 'Subscription deactivated successfully',
        subscription 
      });
    }
    
  } catch (error) {
    console.error('Error in DELETE /api/subscriptions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
