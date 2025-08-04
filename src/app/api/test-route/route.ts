import { connectToDatabase } from "@/lib/mongoose";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectToDatabase();
    console.log("connected to db");
    return NextResponse.json({ message: "success" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "error" });
  }
};
