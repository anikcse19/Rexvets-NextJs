# Appointment Confirmation Email Setup

This document explains how the appointment confirmation email functionality works in the RexVets Next.js application.

## Overview

When a pet parent successfully books an appointment, confirmation emails are automatically sent to both the veterinarian and the pet parent with appointment details and meeting links.

## Components

### 1. Email Service (`src/lib/email.ts`)

The email service includes:
- `sendAppointmentConfirmationEmails()` function
- HTML email templates for both doctor and parent
- Professional styling with RexVet branding

### 2. API Endpoint (`src/app/api/appointment-confirmation/send-email/route.ts`)

Handles the email sending request:
- Validates authentication
- Validates required fields
- Calls the email service
- Returns success/error responses

### 3. Integration (`src/components/AppointmentConfirmation/AppointmentConfirmationPage.tsx`)

The appointment confirmation page:
- Generates unique meeting links for video calls
- Fetches pet data to get pet names
- Sends confirmation emails after successful appointment creation
- Handles email errors gracefully (doesn't fail appointment creation)

### 4. Meeting Link Generation

Meeting links are generated in the frontend component using:
- Pet parent ID (first 4 characters)
- Veterinarian ID (first 4 characters)
- Current timestamp (base36 encoded)
- Format: `https://rexvets-nextjs.vercel.app/video-call/?{roomId}`

## Email Templates

### Doctor Email Template
- Professional greeting
- Appointment details (date, time, pet name, parent name)
- Meeting link button
- Contact information

### Parent Email Template
- Friendly greeting
- Appointment details (date, time, pet name, doctor name)
- Meeting link button
- Support contact information

## Configuration

### Environment Variables Required
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Development Mode
If email credentials are not configured, the system will:
- Log the email data to console
- Not fail the appointment creation
- Continue with normal flow

## Testing

### Test Endpoint
Use `/api/test-appointment-email` to test email functionality:

```bash
curl -X POST http://localhost:3000/api/test-appointment-email \
  -H "Content-Type: application/json" \
  -d '{
    "doctorEmail": "doctor@example.com",
    "doctorName": "Dr. John Smith",
    "parentEmail": "parent@example.com",
    "parentName": "Jane Doe",
    "petName": "Buddy",
    "appointmentDate": "2024-01-15",
    "appointmentTime": "10:00 AM",
    "meetingLink": "https://rexvets.org/VideoCall/123/preview"
  }'
```

## Flow

1. Pet parent completes appointment booking form
2. Meeting link is generated in frontend component
3. Appointment is created in database with meeting link
4. Donation status is updated
5. Pet data is fetched to get pet name
6. Email data is prepared with all required information including meeting link
7. Confirmation emails are sent to both doctor and parent
8. User is redirected to appointments dashboard

## Error Handling

- Email sending errors don't prevent appointment creation
- All errors are logged to console
- Graceful fallbacks for missing data
- Development mode logging when email not configured

## Security

- API endpoint requires authentication
- Input validation for all required fields
- No sensitive data exposed in logs
- Secure email transport (SMTP with TLS)

## Future Enhancements

- Email templates customization
- Multiple language support
- Email scheduling for reminders
- PDF attachments with appointment details
- Email tracking and analytics
