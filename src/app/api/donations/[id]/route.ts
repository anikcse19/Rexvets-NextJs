import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { DonationModel } from "@/models";
import { z } from "zod";
import mongoose from "mongoose";

// Validation schema for updates
const updateDonationSchema = z.object({
  donorName: z.string().min(1).optional(),
  donorEmail: z.string().email().optional(),
  donationAmount: z.number().min(1).optional(),
  donationType: z.enum(["donation", "booking"]).optional(),
  transactionID: z.string().optional(),
  isRecurring: z.boolean().optional(),
  status: z.string().optional(),
  badgeName: z.string().optional(),
  badgeImageUrl: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

/**
 * GET /api/donations/[id]
 * Fetch a specific donation by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid donation ID" },
        { status: 400 }
      );
    }

    const donation = await DonationModel.findById(id).lean();

    if (!donation) {
      return NextResponse.json(
        { success: false, error: "Donation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: donation,
    });
  } catch (error) {
    console.error("Error fetching donation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch donation" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/donations/[id]
 * Update a specific donation by ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const body = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid donation ID" },
        { status: 400 }
      );
    }

    const validatedData = updateDonationSchema.parse(body);

    const donation = await DonationModel.findByIdAndUpdate(
      id,
      { ...validatedData },
      { new: true, runValidators: true }
    );

    if (!donation) {
      return NextResponse.json(
        { success: false, error: "Donation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: donation,
      message: "Donation updated successfully",
    });
  } catch (error) {
    console.error("Error updating donation:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to update donation" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/donations/[id]
 * Delete a specific donation by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid donation ID" },
        { status: 400 }
      );
    }

    const donation = await DonationModel.findByIdAndDelete(id);

    if (!donation) {
      return NextResponse.json(
        { success: false, error: "Donation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Donation deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting donation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete donation" },
      { status: 500 }
    );
  }
}
