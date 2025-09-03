// Email templates to follow (ported from emailTemplatestoFollow.js)
export const welcomeEmailTemplate = (name: string) => `
            <h1>Welcome to Rex Vets!</h1>
            <p>Dear ${name},</p>
            <p>Welcome to Rex Vets and thank you for choosing us for your pet's healthcare needs. We're thrilled to have you on board and look forward to helping you and your furry friend live happier, healthier lives.</p>
            <p>You're now part of a community of pet lovers who are committed to providing the best care for their pets. To schedule your first video call with one of our experienced veterinarians, simply visit the 'Home' tab in your account and click 'Book a video call', and you'll be on your way to a virtual appointment.</p>
            <p>If you have any questions or need assistance at any point along the way, please don't hesitate to reach out to our dedicated support team at support@rexvets.com. We're here to make your experience with Rex Vets as seamless and enjoyable as possible.</p>
            <p>Thank you once again for choosing Rex Vets. We can't wait to assist you in providing the best possible care for your pet.</p>
            <p>Warm regards,<br>The Team at Rex Vets</p>
            <div style="background-color: #002366; padding: 10px; text-align: center;">
                <img src="https://res.cloudinary.com/di6zff0rd/image/upload/v1747926532/Logo_debjuj.png" alt="Rex Vets Logo" width="150" style="display: block; margin: 0 auto;" />
            </div>
        `;

export const bookingConfirmationDoctorTemplate = (
  doctorName: string,
  parentName: string,
  appointmentDateTime: string,
  petName: string,
  meetingLink: string
) => `
    <div style="background-color: #c5f1fc; padding: 0; text-align: center; width: 100%;"></div>
    <p>Dear Dr. ${doctorName},</p>
    <p>We're excited to confirm your upcoming video call appointment with ${parentName} at Rex Vets. Here are the details for your appointment:</p>
    <p><strong>Start Time:</strong> ${appointmentDateTime}</p>
    <p><strong>Veterinarian:</strong> Dr. ${doctorName}</p>
    <p><strong>Parent:</strong> ${parentName}</p>
    <p><strong>Pet Name:</strong> ${petName}</p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${meetingLink}" style="background-color: #002366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Appointment Link</a>
    </div>
    <p style="text-align: center; word-break: break-all; color: #666;">Or copy and paste this link in your browser:<br/> ${meetingLink}</p>
    <p>Please make sure you're ready for the call at least a few minutes before the scheduled time.</p>
    <p>If you need to reschedule or have any other questions, please feel free to reply to this email or contact our support team at <a href="mailto:support@rexvets.com">support@rexvets.com</a>.</p>
    <p>We thank you for your dedication to pet's care.</p>
    <p>Warm regards,<br>The Team at Rex Vets</p>
    <div style="background-color: #002366; padding: 10px; text-align: center;">
      <img src="https://res.cloudinary.com/di6zff0rd/image/upload/v1747926532/Logo_debjuj.png" alt="Rex Vets Logo" width="150" style="display: block; margin: 0 auto;" />
    </div>
`;

export const bookingConfirmationParentTemplate = (
  parentName: string,
  doctorName: string,
  appointmentDateTime: string,
  petName: string,
  meetingLink: string
) => `
    <div style="background-color: #c5f1fc; padding: 0; text-align: center; width: 100%;"></div>
    <p>Dear ${parentName},</p>
    <p>We're excited to confirm your upcoming video call appointment with <strong>${doctorName}</strong> at Rex Vets. Here are the details for your appointment:</p>
    <p><strong>Start Time:</strong> ${appointmentDateTime}</p>
    <p><strong>Veterinarian:</strong> ${doctorName}</p>
    <p><strong>Pet Name:</strong> ${petName}</p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${meetingLink}" style="background-color: #002366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Appointment</a>
    </div>
    <p style="text-align: center; word-break: break-all; color: #666;">Or copy and paste this link in your browser:<br/> ${meetingLink}</p>
    <p>Please make sure you're ready for the call at least a few minutes before the scheduled time. ${doctorName} is here to address any questions or concerns you have about your pet's health.</p>
    <p>If you need to reschedule or have any other questions, please feel free to reply to this email or contact our support team at <a href="mailto:support@rexvets.com">support@rexvets.com</a>.</p>
    <p>We look forward to assisting you with your pet's care.</p>
    <p>Warm regards,<br>The Team at Rex Vets</p>
    <div style="background-color: #002366; padding: 10px; text-align: center;">
      <img src="https://res.cloudinary.com/di6zff0rd/image/upload/v1747926532/Logo_debjuj.png" alt="Rex Vets Logo" width="150" style="display: block; margin: 0 auto;" />
    </div>
`;

