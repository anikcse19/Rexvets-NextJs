# Review API Usage Examples

## Creating a Review (POST /api/reviews)

### Request Body:
```json
{
  "rating": 5,
  "comment": "Excellent service! Dr. Smith was very knowledgeable and caring.",
  "appointmentDate": "August 15, 2024",
  "doctorId": "64f8a1b2c3d4e5f678901234",
  "parentId": "64f8a1b2c3d4e5f678901235",
  "visible": true
}
```

### Success Response:
```json
{
  "success": true,
  "message": "Review created successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f678901236",
    "rating": 5,
    "comment": "Excellent service! Dr. Smith was very knowledgeable and caring.",
    "appointmentDate": "August 15, 2024",
    "doctorId": {
      "_id": "64f8a1b2c3d4e5f678901234",
      "name": "Dr. John Smith",
      "specialization": "General Veterinary",
      "profileImage": "https://example.com/doctor.jpg"
    },
    "parentId": {
      "_id": "64f8a1b2c3d4e5f678901235",
      "name": "Jane Doe",
      "profileImage": "https://example.com/parent.jpg"
    },
    "visible": true,
    "createdAt": "2024-08-15T10:30:00.000Z",
    "updatedAt": "2024-08-15T10:30:00.000Z"
  }
}
```

### Validation Error Response:
```json
{
  "success": false,
  "message": "Validation failed",
  "errorCode": "VALIDATION_ERROR",
  "errors": {
    "doctorId": "Invalid doctor ID format",
    "rating": "Rating must be between 1 and 5"
  }
}
```

## Getting Reviews (GET /api/reviews)

### Request:
```
GET /api/reviews?doctorId=64f8a1b2c3d4e5f678901234&page=1&limit=10
```

### Success Response:
```json
{
  "success": true,
  "message": "Reviews fetched successfully",
  "data": {
    "reviews": [
      {
        "_id": "64f8a1b2c3d4e5f678901236",
        "rating": 5,
        "comment": "Excellent service!",
        "doctorId": {
          "_id": "64f8a1b2c3d4e5f678901234",
          "name": "Dr. John Smith",
          "specialization": "General Veterinary"
        },
        "parentId": {
          "_id": "64f8a1b2c3d4e5f678901235",
          "name": "Jane Doe"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

## Getting Doctor Reviews (GET /api/reviews/doctor/[doctorId])

### Request:
```
GET /api/reviews/doctor/64f8a1b2c3d4e5f678901234?stats=true&page=1&limit=10
```

### Success Response:
```json
{
  "success": true,
  "message": "Doctor reviews fetched successfully",
  "data": {
    "doctor": {
      "id": "64f8a1b2c3d4e5f678901234",
      "name": "Dr. John Smith",
      "specialization": "General Veterinary",
      "profileImage": "https://example.com/doctor.jpg"
    },
    "reviews": [...],
    "stats": {
      "totalReviews": 15,
      "averageRating": 4.7,
      "ratingDistribution": {
        "1": 0,
        "2": 1,
        "3": 2,
        "4": 5,
        "5": 7
      }
    },
    "pagination": {...}
  }
}
```

## Getting Parent Reviews (GET /api/reviews/parent/[parentId])

### Request:
```
GET /api/reviews/parent/64f8a1b2c3d4e5f678901235?page=1&limit=10
```

## Getting Review Statistics (GET /api/reviews/stats)

### Overall Stats:
```
GET /api/reviews/stats
```

### Doctor-Specific Stats:
```
GET /api/reviews/stats?doctorId=64f8a1b2c3d4e5f678901234
```

## Updating a Review (PUT /api/reviews/[id])

### Request Body:
```json
{
  "rating": 4,
  "comment": "Updated comment - still very good service!"
}
```

## Deleting a Review (DELETE /api/reviews/[id])

### Success Response:
```json
{
  "success": true,
  "message": "Review deleted successfully",
  "data": null
}
```

## Important Notes:

1. **ObjectId Format**: All IDs must be valid MongoDB ObjectIds (24-character hex strings)
2. **Rating Range**: Must be between 1 and 5 (integers only)
3. **Comment Length**: Must be between 1 and 1000 characters
4. **Appointment Date**: Must be a valid date string
5. **Soft Delete**: Reviews are soft-deleted (marked as deleted but not removed from database)

## Error Codes:

- `VALIDATION_ERROR`: Input validation failed
- `REVIEW_NOT_FOUND`: Review doesn't exist
- `DOCTOR_NOT_FOUND`: Doctor doesn't exist
- `PARENT_NOT_FOUND`: Pet parent doesn't exist
- `DUPLICATE_REVIEW`: Review already exists for this appointment
- `INVALID_ID`: Invalid ObjectId format
- `FETCH_ERROR`: General fetch errors
- `CREATE_ERROR`: Creation errors
- `UPDATE_ERROR`: Update errors
- `DELETE_ERROR`: Deletion errors
