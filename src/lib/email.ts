import nodemailer from 'nodemailer';

// Email configuration
const emailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.org',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
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
const createEmailVerificationTemplate = (name: string, verificationUrl: string) => {
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
            </div>
            
            <div class="footer">
                <p>If you didn't create an account with RexVet, you can safely ignore this email.</p>
                <p>© 2024 RexVet. All rights reserved.</p>
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
            </div>
        </div>
    </body>
    </html>
  `;
};

// Email sending functions
export async function sendEmailVerification(email: string, token: string, name: string): Promise<void> {
  try {
    // Check if email service is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email service not configured. Using development mode.');
      console.log(`Email verification would be sent to ${email} for ${name} with token: ${token}`);
      const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;
      console.log(`Verification URL: ${verificationUrl}`);
      return;
    }

    const transporter = createTransporter();
    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;
    const htmlContent = createEmailVerificationTemplate(name, verificationUrl);

    const mailOptions = {
      from: `"RexVet" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email - Welcome to RexVet! 🐾',
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email verification sent successfully:', info.messageId);
  } catch (error) {
    console.error('Failed to send email verification:', error);
    throw new Error('Failed to send verification email');
  }
}

export async function sendPasswordReset(email: string, token: string, name: string): Promise<void> {
  try {
    // Check if email service is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email service not configured. Using development mode.');
      console.log(`Password reset email would be sent to ${email} for ${name} with token: ${token}`);
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
      subject: 'Reset Your Password - RexVet 🐾',
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully:', info.messageId);
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
}

// Test email configuration
export async function testEmailConfiguration(): Promise<boolean> {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email configuration not found. Please set EMAIL_USER and EMAIL_PASS environment variables.');
      return false;
    }

    const transporter = createTransporter();
    await transporter.verify();
    console.log('Email configuration is valid!');
    return true;
  } catch (error) {
    console.error('Email configuration test failed:', error);
    return false;
  }
}

