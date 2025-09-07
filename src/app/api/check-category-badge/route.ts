import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log("api hitted");
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const id = session.user.id;
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    if (!user.categoryBadge) {
      return NextResponse.json(
        { success: false, message: "Badge not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, badgeName: user.categoryBadge },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
