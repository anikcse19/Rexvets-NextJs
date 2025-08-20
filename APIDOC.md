# API Documentation - New Endpoints

This document covers the newly implemented API endpoints that are currently untracked in Git.

## Table of Contents

- [Prescription Management API](#prescription-management-api)
- [Pet Parent - My Pets API](#pet-parent---my-pets-api)
- [Utility Functions](#utility-functions)
- [Data Models](#data-models)

---

## Prescription Management API

### Base URL: `/api/prescriptions`

Complete CRUD operations for managing prescriptions in the veterinary system.

#### **POST** `/api/prescriptions`
Create a new prescription.

**Request Body:**
```json
{
  "medication": [
    {
      "medicationDetails": {
        "medicationName": "Amoxicillin",
        "form": "Tablet",
        "medicationQuantity": 30,
        "quantityUnit": "count",
        "strength": 500,
        "strengthUnit": "mg"
      },
      "usageInstruction": {
        "refills": 2,
        "refillGap": 30,
        "direction": "Take 1 tablet twice daily with food"
      }
    }
  ],
  "pharmacyPermission": {
    "canUseGenericSubstitution": true,
    "canFilledByPharmacy": true,
    "noteToPharmacist": "Patient has penicillin allergy history"
  },
  "pet": "60f7b1b3c9a6b12345678901",
  "parent": "60f7b1b3c9a6b12345678902", 
  "doctor": "60f7b1b3c9a6b12345678903"
}
```

**Response (201):**
```json
{
  "statusCode": 201,
  "success": true,
  "message": "Prescription created successfully",
  "data": {
    "_id": "60f7b1b3c9a6b12345678904",
    "medication": [...],
    "pharmacyPermission": {...},
    "pet": "60f7b1b3c9a6b12345678901",
    "parent": "60f7b1b3c9a6b12345678902",
    "doctor": "60f7b1b3c9a6b12345678903",
    "isDeleted": false,
    "createdAt": "2025-08-20T11:22:13.000Z",
    "updatedAt": "2025-08-20T11:22:13.000Z"
  }
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Error message details",
  "errorCode": "CREATE_FAILED",
  "errors": null
}
```

---

#### **GET** `/api/prescriptions`
Retrieve all prescriptions with pagination support.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Example Request:**
```
GET /api/prescriptions?page=1&limit=10
```

**Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Prescriptions fetched successfully",
  "data": [
    {
      "_id": "60f7b1b3c9a6b12345678904",
      "medication": [...],
      "pharmacyPermission": {...},
      "pet": {
        "_id": "60f7b1b3c9a6b12345678901",
        "name": "Buddy",
        "species": "Dog"
      },
      "parent": {
        "_id": "60f7b1b3c9a6b12345678902", 
        "name": "John Doe",
        "email": "john@example.com"
      },
      "doctor": {
        "_id": "60f7b1b3c9a6b12345678903",
        "name": "Dr. Sarah Wilson",
        "email": "sarah@vetclinic.com"
      },
      "createdAt": "2025-08-20T11:22:13.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

#### **GET** `/api/prescriptions/[id]`
Retrieve a specific prescription by ID.

**Path Parameters:**
- `id`: Prescription ObjectId

**Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Prescription fetched successfully",
  "data": {
    "_id": "60f7b1b3c9a6b12345678904",
    "medication": [
      {
        "medicationDetails": {
          "medicationName": "Amoxicillin",
          "form": "Tablet",
          "medicationQuantity": 30,
          "quantityUnit": "count",
          "strength": 500,
          "strengthUnit": "mg"
        },
        "usageInstruction": {
          "refills": 2,
          "refillGap": 30,
          "direction": "Take 1 tablet twice daily with food"
        }
      }
    ],
    "pharmacyPermission": {
      "canUseGenericSubstitution": true,
      "canFilledByPharmacy": true,
      "noteToPharmacist": "Patient has penicillin allergy history"
    },
    "pet": { ... },
    "parent": { ... },
    "doctor": { ... }
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Prescription not found",
  "errorCode": "NOT_FOUND",
  "errors": null
}
```

---

#### **PUT** `/api/prescriptions/[id]`
Update an existing prescription.

**Path Parameters:**
- `id`: Prescription ObjectId

**Request Body:** (Partial prescription object)
```json
{
  "pharmacyPermission": {
    "canUseGenericSubstitution": false,
    "noteToPharmacist": "Updated note for pharmacist"
  }
}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Prescription updated successfully",
  "data": {
    "_id": "60f7b1b3c9a6b12345678904",
    "medication": [...],
    "pharmacyPermission": {
      "canUseGenericSubstitution": false,
      "canFilledByPharmacy": true,
      "noteToPharmacist": "Updated note for pharmacist"
    },
    "updatedAt": "2025-08-20T11:25:00.000Z"
  }
}
```

---

#### **DELETE** `/api/prescriptions/[id]`
Delete a prescription.

**Path Parameters:**
- `id`: Prescription ObjectId

**Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Prescription deleted successfully",
  "data": null
}
```

---

## Pet Parent - My Pets API

### Base URL: `/api/pet-parent/my-pets`

Retrieve pets belonging to a specific pet parent.

#### **GET** `/api/pet-parent/my-pets/[parentId]`
Fetch all pets for a specific parent.

**Path Parameters:**
- `parentId`: Pet parent ObjectId

**Example Request:**
```
GET /api/pet-parent/my-pets/60f7b1b3c9a6b12345678902
```

**Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Pets fetched successfully",
  "data": [
    {
      "_id": "60f7b1b3c9a6b12345678901",
      "name": "Buddy",
      "image": "https://cloudinary.com/image1.jpg",
      "species": "Dog",
      "breed": "Golden Retriever",
      "gender": "Male",
      "primaryColor": "Golden",
      "spayedNeutered": "Yes",
      "weight": 65,
      "weightUnit": "lbs",
      "dateOfBirth": "2020-05-15",
      "parentId": "60f7b1b3c9a6b12345678902",
      "allergies": ["Peanuts", "Chicken"],
      "medicalConditions": ["Hip Dysplasia"],
      "currentMedications": ["Glucosamine"],
      "healthStatus": "Good",
      "emergencyContact": "+1234567890",
      "veterinarianNotes": "Friendly, good with children",
      "lastVisit": "2025-08-01",
      "nextVaccination": "2025-12-15",
      "isDeleted": false,
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-08-15T14:20:00.000Z"
    }
  ]
}
```

**Error Responses:**

**400 - Invalid Parent ID:**
```json
{
  "success": false,
  "message": "Invalid parent ID",
  "errorCode": "INVALID_PARENT_ID",
  "errors": null
}
```

**404 - No Pets Found:**
```json
{
  "success": false,
  "message": "No pets found for this parent",
  "errorCode": "NOT_FOUND",
  "errors": null
}
```

**500 - Server Error:**
```json
{
  "success": false,
  "message": "Failed to fetch pets",
  "errorCode": "FETCH_FAILED",
  "errors": null
}
```

---

## Utility Functions

### Response Handler Utilities

Located in `/src/lib/utils/send.response.ts`

#### **sendResponse<T>()**
Standardized function for sending successful API responses.

**Function Signature:**
```typescript
sendResponse<T>({
  statusCode: number,
  message: string,
  success: boolean,
  data?: T | null,
  meta?: {
    page?: number,
    limit?: number,
    totalPages?: number
  }
})
```

**Usage Example:**
```typescript
return sendResponse({
  statusCode: 200,
  success: true,
  message: "Data fetched successfully",
  data: results,
  meta: { page: 1, limit: 10, totalPages: 5 }
});
```

#### **throwAppError()**
Standardized function for sending error responses.

**Function Signature:**
```typescript
throwAppError(
  error: IErrorResponse,
  statusCode: number = 400
)
```

**IErrorResponse Interface:**
```typescript
interface IErrorResponse {
  success: boolean;
  message: string;
  errorCode: string;
  errors: Record<string, any> | null;
}
```

**Usage Example:**
```typescript
return throwAppError(
  {
    success: false,
    message: "Resource not found",
    errorCode: "NOT_FOUND",
    errors: null
  },
  404
);
```

---

## Data Models

### Prescription Model

Located in `/src/models/Prescription.ts`

#### **IPrescription Interface:**
```typescript
interface IPrescription extends Document {
  medication: {
    medicationDetails: {
      medicationName: string;
      form: string;
      medicationQuantity: number;
      quantityUnit: "count" | "gram" | "liter" | "milliliter" | "microgram" | "pound" | "gallon" | "ounce";
      strength: number;
      strengthUnit: string;
    };
    usageInstruction: {
      refills: number;
      refillGap: number;
      direction: string;
    };
  }[];
  pharmacyPermission: {
    canUseGenericSubstitution: boolean;
    canFilledByPharmacy: boolean;
    noteToPharmacist: string;
  };
  pet: Types.ObjectId;      // Reference to Pet
  parent: Types.ObjectId;   // Reference to PetParent
  doctor: Types.ObjectId;   // Reference to Veterinarian
  isDeleted: boolean;
}
```

#### **Validation Rules:**
- `medicationName`: Required string
- `form`: Required string  
- `medicationQuantity`: Required positive number
- `quantityUnit`: Must be one of the enum values
- `strength`: Required positive number
- `strengthUnit`: Required string
- `refills`: Required number
- `refillGap`: Required number (days between refills)
- `direction`: Required string (usage instructions)
- `pet`, `parent`, `doctor`: Required ObjectId references
- `canUseGenericSubstitution`: Boolean (default: false)
- `canFilledByPharmacy`: Boolean (default: false)
- `noteToPharmacist`: String (default: empty)
- `isDeleted`: Boolean (default: false)

#### **Relationships:**
- **Pet**: References `Pet` model
- **Parent**: References `PetParent` model  
- **Doctor**: References `Veterinarian` model

---

## Error Codes Reference

### Common Error Codes:
- `VALIDATION_ERROR`: Request validation failed
- `INVALID_PARENT_ID`: Invalid or malformed parent ObjectId
- `INVALID_PET_ID`: Invalid or malformed pet ObjectId
- `NOT_FOUND`: Resource not found
- `CREATE_FAILED`: Failed to create resource
- `UPDATE_FAILED`: Failed to update resource
- `DELETE_FAILED`: Failed to delete resource
- `FETCH_FAILED`: Failed to retrieve resource
- `INTERNAL_ERROR`: Internal server error

### HTTP Status Codes:
- `200`: Success
- `201`: Created successfully
- `400`: Bad request / Validation error
- `404`: Resource not found
- `500`: Internal server error

---

## Notes

1. **Soft Delete**: All endpoints implement soft delete patterns using the `isDeleted` flag
2. **Pagination**: GET endpoints support pagination with `page` and `limit` parameters
3. **Population**: Prescription endpoints automatically populate related entities (pet, parent, doctor)
4. **Validation**: All endpoints use comprehensive input validation
5. **Error Handling**: Standardized error responses across all endpoints
6. **ObjectId Validation**: All ID parameters are validated before database operations

---

## Authentication & Authorization

These endpoints require proper authentication and authorization:
- Prescription endpoints: Require authenticated veterinarian or authorized staff
- Pet Parent endpoints: Require authenticated pet parent or authorized access
- Proper session management through NextAuth integration
