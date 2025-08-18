// src/app/api/pet-parent/route.ts api to get pet parent data

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import PetParentModel from "@/models/PetParent";
import { z } from "zod";

// Query validation
const querySchema = z.object({
  id: z.string().trim().optional(),
  email: z
    .string()
    .trim()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    .optional(),
  includePets: z
    .string()
    .transform((v) => v === "true")
    .optional()
    .default("true" as any),
  includePreferences: z
    .string()
    .transform((v) => v === "true")
    .optional()
    .default("true" as any),
  includeEmergencyContact: z
    .string()
    .transform((v) => v === "true")
    .optional()
    .default("true" as any),
});

// Common projection to exclude sensitive fields
const SENSITIVE_EXCLUDE =
  "-password -emailVerificationToken -emailVerificationExpires -passwordResetToken -passwordResetExpires -googleAccessToken -googleRefreshToken";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    const parsed = querySchema.safeParse(queryParams);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { id, email, includePets, includePreferences, includeEmergencyContact } = parsed.data as any;

    // Resolve identity: prefer explicit id/email; otherwise use authenticated session
    let resolvedFilter: Record<string, unknown> | null = null;

    if (id) {
      resolvedFilter = { _id: id };
    } else if (email) {
      resolvedFilter = { email: email.toLowerCase() };
    } else {
      const session = await getServerSession(authOptions);
      if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      resolvedFilter = { email: session.user.email.toLowerCase() };
    }

    await connectToDatabase();

    // Build projection: optionally exclude heavy subdocs if not requested
    const projectionParts: string[] = [SENSITIVE_EXCLUDE];
    if (includePets === false) projectionParts.push("-pets");
    if (includePreferences === false) projectionParts.push("-preferences");
    if (includeEmergencyContact === false) projectionParts.push("-emergencyContact");
    const projection = projectionParts.join(" ");

    const petParent = await PetParentModel.findOne({ ...resolvedFilter, isActive: true }).select(projection);

    if (!petParent) {
      return NextResponse.json(
        { error: "Pet parent not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: petParent });
  } catch (error) {
    console.error("Error fetching pet parent:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
