# Appointment Chat System

This document describes the new dynamic appointment chat system that replaces the mock data in `PetParentChatbox.tsx`.

## Overview

The appointment chat system allows real-time communication between pet parents and veterinarians during appointments. It includes:

- Real-time message sending and receiving
- Message read status tracking
- Support for different message types (text, image, video, assessment, prescription, file)
- Automatic chat creation for new appointments
- User authorization and access control

## Components

### 1. AppointmentChat Model (`src/models/AppointmentChat.ts`)

Defines the database schema for appointment chats and messages:

- `AppointmentChat`: Contains chat metadata and message array
- `AppointmentMessage`: Individual message structure with sender info, content, and status

### 2. API Endpoints (`src/app/api/appointment-chat/`)

- `GET /api/appointment-chat/messages?appointmentId=<id>`: Fetch messages for an appointment
- `POST /api/appointment-chat/messages`: Send a new message
- `GET /api/appointment-chat/test?appointmentId=<id>`: Test endpoint for debugging

### 3. Updated PetParentChatbox Component

The component now:
- Fetches real messages from the API
- Sends messages through the API
- Polls for new messages every 5 seconds
- Shows loading states and error handling
- Uses real user data from the session

## Features

### Real-time Communication
- Messages are fetched every 5 seconds to simulate real-time updates
- New messages appear immediately after sending
- Read status is automatically updated

### Message Types
- **Text**: Regular chat messages
- **Image**: Image attachments
- **Video**: Video attachments  
- **Assessment**: Medical assessment notes
- **Prescription**: Prescription information
- **File**: Document attachments

### Security & Authorization
- Users can only access chats for their own appointments
- Pet parents can only see chats where they are the pet parent
- Veterinarians can only see chats where they are the veterinarian
- All API endpoints require authentication

### Error Handling
- Network errors are displayed to users
- Loading states prevent multiple requests
- Graceful fallbacks for missing data

## Usage

### For Pet Parents
1. Navigate to an appointment detail page
2. The chat will automatically load messages for that appointment
3. Type and send messages using the input field
4. Messages from the veterinarian will appear automatically

### For Veterinarians
1. Access the appointment from the veterinarian dashboard
2. Use the same chat interface to communicate with pet parents
3. Send assessments and prescriptions using the appropriate message types

## API Response Format

### GET /api/appointment-chat/messages
```json
{
  "messages": [
    {
      "_id": "message_id",
      "senderId": "user_id",
      "senderName": "User Name",
      "senderImage": "profile_image_url",
      "content": "Message content",
      "messageType": "text",
      "isRead": true,
      "isDelivered": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "appointment": {
    "id": "appointment_id",
    "petParentName": "Parent Name",
    "veterinarianName": "Dr. Name",
    "petName": "Pet Name",
    "appointmentDate": "2024-01-15",
    "appointmentTime": "10:30"
  }
}
```

### POST /api/appointment-chat/messages
Request:
```json
{
  "appointmentId": "appointment_id",
  "content": "Message content",
  "messageType": "text",
  "attachments": []
}
```

Response:
```json
{
  "message": {
    "_id": "new_message_id",
    "senderId": "user_id",
    "senderName": "User Name",
    "content": "Message content",
    "messageType": "text",
    "isRead": false,
    "isDelivered": true,
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "success": true
}
```

## Testing

Use the test endpoint to verify the system is working:
```
GET /api/appointment-chat/test?appointmentId=<appointment_id>
```

This will return:
```json
{
  "appointmentExists": true,
  "chatExists": false,
  "appointmentId": "appointment_id",
  "userId": "user_id",
  "userRole": "pet_parent",
  "message": "Appointment chat system is working correctly"
}
```

## Future Enhancements

1. **WebSocket Integration**: Replace polling with real-time WebSocket connections
2. **Push Notifications**: Send notifications for new messages
3. **File Upload**: Implement file upload functionality for attachments
4. **Message Encryption**: Add end-to-end encryption for sensitive medical information
5. **Chat History**: Add pagination for large chat histories
6. **Typing Indicators**: Show when the other party is typing

## Troubleshooting

### Common Issues

1. **Messages not loading**: Check if the appointment exists and user has access
2. **Cannot send messages**: Verify user authentication and appointment access
3. **Real-time updates not working**: Check network connectivity and API responses
4. **Permission errors**: Ensure user role matches appointment participants

### Debug Steps

1. Check browser console for JavaScript errors
2. Verify API responses in Network tab
3. Test with the `/api/appointment-chat/test` endpoint
4. Check database for appointment and chat records
5. Verify user session and authentication status