// Appointment confirmation email templates
const createAppointmentConfirmationDoctorTemplate = (
  doctorName: string,
  parentName: string,
  appointmentDateTime: string,
  petName: string,
  meetingLink: string
) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Confirmation - RexVet</title>
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
                background-color: #c5f1fc;
                padding: 20px;
                text-align: center;
                border-radius: 10px 10px 0 0;
                margin: -30px -30px 30px -30px;
            }
            .logo {
                font-size: 28px;
                font-weight: bold;
                color: #002366;
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
            .appointment-details {
                background-color: #f8f9fa;
                border-left: 4px solid #002366;
                padding: 20px;
                margin: 20px 0;
                border-radius: 0 5px 5px 0;
            }
            .button {
                display: inline-block;
                background: linear-gradient(135deg, #002366, #1e40af);
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
            .highlight {
                color: #002366;
                font-weight: bold;
            }
            .meeting-link {
                word-break: break-all;
                color: #666;
                font-size: 14px;
                background-color: #f8f9fa;
                padding: 10px;
                border-radius: 5px;
                margin: 10px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🐾 RexVet</div>
                <h1 class="title">Appointment Confirmation</h1>
            </div>
            
            <div class="content">
                <p>Dear <span class="highlight">${doctorName}</span>,</p>
                
                <p>We're excited to confirm your upcoming video call appointment with <span class="highlight">${parentName}</span> at RexVet. Here are the details for your appointment:</p>
                
                <div class="appointment-details">
                    <p><strong>Start Time:</strong> ${appointmentDateTime}</p>
                    <p><strong>Veterinarian:</strong> ${doctorName}</p>
                    <p><strong>Parent:</strong> ${parentName}</p>
                    <p><strong>Pet Name:</strong> ${petName}</p>
                </div>
                
                <div style="text-align: center;">
                    <a href="${meetingLink}" class="button">Join Appointment</a>
                </div>
                
                <p class="meeting-link">
                    Or copy and paste this link in your browser:<br/> ${meetingLink}
                </p>

                <p>Please make sure you're ready for the call at least a few minutes before the scheduled time.</p>

                <p>If you need to reschedule or have any other questions, please feel free to reply to this email or contact our support team at <a href="mailto:support@rexvets.org">support@rexvets.org</a>.</p>

                <p>We thank you for your dedication to pet care.</p>
            </div>
            
            <div class="footer">
                <p>Warm regards,<br>The Team at RexVet</p>
                <p>© 2024 RexVet. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

const createAppointmentConfirmationParentTemplate = (
  parentName: string,
  doctorName: string,
  appointmentDateTime: string,
  petName: string,
  meetingLink: string
) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Appointment Confirmation - RexVet</title>
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
                background-color: #c5f1fc;
                padding: 20px;
                text-align: center;
                border-radius: 10px 10px 0 0;
                margin: -30px -30px 30px -30px;
            }
            .logo {
                font-size: 28px;
                font-weight: bold;
                color: #002366;
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
            .appointment-details {
                background-color: #f8f9fa;
                border-left: 4px solid #002366;
                padding: 20px;
                margin: 20px 0;
                border-radius: 0 5px 5px 0;
            }
            .button {
                display: inline-block;
                background: linear-gradient(135deg, #002366, #1e40af);
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
            .highlight {
                color: #002366;
                font-weight: bold;
            }
            .meeting-link {
                word-break: break-all;
                color: #666;
                font-size: 14px;
                background-color: #f8f9fa;
                padding: 10px;
                border-radius: 5px;
                margin: 10px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🐾 RexVet</div>
                <h1 class="title">Your Appointment Confirmation</h1>
            </div>
            
            <div class="content">
                <p>Dear <span class="highlight">${parentName}</span>,</p>
                
                <p>We're excited to confirm your upcoming video call appointment with <span class="highlight">${doctorName}</span> at RexVet. Here are the details for your appointment:</p>
                
                <div class="appointment-details">
                    <p><strong>Start Time:</strong> ${appointmentDateTime}</p>
                    <p><strong>Veterinarian:</strong> ${doctorName}</p>
                    <p><strong>Pet Name:</strong> ${petName}</p>
                </div>
                
                <div style="text-align: center;">
                    <a href="${meetingLink}" class="button">Join Appointment</a>
                </div>
                
                <p class="meeting-link">
                    Or copy and paste this link in your browser:<br/> ${meetingLink}
                </p>

                <p>Please make sure you're ready for the call at least a few minutes before the scheduled time. ${doctorName} is here to address any questions or concerns you have about your pet's health.</p>

                <p>If you need to reschedule or have any other questions, please feel free to reply to this email or contact our support team at <a href="mailto:support@rexvets.org">support@rexvets.org</a>.</p>

                <p>We look forward to assisting you with your pet's care.</p>
            </div>
            
            <div class="footer">
                <p>Warm regards,<br>The Team at RexVet</p>
                <p>© 2024 RexVet. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

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
}: {
  doctorEmail: string;
  doctorName: string;
  parentEmail: string;
  parentName: string;
  petName: string;
  appointmentDate: string;
  appointmentTime: string;
  meetingLink: string;
}): Promise<void> {
  try {
    console.log('sendAppointmentConfirmationEmails called with:', {
      doctorEmail,
      doctorName,
      parentEmail,
      parentName,
      petName,
      appointmentDate,
      appointmentTime,
      meetingLink,
    });

    // Check if email service is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email service not configured. Using development mode.');
      console.log(`Appointment confirmation emails would be sent to:`);
      console.log(`- Doctor: ${doctorEmail} (${doctorName})`);
      console.log(`- Parent: ${parentEmail} (${parentName})`);
      console.log(`Appointment: ${appointmentDate} at ${appointmentTime} for ${petName}`);
      console.log(`Meeting link: ${meetingLink}`);
      return;
    }

    const transporter = createTransporter();
    const appointmentDateTime = `${appointmentDate} at ${appointmentTime}`;

    // Send email to doctor
    const doctorHtmlContent = createAppointmentConfirmationDoctorTemplate(
      doctorName,
      parentName,
      appointmentDateTime,
      petName,
      meetingLink
    );

    const doctorMailOptions = {
      from: `"RexVet" <${process.env.EMAIL_USER}>`,
      to: doctorEmail,
      subject: 'Appointment Confirmation - RexVet',
      html: doctorHtmlContent,
    };

    // Send email to parent
    const parentHtmlContent = createAppointmentConfirmationParentTemplate(
      parentName,
      doctorName,
      appointmentDateTime,
      petName,
      meetingLink
    );

    const parentMailOptions = {
      from: `"RexVet" <${process.env.EMAIL_USER}>`,
      to: parentEmail,
      subject: 'Your Appointment Confirmation - RexVet',
      html: parentHtmlContent,
    };

    console.log('Attempting to send emails...');
    
    // Send both emails
    const [doctorInfo, parentInfo] = await Promise.all([
      transporter.sendMail(doctorMailOptions),
      transporter.sendMail(parentMailOptions),
    ]);

    console.log('Appointment confirmation emails sent successfully:');
    console.log('- Doctor email:', doctorInfo.messageId);
    console.log('- Parent email:', parentInfo.messageId);
  } catch (error) {
    console.error('Failed to send appointment confirmation emails:', error);
    throw new Error('Failed to send appointment confirmation emails');
  }
}

// Appointment reminder email templates
const createAppointmentReminderDoctorTemplate = (
  doctorName: string,
  parentName: string,
  appointmentDateTime: string,
  meetingLink: string
) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Appointment Reminder - RexVet</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; }
        .container { background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background-color: #c5f1fc; padding: 16px; text-align: center; border-radius: 10px 10px 0 0; margin: -30px -30px 20px -30px; }
        .title { color: #2c3e50; font-size: 22px; margin: 0; }
        .button { display: inline-block; background: linear-gradient(135deg, #002366, #1e40af); color: white; padding: 12px 22px; text-decoration: none; border-radius: 24px; font-weight: bold; text-align: center; margin: 16px 0; }
        .meeting-link { word-break: break-all; color: #666; font-size: 14px; background-color: #f8f9fa; padding: 10px; border-radius: 5px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h2 class="title">Appointment starts in 10 minutes</h2></div>
        <p>Dear <strong>${doctorName}</strong>,</p>
        <p>Your video call appointment with <strong>${parentName}</strong> starts at <strong>${appointmentDateTime}</strong>.</p>
        <div style="text-align:center"><a href="${meetingLink}" class="button">Join Appointment</a></div>
        <p class="meeting-link">Or open this link: ${meetingLink}</p>
        <p>Thank you for caring for our pet community.</p>
      </div>
    </body>
    </html>
  `;
};

const createAppointmentReminderParentTemplate = (
  parentName: string,
  doctorName: string,
  appointmentDateTime: string,
  meetingLink: string
) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Appointment Reminder - RexVet</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; }
        .container { background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background-color: #c5f1fc; padding: 16px; text-align: center; border-radius: 10px 10px 0 0; margin: -30px -30px 20px -30px; }
        .title { color: #2c3e50; font-size: 22px; margin: 0; }
        .button { display: inline-block; background: linear-gradient(135deg, #002366, #1e40af); color: white; padding: 12px 22px; text-decoration: none; border-radius: 24px; font-weight: bold; text-align: center; margin: 16px 0; }
        .meeting-link { word-break: break-all; color: #666; font-size: 14px; background-color: #f8f9fa; padding: 10px; border-radius: 5px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h2 class="title">Your appointment starts in 10 minutes</h2></div>
        <p>Dear <strong>${parentName}</strong>,</p>
        <p>This is a friendly reminder for your video call with <strong>${doctorName}</strong> at <strong>${appointmentDateTime}</strong>.</p>
        <div style="text-align:center"><a href="${meetingLink}" class="button">Join Appointment</a></div>
        <p class="meeting-link">Or open this link: ${meetingLink}</p>
        <p>See you soon!</p>
      </div>
    </body>
    </html>
  `;
};

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
      console.log("[REMINDER] Dev mode. Would send to:", { doctorEmail, parentEmail, appointmentDateTime, meetingLink });
      return;
    }

    const transporter = createTransporter();

    const doctorMail = {
      from: `"RexVet" <${process.env.EMAIL_USER}>`,
      to: doctorEmail,
      subject: "Appointment Reminder - Starts in 10 minutes",
      html: createAppointmentReminderDoctorTemplate(
        doctorName,
        parentName,
        appointmentDateTime,
        meetingLink
      ),
    } as any;

    const parentMail = {
      from: `"RexVet" <${process.env.EMAIL_USER}>`,
      to: parentEmail,
      subject: "Reminder: Your Appointment Starts in 10 Minutes",
      html: createAppointmentReminderParentTemplate(
        parentName,
        doctorName,
        appointmentDateTime,
        meetingLink
      ),
    } as any;

    await Promise.all([transporter.sendMail(doctorMail), transporter.sendMail(parentMail)]);
  } catch (err) {
    console.error("Failed to send reminder emails:", err);
    throw err;
  }
}
