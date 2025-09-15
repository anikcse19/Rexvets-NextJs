import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { PetParentModel } from "@/models";
import { SubscriptionModel } from "@/models/Subscription";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Get session to verify authentication
    const session = await getServerSession(authOptions as any);

    if (!(session as any)?.user?.refId) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
          redirectTo: "/auth/signin",
        },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Check subscription quota and donation status
    const petParent = await PetParentModel.findOne({
      _id: (session as any).user.refId,
      isActive: true,
    }).select("donationPaid lastDonationDate");

    const subscription = await SubscriptionModel.findOne({
      petParent: (session as any).user.refId,
      isActive: true,
    }).select("remainingAppointments _id");

    if (!petParent) {
      return NextResponse.json(
        {
          success: false,
          message: "Pet parent not found",
          redirectTo: "/auth/signin",
        },
        { status: 404 }
      );
    }

    // Check if user has remaining appointments in subscription
    const hasQuota = subscription && subscription.remainingAppointments > 0;

    // If no quota, check donation status
    if (!hasQuota && !petParent.donationPaid) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No remaining appointments and donation required to book appointments",
          redirectTo: "/donate",
          donationStatus: {
            donationPaid: false,
            lastDonationDate: petParent.lastDonationDate,
          },
          subscriptionStatus: {
            hasRemainingAppointments: subscription?.remainingAppointments > 0,
            remainingAppointments: subscription?.remainingAppointments || 0,
            subscriptionId: subscription?._id?.toString(),
          },
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Access granted",
      donationStatus: {
        donationPaid: petParent.donationPaid,
        lastDonationDate: petParent.lastDonationDate,
      },
      subscriptionStatus: {
        hasRemainingAppointments: hasQuota,
        remainingAppointments: subscription?.remainingAppointments || 0,
        subscriptionId: subscription?._id?.toString(),
      },
    });
  } catch (error) {
    console.error("Error checking appointment confirmation access:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        redirectTo: "/",
      },
      { status: 500 }
    );
  }
}
