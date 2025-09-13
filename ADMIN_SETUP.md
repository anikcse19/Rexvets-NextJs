# RexVet Admin Panel Setup

This document explains how to set up and use the admin panel for the RexVet platform.

## Overview

The admin panel provides comprehensive management capabilities for the RexVet platform, including:
- User management (Pet Parents, Veterinarians)
- Appointment management and monitoring
- Financial tracking (Donations, Revenue)
- System monitoring and updates
- Support ticket management

## Authentication

The admin panel uses the existing NextAuth.js authentication system with role-based access control.

### Admin Account Creation

**Note**: Admin accounts can only be created in development environment for security reasons.

#### Method 1: Using the Script (Recommended)

1. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

2. In a new terminal, run the admin creation script:
   ```bash
   npm run create-admin
   # or
   pnpm create-admin
   ```

3. Follow the prompts to enter:
   - Admin email
   - Admin name
   - Admin password (must meet security requirements)

#### Method 2: Using the API Directly

1. Start the development server
2. Make a POST request to `/api/admin/create-admin`:

```bash
curl -X POST http://localhost:3000/api/admin/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@rexvet.com",
    "name": "Admin User",
    "password": "AdminPass123!"
  }'
```

### Password Requirements

Admin passwords must meet the following security requirements:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%*?&)

## Accessing the Admin Panel

1. Navigate to: `http://localhost:3000/admin/auth/signin`
2. Enter your admin credentials
3. You'll be redirected to the admin dashboard at `/admin/overview`

## Admin Panel Features

### Dashboard Overview
- Real-time statistics and metrics
- Interactive charts and graphs
- Top performing veterinarians
- Financial summaries

### User Management
- **Veterinarians**: View, approve, suspend veterinarians
- **Pet Parents**: Manage pet parent accounts
- **Access Control**: Role-based permissions

### Appointment Management
- View all appointments
- Filter by status, doctor, date
- Reschedule appointments
- Monitor video calls
- Export appointment data

### Financial Management
- Track donations and revenue
- Generate financial reports
- Monitor payment status

### System Administration
- System updates and maintenance
- Support ticket management
- Video call monitoring
- Settings and configuration

## Security Features

### Authentication Security
- Strong password requirements
- Account lockout after failed attempts
- Email verification
- Secure session management

### Access Control
- Role-based permissions
- Admin-only access to sensitive features
- Session timeout and refresh

### Data Protection
- Encrypted password storage
- Secure API endpoints
- Input validation and sanitization

## Password Reset

If you forget your admin password:

1. Go to the admin sign-in page
2. Click "Forgot password?"
3. Enter your admin email
4. Check your email for reset instructions
5. Click the reset link and set a new password

## Troubleshooting

### Common Issues

**"Access denied. Admin privileges required."**
- Ensure you're using an account with `role: "admin"`
- Check that the account is active and verified

**"Account is temporarily locked"**
- Wait 2 hours or contact system administrator
- This happens after 5 failed login attempts

**"Account is deactivated"**
- Contact system administrator to reactivate account

**"Email not verified"**
- Admin accounts are auto-verified during creation
- If this error occurs, check account status

### Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Verify the development server is running
3. Ensure database connection is working
4. Check that all environment variables are set

## Development Notes

### Environment Variables Required
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
MONGODB_URI=your-mongodb-connection-string
```

### Database Requirements
- MongoDB database with User collection
- Admin user must have `role: "admin"`
- Account must be active and verified

### API Endpoints Used
- `/api/auth/[...nextauth]` - Authentication
- `/api/auth/forgot-password` - Password reset request
- `/api/auth/reset-password` - Password reset confirmation
- `/api/admin/create-admin` - Admin account creation (dev only)

## Production Deployment

**Important**: Admin account creation is disabled in production for security reasons.

For production deployment:
1. Create admin accounts directly in the database
2. Ensure proper environment variables are set
3. Configure email service for password resets
4. Set up proper monitoring and logging
5. Implement additional security measures as needed

---

For technical support or questions about the admin panel, please contact the development team.
