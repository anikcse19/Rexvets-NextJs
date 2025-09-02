import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Define receipt props interface
interface DonationReceiptProps {
  donorName: string;
  amount: number;
  receiptNumber: string;
  isRecurring: boolean;
  badgeName: string;
  date: string;
  paymentMethod: string;
  logoDataUri?: string;
}

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#f5f5f5',
    padding: 10,
    fontFamily: 'Helvetica',
  },
  container: {
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  headerBar: {
    backgroundColor: '#002366',
    padding: 8,
    textAlign: 'center',
  },
  logo: {
    width: 120,
    height: 24,
    margin: '0 auto',
  },
  body: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  title: {
    color: '#1e3a8a',
    fontSize: 18,
    marginTop: 8,
    marginBottom: 8,
    textAlign: 'left',
    fontWeight: 'bold',
  },
  greeting: {
    fontSize: 12,
    color: '#333333',
    marginBottom: 6,
  },
  receiptBox: {
    marginVertical: 12,
    border: '1px solid #d1d5db',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#f9fafb',
  },
  receiptTitle: {
    marginTop: 0,
    color: '#2563eb',
    fontSize: 13,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    width: '40%',
    fontWeight: 'bold',
    color: '#374151',
    fontSize: 11,
  },
  value: {
    width: '60%',
    color: '#374151',
    textAlign: 'right',
    fontWeight: 500,
    fontSize: 11,
  },
  amount: {
    color: '#16a34a',
    fontWeight: 'bold',
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 4,
    fontSize: 13,
  },
  taxStatement: {
    marginTop: 6,
    fontSize: 10,
    color: '#4b5563',
    lineHeight: 1.25,
  },
  listItem: {
    fontSize: 10,
    color: '#374151',
    marginBottom: 4,
  },
  footerBar: {
    backgroundColor: '#c8ced4',
    padding: 6,
    fontSize: 10,
    color: '#264fa0',
    textAlign: 'center',
  },
  footerText: {
    marginBottom: 2,
  },
});

// Create PDF Document Component
const DonationReceipt: React.FC<DonationReceiptProps> = ({
  donorName,
  amount,
  receiptNumber,
  isRecurring,
  badgeName,
  date,
  paymentMethod,
  logoDataUri,
}) => (
  <Document>
    <Page size={{ width: 570.28, height: 650.89 }} style={styles.page}>
      <View style={styles.container}>
        <View style={styles.headerBar}>
          <Image
            style={styles.logo}
            src={logoDataUri || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMTIwIDI0IiBmaWxsPSIjZmZmIj48L3N2Zz4='}
          />
        </View>

        <View style={styles.body}>
          <Text style={styles.title}>Thank You for Your Generous Donation!</Text>
          <Text style={styles.greeting}>Dear <Text style={{ fontWeight: 'bold' }}>{donorName}</Text>,</Text>
          <Text style={{ fontSize: 11, color: '#333333', marginBottom: 6 }}>
            {isRecurring
              ? 'Your recurring monthly donation helps us provide ongoing support to animals in need.'
              : 'Your one-time donation makes an immediate impact on the lives of animals in our care.'}
          </Text>

          <View style={styles.receiptBox}>
            <Text style={styles.receiptTitle}>Donation Receipt</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Receipt No:</Text>
              <Text style={styles.value}>{receiptNumber}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>{date}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Donation Amount:</Text>
              <Text style={[styles.value, styles.amount]}>${amount}</Text>
            </View>
            {Boolean(badgeName) && (
              <View style={styles.row}>
                <Text style={styles.label}>Badge:</Text>
                <Text style={[styles.value, { fontWeight: 'bold' }]}>{badgeName}</Text>
              </View>
            )}
            <View style={styles.row}>
              <Text style={styles.label}>Payment Method:</Text>
              <Text style={styles.value}>{paymentMethod}</Text>
            </View>
            <Text style={styles.sectionTitle}>Tax Statement:</Text>
            <Text style={styles.taxStatement}>
              Rex Vets Inc is a 501(c)(3) non-profit organization. No goods or services were received in exchange for this gift. It may be considered tax-deductible to the full extent of the law. Please retain this receipt for your records.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>A Note of Thanks:</Text>
          <View>
            <Text style={styles.listItem}>• Your donation directly supports animals in need by helping us provide free and low-cost virtual veterinary care to pets in underserved communities.</Text>
            <Text style={styles.listItem}>• Every dollar helps us reach more families and save more lives — from emergency consultations to routine care.</Text>
            <Text style={styles.listItem}>• With your support, we're one step closer to making quality vet care accessible for every pet, regardless of circumstance.</Text>
          </View>

          <Text style={{ fontSize: 11, marginTop: 10 }}>If you have any questions, feel free to reach out to us at support@rexvets.com.</Text>
          <Text style={{ fontSize: 11, marginTop: 8 }}>With heartfelt thanks,</Text>
          <Text style={{ fontSize: 11, fontStyle: 'italic' }}>– The RexVets Team</Text>
        </View>

        <View style={styles.footerBar}>
          <Text style={styles.footerText}>Rex Vets Inc</Text>
          <Text style={styles.footerText}>📍 123 Animal Care Drive, Miami, FL 33101</Text>
          <Text style={styles.footerText}>EIN: (123) 456-7690 | ✉️ support@rexvets.com</Text>
          <Text style={styles.footerText}>🌐 www.rexvet.org</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default DonationReceipt;
