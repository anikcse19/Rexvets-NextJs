import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { AppointmentModel, type IAppointment } from '@/models';
import { createAppointmentSchema, listAppointmentsQuerySchema } from '@/lib/validation/appointment';

// get appointments
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const parseResult = listAppointmentsQuerySchema.safeParse(Object.fromEntries(searchParams.entries()));
    
    if (!parseResult.success) {
      return NextResponse.json({ 
        success: false,
        message: "Validation failed",
        errorCode: "VALIDATION_ERROR",
        errors: parseResult.error.flatten().fieldErrors
      }, { status: 400 });
    }

    const { page, limit, sort, order, status, veterinarianId, parentId, date, startDate, endDate, includeDeleted } = parseResult.data;

    const filter: any = {};
    if (status) filter.status = status;
    if (veterinarianId) filter.veterinarianId = veterinarianId;
    if (parentId) filter.parentId = parentId;
    if (!includeDeleted) filter.isDeleted = { $ne: true };
    if (date) filter.appointmentDate = date;
    if (startDate && endDate) filter.appointmentDate = { $gte: startDate, $lte: endDate };

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortSpec: any = { [sort]: sortOrder };
    if (sort === 'appointmentDate') sortSpec.appointmentTime = sortOrder;

    // Lean + typed result for performance and type-safety
    const cursor = AppointmentModel.find(filter)
      .sort(sortSpec)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<IAppointment>();
    
    const [items, total] = await Promise.all([
      cursor,
      AppointmentModel.countDocuments(filter),
    ]);

    return NextResponse.json({ 
      success: true,
      message: "Appointments retrieved successfully",
      data: {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ 
      success: false,
      message: "Internal server error",
      errorCode: "INTERNAL_ERROR",
      errors: null
    }, { status: 500 });
  }
}

// create appointment
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    const parseResult = createAppointmentSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ 
        success: false,
        message: "Validation failed",
        errorCode: "VALIDATION_ERROR",
        errors: parseResult.error.flatten().fieldErrors
      }, { status: 400 });
    }

    const appointmentData = parseResult.data;
    const appointment = new AppointmentModel(appointmentData);
    const savedAppointment = await appointment.save();

    return NextResponse.json({ 
      success: true,
      message: "Appointment created successfully",
      data: savedAppointment.toObject()
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating appointment:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json({ 
        success: false,
        message: "Appointment already exists",
        errorCode: "DUPLICATE_ERROR",
        errors: null
      }, { status: 409 });
    }

    return NextResponse.json({ 
      success: false,
      message: "Internal server error",
      errorCode: "INTERNAL_ERROR",
      errors: null
    }, { status: 500 });
  }
}