export const rescheduleConfirmationDoctorTemplate = (
  parentName: string,
  doctorName: string,
  petName: string,
  oldDate: string | null,
  oldTime: string | null,
  appointmentDate: string,
  appointmentTime: string,
  meetingLink: string
) => `
  <div style="background-color: #c5f1fc; padding: 0; text-align: center; width: 100%;"></div>
  <p>Dear ${doctorName},</p>
  <p>This is to notify you that your scheduled video call appointment with <strong>${parentName}</strong> at Rex Vets has been <strong>rescheduled</strong>. Please find the updated appointment details below:</p>
  ${oldDate ? `<p><strong>Previous Time:</strong>${oldDate} at ${oldTime}</p>` : ""}
  <p><strong>New Start Time:</strong> ${appointmentTime}</p>
  <p><strong>Veterinarian:</strong> ${doctorName}</p>
  <p><strong>Parent:</strong> ${parentName}</p>
  <p><strong>Pet Name:</strong> ${petName}</p>
  <div style="text-align: center; margin: 20px 0;"><a href="${meetingLink}" style="background-color: #002366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Join Rescheduled Appointment</a></div>
  <p style="text-align: center; word-break: break-all; color: #666;">Or copy and paste this link in your browser:<br/> ${meetingLink}</p>
  <p>Please ensure you're available and ready for the call at the new time. If the time no longer works for you, kindly contact our support or reply to this email.</p>
  <p>We thank you for your flexibility and continued support.</p>
  <p>Warm regards,<br>The Team at Rex Vets</p>
  <div style="background-color: #002366; padding: 10px; text-align: center;"><img src="https://res.cloudinary.com/di6zff0rd/image/upload/v1747926532/Logo_debjuj.png" alt="Rex Vets Logo" width="150" style="display: block; margin: 0 auto;" /></div>
`;

export const rescheduleConfirmationParentTemplate = (
  parentName: string,
  doctorName: string,
  petName: string,
  oldDate: string | null,
  oldTime: string | null,
  appointmentDate: string,
  userDisplayTime: string,
  meetingLink: string
) => `
  <div style="background-color: #c5f1fc; padding: 0; text-align: center; width: 100%;"></div>
  <p>Dear ${parentName},</p>
  <p>Your video call appointment with <strong>Dr. ${doctorName}</strong> at Rex Vets for <strong>${petName}</strong> has been <strong>rescheduled</strong>.</p>
  ${oldDate ? `<p><strong>Previous Time:</strong>${oldDate} at ${oldTime}</p>` : ""}
  <p><strong>New Start Time:</strong> ${userDisplayTime}</p>
  <p><strong>Veterinarian:</strong> Dr. ${doctorName}</p>
  <p><strong>Pet Name:</strong> ${petName}</p>
  <div style="text-align: center; margin: 20px 0;"><a href="${meetingLink}" style="background-color: #002366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Join Your Appointment</a></div>
  <p style="text-align: center; word-break: break-all; color: #666;">Or copy and paste this link in your browser:<br/> ${meetingLink}</p>
  <p>Please make sure you're ready and in a quiet place a few minutes before your scheduled time.</p>
  <p>If you need to change your appointment again or have any questions, reply to this email or contact our team at <a href="mailto:support@rexvets.com">support@rexvets.com</a>.</p>
  <p>We look forward to helping ${petName} feel their best!</p>
  <p>Warm regards,<br>The Team at Rex Vets</p>
  <div style="background-color: #002366; padding: 10px; text-align: center;"><img src="https://res.cloudinary.com/di6zff0rd/image/upload/v1747926532/Logo_debjuj.png" alt="Rex Vets Logo" width="150" style="display: block; margin: 0 auto;" /></div>
`;

