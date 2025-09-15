# Veterinarian API Documentation

This document provides comprehensive documentation for the veterinarian-related API endpoints.

## 🔐 Authentication

All endpoints require authentication via NextAuth session. Include the session cookie in your requests.

## 📋 Available Endpoints

### 1. **GET /api/veterinarian/update**
**Retrieve current veterinarian profile**

**Headers:**
```
Cookie: next-auth.session-token=YOUR_SESSION_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "veterinarian": {
    "_id": "6651d3abc...",
    "name": "Dr. John Doe",
    "email": "john.vet@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "postNominalLetters": "DVM",
    "gender": "male",
    "city": "Los Angeles",
    "state": "California",
    "countryCode": "+1",
    "phone": "+15551234567",
    "specialization": "General Practice",
    "consultationFee": 50,
    "available": true,
    "bio": "Experienced veterinarian...",
    "profileImage": "https://res.cloudinary.com/...",
    "cv": "https://res.cloudinary.com/...",
    "signatureImage": "https://res.cloudinary.com/...",
    "signature": "John Doe",
    "licenses": [
      {
        "licenseNumber": "CA-123456",
        "deaNumber": "DEA-987654",
        "state": "California",
        "licenseFile": "https://res.cloudinary.com/..."
      }
    ],
    "education": [
      {
        "degree": "Doctor of Veterinary Medicine",
        "institution": "UC Davis",
        "year": 2018
      }
    ],
    "experience": [
      {
        "position": "Senior Veterinarian",
        "institution": "Animal Care Clinic",
        "startDate": "2018-06-01T00:00:00.000Z",
        "endDate": null,
        "description": "General practice and emergency care"
      }
    ],
    "certifications": [
      {
        "name": "ACVS Board Certification",
        "issuingOrganization": "American College of Veterinary Surgeons",
        "issueDate": "2020-03-15T00:00:00.000Z",
        "expiryDate": null
      }
    ],
    "languages": ["English", "Spanish"],
    "timezone": "America/Los_Angeles",
    "workingHours": {
      "monday": { "start": "09:00", "end": "17:00", "available": true },
      "tuesday": { "start": "09:00", "end": "17:00", "available": true },
      "wednesday": { "start": "09:00", "end": "17:00", "available": true },
      "thursday": { "start": "09:00", "end": "17:00", "available": true },
      "friday": { "start": "09:00", "end": "17:00", "available": true },
      "saturday": { "start": "09:00", "end": "17:00", "available": false },
      "sunday": { "start": "09:00", "end": "17:00", "available": false }
    },
    "fcmTokens": {
      "web": "web_token_here",
      "mobile": "mobile_token_here"
    },
    "isEmailVerified": true,
    "isActive": true,
    "isApproved": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. **PUT /api/veterinarian/update**
**Update veterinarian profile data**

**Headers:**
```
Content-Type: application/json
Cookie: next-auth.session-token=YOUR_SESSION_TOKEN
```

**Request Body Examples:**

#### Basic Info Update
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "postNominalLetters": "DVM, PhD",
  "gender": "male",
  "city": "San Francisco",
  "state": "California",
  "countryCode": "+1",
  "phone": "+15551234567",
  "bio": "Updated bio information...",
  "specialization": "Emergency Medicine",
  "consultationFee": 75,
  "available": true,
  "timezone": "America/Los_Angeles",
  "languages": ["English", "Spanish", "French"]
}
```

#### Add Education
```json
{
  "addEducation": {
    "degree": "Master of Veterinary Science",
    "institution": "Stanford University",
    "year": 2020
  }
}
```

#### Update Education (by index)
```json
{
  "updateEducation": {
    "index": 0,
    "education": {
      "degree": "Doctor of Veterinary Medicine",
      "institution": "UC Berkeley",
      "year": 2019
    }
  }
}
```

#### Remove Education (by index)
```json
{
  "removeEducation": 1
}
```

#### Add Experience
```json
{
  "addExperience": {
    "position": "Emergency Veterinarian",
    "institution": "Emergency Animal Hospital",
    "startDate": "2022-01-01T00:00:00.000Z",
    "endDate": null,
    "description": "Emergency and critical care"
  }
}
```

#### Add Certification
```json
{
  "addCertification": {
    "name": "Emergency Medicine Certification",
    "issuingOrganization": "American Veterinary Emergency and Critical Care Society",
    "issueDate": "2023-06-01T00:00:00.000Z",
    "expiryDate": "2028-06-01T00:00:00.000Z"
  }
}
```

#### Add License
```json
{
  "addLicense": {
    "licenseNumber": "NV-654321",
    "deaNumber": "DEA-123456",
    "state": "Nevada",
    "licenseFile": "https://res.cloudinary.com/..."
  }
}
```

#### Update Working Hours
```json
{
  "workingHours": {
    "monday": { "start": "08:00", "end": "18:00", "available": true },
    "tuesday": { "start": "08:00", "end": "18:00", "available": true },
    "wednesday": { "start": "08:00", "end": "18:00", "available": true },
    "thursday": { "start": "08:00", "end": "18:00", "available": true },
    "friday": { "start": "08:00", "end": "18:00", "available": true },
    "saturday": { "start": "09:00", "end": "15:00", "available": true },
    "sunday": { "start": "09:00", "end": "15:00", "available": false }
  }
}
```

#### Update FCM Tokens
```json
{
  "fcmTokens": {
    "web": "new_web_token",
    "mobile": "new_mobile_token"
  }
}
```

