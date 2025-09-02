import { renderToBuffer, type DocumentProps } from '@react-pdf/renderer';
import fs from 'fs';
import path from 'path';
import React from 'react';
import DonationReceipt from './DonationReceipt';

/**
 * Generate a donation receipt PDF
 * 
 * @param {Object} receiptData - The donation receipt data
 * @returns {Promise<Buffer>} - A buffer containing the PDF data
 */
export async function generateDonationReceiptPdf({
  donorName,
  amount,
  receiptNumber,
  isRecurring,
  badgeName,
  date,
  paymentMethod,
}: {
  donorName: string;
  amount: number;
  receiptNumber: string;
  isRecurring: boolean;
  badgeName: string;
  date: string;
  paymentMethod: string;
}): Promise<Buffer> {
  try {
    // Preload local PNG logo as data URI to ensure react-pdf can embed it
    let logoDataUri: string | undefined = undefined;
    try {
      const logoPath = path.join(process.cwd(), 'public', 'logo', 'logo.png');
      const file = fs.readFileSync(logoPath);
      const base64 = file.toString('base64');
      logoDataUri = `data:image/png;base64,${base64}`;
    } catch {}

    // Create the PDF document element (without JSX in .ts file)
    const receipt = React.createElement(DonationReceipt as any, {
      donorName,
      amount,
      receiptNumber,
      isRecurring,
      badgeName,
      date,
      paymentMethod,
      logoDataUri,
    });

    // Render the PDF to a buffer
    const buffer = await renderToBuffer(
      receipt as unknown as React.ReactElement<DocumentProps>
    );
    return buffer;
  } catch (error) {
    console.error('Error generating donation receipt PDF:', error);
    throw new Error('Failed to generate donation receipt PDF');
  }
}

