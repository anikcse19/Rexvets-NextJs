# RexVet Professional Authentication System

## Overview

This document outlines the comprehensive, secure authentication system implemented for the RexVet platform. The system follows industry best practices and provides enterprise-level security features.

## Security Features

### 🔐 Password Security
- **Strong Password Requirements**: Minimum 8 characters with uppercase, lowercase, number, and special character
- **Bcrypt Hashing**: Passwords are hashed using bcrypt with cost factor 12
- **Secure Storage**: Passwords are never stored in plain text
- **Password Reset**: Secure token-based password reset with 10-minute expiration

### 🛡️ Account Protection
- **Brute Force Protection**: Account locking after 5 failed login attempts for 2 hours
- **Rate Limiting**: API endpoints protected against abuse
- **Email Verification**: Required email verification for new accounts
- **Account Status**: Active/inactive account management

### 🔒 Session Management
- **JWT Tokens**: Secure JSON Web Tokens with 24-hour expiration
- **Session Refresh**: Automatic session refresh every hour
- **Secure Logout**: Proper session cleanup on logout

### 📧 Email Security
- **Verification Tokens**: Cryptographically secure tokens with 24-hour expiration
- **Password Reset**: Secure email-based password reset
- **Email Templates**: Professional HTML email templates

## Database Schema

### User Model (`src/models/User.ts`)

```typescript
interface IUser {
  // Basic Information
  name: string;
  email: string;
  phoneNumber?: string;
  profileImage?: string;
  
  // Authentication
  password?: string; // Hashed, never exposed
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  
  // Security
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  isActive: boolean;
  
  // Role-based Access
  role: 'pet_parent' | 'veterinarian' | 'technician' | 'admin';
  
  // Veterinarian-specific fields
  specialization?: string;
  licenseNumber?: string;
  consultationFee?: number;
  available?: boolean;
  
  // Additional
  fcmTokens: { web?: string; mobile?: string };
  timezone?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

## API Endpoints

### Authentication Endpoints

#### 1. User Registration
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "pet_parent",
  "phoneNumber": "+1234567890"
}
```

**Features:**
- Input validation with Zod
- Rate limiting (3 registrations per hour)
- Email verification token generation
- Password strength validation
- Role-specific field validation

#### 2. Email Verification
```http
POST /api/auth/verify-email
Content-Type: application/json

{
  "token": "verification_token_here"
}
```

**Features:**
- Token validation and expiration check
- Secure token hashing
- Account activation

#### 3. Password Reset Request
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Features:**
- Rate limiting (3 requests per hour)
- Email enumeration protection
- Secure reset token generation

#### 4. Password Reset
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_here",
  "password": "NewSecurePass123!"
}
```

**Features:**
- Token validation and expiration check
- Password strength validation
- Secure password update

### NextAuth Integration

The system integrates with NextAuth.js for session management:

```typescript
// src/lib/auth.ts
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({...}),
    CredentialsProvider({...})
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // 1 hour
  },
  callbacks: {
    async jwt({ token, user, account }) {...},
    async session({ session, token }) {...},
    async signIn({ user, account, profile }) {...}
  }
}
```

## Rate Limiting

The system implements comprehensive rate limiting:

```typescript
// Authentication attempts: 5 per 15 minutes
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
});

// Registration attempts: 3 per hour
export const registerRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  maxRequests: 3,
});

// Password reset requests: 3 per hour
export const passwordResetRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  maxRequests: 3,
});
```

## Email System

### Email Templates

The system includes professional email templates for:

1. **Email Verification**
   - Welcome message
   - Verification link with 24-hour expiration
   - Professional styling

2. **Password Reset**
   - Security-focused messaging
   - Reset link with 10-minute expiration
   - Clear instructions

3. **Welcome Email**
   - Post-verification welcome
   - Platform introduction
   - Next steps guidance

### Email Service Integration

```typescript
// src/lib/email.ts
export async function sendVerificationEmail(
  email: string,
  token: string,
  name: string
): Promise<void>

export async function sendPasswordResetEmail(
  email: string,
  token: string,
  name: string
): Promise<void>

export async function sendWelcomeEmail(
  email: string,
  name: string
): Promise<void>
```

## Frontend Integration

### Sign In Page (`src/app/auth/signin/page.tsx`)
- Professional UI with animations
- Google OAuth integration
- Error handling and user feedback
- Responsive design

### Error Handling (`src/app/auth/error/page.tsx`)
- Comprehensive error pages
- User-friendly error messages
- Actionable next steps

### Email Verification (`src/app/auth/verify-email/page.tsx`)
- Real-time verification status
- Loading states and feedback
- Error handling and recovery

## Security Best Practices

### 1. Input Validation
- All inputs validated with Zod schemas
- SQL injection prevention through Mongoose
- XSS protection through proper encoding

### 2. Token Security
- Cryptographically secure random tokens
- SHA-256 hashing for storage
- Configurable expiration times

### 3. Session Security
- JWT tokens with expiration
- Secure cookie settings
- CSRF protection

### 4. Database Security
- Password field excluded from queries
- Indexed fields for performance
- Proper error handling

### 5. Rate Limiting
- IP-based rate limiting
- Configurable limits per endpoint
- Proper HTTP status codes

## Environment Variables

Required environment variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/rexvet

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email (for production)
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@rexvet.com
```

## Deployment Considerations

### 1. Email Service
- Replace placeholder email service with production service
- Configure proper email templates
- Set up email delivery monitoring

### 2. Rate Limiting
- Replace in-memory rate limiting with Redis
- Configure appropriate limits for production
- Monitor rate limiting metrics

### 3. Database
- Use production MongoDB instance
- Configure proper indexes
- Set up database monitoring

### 4. Security Headers
- Implement security headers middleware
- Configure CORS properly
- Set up HTTPS in production

## Monitoring and Logging

### Security Events
- Failed login attempts
- Account lockouts
- Password reset requests
- Email verification attempts

### Performance Metrics
- Authentication response times
- Database query performance
- Rate limiting statistics

## Future Enhancements

### 1. Multi-Factor Authentication (MFA)
- TOTP-based MFA
- SMS-based verification
- Hardware key support

### 2. Advanced Security
- Device fingerprinting
- Location-based access control
- Behavioral analysis

### 3. Compliance
- GDPR compliance features
- Data retention policies
- Audit logging

### 4. Integration
- SSO integration
- LDAP/Active Directory
- Third-party identity providers

## Testing

### Unit Tests
- User model methods
- Authentication logic
- Email service functions

### Integration Tests
- API endpoint testing
- Database operations
- Email delivery testing

### Security Tests
- Password strength validation
- Token security
- Rate limiting effectiveness

## Support and Maintenance

### Regular Tasks
- Monitor security logs
- Update dependencies
- Review rate limiting metrics
- Backup verification tokens

### Incident Response
- Account compromise procedures
- Data breach protocols
- User notification processes

---

This authentication system provides enterprise-level security while maintaining excellent user experience. It follows industry best practices and is designed to scale with the application's growth.
