import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { format } from "date-fns";

// Create styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    borderBottom: 1,
    borderBottomColor: "#000",
    paddingBottom: 10,
  },
  companyInfo: {
    width: "50%",
  },
  locationInfo: {
    width: "50%",
    textAlign: "right",
  },
  companyName: {
    fontSize: 12,
    fontWeight: "bold",
  },
  companyAddress: {
    fontSize: 8,
    marginTop: 2,
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  entryDetails: {
    flexDirection: "row",
    marginBottom: 10,
  },
  entryLeft: {
    width: "50%",
  },
  entryRight: {
    width: "50%",
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  detailLabel: {
    width: "40%",
    fontWeight: "bold",
  },
  detailValue: {
    width: "60%",
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 5,
    backgroundColor: "#f0f0f0",
    padding: 4,
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
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
    padding: 4,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableColHeaderLast: {
    padding: 4,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableCol: {
    borderRightWidth: 1,
    borderRightColor: "#000",
    padding: 4,
    textAlign: "center",
  },
  tableColLeft: {
    borderRightWidth: 1,
    borderRightColor: "#000",
    padding: 4,
    textAlign: "left",
  },
  tableColLast: {
    padding: 4,
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
    fontSize: 8,
  },
  workingDetails: {
    marginTop: 10,
    marginBottom: 20,
  },
  workingDetailsTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 5,
  },
  workingDetailsText: {
    fontSize: 9,
    lineHeight: 1.5,
  },
});

const LogbookPDF = ({ entry }) => {
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
          <View style={styles.locationInfo}>
            <Text style={{ fontWeight: "bold" }}>{entry.siteName}</Text>
            <Text>{entry.location}</Text>
            <Text>Entry #{entry.id}</Text>
            <Text>{format(new Date(entry.date), "dd-MMM-yyyy")}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>MACHINE LOGBOOK ENTRY</Text>

        {/* Machine Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Machine Information</Text>
          <View style={styles.entryDetails}>
            <View style={styles.entryLeft}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Asset/ERP Code:</Text>
                <Text style={styles.detailValue}>{entry.assetCode}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Machine Name:</Text>
                <Text style={styles.detailValue}>{entry.machineName}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Registration No:</Text>
                <Text style={styles.detailValue}>{entry.registrationNo}</Text>
              </View>
            </View>
            <View style={styles.entryRight}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Site Name:</Text>
                <Text style={styles.detailValue}>{entry.siteName}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Location:</Text>
                <Text style={styles.detailValue}>{entry.location}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Diesel Consumption Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Diesel Consumption</Text>
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
        </View>

        {/* Performance Metrics Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Metrics</Text>
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
        </View>

        {/* Hours Meter Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hours Meter</Text>
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
        </View>

        {/* Working Details */}
        <View style={styles.workingDetails}>
          <Text style={styles.workingDetailsTitle}>Working Details:</Text>
          <Text style={styles.workingDetailsText}>
            {entry.workingDetail || "No working details provided."}
          </Text>
        </View>

        {/* Footer with signatures */}
        <View style={styles.footer}>
          <View style={styles.signature}>
            <Text>Operator - Name & Sign</Text>
          </View>
          <View style={styles.signature}>
            <Text>Supervisor - Name & Sign</Text>
          </View>
          <View style={styles.signature}>
            <Text>Site Engineer - Name & Sign</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default LogbookPDF;
