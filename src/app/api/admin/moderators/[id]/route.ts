import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import UserModel from "@/models/User";
import mongoose from "mongoose";

// PUT /api/admin/moderators/[id] - Update moderator access list
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { accesslist } = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid moderator ID" }, { status: 400 });
    }

    if (!accesslist || !Array.isArray(accesslist)) {
      return NextResponse.json(
        { error: "Access list is required and must be an array" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const moderator = await UserModel.findOneAndUpdate(
      { 
        _id: id, 
        role: "moderator",
        isDeleted: { $ne: true }
      },
      { 
        accesslist,
        updatedAt: new Date()
      },
      { new: true }
    ).select("-password -emailVerificationToken -passwordResetToken -googleAccessToken -googleRefreshToken");

    if (!moderator) {
      return NextResponse.json(
        { error: "Moderator not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: "Moderator access list updated successfully",
      moderator: {
        _id: moderator._id,
        name: moderator.name,
        email: moderator.email,
        phone: moderator.phone,
        accesslist: moderator.accesslist,
        isActive: moderator.isActive,
        createdAt: moderator.createdAt,
        updatedAt: moderator.updatedAt,
      }
    });
  } catch (error) {
    console.error("Error updating moderator:", error);
    return NextResponse.json(
      { error: "Failed to update moderator" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/moderators/[id] - Delete moderator (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid moderator ID" }, { status: 400 });
    }

    await connectToDatabase();

    const moderator = await UserModel.findOneAndUpdate(
      { 
        _id: id, 
        role: "moderator",
        isDeleted: { $ne: true }
      },
      { 
        isDeleted: true,
        isActive: false,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!moderator) {
      return NextResponse.json(
        { error: "Moderator not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: "Moderator deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting moderator:", error);
    return NextResponse.json(
      { error: "Failed to delete moderator" },
      { status: 500 }
    );
  }
}
