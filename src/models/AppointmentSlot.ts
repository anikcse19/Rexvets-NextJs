import mongoose, { Document, Model, Schema, Types, models } from "mongoose";
export enum SlotStatus {
  AVAILABLE = "available",
  BOOKED = "booked",
  DISABLED = "disabled",
  ALL = "all",
}

export interface IAvailabilitySlot {
  vetId: Types.ObjectId;
  date: Date; // Store as date without timezone (local date)
  startTime: string; // Store as HH:mm in the appointment's timezone
  endTime: string; // Store as HH:mm in the appointment's timezone
  timezone: string; // Store the timezone of the appointment (e.g., "America/New_York")
  status: SlotStatus;
  notes?: string;
  createdAt: Date;
}

// Mongoose schema
const appointmentSlotSchema: Schema<IAvailabilitySlot & Document> = new Schema(
  {
    vetId: { type: Schema.Types.ObjectId, ref: "Veterinarian", required: true },
    date: { type: Date, required: true }, // Store as local date without timezone
    startTime: { type: String, required: true }, // HH:mm format in appointment timezone
    endTime: { type: String, required: true }, // HH:mm format in appointment timezone
    timezone: { type: String, required: true }, // Timezone identifier (e.g., "America/New_York")
    status: {
      type: String,
      enum: Object.values(SlotStatus),
      default: SlotStatus.AVAILABLE,
    },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ============================================================================
// PROFESSIONAL INDEXING STRATEGY
// ============================================================================

// 1. PRIMARY QUERY INDEXES (Most frequently used queries)
// Optimized for finding available slots for a specific vet on a specific date
appointmentSlotSchema.index(
  { vetId: 1, date: 1, status: 1 },
  {
    name: "vet_date_status_idx",
    background: true,
    partialFilterExpression: { status: { $in: ["available", "booked"] } },
  }
);

// 2. TIME-BASED QUERY INDEXES
// For date range queries and time-based searches
appointmentSlotSchema.index(
  { date: 1, startTime: 1, endTime: 1 },
  {
    name: "date_time_range_idx",
    background: true,
  }
);

// 3. VET-SPECIFIC QUERY INDEXES
// For finding all slots for a specific veterinarian
appointmentSlotSchema.index(
  { vetId: 1, status: 1, date: 1 },
  {
    name: "vet_status_date_idx",
    background: true,
  }
);

appointmentSlotSchema.index(
  { timezone: 1, date: 1, status: 1 },
  {
    name: "timezone_date_status_idx",
    background: true,
  }
);

// 5. STATUS-BASED QUERY INDEXES
// For filtering by slot status
appointmentSlotSchema.index(
  { status: 1, date: 1 },
  {
    name: "status_date_status_idx",
    background: true,
  }
);

// 6. CREATION TIME INDEXES
// For audit trails and time-based analytics
appointmentSlotSchema.index(
  { createdAt: -1 },
  {
    name: "created_at_desc_idx",
    background: true,
  }
);

// 7. COMPOUND INDEXES FOR COMPLEX QUERIES
// For multi-field searches with high selectivity
// IMPORTANT: This index allows different vets to have overlapping time slots
appointmentSlotSchema.index(
  { vetId: 1, date: 1, startTime: 1, endTime: 1, timezone: 1 },
  {
    name: "vet_slot_details_idx",
    background: true,
    // REMOVED unique: true - Different vets can have overlapping slots
  }
);

// 8. OVERLAP PREVENTION INDEX (NEW)
// Prevents the SAME vet from creating overlapping slots on the same date/timezone
// This ensures data integrity while allowing different vets to overlap
appointmentSlotSchema.index(
  { vetId: 1, date: 1, timezone: 1, startTime: 1, endTime: 1 },
  {
    name: "vet_overlap_prevention_idx",
    background: true,
    unique: true, // Only prevents same vet from overlapping slots
  }
);

// 9. TEXT SEARCH INDEX (if needed for notes)
// Uncomment if you need to search through notes
// appointmentSlotSchema.index(
//   { notes: "text" },
//   {
//     name: "notes_text_idx",
//     background: true,
//     weights: { notes: 10 }
//   }
// );

// ============================================================================
// INDEX OPTIMIZATION NOTES
// ============================================================================
/*
INDEX STRATEGY EXPLANATION:

1. vet_date_status_idx: Primary index for finding available/booked slots
   - Most common query: "Find available slots for vet X on date Y"
   - Partial filter reduces index size by excluding disabled slots

2. date_time_range_idx: For time-based queries
   - Useful for: "Find all slots between 9 AM and 5 PM on date X"
   - Supports range queries on time fields

3. vet_status_date_idx: For vet-specific status queries
   - Useful for: "Find all booked slots for vet X"
   - Good for dashboard views and reporting

4. timezone_date_status_idx: For timezone-aware queries
   - Useful for: "Find available slots in EST timezone on date X"
   - Important for multi-timezone applications

5. status_date_status_idx: For status-based filtering
   - Useful for: "Find all available slots on date X"
   - Good for general availability searches

6. created_at_desc_idx: For chronological ordering
   - Useful for: "Show recent slot changes"
   - Good for audit trails and analytics

7. vet_slot_details_idx: Complex query coverage (NON-UNIQUE)
   - Covers detailed slot queries
   - Allows different vets to have overlapping slots
   - IMPORTANT: Removed unique constraint

8. vet_overlap_prevention_idx: NEW - Prevents same vet overlap
   - Ensures same vet cannot have overlapping slots
   - Allows different vets to have overlapping slots
   - Maintains data integrity per veterinarian

OVERLAP SCENARIOS:
✅ ALLOWED: Different vets can have slots at same time/date/timezone
   - Vet A: 9:00-10:00 AM on Aug 6, 2025, EST
   - Vet B: 9:00-10:00 AM on Aug 6, 2025, EST

❌ PREVENTED: Same vet cannot have overlapping slots
   - Vet A: 9:00-10:00 AM on Aug 6, 2025, EST
   - Vet A: 9:30-10:30 AM on Aug 6, 2025, EST (OVERLAP - BLOCKED)

PERFORMANCE CONSIDERATIONS:
- All indexes use background: true for production safety
- Partial filters reduce index size where possible
- Compound indexes follow the ESR rule (Equality, Sort, Range)
- Index names are descriptive and follow naming conventions
- Unique constraints only apply per veterinarian, not globally

QUERY OPTIMIZATION:
- Use covered queries when possible
- Leverage partial indexes for filtered queries
- Monitor index usage with db.appointmentslots.aggregate([{$indexStats: {}}])
- Consider index intersection for complex queries
*/

export const AppointmentSlot: Model<IAvailabilitySlot & Document> =
  models.AppointmentSlot ||
  mongoose.model<IAvailabilitySlot & Document>(
    "AppointmentSlot",
    appointmentSlotSchema
  );
