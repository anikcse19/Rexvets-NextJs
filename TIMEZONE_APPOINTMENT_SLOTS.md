# Timezone-Aware Appointment Slots Implementation

This document describes the implementation of timezone-aware appointment slots that store date and time without timezone conversion, ensuring that appointment times remain consistent regardless of timezone rule changes.

## Overview

The system stores appointment slots with the following approach:
- **Date**: Stored as local date without timezone conversion
- **Time**: Stored as HH:mm format in the appointment's timezone
- **Timezone**: Stored as timezone identifier (e.g., "America/New_York")

This ensures that if a user schedules an appointment for "8:00 AM on December 1st" in their timezone, it will always be 8:00 AM on December 1st in that timezone, regardless of daylight saving time changes.

## Database Schema

### AppointmentSlot Model

```typescript
interface IAvailabilitySlot {
  vetId: Types.ObjectId;
  date: Date; // Store as local date without timezone
  startTime: string; // Store as HH:mm in appointment timezone
  endTime: string; // Store as HH:mm in appointment timezone
  timezone: string; // Store timezone identifier (e.g., "America/New_York")
  status: SlotStatus;
  notes?: string;
  createdAt: Date;
}
```

## API Endpoints

### 1. Generate Appointment Slots

**POST** `/api/appointments/generate-appointment-slot/[vetId]`

Creates appointment slots for a veterinarian in a specific timezone.

**Request Body:**
```json
{
  "dateRange": {
    "start": "2024-01-01",
    "end": "2024-01-07"
  },
  "slotPeriods": [
    {
      "start": "09:00",
      "end": "17:00"
    }
  ],
  "timezone": "America/New_York",
  "slotDuration": 30,
  "bufferBetweenSlots": 5
}
```

**Response:**
```json
{
  "success": true,
  "message": "Generated 16 appointment slots between 2024-01-01 and 2024-01-07 in timezone America/New_York",
  "data": {
    "slotsCount": 16,
    "dateRange": {
      "start": "2024-01-01",
      "end": "2024-01-07"
    },
    "timezone": "America/New_York",
    "slotDuration": 30,
    "bufferBetweenSlots": 5
  }
}
```

### 2. Get Appointment Slots

**GET** `/api/appointments/get-appointment-slots/[vetId]`

Retrieves appointment slots with optional timezone conversion for display.

**Query Parameters:**
- `startDate`: Start date (YYYY-MM-DD)
- `endDate`: End date (YYYY-MM-DD)
- `timezone`: Optional timezone for display conversion
- `status`: Slot status filter (available, booked, etc.)
- `page`: Page number for pagination
- `limit`: Number of items per page

**Example:**
```
GET /api/appointments/get-appointment-slots/123?startDate=2024-01-01&endDate=2024-01-07&timezone=America/Los_Angeles
```

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "_id": "...",
        "date": "2024-01-01T00:00:00.000Z",
        "startTime": "09:00",
        "endTime": "09:30",
        "timezone": "America/New_York",
        "formattedDate": "2024-01-01",
        "formattedStartTime": "06:00", // Converted to display timezone
        "formattedEndTime": "06:30",   // Converted to display timezone
        "displayTimezone": "America/Los_Angeles"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 100,
      "totalPages": 1,
      "totalItems": 16
    }
  }
}
```

## Frontend Integration

### AvailabilityManager Component

The `AvailabilityManager` component now includes timezone support:

```typescript
import { getUserTimezone } from "@/lib/timezone";

export default function AvailabilityManager() {
  const [userTimezone, setUserTimezone] = useState<string>("");

  // Get user's timezone on component mount
  useEffect(() => {
    const timezone = getUserTimezone();
    setUserTimezone(timezone);
  }, []);

  const handleSaveSlots = async (slotPeriods: SlotPeriod[]) => {
    const requestData = {
      dateRange: {
        start: format(selectedRange.start, "yyyy-MM-dd"),
        end: format(selectedRange.end, "yyyy-MM-dd"),
      },
      slotPeriods: slotPeriods.map((slot) => ({
        start: slot.start.toTimeString().slice(0, 5),
        end: slot.end.toTimeString().slice(0, 5),
      })),
      timezone: userTimezone, // Include user's timezone
    };

    // API call with timezone
    const response = await fetch(
      `/api/appointments/generate-appointment-slot/${user?.refId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      }
    );
  };
}
```

## Timezone Utilities

The system includes comprehensive timezone utilities:

### Core Functions

```typescript
// Get user's timezone
const userTimezone = getUserTimezone(); // Returns "America/New_York"

// Validate timezone
const isValid = isValidTimezone("America/New_York"); // Returns true

// Check if time is in the past for a specific date and timezone
const isPast = isTimeInPast("14:00", new Date("2024-01-01"), "America/New_York");

// Convert time between timezones
const convertedTime = convertTimeBetweenTimezones(
  "14:00",
  new Date("2024-01-01"),
  "America/New_York",
  "America/Los_Angeles"
); // Returns "11:00"

// Format slot time for user's timezone
const displayTime = formatSlotTimeForUser(
  "14:00",
  new Date("2024-01-01"),
  "America/New_York",
  "America/Los_Angeles"
); // Returns "11:00 AM"
```

## Key Benefits

1. **Consistent Appointment Times**: Appointments remain at the same local time regardless of DST changes
2. **User Intent Preservation**: If a user schedules "8:00 AM", it will always be 8:00 AM in their timezone
3. **Timezone Flexibility**: Support for different timezones for veterinarians and pet parents
4. **Display Conversion**: Times can be converted for display in different timezones
5. **Future-Proof**: Not affected by timezone rule changes

## Example Use Cases

### 1. Veterinarian in New York, Pet Parent in Los Angeles

- Vet creates slots for 9:00 AM - 5:00 PM EST
- Pet parent sees slots as 6:00 AM - 2:00 PM PST
- Appointment is stored as 9:00 AM EST on the specified date
- If DST changes occur, the appointment remains at 9:00 AM EST

### 2. Recurring Appointments

- Daily appointment at 10:00 AM in Los Angeles
- During PST: 10:00 AM = 6:00 PM UTC
- During PDT: 10:00 AM = 5:00 PM UTC
- The appointment always shows as 10:00 AM in Los Angeles

## Migration Notes

If migrating from an existing system:

1. **Database Migration**: Add `timezone` field to existing appointment slots
2. **Default Timezone**: Set existing slots to a default timezone (e.g., UTC)
3. **Frontend Updates**: Update UI to include timezone selection
4. **API Updates**: Ensure all endpoints handle timezone parameters

## Testing

Test the system with:
- Different timezones
- DST transitions
- Date boundaries
- Invalid timezone handling
- Timezone conversion accuracy

## Security Considerations

- Validate timezone strings to prevent injection attacks
- Use HTTPS for all API calls
- Implement proper authentication and authorization
- Log timezone-related operations for debugging

