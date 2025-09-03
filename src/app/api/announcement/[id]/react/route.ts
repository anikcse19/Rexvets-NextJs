import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { AnnouncementModel } from "@/models/Announcement";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: any
) {
  await connectToDatabase();
  try {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;
    const userId = session?.user?.refId;

    if (!Types.ObjectId.isValid(params.id))
      return NextResponse.json(
        { success: false, message: "Invalid id" },
        { status: 400 }
      );

    const { value } = await req.json();
    if (!["positive", "negative", "neutral"].includes(value))
      return NextResponse.json(
        { success: false, message: "Invalid reaction value" },
        { status: 400 }
      );

    const now = new Date();
    const base = await AnnouncementModel.findOne({
      _id: params.id,
      isDeleted: false,
      audience: { $in: [role] },
      $and: [
        { $or: [{ publishedAt: null }, { publishedAt: { $lte: now } }] },
        { $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }] },
      ],
    }).select({ _id: 1 });

    if (!base)
      return NextResponse.json(
        { success: false, message: "Not found" },
        { status: 404 }
      );

    const updated = await AnnouncementModel.findOneAndUpdate(
      {
        _id: params.id,
        "reactions.user": new Types.ObjectId(userId),
        "reactions.role": role,
      },
      {
        $set: {
          "reactions.$.value": value,
          "reactions.$.reactedAt": new Date(),
        },
      },
      { new: true }
    );

    if (updated) return NextResponse.json({ success: true, data: updated });

    const pushed = await AnnouncementModel.findByIdAndUpdate(
      params.id,
      {
        $push: {
          reactions: {
            user: new Types.ObjectId(userId),
            role,
            value,
            reactedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    return NextResponse.json({ success: true, data: pushed });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 400 }
    );
  }
}
