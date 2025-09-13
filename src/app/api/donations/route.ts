import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { DonationModel } from "@/models";
import { z } from "zod";

// Validation schemas
const createDonationSchema = z.object({
  donorName: z.string().min(1, "Donor name is required"),
  donorEmail: z.string().email("Invalid email address"),
  donationAmount: z.number().min(1, "Donation amount must be at least $1"),
  donationType: z.enum(["donation", "booking"]),
  transactionID: z.string().optional(),
  isRecurring: z.boolean().default(false),
  status: z.string().default("pending"),
  badgeName: z.string().optional(),
  badgeImageUrl: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

const updateDonationSchema = createDonationSchema.partial();

/**
 * GET /api/donations
 * Fetch all donations with optional filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const donationType = searchParams.get("donationType") || "";

    // Build filter object
    const filter: any = {};

    if (search) {
      filter.$or = [
        { donorName: { $regex: search, $options: "i" } },
        { donorEmail: { $regex: search, $options: "i" } },
        { transactionID: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      filter.status = status;
    }

    if (donationType) {
      filter.donationType = donationType;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch donations with pagination
    const donations = await DonationModel.find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalCount = await DonationModel.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: donations,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching donations:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch donations" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/donations
 * Create a new donation record
 */
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const validatedData = createDonationSchema.parse(body);

    // Create donation record
    const donation = await DonationModel.create({
      ...validatedData,
      timestamp: new Date(),
    });

    return NextResponse.json({
      success: true,
      data: donation,
      message: "Donation created successfully",
    });
  } catch (error) {
    console.error("Error creating donation:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create donation" },
      { status: 500 }
    );
  }
}