export const reminderParentTemplate = (
  parentName: string,
  doctorName: string,
  appointmentDateTime: string,
  meetingLink: string
) => `
  <div style="background-color: #c5f1fc; padding: 0; text-align: center; width: 100%;">
    <img src="https://res.cloudinary.com/di6zff0rd/image/upload/v1748961858/emailtemp1_sv6jxx.jpg" alt="Top Banner" style="display: block; height: auto; border: 0; width: 100%;" />
  </div>
  <p>Dear ${parentName},</p>
  <p>This is a friendly reminder that your video call appointment with <strong> ${doctorName}</strong> at Rex Vets is starting in just 10 minutes!</p>
  <p><strong>Date & Time:</strong> ${appointmentDateTime}</p>
  <div style="text-align: center; margin: 20px 0;"><a href="${meetingLink}" style="background-color: #002366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Join Appoinment Now</a></div>
  <p style="text-align: center; word-break: break-all; color: #666;">Or copy and paste this link in your browser:<br/> ${meetingLink}</p>
  <p>Thank you for choosing Rex Vets for your pet's healthcare needs.</p>
  <p>Warm regards,<br>The Team at Rex Vets</p>
  <div style="background-color: #002366; padding: 10px; text-align: center;"><img src="https://res.cloudinary.com/di6zff0rd/image/upload/v1747926532/Logo_debjuj.png" alt="Rex Vets Logo" width="150" style="display: block; margin: 0 auto;" /></div>
`;

export const reminderDoctorTemplate = (
  doctorName: string,
  parentName: string,
  appointmentDateTime: string,
  meetingLink: string
) => `
  <div style="background-color: #c5f1fc; padding: 0; text-align: center; width: 100%;">
    <img src="https://res.cloudinary.com/di6zff0rd/image/upload/v1748961858/emailtemp1_sv6jxx.jpg" alt="Top Banner" style="display: block; height: auto; border: 0; width: 100%;" />
  </div>
  <p>Dear ${doctorName},</p>
  <p>This is a reminder that your video call appointment with <strong>${parentName}</strong> is starting in 10 minutes.</p>
  <p><strong>Date & Time:</strong> ${appointmentDateTime}</p>
  <div style="text-align: center; margin: 20px 0;"><a href="${meetingLink}" style="background-color: #002366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Join Appoinment Now</a></div>
  <p style="text-align: center; word-break: break-all; color: #666;">Or copy and paste this link in your browser:<br/> ${meetingLink}</p>
  <p>Best regards,<br>The Rex Vets Team</p>
  <div style="background-color: #002366; padding: 10px; text-align: center;"><img src="https://res.cloudinary.com/di6zff0rd/image/upload/v1747926532/Logo_debjuj.png" alt="Rex Vets Logo" width="150" style="display: block; margin: 0 auto;" /></div>
`;

