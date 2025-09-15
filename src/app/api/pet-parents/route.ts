import { connectToDatabase } from "@/lib/mongoose";
import { AppointmentModel, PetModel, PetParentModel } from "@/models";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectToDatabase();

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

    // Filters
    const filter: any = { isDeleted: { $ne: true } };
    const name = searchParams.get("name");
    const email = searchParams.get("email");
    const search = searchParams.get("search");
    const isActive = searchParams.get("isActive");
    const status = searchParams.get("status"); // optional: active|inactive
    const startDate = searchParams.get("startDate"); // ISO string
    const endDate = searchParams.get("endDate"); // ISO string

    if (name) filter.name = { $regex: name, $options: "i" };
    if (email) filter.email = { $regex: email, $options: "i" };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
      ];
    }
    if (isActive) filter.isActive = isActive === "true";
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.createdAt = {} as any;
      if (startDate) (filter.createdAt as any).$gte = new Date(startDate);
      if (endDate) (filter.createdAt as any).$lt = new Date(endDate);
    }

    // Pagination
    const skip = (page - 1) * limit;
    const total = await PetParentModel.countDocuments(filter);

    // Fetch parents
    const petParents = await PetParentModel.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean(); // lean() returns plain JS objects → faster, easier to modify

    // Collect IDs
    const parentIds = petParents.map((p) => p._id);

    console.log("parent ids", parentIds);

    // Fetch pets and appointments in bulk
    const pets = await PetModel.find({
      parentId: { $in: parentIds },
    }).lean();
    const appointments = await AppointmentModel.find({
      petParent: { $in: parentIds },
    }).lean();

    console.log(pets, appointments);

    // Group pets and appointments by petParentId
    const petsByParent: Record<string, any[]> = {};
    pets.forEach((pet) => {
      const pid = pet.parentId.toString();
      if (!petsByParent[pid]) petsByParent[pid] = [];
      petsByParent[pid].push(pet);
    });

    const appointmentsByParent: Record<string, any[]> = {};
    appointments.forEach((appt) => {
      const pid = appt.petParent.toString();
      if (!appointmentsByParent[pid]) appointmentsByParent[pid] = [];
      appointmentsByParent[pid].push(appt);
    });

    // Merge into PetParent
    const results = petParents.map((parent) => {
      const pid = (parent._id as Types.ObjectId).toString();
      return {
        ...parent,
        pets: petsByParent[pid] || [],
        appointments: appointmentsByParent[pid] || [],
      };
    });

    return NextResponse.json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: results,
    });
  } catch (error: any) {
    console.error("Error fetching pet parents:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch pet parents" },
      { status: 500 }
    );
  }
}
