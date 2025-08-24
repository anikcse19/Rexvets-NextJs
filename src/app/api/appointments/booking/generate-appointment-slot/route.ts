import { connectToDatabase } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import { generateVeterinarianSlots } from "./utils.appointment-slot";

export const GET = async () => {
  try {
    await connectToDatabase();
    const result = await generateVeterinarianSlots();
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
