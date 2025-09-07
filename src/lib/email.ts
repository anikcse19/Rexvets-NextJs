import nodemailer from "nodemailer";
import { commonStyles } from "./emailStyles";
import {
  bookingConfirmationDoctorTemplate,
  bookingConfirmationParentTemplate,
  rescheduleConfirmationDoctorTemplate,
  rescheduleConfirmationParentTemplate,
  reminderParentTemplate,
  reminderDoctorTemplate,
  donationThankYouTemplate as donationThankYouTemplateShared,
  welcomeEmailTemplate,
  helpRequestEmailTemplate,
  pharmacyRequestPaymentTemplate,
  pharmacyRequestAcceptedTemplate,
  messageToDoctorTemplate,
  messageToParentTemplate,
} from "./emailTemplates";

// Email configuration
const emailConfig = {
  host: process.env.EMAIL_HOST || "smtp.gmail.org",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport(emailConfig);
};


// Email templates
const createEmailVerificationTemplate = (
  name: string,
  verificationUrl: string
) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - RexVet</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background-color: #ffffff;
                border-radius: 10px;
                padding: 30px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 28px;
                font-weight: bold;
                color: #ff6b6b;
                margin-bottom: 10px;
            }
            .title {
                color: #2c3e50;
                font-size: 24px;
                margin-bottom: 20px;
            }
            .content {
                margin-bottom: 30px;
            }
            .button {
                display: inline-block;
                background: linear-gradient(135deg, #ff6b6b, #ee5a24);
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 25px;
                font-weight: bold;
                text-align: center;
                margin: 20px 0;
                transition: transform 0.3s ease;
            }
            .button:hover {
                transform: translateY(-2px);
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: #666;
                font-size: 14px;
            }
            .warning {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 5px;
                padding: 15px;
                margin: 20px 0;
                color: #856404;
            }
            .highlight {
                color: #ff6b6b;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🐾 RexVet</div>
                <h1 class="title">Welcome to RexVet!</h1>
            </div>
            
            <div class="content">
                <p>Hi <span class="highlight">${name}</span>,</p>
                
                <p>Thank you for joining RexVet! We're excited to have you as part of our community of pet parents and veterinary professionals.</p>
                
                <p>To complete your registration and start using RexVet, please verify your email address by clicking the button below:</p>
                
                <div style="text-align: center;">
                    <a href="${verificationUrl}" class="button">Verify Email Address</a>
                </div>
                
                <div class="warning">
                    <strong>Important:</strong> This verification link will expire in 24 hours. If you don't verify your email within this time, you'll need to request a new verification link.
                </div>
                
                <p>If the button above doesn't work, you can copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #666; font-size: 14px;">${verificationUrl}</p>
                
                <p>If you didn't create an account with RexVet, you can safely ignore this email.</p>
            </div>
            
            <div class="footer">
                <p>© 2025 RexVet. All rights reserved.</p>
                <div style="background-color: #002366; padding: 10px; text-align: center; margin-top: 20px;">
                    <img src="https://res.cloudinary.com/di6zff0rd/image/upload/v1747926532/Logo_debjuj.png" alt="Rex Vet Logo" width="150" style="display: block; margin: 0 auto;" />
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
};

const createPasswordResetTemplate = (name: string, resetUrl: string) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password - RexVet</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background-color: #ffffff;
                border-radius: 10px;
                padding: 30px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 28px;
                font-weight: bold;
                color: #ff6b6b;
                margin-bottom: 10px;
            }
            .title {
                color: #2c3e50;
                font-size: 24px;
                margin-bottom: 20px;
            }
            .content {
                margin-bottom: 30px;
            }
            .button {
                display: inline-block;
                background: linear-gradient(135deg, #ff6b6b, #ee5a24);
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 25px;
                font-weight: bold;
                text-align: center;
                margin: 20px 0;
                transition: transform 0.3s ease;
            }
            .button:hover {
                transform: translateY(-2px);
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: #666;
                font-size: 14px;
            }
            .warning {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 5px;
                padding: 15px;
                margin: 20px 0;
                color: #856404;
            }
            .highlight {
                color: #ff6b6b;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🐾 RexVet</div>
                <h1 class="title">Password Reset Request</h1>
            </div>
            
            <div class="content">
                <p>Hi <span class="highlight">${name}</span>,</p>
                
                <p>We received a request to reset your password for your RexVet account.</p>
                
                <p>Click the button below to reset your password:</p>
                
                <div style="text-align: center;">
                    <a href="${resetUrl}" class="button">Reset Password</a>
                </div>
                
                <div class="warning">
                    <strong>Important:</strong> This password reset link will expire in 10 minutes. If you don't reset your password within this time, you'll need to request a new reset link.
                </div>
                
                <p>If the button above doesn't work, you can copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #666; font-size: 14px;">${resetUrl}</p>
                
                <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
            </div>
            
            <div class="footer">
                <p>© 2024 RexVet. All rights reserved.</p>
                <div style="background-color: #002366; padding: 10px; text-align: center; margin-top: 20px;">
                    <img src="https://res.cloudinary.com/di6zff0rd/image/upload/v1747926532/Logo_debjuj.png" alt="Rex Vet Logo" width="150" style="display: block; margin: 0 auto;" />
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Email sending functions
export async function sendEmailVerification(
  email: string,
  token: string,
  name: string,
  isDoctor: boolean = false
): Promise<void> {
  try {
    // Check if email service is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("Email service not configured. Using development mode.");
      console.log(
        `Email verification would be sent to ${email} for ${name} with token: ${token}`
      );
      const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;
      console.log(`Verification URL: ${verificationUrl}`);
      return;
    }

    const transporter = createTransporter();
    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;
    const displayName = isDoctor ? `Dr. ${name}` : name;
    const htmlContent = createEmailVerificationTemplate(displayName, verificationUrl);

    const mailOptions = {
      from: `"RexVet" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email - Welcome to RexVet! 🐾",
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email verification sent successfully:", info.messageId);
  } catch (error) {
    console.error("Failed to send email verification:", error);
    throw new Error("Failed to send verification email");
  }
}

export async function sendPasswordReset(
  email: string,
  token: string,
  name: string
): Promise<void> {
  try {
    // Check if email service is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("Email service not configured. Using development mode.");
      console.log(
        `Password reset email would be sent to ${email} for ${name} with token: ${token}`
      );
      const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
      console.log(`Password reset URL: ${resetUrl}`);
      return;
    }

    const transporter = createTransporter();
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
    const htmlContent = createPasswordResetTemplate(name, resetUrl);

    const mailOptions = {
      from: `"RexVet" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password - RexVet 🐾",
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully:", info.messageId);
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
}

// Test email configuration

// Appointment confirmation email templates
// Deprecated inline templates replaced by shared templates in emailTemplates.ts

// Deprecated inline templates replaced by shared templates in emailTemplates.ts

// Appointment confirmation email function
export async function sendAppointmentConfirmationEmails({
  doctorEmail,
  doctorName,
  parentEmail,
  parentName,
  petName,
  appointmentDate,
  appointmentTime,
  meetingLink,
  donationPdfBuffer,
}: {
  doctorEmail: string;
  doctorName: string;
  parentEmail: string;
  parentName: string;
  petName: string;
  appointmentDate: string;
  appointmentTime: string;
  meetingLink: string;
  donationPdfBuffer?: Buffer;
}): Promise<void> {
  try {
    console.log("sendAppointmentConfirmationEmails called with:", {
      doctorEmail,
      doctorName,
      parentEmail,
      parentName,
      petName,
      appointmentDate,
      appointmentTime,
      meetingLink,
      hasPdfAttachment: !!donationPdfBuffer,
    });

    // Check if email service is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("Email service not configured. Using development mode.");
      console.log(`Appointment confirmation emails would be sent to:`);
      console.log(`- Doctor: ${doctorEmail} (${doctorName})`);
      console.log(`- Parent: ${parentEmail} (${parentName})`);
      console.log(
        `Appointment: ${appointmentDate} at ${appointmentTime} for ${petName}`
      );
      console.log(`Meeting link: ${meetingLink}`);
      return;
    }

    const transporter = createTransporter();
    const appointmentDateTime = `${appointmentDate} at ${appointmentTime}`;

    // Send email to doctor
    const doctorHtmlContent = bookingConfirmationDoctorTemplate(
      doctorName,
      parentName,
      appointmentDateTime,
      petName,
      meetingLink
    );

    const doctorMailOptions = {
      from: `"RexVet" <${process.env.EMAIL_USER}>`,
      to: doctorEmail,
      subject: "Appointment Confirmation - RexVet",
      html: doctorHtmlContent,
    };

    // Send email to parent
    const parentHtmlContent = bookingConfirmationParentTemplate(
      parentName,
      doctorName,
      appointmentDateTime,
      petName,
      meetingLink
    );

    // Build parent mail options with PDF attachment if available
    const parentMailOptions: any = {
      from: `"Rex Vet" <${process.env.EMAIL_USER}>`,
      to: parentEmail,
      subject: "Your Appointment Confirmation - Rex Vet",
      html: parentHtmlContent,
    };

    // Add PDF attachment if available
    if (donationPdfBuffer) {
      console.log("Adding PDF attachment to email");
      parentMailOptions.attachments = [
        {
          filename: "Donation_Receipt.pdf",
          content: donationPdfBuffer.toString("base64"),
          encoding: "base64",
          contentType: "application/pdf",
        },
      ];
    } else {
      console.log("No PDF attachment available");
    }

    console.log("Attempting to send emails...");

    // Send both emails
    const [doctorInfo, parentInfo] = await Promise.all([
      transporter.sendMail(doctorMailOptions),
      transporter.sendMail(parentMailOptions),
    ]);

    console.log("Appointment confirmation emails sent successfully:");
    console.log("- Doctor email:", doctorInfo.messageId);
    console.log("- Parent email:", parentInfo.messageId);
  } catch (error) {
    console.error("Failed to send appointment confirmation emails:", error);
    throw new Error("Failed to send appointment confirmation emails");
  }
}

// Appointment reminder email templates
// Deprecated inline reminder templates; use shared reminders from emailTemplates.ts

export async function sendAppointmentReminderEmails({
  doctorEmail,
  doctorName,
  parentEmail,
  parentName,
  appointmentDateTime,
  meetingLink,
}: {
  doctorEmail: string;
  doctorName: string;
  parentEmail: string;
  parentName: string;
  appointmentDateTime: string;
  meetingLink: string;
}): Promise<void> {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("[REMINDER] Dev mode. Would send to:", {
        doctorEmail,
        parentEmail,
        appointmentDateTime,
        meetingLink,
      });
      return;
    }

    const transporter = createTransporter();

    const doctorMail = {
      from: `"Rex Vet" <${process.env.EMAIL_USER}>`,
      to: doctorEmail,
      subject: "Appointment Reminder - Starts in 10 minutes",
      html: reminderDoctorTemplate(
        doctorName,
        parentName,
        appointmentDateTime,
        meetingLink
      ),
    } as any;

    const parentMail = {
      from: `"Rex Vet" <${process.env.EMAIL_USER}>`,
      to: parentEmail,
      subject: "Reminder: Your Appointment Starts in 10 Minutes",
      html: reminderParentTemplate(
        parentName,
        doctorName,
        appointmentDateTime,
        meetingLink
      ),
    } as any;

    await Promise.all([
      transporter.sendMail(doctorMail),
      transporter.sendMail(parentMail),
    ]);
  } catch (err) {
    console.error("Failed to send reminder emails:", err);
    throw err;
  }
}

