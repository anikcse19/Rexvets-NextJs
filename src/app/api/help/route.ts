import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { HelpModel } from "@/models";
import { helpRequestSchema, helpFilterSchema } from "@/lib/validation/help";

/**
 * GET /api/help
 * 
 * Returns a paginated list of help requests with filtering options.
 * Query params:
 * - page: number (default 1)
 * - limit: number (default 20, max 100)
 * - role: 'pet_parent' | 'veterinarian' | 'technician' | 'admin' (optional)
 * - email: string (optional)
 * - q: text search on subject and details (optional)
 */
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const filterData = {
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
      role: searchParams.get('role') || undefined,
      email: searchParams.get('email') || undefined,
      q: searchParams.get('q') || undefined,
    };

    // Validate filter parameters
    const validatedFilters = helpFilterSchema.safeParse(filterData);
    if (!validatedFilters.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errorCode: "VALIDATION_ERROR",
          errors: validatedFilters.error.issues.reduce((acc, issue) => {
            const field = issue.path.join('.');
            acc[field] = issue.message;
            return acc;
          }, {} as Record<string, string>),
        },
        { status: 400 }
      );
    }

    const { page, limit, role, email, q } = validatedFilters.data;

    // Build filter object
    const filter: Record<string, any> = {
      isActive: true,
      isDeleted: { $ne: true },
    };

    if (role) filter.role = role;
    if (email) filter.email = email.toLowerCase();

    // Text search
    if (q) {
      filter.$text = { $search: q };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const [helpRequests, total] = await Promise.all([
      HelpModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      HelpModel.countDocuments(filter),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      message: "Help requests retrieved successfully",
      data: {
        helpRequests,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage,
          hasPrevPage,
        },
      },
    });
  } catch (error: any) {
    console.error("GET /api/help error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch help requests",
        errorCode: "FETCH_ERROR",
        errors: null,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/help
 * 
 * Creates a new help request.
 * Body: HelpRequestData
 */
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();

    // Validate request body
    const validatedData = helpRequestSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errorCode: "VALIDATION_ERROR",
          errors: validatedData.error.issues.reduce((acc, issue) => {
            const field = issue.path.join('.');
            acc[field] = issue.message;
            return acc;
          }, {} as Record<string, string>),
        },
        { status: 400 }
      );
    }

    const helpData = validatedData.data;

    // Create new help request
    const helpRequest = new HelpModel({
      ...helpData,
      email: helpData.email.toLowerCase(),
    });

    await helpRequest.save();

    return NextResponse.json(
      {
        success: true,
        message: "Help request created successfully",
        data: {
          id: helpRequest._id,
          role: helpRequest.role,
          name: helpRequest.name,
          email: helpRequest.email,
          phone: helpRequest.phone,
          state: helpRequest.state,
          subject: helpRequest.subject,
          details: helpRequest.details,
          createdAt: helpRequest.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/help error:", error);

    // Handle MongoDB validation errors
    if (error.name === "ValidationError") {
      const validationErrors: Record<string, string> = {};
      Object.values(error.errors).forEach((err: any) => {
        validationErrors[err.path] = err.message;
      });

      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errorCode: "VALIDATION_ERROR",
          errors: validationErrors,
        },
        { status: 400 }
      );
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "A help request with this information already exists",
          errorCode: "DUPLICATE_ERROR",
          errors: null,
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create help request",
        errorCode: "CREATE_ERROR",
        errors: null,
      },
      { status: 500 }
    );
  }
}
