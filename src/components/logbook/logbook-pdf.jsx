import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { format, parseISO } from "date-fns";

// Create styles matching Material Issue PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  companyInfo: {
    width: "60%",
  },
  companyName: {
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 2,
  },
  companyAddress: {
    marginBottom: 1,
  },
  dateInfo: {
    width: "40%",
    alignItems: "flex-end",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    textDecoration: "underline",
  },
  sectionContainer: {
    flexDirection: "row",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#000",
  },
  section: {
    width: "50%",
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  sectionRight: {
    width: "50%",
    padding: 8,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    marginBottom: 3,
  },
  label: {
    width: "40%",
    fontWeight: "bold",
  },
  value: {
    width: "60%",
  },
  noteBox: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 8,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
  },
  noteText: {
    fontStyle: "italic",
  },
  table: {
    display: "table",
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  tableRowLast: {
    flexDirection: "row",
  },
  tableColHeader: {
    borderRightWidth: 1,
    borderRightColor: "#000",
    padding: 5,
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
  },
  tableColHeaderLast: {
    padding: 5,
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
  },
  tableCol: {
    borderRightWidth: 1,
    borderRightColor: "#000",
    padding: 5,
    textAlign: "center",
  },
  tableColLast: {
    padding: 5,
    textAlign: "center",
  },
  footer: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signature: {
    width: "30%",
    borderTopWidth: 1,
    borderTopColor: "#000",
    paddingTop: 5,
    textAlign: "center",
  },
});

const LogbookPDF = ({ entry }) => {
  // Format date if needed
  const formatDisplayDate = (dateString) => {
    try {
      return format(parseISO(dateString), "dd-MMM-yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const dieselUsed =
    entry.dieselOpeningBalance + entry.dieselIssue - entry.dieselClosingBalance;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>
              M/s B. P. C INFRAPROJECTS PVT LTD
            </Text>
            <Text style={styles.companyAddress}>
              Galaxia Mall, Unit - 12, 2nd Floor, Piska More, Ratu Road
            </Text>
            <Text style={styles.companyAddress}>Ranchi - 834005</Text>
          </View>
          <View style={styles.dateInfo}>
            <Text>Entry No: #{entry.id}</Text>
            <Text>Date: {formatDisplayDate(entry.date)}</Text>
            {/* <Text>Site: {entry.siteName}</Text>
            <Text>Location: {entry.location}</Text> */}
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>MACHINE LOGBOOK ENTRY</Text>

        {/* Machine Information */}
        <View style={styles.sectionContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Machine Information</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Asset/ERP Code:</Text>
              <Text style={styles.value}>{entry.assetCode}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Machine Name:</Text>
              <Text style={styles.value}>{entry.machineName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Registration No:</Text>
              <Text style={styles.value}>{entry.registrationNo}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>GST No.:</Text>
              <Text style={styles.value}>21AABCT4589R1ZP</Text>
            </View>
          </View>
          <View style={styles.sectionRight}>
            <Text style={styles.sectionTitle}>Site Details</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Site Name:</Text>
              <Text style={styles.value}>{entry.siteName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Location:</Text>
              <Text style={styles.value}>{entry.location}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Contact:</Text>
              <Text style={styles.value}>SUKUMAR SAHU</Text>
            </View>
          </View>
        </View>

        {/* Note */}
        <View style={styles.noteBox}>
          <Text style={styles.noteText}>
            This logbook entry records the daily machine performance and diesel 
            consumption for maintenance and efficiency tracking purposes.
          </Text>
          <Text style={styles.noteText}>
            All readings should be verified and recorded accurately by the operator.
          </Text>
        </View>

        {/* Diesel Consumption Table */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { width: "25%" }]}>
              <Text>Opening Balance (L)</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "25%" }]}>
              <Text>Diesel Issue (L)</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "25%" }]}>
              <Text>Closing Balance (L)</Text>
            </View>
            <View style={[styles.tableColHeaderLast, { width: "25%" }]}>
              <Text>Diesel Used (L)</Text>
            </View>
          </View>
          <View style={styles.tableRowLast}>
            <View style={[styles.tableCol, { width: "25%" }]}>
              <Text>{entry.dieselOpeningBalance}</Text>
            </View>
            <View style={[styles.tableCol, { width: "25%" }]}>
              <Text>{entry.dieselIssue}</Text>
            </View>
            <View style={[styles.tableCol, { width: "25%" }]}>
              <Text>{entry.dieselClosingBalance}</Text>
            </View>
            <View style={[styles.tableColLast, { width: "25%" }]}>
              <Text>{dieselUsed}</Text>
            </View>
          </View>
        </View>

        {/* Performance Metrics Table */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { width: "20%" }]}>
              <Text>KM Reading (Start)</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "20%" }]}>
              <Text>KM Reading (End)</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "20%" }]}>
              <Text>Total KM Run</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "20%" }]}>
              <Text>Diesel Efficiency (KM/L)</Text>
            </View>
            <View style={[styles.tableColHeaderLast, { width: "20%" }]}>
              <Text>Diesel Used (L)</Text>
            </View>
          </View>
          <View style={styles.tableRowLast}>
            <View style={[styles.tableCol, { width: "20%" }]}>
              <Text>{entry.openingKMReading}</Text>
            </View>
            <View style={[styles.tableCol, { width: "20%" }]}>
              <Text>{entry.closingKMReading}</Text>
            </View>
            <View style={[styles.tableCol, { width: "20%" }]}>
              <Text>{entry.totalRunKM}</Text>
            </View>
            <View style={[styles.tableCol, { width: "20%" }]}>
              <Text>{entry.dieselAvgKM}</Text>
            </View>
            <View style={[styles.tableColLast, { width: "20%" }]}>
              <Text>{dieselUsed}</Text>
            </View>
          </View>
        </View>

        {/* Hours Meter Table */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { width: "20%" }]}>
              <Text>Hours Meter (Start)</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "20%" }]}>
              <Text>Hours Meter (End)</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "20%" }]}>
              <Text>Total Hours Run</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "20%" }]}>
              <Text>Diesel per Hour (L/Hr)</Text>
            </View>
            <View style={[styles.tableColHeaderLast, { width: "20%" }]}>
              <Text>Diesel Used (L)</Text>
            </View>
          </View>
          <View style={styles.tableRowLast}>
            <View style={[styles.tableCol, { width: "20%" }]}>
              <Text>{entry.openingHrsMeter}</Text>
            </View>
            <View style={[styles.tableCol, { width: "20%" }]}>
              <Text>{entry.closingHrsMeter}</Text>
            </View>
            <View style={[styles.tableCol, { width: "20%" }]}>
              <Text>{entry.totalRunHrsMeter}</Text>
            </View>
            <View style={[styles.tableCol, { width: "20%" }]}>
              <Text>{entry.dieselAvgHrsMeter}</Text>
            </View>
            <View style={[styles.tableColLast, { width: "20%" }]}>
              <Text>{dieselUsed}</Text>
            </View>
          </View>
        </View>

        {/* Narration */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontWeight: "bold" }}>Working Details:</Text>
          <Text>{entry.workingDetail || "No working details provided."}</Text>
        </View>

        {/* Footer with signatures */}
        <View style={styles.footer}>
          <View style={styles.signature}>
            <Text>Operator</Text>
            <Text>Name & Sign</Text>
          </View>
          <View style={styles.signature}>
            <Text>Supervisor</Text>
            <Text>Name & Sign</Text>
          </View>
          <View style={styles.signature}>
            <Text>Site Engineer</Text>
            <Text>Name & Sign</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default LogbookPDF;
