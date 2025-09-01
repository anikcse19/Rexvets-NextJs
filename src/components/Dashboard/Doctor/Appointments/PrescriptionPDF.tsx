import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import img from "../../../../../public/assets/user_icon.png";
import { Appointment, Doctor, Pet, PetParent } from "@/lib/types";

// Optional: Add custom fonts if needed
Font.register({
  family: "Helvetica-Bold",
  fonts: [
    { src: "https://fonts.gstatic.com/s/helvetica/v11/XYZ.ttf" }, // fallback example
  ],
});

Font.register({
  family: "OpenSans",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/opensans/v34/mem8YaGs126MiZpBA-UFVZ0e.ttf", // normal
      fontWeight: "normal",
    },
    {
      src: "https://fonts.gstatic.com/s/opensans/v34/mem6YaGs126MiZpBA-UFVZ0f.ttf", // bold
      fontWeight: "bold",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  section: {
    marginBottom: 14,
    borderBottom: 1,
    paddingBottom: 8,
  },
  title: {
    fontSize: 12,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  text: {
    fontSize: 12,
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 4,
  },
  col: {
    width: "48%",
  },
  rx: {
    fontSize: 32,
    color: "#0066cc",
    textAlign: "right",
    marginBottom: 10,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 9,
    borderTop: 1,
    paddingTop: 6,
  },
  signatureSection: {
    marginTop: 30,
    textAlign: "left",
  },
  signatureLine: {
    marginTop: 30,
    borderBottom: 1,
    width: "50%",
  },
  signatureLabel: {
    fontSize: 10,
    marginTop: 4,
  },
  rowLine: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  label: {
    width: 80,
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 8, // space between label and value
  },
  label2: {
    width: 160,
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 8, // space between label and value
  },
  value: {
    fontSize: 12,
    flex: 1,
  },
  veterinarianTitle: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily: "OpenSans",
  },
  gap: {
    marginTop: "15px",
  },
});

interface PrescriptionPDFProps {
  appointment: Appointment;
  veterinarian: Doctor;
  petParent: PetParent;
  pet: Pet;
  values: any;
  logoUrl?: any;
}

const PrescriptionPDF = ({
  appointment,
  veterinarian,
  petParent,
  pet,
  values,

  logoUrl,
}: PrescriptionPDFProps) => {
  // console.log(signatureUrl, "sign", veterinarian, "doctr");

  // console.log("appointment data from pdf", values);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.row}>
          <View style={{ width: "50%" }}>
            {logoUrl && (
              <Image
                src={logoUrl}
                style={{ width: 80, height: 30, marginBottom: 10 }}
              />
            )}
          </View>
          <Text style={styles.rx}>Rx</Text>
        </View>

        {/* Prescriber */}
        {/* <View style={styles.section}>
          <Text style={styles.title}>Prescriber</Text>
          <Text style={styles.veterinarianTitle}>
            DR. {veterinarian?.name || "N/A"}
          </Text>
          <View style={styles.rowLine}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{veterinarian?.phoneNumber || "-"}</Text>
          </View>

          <View style={styles.rowLine}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{veterinarian.email || "-"}</Text>
          </View>

          <View style={styles.rowLine}>
            <Text style={styles.label}>License #:</Text>
            <Text style={styles.value}>
              {veterinarian?.licenses?.[0]?.licenseNumber || "-"}
            </Text>
          </View>
          <Text style={styles.text}>
            DEA #: {veterinarian?.licenses?.[0].deaNumber || "-"}
          </Text>
        </View> */}

        {/* issue date */}
        {/* <View style={styles.section}>
          <Text style={styles.text}>
            Issued Date: {new Date().toLocaleDateString()}
          </Text>
          <Text style={styles.text}>Reference #: {appointment.id}</Text>
        </View> */}

        {/* Client & Patient */}
        {/* <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.title}>Client</Text>
              <Text style={styles.text}>{petParent?.name || "-"}</Text>

              <View style={styles.row}>
                <Text style={styles.label}>State:</Text>
                <Text style={styles.value}>{petParent?.state || "-"}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Phone:</Text>
                <Text style={styles.value}>
                  {petParent?.phoneNumber || "-"}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{petParent?.email || "-"}</Text>
              </View>
            </View>
            <View style={styles.col}>
              <Text style={styles.title}>Patient (Animal)</Text>
              <Text style={styles.text}>{pet?.name || "-"}</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Species:</Text>
                <Text style={styles.value}>{pet?.species || "-"}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Breed:</Text>
                <Text style={styles.value}>{pet?.breed || "-"}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Sex:</Text>
                <Text style={styles.value}>{pet?.gender || "-"}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Weight:</Text>
                <Text style={styles.value}>
                  {pet?.weight || "-"} {pet?.weightUnit || "LBS"}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Age:</Text>
                <Text style={styles.value}></Text>
              </View>
            </View>
          </View>
        </View> */}

        {/* Medicine */}
        {/* <View style={styles.section}>
          <Text style={styles.title}>Medicine</Text>
          <Text style={styles.text}>
            {values.medications[0].name} {values.strength}
            {values.strengthUnit}, {values.form}
          </Text>
          <View style={styles.row}>
            <Text style={styles.label2}>Quantity:</Text>
            <Text style={styles.value}>{values.medications[0].quantity}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label2}>Total Dispensed:</Text>
            <Text style={styles.value}>{values.medications[0].quantity}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label2}>Refills:</Text>
            <Text style={styles.value}>
              {values.usageInstructions.refills || 0}
            </Text>
          </View>
          <View></View>
          <View style={[styles.row, styles.gap]}>
            <Text style={styles.label2}>Generic Permissible?</Text>
            <Text style={styles.value}>
              {values.pharmacy.canUseGenericSubs ? "Yes" : "No"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label2}>Allow Human Pharmacy?</Text>
            <Text style={styles.value}>
              {values.pharmacy.canFilledHumanPharmacy ? "Yes" : "No"}
            </Text>
          </View>
        </View> */}

        {/* <View style={styles.section}>
          <Text style={styles.title}>Directions</Text>
          <Text style={styles.text}>
            {values.usageInstructions.directionForUse}
          </Text>
        </View> */}

        {/* Note */}
        {/* <View style={styles.section}>
          <Text style={styles.title}>Note to Pharmacist:</Text>
          <Text>{values?.pharmacy?.noteToPharmacist}</Text>
        </View> */}

        {/* Signature */}
        {/* <View style={styles.signatureSection}>
          {veterinarian.signature ? (
            <Image src={veterinarian.signature} style={{ width: 100 }} />
          ) : (
            <>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>Signature of Prescriber</Text>
            </>
          )}
        </View> */}

        {/* Footer */}
        <Text style={styles.footer}>
          VETERINARY PRESCRIPTIONS POWERED BY REXVET.COM — PAGE 1 OF 1
        </Text>
      </Page>
    </Document>
  );
};

export default PrescriptionPDF;
