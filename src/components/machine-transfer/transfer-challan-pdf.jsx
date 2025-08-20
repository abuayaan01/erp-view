import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { format, parseISO } from "date-fns";
import logo from "../../assets/icons/company-logo.jpeg";

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
  logoContainer: {
    alignItems: "center",
    marginBottom: 10,
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
  },
  tableColLast: {
    padding: 5,
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

const TransferChallanPDF = ({ transfer }) => {
  console.log(transfer);
  // Format date if needed
  const formatDisplayDate = (dateString) => {
    try {
      return format(parseISO(dateString), "dd-MMM-yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const getChallanTitle = () => {
    if (transfer.requestType === "Site Transfer")
      return "MACHINE TRANSFER CHALLAN";
    if (transfer.requestType === "Sell") return "MACHINE SALE CHALLAN";
    return "MACHINE SCRAP CHALLAN";
  };

  const getToTitle = () => {
    if (transfer.requestType === "Site Transfer") return "TO";
    if (transfer.requestType === "Sell") return "BUYER";
    return "SCRAP VENDOR";
  };

  const getSignatureTitle = () => {
    if (transfer.requestType === "Site Transfer") return "Receiver's Signature";
    if (transfer.requestType === "Sell") return "Buyer's Signature";
    return "Vendor's Signature";
  };

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
            <Text style={styles.companyAddress}>Contact: +91 9471100887</Text>
          </View>
          <View style={styles.dateInfo}>
            <View style={styles.logoContainer}>
              <Image src={logo} style={{ width: 50, height: 50 }} />
            </View>
            <Text>Challan No: {transfer.id}</Text>
            <Text>Date: {formatDisplayDate(transfer.approvedAt)}</Text>
            <Text>Time: {format(new Date(), "HH:mm")}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>{getChallanTitle()}</Text>

        {/* From/To Sections */}
        <View style={styles.sectionContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>From</Text>
            {/* <View style={styles.row}>
              <Text style={styles.label}>Site:</Text>
              <Text style={styles.value}>{transfer.fromSite}</Text>
            </View> */}
            <View style={styles.row}>
              <Text style={styles.label}>Site Name:</Text>
              <Text style={styles.value}>{transfer?.currentSite?.name}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Site Code:</Text>
              <Text style={styles.value}>{transfer?.currentSite?.code}</Text>
            </View>
            {/* <View style={styles.row}>
              <Text style={styles.label}>GST No.:</Text>
              <Text style={styles.value}>21AABCT4589R1ZP</Text>
            </View> */}
          </View>
          <View style={styles.sectionRight}>
            <Text style={styles.sectionTitle}>{getToTitle()}</Text>
            {/* <View style={styles.row}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>
                {transfer.requestType === "Site Transfer"
                  ? transfer.destinationSite?.name
                  : transfer.requestType === "Sell"
                  ? transfer.buyerName
                  : transfer.scrapVendor}
              </Text>
            </View> */}
            {transfer.requestType === "Site Transfer" && (
              <>
                <View style={styles.row}>
                  <Text style={styles.label}>Site Name:</Text>
                  <Text style={styles.value}>
                    {transfer?.destinationSite?.name}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Site Code:</Text>
                  <Text style={styles.value}>
                    {transfer?.destinationSite?.code}
                  </Text>
                </View>
              </>
            )}
            {transfer.requestType === "Sell" && (
              <>
                <View style={styles.row}>
                  <Text style={styles.label}>Contact:</Text>
                  <Text style={styles.value}>
                    {transfer.buyerContact || "N/A"}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Address:</Text>
                  <Text style={styles.value}>
                    {transfer.buyerAddress || "N/A"}
                  </Text>
                </View>
              </>
            )}
            {transfer.requestType === "Scrap" && (
              <>
                <View style={styles.row}>
                  <Text style={styles.label}>Contact:</Text>
                  <Text style={styles.value}>
                    {transfer.scrapVendorContact || "N/A"}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Address:</Text>
                  <Text style={styles.value}>
                    {transfer.scrapVendorAddress || "N/A"}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Note */}
        <View style={styles.noteBox}>
          <Text style={styles.noteText}>
            We are{" "}
            {transfer.requestType === "Site Transfer"
              ? "transferring"
              : transfer.requestType === "Sell"
              ? "selling"
              : "scrapping"}{" "}
            the following machine for OUR OWN USE and Not For Sale/Resale.
          </Text>
          <Text style={styles.noteText}>
            The concerned Authority is requested to allow uninterrupted
            transport of this machine.
          </Text>
        </View>

        {/* Machine Details Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { width: "8%" }]}>
              <Text>S.No.</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "15%" }]}>
              <Text>Machine Code</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "25%" }]}>
              <Text>Machine Name</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "15%" }]}>
              <Text>Model</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "15%" }]}>
              <Text>Serial No.</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "15%" }]}>
              <Text>Registration No.</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "12%" }]}>
              <Text>Condition</Text>
            </View>
            <View style={[styles.tableColHeaderLast, { width: "10%" }]}>
              <Text>Remarks</Text>
            </View>
          </View>

          {/* Table Body */}
          <View style={styles.tableRowLast}>
            <View style={[styles.tableCol, { width: "8%" }]}>
              <Text>1</Text>
            </View>
            <View style={[styles.tableCol, { width: "15%" }]}>
              <Text>{transfer.machine?.machineCode}</Text>
            </View>
            <View style={[styles.tableCol, { width: "25%" }]}>
              <Text>{transfer.machine?.machineName}</Text>
            </View>
            <View style={[styles.tableCol, { width: "15%" }]}>
              <Text>{transfer.machine?.model || "N/A"}</Text>
            </View>
            <View style={[styles.tableCol, { width: "15%" }]}>
              <Text>{transfer.machine?.serialNumber || "N/A"}</Text>
            </View>
            <View style={[styles.tableCol, { width: "15%" }]}>
              <Text>{transfer.registrationNumber || "N/A"}</Text>
            </View>
            <View style={[styles.tableCol, { width: "12%" }]}>
              <Text>Working</Text>
            </View>
            <View style={[styles.tableColLast, { width: "10%" }]}>
              <Text>-</Text>
            </View>
          </View>
        </View>

        {/* Transport Details */}
        <View style={styles.sectionContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Transport Details</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Vehicle No:</Text>
              <Text style={styles.value}>
                {transfer.transportDetails?.vehicleNumber || "N/A"}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Driver Name:</Text>
              <Text style={styles.value}>
                {transfer.transportDetails?.driverName || "N/A"}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Driver Contact:</Text>
              <Text style={styles.value}>
                {transfer.transportDetails?.mobileNumber || "N/A"}
              </Text>
            </View>
          </View>
          <View style={styles.sectionRight}>
            <Text style={styles.sectionTitle}>
              {transfer.requestType === "Sell"
                ? "Sale Details"
                : transfer.requestType === "Scrap"
                ? "Scrap Details"
                : "Additional Info"}
            </Text>
            <View style={styles.row}>
              <Text style={styles.label}>Approved By:</Text>
              <Text style={styles.value}>
                {transfer?.approver?.name || "N/A"}
              </Text>
            </View>
            {transfer.requestType === "Sell" && (
              <View style={styles.row}>
                <Text style={styles.label}>Sale Amount:</Text>
                <Text style={styles.value}>
                  ₹{transfer.saleAmount ? transfer.saleAmount : "N/A"}
                </Text>
              </View>
            )}
            {transfer.requestType === "Scrap" && (
              <View style={styles.row}>
                <Text style={styles.label}>Scrap Value:</Text>
                <Text style={styles.value}>
                  ₹{transfer.scrapValue ? transfer.scrapValue : "N/A"}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Narration */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontWeight: "bold" }}>Narration:</Text>
          <Text>
            Machine{" "}
            {transfer.requestType === "Site Transfer"
              ? "transfer"
              : transfer.requestType === "Sell"
              ? "sale"
              : "scrap"}{" "}
            as per approval
          </Text>
          <Text>Status: {transfer.status}</Text>
          <Text>Reference: {transfer.requestType}</Text>
        </View>

        {/* Footer with signatures */}
        <View style={styles.footer}>
          <View style={styles.signature}>
            <Text>Authorized By</Text>
          </View>
          <View style={styles.signature}>
            <Text>Prepared By</Text>
          </View>
          <View style={styles.signature}>
            <Text>{getSignatureTitle()}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default TransferChallanPDF;
