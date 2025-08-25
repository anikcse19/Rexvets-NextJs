import { connectToDatabase } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import { generateSlotsForDateRange } from "./utils.appointment-slot";

export const GET = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const result = await generateSlotsForDateRange(
      startDate as any,
      endDate as any
    );
    return NextResponse.json(result, {
      status: 200,
      statusText: "Success",
    });
  } catch (error) {
    console.error("Error generating appointment slots:", error);
    return NextResponse.json(
      { message: "Error generating appointment slots" },
      { status: 500, statusText: "Internal Server Error" }
    );
  }
};
