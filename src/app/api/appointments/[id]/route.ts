import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { AppointmentModel, type IAppointment } from '@/models';
import { updateAppointmentSchema } from '@/lib/validation/appointment';

function isValidObjectId(id: string) {
  return /^[a-f\d]{24}$/i.test(id);
}

// get appointment by id
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    
    if (!isValidObjectId(id)) {
      return NextResponse.json({ 
        success: false,
        message: "Invalid appointment ID",
        errorCode: "INVALID_ID",
        errors: null
      }, { status: 400 });
    }
    
    // Query out soft-deleted docs and strongly type the lean result to avoid TS issues
    const doc = await AppointmentModel
      .findOne({ _id: id, isDeleted: { $ne: true } })
      .lean<IAppointment>();
      
    if (!doc) {
      return NextResponse.json({ 
        success: false,
        message: "Appointment not found",
        errorCode: "APPOINTMENT_NOT_FOUND",
        errors: null
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true,
      message: "Appointment retrieved successfully",
      data: doc
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json({ 
      success: false,
      message: "Internal server error",
      errorCode: "INTERNAL_ERROR",
      errors: null
    }, { status: 500 });
  }
}

// update appointment by id
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    
    if (!isValidObjectId(id)) {
      return NextResponse.json({ 
        success: false,
        message: "Invalid appointment ID",
        errorCode: "INVALID_ID",
        errors: null
      }, { status: 400 });
    }
    
    const body = await request.json();
    const parseResult = updateAppointmentSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ 
        success: false,
        message: "Validation failed",
        errorCode: "VALIDATION_ERROR",
        errors: parseResult.error.flatten().fieldErrors
      }, { status: 400 });
    }
    
    // Prevent updating a soft-deleted document
    const updated = await AppointmentModel.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } },
      { $set: parseResult.data },
      { new: true, runValidators: true }
    ).lean<IAppointment>();
    
    if (!updated) {
      return NextResponse.json({ 
        success: false,
        message: "Appointment not found",
        errorCode: "APPOINTMENT_NOT_FOUND",
        errors: null
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true,
      message: "Appointment updated successfully",
      data: updated
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating appointment:', error);
    return NextResponse.json({ 
      success: false,
      message: "Internal server error",
      errorCode: "INTERNAL_ERROR",
      errors: null
    }, { status: 500 });
  }
}

// delete appointment by id
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    
    if (!isValidObjectId(id)) {
      return NextResponse.json({ 
        success: false,
        message: "Invalid appointment ID",
        errorCode: "INVALID_ID",
        errors: null
      }, { status: 400 });
    }
    
    // Soft delete (idempotent)
    const updated = await AppointmentModel.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true }
    ).lean<IAppointment>();
    
    if (!updated) {
      return NextResponse.json({ 
        success: false,
        message: "Appointment not found",
        errorCode: "APPOINTMENT_NOT_FOUND",
        errors: null
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true,
      message: "Appointment deleted successfully",
      data: null
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json({ 
      success: false,
      message: "Internal server error",
      errorCode: "INTERNAL_ERROR",
      errors: null
    }, { status: 500 });
  }
}