export const donationThankYouTemplate = (
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
  return `
<div style="max-width: 700px; margin: 0 auto; background: #ffffff; font-family: Arial, sans-serif; color: #333; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
  <div style="background-color: #002366; padding: 10px; text-align: center;">
    <img src="https://res.cloudinary.com/di6zff0rd/image/upload/v1747926532/Logo_debjuj.png" alt="Rex Vets Logo" width="150" style="display: block; margin: 0 auto;" />
  </div>
  <div style="padding: 10px 30px;">
    <h2 style="color: #1e3a8a;">Thank You for Your Generous Donation!</h2>
    <p>Dear <strong>${donorName}</strong>,</p>
    <p>We sincerely appreciate your contribution to RexVets. ${recurringText}</p>
    <div style="margin: 30px 0; border: 1px solid #d1d5db; border-radius: 8px; padding: 20px; background-color: #f9fafb;">
      <h3 style="margin-top: 0; color: #2563eb;">🧾 Donation Receipt</h3>
      <p><strong>Receipt No:</strong> ${receiptNumber}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Donation Amount:</strong> <span style="color: #16a34a; font-weight: bold;">$${amount}</span></p>
      <p><strong>Badge:</strong> <span style="font-weight: bold;">${badgeName}</span></p>
      <p><strong>Payment Method:</strong> ${paymentMethod}</p>
      <h4>Tax Statement:</h4>
      <p style="margin:0">Rex Vets Inc is a 501(c)(3) non-profit organization. No goods or services were received in exchange for this gift. It may be considered tax-deductible to the full extent of the law. Please retain this receipt for your records.</p>
    </div>
    <h4>A Note of Thanks:</h4>
    <ul style="padding-left: 20px; color: #374151; margin: 15px 0;">
      <li>Your donation directly supports animals in need by helping us provide free and low-cost virtual veterinary care to pets in underserved communities.</li>
      <li>Every dollar helps us reach more families and save more lives — from emergency consultations to routine care.</li>
      <li>With your support, we're one step closer to making quality vet care accessible for every pet, regardless of circumstance.</li>
    </ul>
    <p>If you have any questions, feel free to reach out to us at <a href="mailto:support@rexvets.com" style="color: #2563eb;">support@rexvets.com</a>.</p>
    <p style="margin-top: 20px;">With heartfelt thanks,</p>
    <p><em>– The RexVets Team</em></p>
  </div>
  <div class="footer">
    <p>Rex Vets Inc</p>
    <p>📍 123 Animal Care Drive, Miami, FL 33101</p>
    <p>EIN: (123) 456-7690 | ✉️ support@rexvets.com</p>
    <p>🌐 www.rexvets.com</p>
  </div>
</div>`;
};

export const pharmacyRequestPaymentTemplate = ({
  name,
  transactionId,
  amount,
  pharmacyName,
  date,
}: {
  name: string;
  transactionId: string;
  amount: number;
  pharmacyName: string;
  date: string | number | Date;
}) => {
  return `
      <div style="background-color: #f4f4f4; padding: 40px 0; font-family: Arial, sans-serif;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
      <div style="background-color: #002366; padding: 10px; text-align: center;">
        <img src="https://res.cloudinary.com/di6zff0rd/image/upload/v1747926532/Logo_debjuj.png" alt="Rex Vets Logo" width="150" style="display: block; margin: 0 auto;" />
      </div>
      <div style="padding: 30px;">
        <h2 style="color: #002366;">Hello ${name || "Pet Parent"},</h2>
        <p style="font-size: 16px; color: #555;">Thank you for your payment! We've successfully received your pharmacy transfer request. Below is your receipt:</p>
        <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
          <tbody>
            <tr><td style="padding: 8px 0; color: #555;"><strong>Pharmacy:</strong></td><td style="padding: 8px 0; color: #111;">${pharmacyName}</td></tr>
            <tr><td style="padding: 8px 0; color: #555;"><strong>Amount Paid:</strong></td><td style="padding: 8px 0; color: #111;">$${amount.toFixed(2)}</td></tr>
            <tr><td style="padding: 8px 0; color: #555;"><strong>Transaction ID:</strong></td><td style="padding: 8px 0; color: #111;">${transactionId}</td></tr>
            <tr><td style="padding: 8px 0; color: #555;"><strong>Date:</strong></td><td style="padding: 8px 0; color: #111;">${new Date(date).toLocaleString()}</td></tr>
          </tbody>
        </table>
        <p style="margin-top: 30px; font-size: 15px; color: #333;">Our team will begin processing your pharmacy transfer right away. The typical turnaround is 2–3 business days.</p>
        <p style="font-size: 15px; color: #333;">If you have any questions or need support, feel free to reply to this email.</p>
      </div>
      <div style="background-color: #f0f0f0; text-align: center; padding: 20px; font-size: 13px; color: #777;">🐾 RexVets • 123 Pet Lane, Animal City, USA<br/><a href="mailto:support@rexvets.com" style="color: #002366;">support@rexvets.com</a></div>
    </div>
  </div>`;
};

