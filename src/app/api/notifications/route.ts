import { connectToDatabase } from "@/lib/mongoose";
import { sendResponse, throwAppError } from "@/lib/utils/send.response";
import { NotificationModel, NotificationType } from "@/models";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const skip = (page - 1) * limit;

    // Filters
    const type = searchParams.get("type") as NotificationType;
    const recipientId = searchParams.get("recipientId");
    const actorId = searchParams.get("actorId");
    const appointmentId = searchParams.get("appointmentId");
    const vetId = searchParams.get("vetId");
    const petId = searchParams.get("petId");
    const petParentId = searchParams.get("petParentId");
    const isRead = searchParams.get("isRead");
    const search = searchParams.get("search");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build query
    const query: any = {};

    // Type filter
    if (type && Object.values(NotificationType).includes(type)) {
      query.type = type;
    }

    // ID filters
    if (recipientId) query.recipientId = recipientId;
    if (actorId) query.actorId = actorId;
    if (appointmentId) query.appointmentId = appointmentId;
    if (vetId) query.vetId = vetId;
    if (petId) query.petId = petId;
    if (petParentId) query.petParentId = petParentId;

    // Read status filter
    if (isRead !== null && isRead !== undefined) {
      query.isRead = isRead === "true";
    }

    // Date range filters
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    // Text search across title and body
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { body: { $regex: search, $options: "i" } },
      ];
    }

    // Fetch data with pagination and sorting
    const [notifications, total] = await Promise.all([
      NotificationModel.find(query)
        .populate("recipientId", "name email role")
        .populate("actorId", "name email role")
        .populate("appointmentId", "appointmentDate veterinarian petParent pet")
        .populate("vetId", "name email")
        .populate("petId", "name species breed")
        .populate("petParentId", "name email")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      NotificationModel.countDocuments(query),
    ]);

    return sendResponse({
      statusCode: 200,
      success: true,
      message: "Notifications fetched successfully",
      data: notifications,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return throwAppError(
      {
        success: false,
        message: "Failed to fetch notifications",
        errorCode: "NOTIFICATION_FETCH_ERROR",
        errors: error?.errors || null,
      },
      500
    );
  }
}