// Donation thank you email template
const createDonationThankYouTemplate = (
  donorName: string,
  amount: number,
  receiptNumber: string,
  isRecurring: boolean,
  badgeName: string,
  date: string,
  paymentMethod: string
) => {
  const recurringText = isRecurring
    ? "Your recurring monthly donation will help us provide continuous care to pets in need."
    : "Your one-time donation makes an immediate impact on the lives of pets and their families.";

  // Replicate email server styles (commonStyles + donation-specific styles)
  const sharedStyles: string = commonStyles;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Thank You for Your Donation</title>
  ${sharedStyles}
  <style>
    .receipt-section { margin: 30px 0; border: 1px solid #d1d5db; border-radius: 8px; padding: 20px; background-color: #f9fafb; }
    .receipt-title { margin-top: 0; color: #2563eb; font-size: 20px; margin-bottom: 15px; }
    .amount { color: #16a34a; font-weight: bold; font-size: 18px; }
    .impact-list { padding-left: 20px; color: #374151; margin: 15px 0; }
    .impact-list li { margin-bottom: 10px; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="body">
      <h2 class="title">Thank You for Your Generous Donation!</h2>
      <p>Dear <strong>${donorName}</strong>,</p>
      <p>We sincerely appreciate your contribution to Rex Vet. ${recurringText}</p>

      <div class="receipt-section">
        <h3 class="receipt-title">🧾 Donation Receipt</h3>
        <p><strong>Receipt No:</strong> ${receiptNumber}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Donation Amount:</strong> <span class="amount">$${amount}</span></p>
        <p><strong>Badge:</strong> <span style="font-weight: bold;">${badgeName}</span></p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <h4>Tax Statement:</h4>
        <p style="margin:0">Rex Vet Inc is a 501(c)(3) non-profit organization. No goods or services were received in exchange for this gift. It may be considered tax-deductible to the full extent of the law. Please retain this receipt for your records.</p>
      </div>

      <h4 style="color: #1e3a8a; margin-top: 20px;">A Note of Thanks:</h4>
      <ul class="impact-list">
        <li>Your donation directly supports animals in need by helping us provide free and low-cost virtual veterinary care to pets in underserved communities.</li>
        <li>Every dollar helps us reach more families and save more lives — from emergency consultations to routine care.</li>
        <li>With your support, we're one step closer to making quality vet care accessible for every pet, regardless of circumstance.</li>
      </ul>

      <p>If you have any questions, feel free to reach out to us at <a href="mailto:support@rexvet.org" style="color: #2563eb;">support@rexvet.org</a>.</p>
      
      <p style="margin-top: 20px;">With heartfelt thanks,</p>
      <p><em>– The RexVet Team</em></p>
    </div>
    
   <div style="background: rgb(200, 206, 219); padding: 15px; font-size: 14px; color: rgb(38, 79, 160); text-align: center; margin-top: 20px;">
      <p style="margin: 5px 0;">Rex Vet Inc</p>
      <p style="margin: 5px 0;">📍 123 Animal Care Drive, Miami, FL 33101</p>
      <p style="margin: 5px 0;">EIN: (123) 456-7690 | ✉️ support@rexvet.org</p>
      <p style="margin: 5px 0;">🌐 www.rexvet.org</p>
    </div>
  </div>
</body>
</html>`;
};

// Send donation thank you email with PDF receipt
export async function sendDonationThankYouEmail({
  email,
  name,
  donationAmount,
  isRecurring,
  badgeName,
  donationDate,
  paymentMethod,
  transactionID,
  pdfBuffer,
}: {
  email: string;
  name: string;
  donationAmount: number;
  isRecurring: boolean;
  badgeName: string;
  donationDate: string;
  paymentMethod: string;
  transactionID: string;
  pdfBuffer?: Buffer;
}): Promise<void> {
  try {
    console.log("Sending donation thank you email to:", email);

    // Check if email service is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("Email service not configured. Using development mode.");
      console.log(`Donation thank you email would be sent to: ${email}`);
      console.log(
        `Donation details: $${donationAmount} (${
          isRecurring ? "recurring" : "one-time"
        })`
      );
      return;
    }

    // Send email directly via nodemailer (optional pdfBuffer can be attached)
    const attachmentBuffer: Buffer | null = pdfBuffer || null;
    const transporter = createTransporter();
    const htmlContent = donationThankYouTemplateShared(
      name,
      donationAmount,
      transactionID,
      isRecurring,
      badgeName,
      donationDate,
      paymentMethod
    );

    const mailOptions = {
      from: `"RexVet" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank You for Your Generous Donation - RexVet",
      html: htmlContent,
    } as any;

    // If we have a PDF buffer, attach it to the email
    if (attachmentBuffer) {
      mailOptions.attachments = [
        {
          filename: "Donation_Receipt.pdf",
          content: attachmentBuffer,
          contentType: "application/pdf",
        },
      ];
    }

    const info = await transporter.sendMail(mailOptions);
    console.log("Donation thank you email sent successfully:", info.messageId);
  } catch (error) {
    console.error("Failed to send donation thank you email:", error);
    throw new Error("Failed to send donation thank you email");
  }
}

// New: Send welcome email using shared template
export async function sendWelcomeEmail(
  email: string,
  name: string
): Promise<void> {
  try {
    console.log("[WELCOME] Attempting to send welcome email to:", email);
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("[WELCOME] Dev mode. Would send to:", email);
      console.log("[WELCOME] EMAIL_USER:", process.env.EMAIL_USER ? "SET" : "NOT SET");
      console.log("[WELCOME] EMAIL_PASS:", process.env.EMAIL_PASS ? "SET" : "NOT SET");
      return;
    }
    
    const transporter = createTransporter();
    const html = welcomeEmailTemplate(name);
    
    console.log("[WELCOME] Sending email with template length:", html.length);
    
    const mailOptions = {
      from: `"RexVet" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Rex Vet",
      html,
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log("[WELCOME] Welcome email sent successfully:", info.messageId);
  } catch (err) {
    console.error("[WELCOME] Failed to send welcome email:", err);
    throw err;
  }
}

// New: Help/Support request email using shared template
export async function sendHelpRequestEmail(params: {
  to: string;
  fullName: string;
  emailAddress: string;
  phoneNo: string;
  state: string;
  subject: string;
  message: string;
  image?: string;
  userType: string;
  userID: string;
}): Promise<void> {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("[HELP] Dev mode. Would send to:", params.to);
      return;
    }
    const transporter = createTransporter();
    const html = helpRequestEmailTemplate(params);
    await transporter.sendMail({
      from: `"RexVet" <${process.env.EMAIL_USER}>`,
      to: params.to,
      subject: `Support Request: ${params.subject || "New Request"}`,
      html,
    } as any);
  } catch (err) {
    console.error("Failed to send help request email:", err);
    throw err;
  }
}

// New: Pharmacy payment receipt email
export async function sendPharmacyPaymentEmail(params: {
  to: string;
  name: string;
  transactionId: string;
  amount: number;
  pharmacyName: string;
  date: string | number | Date;
}): Promise<void> {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("[PHARMACY PAYMENT] Dev mode. Would send to:", params.to);
      return;
    }
    const transporter = createTransporter();
    const html = pharmacyRequestPaymentTemplate(params);
    await transporter.sendMail({
      from: `"RexVet" <${process.env.EMAIL_USER}>`,
      to: params.to,
      subject: "Pharmacy Transfer Payment Receipt",
      html,
    } as any);
  } catch (err) {
    console.error("Failed to send pharmacy payment email:", err);
    throw err;
  }
}

// New: Pharmacy request accepted email
export async function sendPharmacyAcceptedEmail(params: {
  to: string;
  name: string;
  transactionId: string;
  amount: string | number;
  pharmacyName: string;
  pharmacyAddress: string;
  pharmacyCity: string;
  pharmacyState: string;
  date: string;
}): Promise<void> {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("[PHARMACY ACCEPTED] Dev mode. Would send to:", params.to);
      return;
    }
    const transporter = createTransporter();
    const html = pharmacyRequestAcceptedTemplate(params);
    await transporter.sendMail({
      from: `"RexVet" <${process.env.EMAIL_USER}>`,
      to: params.to,
      subject: "Pharmacy Transfer Accepted",
      html,
    } as any);
  } catch (err) {
    console.error("Failed to send pharmacy accepted email:", err);
    throw err;
  }
}

// ADD_SEND_CHAT_NOTIFICATION_EMAIL
export async function sendChatNotificationEmail(params: {
  to: string;
  recipientName: string;
  senderName: string;
  isToDoctor: boolean;
  appointmentId: string;
}): Promise<void> {
  const { to, recipientName, senderName, isToDoctor, appointmentId } = params;
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`[CHAT] Dev mode. Would send to: ${to}`);
      return;
    }
    const transporter = createTransporter();
    const html = isToDoctor
      ? messageToDoctorTemplate({ doctorName: recipientName, parentName: senderName, appointmentId })
      : messageToParentTemplate({ parentName: recipientName, doctorName: senderName, appointmentId });

    await transporter.sendMail({
      from: `"RexVet" <${process.env.EMAIL_USER}>`,
      to,
      subject: "New chat message on RexVet",
      html,
    } as any);
  } catch (err) {
    console.error("Failed to send chat notification email:", err);
  }
}


