# Veterinarian API with Next Available Slots

## Overview

The `/api/veterinarian` endpoint has been updated to include the next two available appointment slots for each veterinarian. This provides immediate visibility into when veterinarians are available for appointments.

## API Endpoint

```
GET /api/veterinarian
```

## Response Structure

Each veterinarian object now includes a `nextAvailableSlots` array containing up to 2 available appointment slots:

```json
{
  "success": true,
  "message": "Veterinarians retrieved successfully",
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "Dr. Sarah Johnson",
      "specialization": "Small Animal Medicine",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "nextAvailableSlots": [
        {
          "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
          "date": "2025-01-15T00:00:00.000Z",
          "startTime": "09:00",
          "endTime": "10:00",
          "timezone": "America/New_York",
          "status": "available",
          "notes": "Morning consultation slot"
        },
        {
          "_id": "64f1a2b3c4d5e6f7g8h9i0j3",
          "date": "2025-01-15T00:00:00.000Z",
          "startTime": "14:00",
          "endTime": "15:00",
          "timezone": "America/New_York",
          "status": "available",
          "notes": "Afternoon consultation slot"
        }
      ]
    }
  ]
}
```

## Slot Information

Each appointment slot includes:

- **`_id`**: Unique identifier for the slot
- **`date`**: Date of the appointment (ISO format)
- **`startTime`**: Start time in HH:mm format (in appointment timezone)
- **`endTime`**: End time in HH:mm format (in appointment timezone)
- **`timezone`**: Timezone identifier (e.g., "America/New_York")
- **`status`**: Always "available" for these slots
- **`notes`**: Optional notes about the slot

## Features

### 1. **Future Dates Only**
- Only returns slots with dates >= current date
- Ensures no past appointments are shown

### 2. **Chronological Ordering**
- Slots are sorted by date (earliest first)
- Within same date, sorted by start time

### 3. **Limited Results**
- Maximum of 2 slots per veterinarian
- Optimizes response size and performance

### 4. **Timezone Awareness**
- Each slot includes its timezone
- Allows frontend to display times correctly

## Query Parameters

All existing query parameters continue to work:

- `page`: Page number (default: 1)
- `limit`: Results per page (default: 20, max: 100)
- `q` or `name`: Text search on veterinarian name
- `specialization`: Exact match on specialization
- `available`: Filter by availability status
- `approved`: Filter by approval status
- `city`, `state`, `country`: Location-based filtering
- And many more...

## Database Optimization

The API uses MongoDB aggregation pipeline with optimized indexes:

- **Primary Index**: `{ vetId: 1, date: 1, status: 1 }`
- **Time-based Index**: `{ date: 1, startTime: 1, endTime: 1 }`
- **Vet-specific Index**: `{ vetId: 1, status: 1, date: 1 }`

## Use Cases

### 1. **Veterinarian Directory**
- Show available slots directly in search results
- Reduce clicks to book appointments

### 2. **Quick Booking**
- Display next available times immediately
- Improve user experience and conversion

### 3. **Availability Comparison**
- Compare multiple veterinarians' availability
- Help users make informed decisions

### 4. **Dashboard Views**
- Veterinarians can see their upcoming availability
- Staff can quickly check open slots

## Example Frontend Usage

```typescript
// Fetch veterinarians with next available slots
const response = await fetch('/api/veterinarian?limit=10');
const data = await response.json();

// Display each veterinarian with their slots
data.data.forEach((vet: any) => {
  console.log(`Dr. ${vet.name} - Next available:`);
  vet.nextAvailableSlots.forEach((slot: any) => {
    const date = new Date(slot.date).toLocaleDateString();
    console.log(`  ${date} at ${slot.startTime} (${slot.timezone})`);
  });
});
```

## Performance Notes

- **Indexed Queries**: All slot lookups use optimized database indexes
- **Limited Results**: Maximum 2 slots per vet prevents large responses
- **Future Date Filter**: Reduces unnecessary data processing
- **Aggregation Pipeline**: Single database query for efficiency

## Error Handling

The API maintains the same error handling structure:

```json
{
  "success": false,
  "message": "Failed to fetch veterinarians",
  "errorCode": "FETCH_ERROR",
  "errors": null
}
```

## Migration Notes

- **Backward Compatible**: Existing API consumers continue to work
- **New Field**: `nextAvailableSlots` is added to each veterinarian object
- **Optional Field**: If no slots exist, array will be empty
- **No Breaking Changes**: All existing functionality preserved
