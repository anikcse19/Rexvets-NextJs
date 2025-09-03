import { NextRequest, NextResponse } from 'next/server';
import { sendDonationThankYouEmail } from '@/lib/email';
import { generateDonationReceiptPdf } from '@/lib/pdf/generatePdf';

/**
 * Test endpoint for donation thank you email
 * This allows testing the donation email flow without making an actual payment
 */
export async function GET(request: NextRequest) {
  try {
    // Generate test data
    const testData = {
      email: request.nextUrl.searchParams.get('email') || 'test@example.com',
      name: request.nextUrl.searchParams.get('name') || 'Test Donor',
      donationAmount: parseFloat(request.nextUrl.searchParams.get('amount') || '25'),
      isRecurring: request.nextUrl.searchParams.get('recurring') === 'true',
      badgeName: request.nextUrl.searchParams.get('badge') || 'Supporter',
      donationDate: request.nextUrl.searchParams.get('date') || new Date().toISOString().split('T')[0],
      paymentMethod: request.nextUrl.searchParams.get('payment') || 'Test Card ending in 4242',
      transactionID: request.nextUrl.searchParams.get('id') || `TEST_${Date.now()}`,
    };

    // Generate PDF receipt
    const pdfBuffer = await generateDonationReceiptPdf({
      donorName: testData.name,
      amount: testData.donationAmount,
      receiptNumber: testData.transactionID,
      isRecurring: testData.isRecurring,
      badgeName: testData.badgeName,
      date: testData.donationDate,
      paymentMethod: testData.paymentMethod,
    });

    // Send thank you email with PDF attachment
    await sendDonationThankYouEmail({
      ...testData,
      pdfBuffer,
    });

    return NextResponse.json({
      success: true,
      message: 'Test donation thank you email sent successfully',
      testData,
    });
  } catch (error: any) {
    console.error('Error sending test email:', error);
    return NextResponse.json({ 
      error: 'Failed to send test email',
      details: error.message
    }, { status: 500 });
  }
}

