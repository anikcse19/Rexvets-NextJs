import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { AppointmentModel } from '@/models';
import { bulkDeleteAppointmentsSchema } from '@/lib/validation/appointment';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    // Strict Zod validation
    const parsed = bulkDeleteAppointmentsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ 
        success: false,
        message: "Validation failed",
        errorCode: "VALIDATION_ERROR",
        errors: parsed.error.flatten().fieldErrors
      }, { status: 400 });
    }
    
    const { ids: validIds } = parsed.data;

    const result = await AppointmentModel.updateMany(
      { _id: { $in: validIds }, isDeleted: { $ne: true } }, // Only update if not already soft-deleted
      { $set: { isDeleted: true } }
    );
    
    return NextResponse.json({ 
      success: true,
      message: "Bulk delete operation completed successfully",
      data: {
        deletedCount: result.modifiedCount,
        totalRequested: validIds.length,
        skippedCount: validIds.length - (result.modifiedCount || 0)
      }
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error bulk deleting appointments:', error);
    return NextResponse.json({ 
      success: false,
      message: "Internal server error",
      errorCode: "INTERNAL_ERROR",
      errors: null
    }, { status: 500 });
  }
}