export const pharmacyRequestAcceptedTemplate = ({
  name,
  transactionId,
  amount,
  pharmacyName,
  pharmacyAddress,
  pharmacyCity,
  pharmacyState,
  date,
}: {
  name: string;
  transactionId: string;
  amount: string | number;
  pharmacyName: string;
  pharmacyAddress: string;
  pharmacyCity: string;
  pharmacyState: string;
  date: string;
}) => {
  return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
  <div style="background-color: #c5f1fc; padding: 0; text-align: center; width: 100%;">
    <img src="https://res.cloudinary.com/di6zff0rd/image/upload/v1748961858/emailtemp1_sv6jxx.jpg" alt="Top Banner" style="display: block; height: auto; border: 0; width: 100%;" />
  </div>
  <div style="padding: 30px;">
    <h2 style="color: #002366;">Hi ${name},</h2>
    <p style="font-size: 16px; color: #333;">We're happy to let you know that your pharmacy transfer request has been <strong style="color: green;">accepted</strong>.</p>
    <p style="font-size: 16px; color: #333;">Our team is now processing your request, and we'll forward the prescription to your nearby pharmacy as soon as possible.</p>
    <table style="margin-top: 20px; font-size: 15px; color: #333;">
      <tr><td style="padding: 4px 0;"><strong>Pharmacy:</strong></td><td style="padding: 4px 0;">${pharmacyName}</td></tr>
      <tr><td style="padding: 4px 0;"><strong>Pharmacy Address:</strong></td><td style="padding: 4px 0;">${pharmacyAddress},${pharmacyCity},${pharmacyState}</td></tr>
      <tr><td style="padding: 4px 0;"><strong>Amount Paid:</strong></td><td style="padding: 4px 0;">${amount}</td></tr>
      <tr><td style="padding: 4px 0;"><strong>Transaction ID:</strong></td><td style="padding: 4px 0;">${transactionId}</td></tr>
      <tr><td style="padding: 4px 0;"><strong>Requested Date:</strong></td><td style="padding: 4px 0;">${date}</td></tr>
    </table>
    <p style="margin-top: 30px; font-size: 15px; color: #333;">If you have any questions or need further assistance, feel free to reply to this email. We're here to help!</p>
    <p style="font-size: 16px; font-weight: 600; color: #002366; margin-top: 40px;">Sincerely,<br>Rex Vets Team 🐾</p>
  </div>
  <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #888;">© ${new Date().getFullYear()} Rex Vets. All rights reserved.</div>
</div>`;
};

export function helpRequestEmailTemplate({
  fullName,
  emailAddress,
  phoneNo,
  state,
  subject,
  message,
  image,
  userType,
  userID,
}: {
  fullName: string; emailAddress: string; phoneNo: string; state: string; subject: string; message: string; image?: string; userType: string; userID: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #004085;">New Support Request from ${userType}</h2>
      <p>A new support request has been submitted by a ${userType}. Here are the details:</p>
      <table style="width: 100%; margin-top: 16px; font-size: 14px;">
        <tr><td style="font-weight: bold; padding: 6px 0;">Full Name:</td><td>${fullName || "N/A"}</td></tr>
        <tr><td style="font-weight: bold; padding: 6px 0;">Email Address:</td><td>${emailAddress || "N/A"}</td></tr>
        <tr><td style="font-weight: bold; padding: 6px 0;">Phone No:</td><td>${phoneNo || "N/A"}</td></tr>
        <tr><td style="font-weight: bold; padding: 6px 0;">State:</td><td>${state || "N/A"}</td></tr>
        <tr><td style="font-weight: bold; padding: 6px 0;">User ID:</td><td>${userID || "N/A"}</td></tr>
      </table>
      <hr style="margin: 24px 0;" />
      <h3 style="margin-bottom: 8px; color: #333;">Subject: ${subject || "No Subject"}</h3>
      <p style="white-space: pre-line; line-height: 1.6;">${message || "No message provided."}</p>
      ${image ? `<div style="margin-top: 24px;"><p><strong>Attached Screenshot / Image:</strong></p><img src="${image}" alt="attachment" style="max-width: 100%; border: 1px solid #ccc; border-radius: 4px;" /></div>` : ""}
      <p style="margin-top: 40px; font-size: 13px; color: #999;">This request was submitted on behalf of a registered ${userType}.</p>
    </div>`;
}


