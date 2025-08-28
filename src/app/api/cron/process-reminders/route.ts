import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { AppointmentModel } from "@/models/Appointment";
import { AppointmentSlot } from "@/models/AppointmentSlot";
import { VeterinarianModel } from "@/models";
import PetParent from "@/models/PetParent";
import { sendAppointmentReminderEmails } from "@/lib/email";

// This endpoint is intended to be called by Vercel Cron every minute
// It finds appointments starting in ~10 minutes (window 9-11 minutes) and
// sends reminder emails to both veterinarian and pet parent, if not already sent.

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const now = new Date();
    const windowStart = new Date(now.getTime() + 9 * 60 * 1000);
    const windowEnd = new Date(now.getTime() + 11 * 60 * 1000);

    // Find upcoming appointments whose slot date is within window
    // Appointment holds appointmentDate (same as slot date) and slotId
    const appointments = await AppointmentModel.find({
      isDeleted: false,
      status: { $in: ["upcoming", "UPCOMING", "scheduled", "SCHEDULED"] },
      appointmentDate: { $gte: windowStart, $lte: windowEnd },
    })
      .lean()
      .exec();

    if (!appointments.length) {
      return NextResponse.json({ success: true, processed: 0 });
    }

    // Load related slot and people data
    const slotIds = appointments.map((a: any) => a.slotId).filter(Boolean);
    const [slots, vets, parents] = await Promise.all([
      AppointmentSlot.find({ _id: { $in: slotIds } }).lean().exec(),
      VeterinarianModel.find({ _id: { $in: appointments.map((a: any) => a.veterinarian) } })
        .select("name email")
        .lean()
        .exec(),
      PetParent.find({ _id: { $in: appointments.map((a: any) => a.petParent) } })
        .select("name email")
        .lean()
        .exec(),
    ]);

    const slotMap = new Map(slots.map((s: any) => [String(s._id), s]));
    const vetMap = new Map(vets.map((v: any) => [String(v._id), v]));
    const parentMap = new Map(parents.map((p: any) => [String(p._id), p]));

    let sentCount = 0;

    for (const appt of appointments as any[]) {
      const slot = slotMap.get(String(appt.slotId));
      const vet = vetMap.get(String(appt.veterinarian));
      const parent = parentMap.get(String(appt.petParent));

      if (!slot || !vet || !parent) continue;

      // Skip if reminder already sent
      if (appt.reminderSent) continue;

      const datePart = new Date(appt.appointmentDate)
        .toISOString()
        .split("T")[0];
      const startTime = slot.startTime; // stored as HH:mm local string
      const appointmentDateTime = `${datePart} ${startTime}`;

      try {
        await sendAppointmentReminderEmails({
          doctorEmail: vet.email || "",
          doctorName: `Dr. ${vet.name || ""}`,
          parentEmail: parent.email || "",
          parentName: parent.name || "",
          appointmentDateTime,
          meetingLink: appt.meetingLink || "",
        });

        // Mark reminder sent
        await AppointmentModel.updateOne(
          { _id: appt._id },
          { $set: { reminderSent: true } }
        );
        sentCount++;
      } catch (err) {
        console.error("Reminder send failed for appointment", appt._id, err);
        // Continue with others
      }
    }

    return NextResponse.json({ success: true, processed: appointments.length, sent: sentCount });
  } catch (err: any) {
    console.error("process-reminders error:", err);
    return NextResponse.json({ success: false, error: err?.message || "Unknown error" }, { status: 500 });
  }
}


