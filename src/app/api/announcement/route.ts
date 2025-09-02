// app/api/announcements/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { AnnouncementModel } from "@/models/Announcement";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  await connectToDatabase();
  try {
    const body = await req.json();

    if (
      !body.title ||
      !body.details ||
      !body.kind ||
      !Array.isArray(body.audience)
    ) {
      throw new Error(
        "Missing required fields: title, details, kind, audience"
      );
    }

    const doc = await AnnouncementModel.create({
      ...body,
      isDeleted: false,
    });

    return NextResponse.json({ success: true, data: doc }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 400 }
    );
  }
}

export async function GET(req: NextRequest) {
  await connectToDatabase();
  try {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;

    console.log("role", role);
    const url = new URL(req.url);

    const page = Number(url.searchParams.get("page") || 1);
    const limit = Number(url.searchParams.get("limit") || 20);
    const skip = (page - 1) * limit;
    const includeExpired = url.searchParams.get("includeExpired") === "true";
    const kind = url.searchParams.get("kind");
    const roleFilter = url.searchParams.get("role") as
      | "veterinarian"
      | "pet_parent"
      | null;
    const search = url.searchParams.get("search");

    const now = new Date();
    const visibilityClause: any = {
      isDeleted: false,
      audience: { $in: [roleFilter ?? role] },
      $and: [
        { $or: [{ publishedAt: null }, { publishedAt: { $lte: now } }] },
        includeExpired
          ? {}
          : { $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }] },
      ],
    };

    if (kind) visibilityClause.kind = kind;
    if (search) visibilityClause.$text = { $search: search };

    const [items, total] = await Promise.all([
      AnnouncementModel.find(visibilityClause)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AnnouncementModel.countDocuments(visibilityClause),
    ]);

    return NextResponse.json({
      success: true,
      data: items,
      page,
      limit,
      total,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 400 }
    );
  }
}
