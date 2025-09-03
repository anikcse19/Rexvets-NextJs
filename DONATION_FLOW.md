# RexVets Donation Flow

This document describes the donation flow implementation in the RexVets application, including the frontend components, API endpoints, and email functionality.

## Overview

The donation flow allows users to make one-time or recurring donations to RexVets. When a donation is made, the system:

1. Creates a payment intent through Stripe
2. Processes the payment on the frontend using Stripe Elements
3. Confirms the payment and sends a thank you email with a PDF receipt
4. Updates the donation record in the database

## Components

### Frontend Components

- `DonationBox.tsx`: Main donation form component with Stripe integration
- `DonationCardInfo.tsx`: Container component for the donation form
- `DonationForm.tsx`: Alternative donation form (not currently used in the donation-now page)

### API Endpoints

- `/api/donations/create-payment-intent`: Creates a Stripe payment intent for processing payments
- `/api/donations/confirm-payment`: Confirms successful payments and sends thank you emails with PDF receipts
- `/api/test/donation-email`: Test endpoint for the email functionality

### PDF Generation

- `/src/lib/pdf/DonationReceipt.tsx`: React PDF component for generating donation receipts
- `/src/lib/pdf/generatePdf.ts`: Utility function for rendering PDF to buffer

### Email Functionality

- `/src/lib/email.ts`: Contains email templates and sending functions

## Donation Flow

1. **User makes a donation**:
   - User fills out the donation form with amount, payment details, and donor information
   - Frontend creates a payment intent through the API
   - Frontend confirms the payment with Stripe

2. **Payment confirmation**:
   - After successful payment, frontend calls `/api/donations/confirm-payment`
   - The API endpoint retrieves payment details from Stripe
   - The API endpoint updates the donation status in the database

3. **Thank you email**:
   - The confirmation endpoint generates a PDF receipt
   - The system sends an email with the PDF attachment to the donor

## Testing

To test the donation email flow without making a payment:

1. Make a GET request to `/api/test/donation-email` with the following optional query parameters:
   - `email`: Donor email address
   - `name`: Donor name
   - `amount`: Donation amount
   - `recurring`: Whether the donation is recurring (`true` or `false`)
   - `badge`: Badge name (Champion, Guardian, Supporter, Friend)
   - `date`: Donation date (YYYY-MM-DD)
   - `payment`: Payment method description
   - `id`: Transaction ID

Example:
```
/api/test/donation-email?email=test@example.com&name=John%20Doe&amount=50&recurring=false&badge=Guardian
```

## Environment Variables

The following environment variables are required:

```
# Stripe API keys
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Email configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here

# Email server configuration (optional, for external PDF generation)
EMAIL_SERVER_URL=http://localhost:5000
EMAIL_SERVER_API_KEY=your_api_key_here
```

## Integration with Email Server

The system can work in two modes:

1. **Standalone mode**: Generates PDFs and sends emails directly
2. **Email server mode**: Delegates PDF generation and email sending to the external email server

When `EMAIL_SERVER_URL` is configured, the system will use the external email server for PDF generation and email sending.
