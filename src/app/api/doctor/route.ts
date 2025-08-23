import { connectToDatabase } from "@/lib/mongoose";
import { DoctorModel } from "@/models/Doctor";
import { NextResponse } from "next/server";
export const GET = async () => {
  await connectToDatabase();
  try {
    const doctors = await DoctorModel.find().limit(40);
    return NextResponse.json({ name: "HELLO", doctors });
  } catch {
    return NextResponse.json({ error: "Failed to fetch doctors" });
  }
};