#### Replace Entire Arrays
```json
{
  "education": [
    {
      "degree": "Doctor of Veterinary Medicine",
      "institution": "UC Davis",
      "year": 2018
    },
    {
      "degree": "Master of Veterinary Science",
      "institution": "Stanford University",
      "year": 2020
    }
  ],
  "experience": [
    {
      "position": "Senior Veterinarian",
      "institution": "Animal Care Clinic",
      "startDate": "2018-06-01T00:00:00.000Z",
      "endDate": null,
      "description": "General practice and emergency care"
    }
  ]
}
```

**Response (200):**
```json
{
  "message": "Veterinarian profile updated successfully",
  "veterinarian": {
    // Updated veterinarian object
  }
}
```

### 3. **POST /api/veterinarian/upload**
**Upload files (profile image, CV, signature, license files)**

**Headers:**
```
Content-Type: multipart/form-data
Cookie: next-auth.session-token=YOUR_SESSION_TOKEN
```

**Form Data:**
- `file`: File to upload
- `fileType`: One of `profileImage`, `cv`, `signatureImage`, `licenseFile`
- `licenseIndex`: Number (required only for `licenseFile`)

**File Type Specifications:**
- **profileImage**: JPG, PNG, GIF, WEBP (max 5MB)
- **cv**: PDF, DOC, DOCX (max 10MB)
- **signatureImage**: JPG, PNG, GIF, WEBP (max 2MB)
- **licenseFile**: PDF, JPG, PNG (max 5MB)

**Example (cURL):**
```bash
curl -X POST http://localhost:3001/api/veterinarian/upload \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -F "file=@/path/to/profile.jpg" \
  -F "fileType=profileImage"
```

**Response (200):**
```json
{
  "message": "File uploaded successfully",
  "fileUrl": "https://res.cloudinary.com/...",
  "veterinarian": {
    // Updated veterinarian object with new file URL
  }
}
```

### 4. **DELETE /api/veterinarian/upload**
**Remove files from profile**

**Headers:**
```
Cookie: next-auth.session-token=YOUR_SESSION_TOKEN
```

**Query Parameters:**
- `fileType`: One of `profileImage`, `cv`, `signatureImage`, `licenseFile`
- `licenseIndex`: Number (required only for `licenseFile`)

**Example:**
```
DELETE /api/veterinarian/upload?fileType=profileImage
DELETE /api/veterinarian/upload?fileType=licenseFile&licenseIndex=0
```

**Response (200):**
```json
{
  "message": "File removed successfully",
  "veterinarian": {
    // Updated veterinarian object with file field set to null
  }
}
```

## 🚨 Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized. Please sign in to access this resource."
}
```

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "invalid_string",
      "message": "Invalid email address",
      "path": ["email"]
    }
  ]
}
```

### 404 Not Found
```json
{
  "error": "Veterinarian profile not found"
}
```

### 409 Conflict
```json
{
  "error": "A veterinarian with this license number already exists.",
  "field": "licenseNumber"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to update profile. Please try again."
}
```

## 📝 Validation Rules

### Basic Info
- `firstName`, `lastName`: 2-50 characters, letters and spaces only
- `gender`: "male", "female", or "other"
- `email`: Valid email format
- `city`, `state`: 2-100 characters
- `countryCode`: 2-3 characters
- `phone`: 10-15 digits, international format
- `bio`: Max 1000 characters
- `specialization`: Min 2 characters
- `consultationFee`: Non-negative number
- `languages`: Array of strings

### Education
- `degree`: Min 2 characters
- `institution`: Min 2 characters
- `year`: Between 1900 and current year

### Experience
- `position`: Min 2 characters
- `institution`: Min 2 characters
- `startDate`: Valid ISO datetime string
- `endDate`: Valid ISO datetime string (optional)
- `description`: Optional string

### Certifications
- `name`: Min 2 characters
- `issuingOrganization`: Min 2 characters
- `issueDate`: Valid ISO datetime string
- `expiryDate`: Valid ISO datetime string (optional)

### Licenses
- `licenseNumber`: Min 1 character
- `deaNumber`: Optional string
- `state`: Min 1 character
- `licenseFile`: Valid URL (optional)

### Working Hours
- `start`, `end`: HH:MM format (24-hour)
- `available`: Boolean
- End time must be after start time

## 🔄 Array Operations

The update API supports flexible array operations:

1. **Replace entire array**: Send the complete array
2. **Add item**: Use `addEducation`, `addExperience`, etc.
3. **Update item**: Use `updateEducation`, `updateExperience`, etc. with index
4. **Remove item**: Use `removeEducation`, `removeExperience`, etc. with index

## 🗂️ File Management

- Files are uploaded to Cloudinary with organized folder structure
- Filenames are prefixed with veterinarian name and timestamp
- Images are automatically resized and optimized
- License files can be associated with specific license entries

## 🔒 Security Features

- Session-based authentication
- Input validation with Zod schemas
- File type and size validation
- SQL injection protection via Mongoose
- Rate limiting (inherited from NextAuth)
- Sensitive field exclusion in responses

## 🧪 Testing Examples

### Postman Collection
```json
{
  "info": {
    "name": "Veterinarian API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get Profile",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Cookie",
            "value": "next-auth.session-token=YOUR_TOKEN"
          }
        ],
        "url": {
          "raw": "http://localhost:3001/api/veterinarian/update",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3001",
          "path": ["api", "veterinarian", "update"]
        }
      }
    },
    {
      "name": "Update Basic Info",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          },
          {
            "key": "Cookie",
            "value": "next-auth.session-token=YOUR_TOKEN"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"firstName\": \"John\",\n  \"lastName\": \"Smith\",\n  \"bio\": \"Updated bio\"\n}"
        },
        "url": {
          "raw": "http://localhost:3001/api/veterinarian/update",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3001",
          "path": ["api", "veterinarian", "update"]
        }
      }
    }
  ]
}
```

## 📞 Support

For API support or questions, please refer to the development team or create an issue in the project repository.
