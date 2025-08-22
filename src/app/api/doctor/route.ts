import { connectToDatabase } from "@/lib/mongoose";
import { DoctorModel, IDoctor } from "@/models/Doctor";
import { NextResponse } from "next/server";
import { doctors } from "./doctor.data";
export const bulkInsertDoctors = async (doctors: IDoctor[]) => {
  if (!doctors || doctors.length === 0) return { inserted: 0 };

  // Prepare bulk insert operations
  const bulkOps = doctors.map((doc) => ({
    insertOne: { document: doc },
  }));

  // Execute bulkWrite
  const result = await DoctorModel.bulkWrite(bulkOps, { ordered: false });

  return {
    inserted: result.insertedCount,
  };
};
export const GET = async () => {
  await connectToDatabase();
  try {
    const doctors = await DoctorModel.find().limit(40);
    return NextResponse.json({ name: "HELLO", doctors });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch doctors" });
  }
};
