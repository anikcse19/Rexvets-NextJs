// app/api/announcements/route.ts
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { AnnouncementModel } from "@/models/Announcement";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

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
    const adminView = url.searchParams.get("adminView") === "true";

    const now = new Date();
    let visibilityClause: any = {
      isDeleted: false,
    };

    // If admin view, show all announcements regardless of role
    if (adminView) {
      // Admin can see all announcements
    } else {
      // Regular user filtering
      visibilityClause.audience = { $in: [roleFilter ?? role] };
      visibilityClause.$and = [
        { $or: [{ publishedAt: null }, { publishedAt: { $lte: now } }] },
        includeExpired
          ? {}
          : { $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }] },
      ];
    }

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

export async function DELETE(req: NextRequest) {
  await connectToDatabase();
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is admin
    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Announcement ID is required" },
        { status: 400 }
      );
    }

    const result = await AnnouncementModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, message: "Announcement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Announcement deleted successfully" });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 400 }
    );
  }
}
