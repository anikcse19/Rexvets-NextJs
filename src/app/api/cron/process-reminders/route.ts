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
  const startTime = new Date();
  console.log(`[CRON] Process reminders started at ${startTime.toISOString()}`);
  
  try {
    await connectToDatabase();
    console.log(`[CRON] Database connected successfully`);

    const now = new Date();
    const windowStart = new Date(now.getTime() + 9 * 60 * 1000);
    const windowEnd = new Date(now.getTime() + 11 * 60 * 1000);

    console.log(`[CRON] Time window: ${windowStart.toISOString()} to ${windowEnd.toISOString()}`);

    // Find upcoming appointments whose slot date is within window
    // Appointment holds appointmentDate (same as slot date) and slotId
    const appointments = await AppointmentModel.find({
      isDeleted: false,
      status: { $in: ["upcoming", "UPCOMING", "scheduled", "SCHEDULED"] },
      appointmentDate: { $gte: windowStart, $lte: windowEnd },
    })
      .lean()
      .exec();

    console.log(`[CRON] Found ${appointments.length} appointments in time window`);

    if (!appointments.length) {
      console.log(`[CRON] No appointments to process`);
      return NextResponse.json({ 
        success: true, 
        processed: 0,
        debug: {
          timeWindow: {
            start: windowStart.toISOString(),
            end: windowEnd.toISOString()
          },
          totalAppointments: 0,
          pendingReminders: 0,
          sentReminders: 0,
          executionTime: `${Date.now() - startTime.getTime()}ms`
        }
      });
    }

    // Load related slot and people data
    const slotIds = appointments.map((a: any) => a.slotId).filter(Boolean);
    console.log(`[CRON] Loading data for ${slotIds.length} slots, ${appointments.length} appointments`);
    
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

    console.log(`[CRON] Loaded: ${slots.length} slots, ${vets.length} vets, ${parents.length} parents`);

    const slotMap = new Map(slots.map((s: any) => [String(s._id), s]));
    const vetMap = new Map(vets.map((v: any) => [String(v._id), v]));
    const parentMap = new Map(parents.map((p: any) => [String(p._id), p]));

    let sentCount = 0;
    let skippedCount = 0;
    let missingDataCount = 0;
    let alreadySentCount = 0;

    console.log(`[CRON] Processing ${appointments.length} appointments...`);

    for (const appt of appointments as any[]) {
      const slot = slotMap.get(String(appt.slotId));
      const vet = vetMap.get(String(appt.veterinarian));
      const parent = parentMap.get(String(appt.petParent));

      if (!slot || !vet || !parent) {
        console.log(`[CRON] Skipping appointment ${appt._id} - missing data (slot: ${!!slot}, vet: ${!!vet}, parent: ${!!parent})`);
        missingDataCount++;
        continue;
      }

      // Skip if reminder already sent
      if (appt.reminderSent) {
        console.log(`[CRON] Skipping appointment ${appt._id} - reminder already sent`);
        alreadySentCount++;
        continue;
      }

      const datePart = new Date(appt.appointmentDate)
        .toISOString()
        .split("T")[0];
      const startTime = slot.startTime; // stored as HH:mm local string
      const appointmentDateTime = `${datePart} ${startTime}`;

      try {
        console.log(`[CRON] Sending reminder for appointment ${appt._id} to ${parent.email} and ${vet.email}`);
        
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
        console.log(`[CRON] Successfully sent reminder for appointment ${appt._id}`);
      } catch (err) {
        console.error(`[CRON] Reminder send failed for appointment ${appt._id}:`, err);
        skippedCount++;
        // Continue with others
      }
    }

    const executionTime = Date.now() - startTime.getTime();
    const pendingReminders = appointments.length - alreadySentCount - missingDataCount;
    
    console.log(`[CRON] Process completed in ${executionTime}ms`);
    console.log(`[CRON] Summary: ${appointments.length} total, ${pendingReminders} pending, ${sentCount} sent, ${alreadySentCount} already sent, ${missingDataCount} missing data, ${skippedCount} failed`);

    return NextResponse.json({ 
      success: true, 
      processed: appointments.length, 
      sent: sentCount,
      debug: {
        timeWindow: {
          start: windowStart.toISOString(),
          end: windowEnd.toISOString()
        },
        totalAppointments: appointments.length,
        pendingReminders,
        sentReminders: sentCount,
        alreadySentReminders: alreadySentCount,
        missingData: missingDataCount,
        failedSends: skippedCount,
        executionTime: `${executionTime}ms`,
        timestamp: startTime.toISOString()
      }
    });
  } catch (err: any) {
    const executionTime = Date.now() - startTime.getTime();
    console.error(`[CRON] Process reminders error after ${executionTime}ms:`, err);
    return NextResponse.json({ 
      success: false, 
      error: err?.message || "Unknown error",
      debug: {
        executionTime: `${executionTime}ms`,
        timestamp: startTime.toISOString()
      }
    }, { status: 500 });
  }
}


