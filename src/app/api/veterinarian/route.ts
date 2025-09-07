import { connectToDatabase } from "@/lib/mongoose";
import { VeterinarianModel } from "@/models";
import moment from "moment-timezone";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/veterinarian
 *
 * Returns a paginated list of veterinarians with their next two available appointment slots.
 * Query params:
 * - page: number (default 1)
 * - limit: number (default 20)
 * - q: text search on name (optional)
 * - specialization: exact match (optional)
 * - available: 'true' | 'false' (optional)
 * - timezone: string (optional, e.g., 'America/New_York', 'Europe/London', 'Asia/Tokyo') - defaults to UTC
 */
export async function GET(req: NextRequest) {
  try {
    console.log("Connecting to database...");
    console.log(
      "MongoDB URI (first 20 chars):",
      process.env.MONGODB_URI?.substring(0, 20) + "..."
    );
    await connectToDatabase();
    console.log("Database connected successfully");

    const { searchParams } = new URL(req.url);
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || "20", 10), 1),
      100
    );
    const q = (searchParams.get("q") || searchParams.get("name") || "").trim();
    const specialization = (searchParams.get("specialization") || "").trim();
    const availableParam = searchParams.get("available");
    const approvedParam = searchParams.get("approved");
    const speciality = (searchParams.get("speciality") || "").trim();
    const treatedSpecies = (searchParams.get("treatedSpecies") || "").trim();
    const interest = (searchParams.get("interest") || "").trim();
    const researchArea = (searchParams.get("researchArea") || "").trim();
    const monthlyGoal = searchParams.get("monthlyGoal");
    const experienceYears = (searchParams.get("experienceYears") || "").trim();
    const city = (searchParams.get("city") || "").trim();
    const state = (searchParams.get("state") || "").trim();
    const country = (searchParams.get("country") || "").trim();
    const gender = (searchParams.get("gender") || "").trim();
    const yearsOfExperience = (
      searchParams.get("yearsOfExperience") || ""
    ).trim();
    const noticePeriod = searchParams.get("noticePeriod");

    const filter: Record<string, any> = {
      // Temporarily removed filters to debug
      // isActive: true,
      // isDeleted: { $ne: true },
    };

    // Do not force approval by default; allow optional filtering via `approved`
    if (approvedParam === "true") {
      filter.isApproved = true;
    } else if (approvedParam === "false") {
      filter.isApproved = false;
    }

    if (q) {
      filter.name = { $regex: q, $options: "i" };
    }
    if (specialization) {
      filter.specialization = specialization;
    }
    if (availableParam === "true") {
      filter.available = true;
    } else if (availableParam === "false") {
      filter.available = false;
    }
    if (speciality) {
      filter.specialities = { $in: [speciality] };
    }
    if (treatedSpecies) {
      filter.treatedSpecies = { $in: [treatedSpecies] };
    }
    if (interest) {
      filter.interests = { $in: [interest] };
    }
    if (researchArea) {
      filter.researchAreas = { $in: [researchArea] };
    }
    if (monthlyGoal) {
      filter.monthlyGoal = { $gte: parseInt(monthlyGoal) };
    }
    if (experienceYears) {
      filter.experienceYears = { $regex: experienceYears, $options: "i" };
    }
    if (city) {
      filter.city = { $regex: city, $options: "i" };
    }
    if (state) {
      filter.state = { $regex: state, $options: "i" };
    }
    if (country) {
      filter.country = { $regex: country, $options: "i" };
    }
    if (gender) {
      filter.gender = gender.toLowerCase();
    }
    if (yearsOfExperience) {
      filter.yearsOfExperience = { $regex: yearsOfExperience, $options: "i" };
    }
    if (noticePeriod) {
      filter.noticePeriod = parseInt(noticePeriod);
    }

    // Build aggregation pipeline to include next two available slots
    // Get user's timezone from query params or default to UTC
    const userTimezone = searchParams.get("timezone") || "UTC";

    // Get current time in user's timezone
    const now = moment().tz(userTimezone);
    const todayStart = now.clone().startOf("day");
    const currentTime = now.format("HH:mm");

    const pipeline: any[] = [
      { $match: filter },
      {
        $lookup: {
          from: "appointmentslots",
          let: { vetId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$vetId", "$$vetId"] },
                status: "available",
                $or: [
                  // Future dates
                  { date: { $gt: todayStart.toDate() } },
                  // Today but future time slots
                  {
                    $and: [
                      { date: { $eq: todayStart.toDate() } },
                      { startTime: { $gt: currentTime } },
                    ],
                  },
                ],
              },
            },
            {
              $sort: {
                date: 1,
                startTime: 1,
              },
            },
            {
              $limit: 2, // Get only next 2 available slots
            },
            {
              $project: {
                _id: 1,
                date: 1,
                startTime: 1,
                endTime: 1,
                timezone: 1,
                status: 1,
                notes: 1,
              },
            },
          ],
          as: "nextAvailableSlots",
        },
      },
      {
        $addFields: {
          // Ensure all fields are included except sensitive ones
          nextAvailableSlots: "$nextAvailableSlots",
        },
      },
      // Filter out veterinarians who have no available slots
      {
        $match: {
          "nextAvailableSlots.0": { $exists: true },
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ];

    // Execute aggregation pipeline
    const [items, total] = await Promise.all([
      VeterinarianModel.aggregate(pipeline),
      VeterinarianModel.countDocuments(filter),
    ]);

    // Debug logging
    console.log("User timezone:", userTimezone);
    console.log("Current time in user timezone:", currentTime);
    console.log("Today start in user timezone:", todayStart.format());
    console.log("Filter applied:", JSON.stringify(filter, null, 2));
    console.log("Total veterinarians found:", total);
    console.log("Items returned:", items.length);

    // Check total count without filters
    const totalWithoutFilters = await VeterinarianModel.countDocuments({});
    console.log(
      "Total veterinarians in database (no filters):",
      totalWithoutFilters
    );

    // Return veterinarians with their next two available appointment slots
    // Each veterinarian object now includes a 'nextAvailableSlots' array
    // containing up to 2 available slots with date, startTime, endTime, timezone, status, and notes
    return NextResponse.json({
      success: true,
      message: "Veterinarians retrieved successfully",
      data: items,
    });

    // return NextResponse.json({
    //   success: true,
    //   message: "Veterinarians retrieved successfully",
    //   data: {
    //     veterinarians: items,
    //     pagination: {
    //       page,
    //       limit,
    //       total,
    //       pages: Math.ceil(total / limit),
    //     },
    //   },
    // });
  } catch (error: any) {
    console.error("GET /api/veterinarian error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch veterinarians",
        errorCode: "FETCH_ERROR",
        errors: null,
      },
      { status: 500 }
    );
  }
}
