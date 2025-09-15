// app/api/announcements/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { AnnouncementModel } from "@/models/Announcement";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: any
) {
  await connectToDatabase();
  try {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;
    if (!Types.ObjectId.isValid(params.id)) throw new Error("Invalid id");

    const now = new Date();
    const doc = await AnnouncementModel.findOne({
      _id: params.id,
      isDeleted: false,
      audience: { $in: [role] },
      $and: [
        { $or: [{ publishedAt: null }, { publishedAt: { $lte: now } }] },
        { $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }] },
      ],
    }).lean();

    if (!doc)
      return NextResponse.json(
        { success: false, message: "Not found" },
        { status: 404 }
      );
    return NextResponse.json({ success: true, data: doc });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 400 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: any
) {
  await connectToDatabase();
  try {
    const body = await req.json();

    const doc = await AnnouncementModel.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true }
    );
    if (!doc)
      return NextResponse.json(
        { success: false, message: "Not found" },
        { status: 404 }
      );
    return NextResponse.json({ success: true, data: doc });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: any
) {
  await connectToDatabase();
  try {
    const doc = await AnnouncementModel.findByIdAndUpdate(
      params.id,
      { $set: { isDeleted: true } },
      { new: true }
    );
    if (!doc)
      return NextResponse.json(
        { success: false, message: "Not found" },
        { status: 404 }
      );
    return NextResponse.json({ success: true, data: doc });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 400 }
    );
  }
}
