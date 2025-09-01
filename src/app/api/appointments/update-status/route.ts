import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { AppointmentModel } from "@/models/Appointment";
import { PetHistoryModel } from "@/models/PetHistory";
import { PetModel } from "@/models/Pet";
import mongoose from "mongoose";

export async function PATCH(req: NextRequest) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const { appointmentId, newStatus } = body;

    if (!appointmentId || !newStatus) {
      return NextResponse.json(
        { error: "appointmentId and newStatus are required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return NextResponse.json(
        { error: "Invalid appointmentId" },
        { status: 400 }
      );
    }

    // Find appointment
    const appointment = await AppointmentModel.findById(appointmentId)
      .populate("pet")
      .populate("veterinarian")
      .populate("petParent");

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    console.log("find appointment", appointment);

    // Update status
    appointment.status = newStatus;
    await appointment.save();

    // If status is complete, create pet history and update pet seenBy
    if (newStatus === "completed") {
      const petHistory = await PetHistoryModel.create({
        petParent: appointment.petParent._id,
        pet: appointment.pet._id,
        veterinarian: appointment.veterinarian._id,
        appointment: appointment._id,
        visitDate: appointment.appointmentDate,
        diagnosis: "", // optionally you can pass diagnosis/treatment here
        treatment: "",
        medications: [],
        notes: "",
        followUpNeeded: false,
      });

      // Update pet seenBy
      await PetModel.findByIdAndUpdate(appointment.pet._id, {
        $addToSet: { seenBy: appointment.veterinarian._id },
      });
    }

    return NextResponse.json({ message: "Status updated", appointment });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
