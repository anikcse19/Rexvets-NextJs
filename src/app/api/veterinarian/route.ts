import { connectToDatabase } from "@/lib/mongoose";
import { VeterinarianModel, AppointmentModel } from "@/models";
import { AppointmentSlot } from "@/models/AppointmentSlot";
import moment from "moment-timezone";
import { NextRequest, NextResponse } from "next/server";
import { getSlotsByNoticePeriodAndDateRangeByVetId } from "../appointments/booking/slot/slot.util";

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
    const skipSlotFilter = searchParams.get("skipSlotFilter") === "true";

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
    // const userTimezone = searchParams.get("timezone") || "UTC";

    // First, get all veterinarians that match the filter
    // Use lean() and pagination to reduce memory and speed up response
    const veterinarians = await VeterinarianModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Build nextAvailableSlots per vet mirroring today's-slot logic
    const slotByVet = new Map<
      string,
      { todaysCount: number; nextAvailableSlots: any[] }
    >();
    const vetResults = await Promise.all(
      veterinarians.map(async (vet: any) => {
        const tz = vet.timezone || "UTC";
        const notice = vet.noticePeriod ?? 0;
        const nowTz = moment.tz(tz);

        // Fetch today's slots first
        const todaySlots = await getSlotsByNoticePeriodAndDateRangeByVetId({
          vetId: vet._id.toString(),
          noticePeriod: notice,
          // Pass the same date for start and end to mirror today's-slot behavior
          startDate: nowTz.toDate(),
          endDate: nowTz.toDate(),
          timezone: tz,
        });

        if (todaySlots && todaySlots.length > 0) {
          const nextTwo = todaySlots.slice(0, 2);
          slotByVet.set(vet._id.toString(), {
            todaysCount: todaySlots.length,
            nextAvailableSlots: nextTwo,
          });
          return;
        }

        // Otherwise fetch nearest future date slots (within next 30 days)
        const futureStart = nowTz.clone().add(1, "day").startOf("day").toDate();
        const futureEnd = nowTz.clone().add(30, "day").endOf("day").toDate();
        const futureSlots = await getSlotsByNoticePeriodAndDateRangeByVetId({
          vetId: vet._id.toString(),
          noticePeriod: notice,
          startDate: futureStart,
          endDate: futureEnd,
          timezone: tz,
        });
        // Restrict to the first future date's slots only, then take up to 2
        let nextTwo: any[] = [];
        if (futureSlots && futureSlots.length > 0) {
          const firstDateStr = moment
            .tz(futureSlots[0].date, tz)
            .format("YYYY-MM-DD");
          nextTwo = futureSlots
            .filter(
              (s: any) =>
                moment.tz(s.date, tz).format("YYYY-MM-DD") === firstDateStr
            )
            .slice(0, 2);
        }
        slotByVet.set(vet._id.toString(), {
          todaysCount: 0,
          nextAvailableSlots: nextTwo,
        });
      })
    );

    // Get appointment counts for all veterinarians
    const vetIds = veterinarians.map((vet: any) => vet._id);
    const appointmentCounts = await AppointmentModel.aggregate([
      {
        $match: {
          veterinarian: { $in: vetIds },
          isDeleted: false
        }
      },
      {
        $group: {
          _id: "$veterinarian",
          appointmentCount: { $sum: 1 },
          completedAppointments: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
          }
        }
      }
    ]);

    // Create a map for quick lookup
    const appointmentCountMap = new Map();
    appointmentCounts.forEach((count) => {
      appointmentCountMap.set(count._id.toString(), {
        totalAppointments: count.appointmentCount,
        completedAppointments: count.completedAppointments
      });
    });

    const items = veterinarians
      .map((vet: any) => {
        const s = slotByVet.get(vet._id.toString());
        const appointmentData = appointmentCountMap.get(vet._id.toString()) || {
          totalAppointments: 0,
          completedAppointments: 0
        };
        
        return {
          ...vet,
          todaysCount: s?.todaysCount || 0,
          nextAvailableSlots: s?.nextAvailableSlots || [],
          appointments: Array(appointmentData.totalAppointments).fill(null), // Create array for length
          appointmentCount: appointmentData.totalAppointments,
          completedAppointments: appointmentData.completedAppointments
        };
      })
      .filter((v: any) => {
        // Skip slot filtering if skipSlotFilter is true
        if (skipSlotFilter) {
          return true;
        }
        // Original slot filtering logic
        return v.todaysCount > 0 || (v.nextAvailableSlots || []).length > 0;
      });

    // Get total count for pagination
    const total = await VeterinarianModel.countDocuments(filter);

    // // Debug logging
    // console.log("User timezone:", userTimezone);
    // console.log("Current time in user timezone:", currentTime);
    // console.log("Today start in user timezone:", todayStart.format());
    // console.log("Filter applied:", JSON.stringify(filter, null, 2));
    // console.log("Total veterinarians found:", total);
    // console.log("Items returned:", items.length);

    // Log notice period filtering results
    // items.forEach((vet: any, index) => {
    //   console.log(
    //     `Vet ${index + 1} (${vet.name}): noticePeriod=${
    //       vet.noticePeriod
    //     }min, available slots=${vet.nextAvailableSlots?.length || 0}`
    //   );
    //   if (vet.nextAvailableSlots?.length > 0) {
    //     vet.nextAvailableSlots.forEach((slot: any, slotIndex: number) => {
    //       console.log(
    //         `  Slot ${slotIndex + 1}: ${slot.date} ${
    //           slot.startTime
    //         } (${slot.minutesFromNow?.toFixed(1)}min from now)`
    //       );
    //     });
    //   }
    // });

    // Check total count without filters
    const totalWithoutFilters = await VeterinarianModel.countDocuments({});
    // console.log(
    //   "Total veterinarians in database (no filters):",
    //   totalWithoutFilters
    // );
    // console.log("items", items);
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
