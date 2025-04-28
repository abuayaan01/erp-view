import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import { format } from "date-fns"

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
  challanInfo: {
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
    textAlign: "right",
  },
  challanDetails: {
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 4,
    marginBottom: 10,
  },
  challanDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  challanLabel: {
    fontSize: 8,
    fontWeight: "bold",
  },
  challanValue: {
    fontSize: 10,
    fontWeight: "bold",
  },
  referenceValue: {
    fontSize: 9,
    textAlign: "right",
  },
  fromToSection: {
    flexDirection: "row",
    marginBottom: 10,
  },
  fromSection: {
    width: "50%",
    paddingRight: 10,
    borderRight: 1,
    borderRightColor: "#000",
  },
  toSection: {
    width: "50%",
    paddingLeft: 10,
  },
  sectionTitle: {
    fontSize: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  sectionName: {
    fontSize: 9,
    fontWeight: "bold",
  },
  sectionText: {
    fontSize: 8,
    marginBottom: 2,
  },
  detailsSection: {
    marginBottom: 10,
  },
  detailsTitle: {
    fontSize: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
    borderBottom: 1,
    borderBottomColor: "#000",
    paddingBottom: 2,
    marginBottom: 4,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  detailsColumn: {
    width: "50%",
    marginBottom: 4,
  },
  detailsColumnThird: {
    width: "33.33%",
    marginBottom: 4,
  },
  detailsLabel: {
    fontSize: 8,
    color: "#666",
  },
  detailsValue: {
    fontSize: 9,
    fontWeight: "medium",
  },
  termsSection: {
    fontSize: 7,
    color: "#666",
    borderTop: 1,
    borderTopColor: "#000",
    paddingTop: 8,
    marginTop: 8,
  },
  termsTitle: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  termsList: {
    marginLeft: 10,
  },
  termsItem: {
    marginBottom: 2,
  },
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },
  signature: {
    width: "40%",
    borderTop: 1,
    borderTopStyle: "dashed",
    borderTopColor: "#000",
    paddingTop: 4,
    textAlign: "center",
  },
  signatureTitle: {
    fontSize: 8,
    fontWeight: "bold",
  },
  signatureSubtitle: {
    fontSize: 7,
    color: "#666",
  },
})

const TransferChallanPDF = ({ transfer }) => {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd-MMM-yyyy")
    } catch (error) {
      return dateString
    }
  }

  const getChallanTitle = () => {
    if (transfer.type === "site_transfer") return "MACHINE TRANSFER CHALLAN"
    if (transfer.type === "sell") return "MACHINE SALE CHALLAN"
    return "MACHINE SCRAP CHALLAN"
  }

  const getToTitle = () => {
    if (transfer.type === "site_transfer") return "TO"
    if (transfer.type === "sell") return "BUYER"
    return "SCRAP VENDOR"
  }

  const getSignatureTitle = () => {
    if (transfer.type === "site_transfer") return "Receiver's Signature"
    if (transfer.type === "sell") return "Buyer's Signature"
    return "Vendor's Signature"
  }

  const getSignatureSubtitle = () => {
    if (transfer.type === "site_transfer") return "(Receiver)"
    if (transfer.type === "sell") return "(Buyer)"
    return "(Vendor)"
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>YOUR COMPANY LOGO</Text>
            <Text style={styles.companyAddress}>Your Company Name</Text>
            <Text style={styles.companyAddress}>Address Line 1, Address Line 2</Text>
            <Text style={styles.companyAddress}>Contact: +XX XXXX XXXXX</Text>
          </View>
          <View style={styles.challanInfo}>
            <Text style={styles.title}>{getChallanTitle()}</Text>
            <Text style={styles.companyAddress}>Date: {formatDate(new Date().toISOString())}</Text>
          </View>
        </View>

        {/* Challan ID and Reference */}
        <View style={styles.challanDetails}>
          <View style={styles.challanDetailsRow}>
            <View>
              <Text style={styles.challanLabel}>Challan No:</Text>
              <Text style={styles.challanValue}>{transfer.id}</Text>
            </View>
            <View>
              <Text style={styles.challanLabel}>Reference:</Text>
              <Text style={styles.referenceValue}>
                {transfer.type === "site_transfer"
                  ? "Site Transfer"
                  : transfer.type === "sell"
                    ? "Machine Sale"
                    : "Machine Scrap"}
              </Text>
            </View>
          </View>
        </View>

        {/* From/To Details */}
        <View style={styles.fromToSection}>
          <View style={styles.fromSection}>
            <Text style={styles.sectionTitle}>From</Text>
            <Text style={styles.sectionName}>{transfer.fromSite}</Text>
            <Text style={styles.sectionText}>Your Company Name</Text>
            <Text style={styles.sectionText}>Address Line 1</Text>
            <Text style={styles.sectionText}>Address Line 2</Text>
            <Text style={styles.sectionText}>Contact: +XX XXXX XXXXX</Text>
          </View>

          <View style={styles.toSection}>
            <Text style={styles.sectionTitle}>{getToTitle()}</Text>
            <Text style={styles.sectionName}>
              {transfer.type === "site_transfer"
                ? transfer.toSite
                : transfer.type === "sell"
                  ? transfer.buyerName
                  : transfer.scrapVendor}
            </Text>
            {transfer.type === "sell" && (
              <>
                <Text style={styles.sectionText}>Contact: {transfer.buyerContact || "N/A"}</Text>
                {transfer.buyerAddress && <Text style={styles.sectionText}>{transfer.buyerAddress}</Text>}
              </>
            )}
            {transfer.type === "scrap" && (
              <>
                <Text style={styles.sectionText}>Contact: {transfer.scrapVendorContact || "N/A"}</Text>
                {transfer.scrapVendorAddress && <Text style={styles.sectionText}>{transfer.scrapVendorAddress}</Text>}
              </>
            )}
            {transfer.type === "site_transfer" && (
              <>
                <Text style={styles.sectionText}>Your Company Name</Text>
                <Text style={styles.sectionText}>Address Line 1</Text>
                <Text style={styles.sectionText}>Address Line 2</Text>
                <Text style={styles.sectionText}>Contact: +XX XXXX XXXXX</Text>
              </>
            )}
          </View>
        </View>

        {/* Machine Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.detailsTitle}>Machine Details</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailsColumn}>
              <Text style={styles.detailsLabel}>Machine Name:</Text>
              <Text style={styles.detailsValue}>{transfer.machineName}</Text>
            </View>
            <View style={styles.detailsColumn}>
              <Text style={styles.detailsLabel}>Machine ID:</Text>
              <Text style={styles.detailsValue}>{transfer.machineId}</Text>
            </View>
            <View style={styles.detailsColumn}>
              <Text style={styles.detailsLabel}>Model:</Text>
              <Text style={styles.detailsValue}>{transfer.model || "N/A"}</Text>
            </View>
            <View style={styles.detailsColumn}>
              <Text style={styles.detailsLabel}>Serial Number:</Text>
              <Text style={styles.detailsValue}>{transfer.serialNumber || "N/A"}</Text>
            </View>
          </View>
        </View>

        {/* Transfer Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.detailsTitle}>
            {transfer.type === "site_transfer"
              ? "Transfer Details"
              : transfer.type === "sell"
                ? "Sale Details"
                : "Scrap Details"}
          </Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailsColumn}>
              <Text style={styles.detailsLabel}>Date:</Text>
              <Text style={styles.detailsValue}>{formatDate(transfer.transferDate)}</Text>
            </View>
            <View style={styles.detailsColumn}>
              <Text style={styles.detailsLabel}>Approved By:</Text>
              <Text style={styles.detailsValue}>{transfer.approvedBy}</Text>
            </View>
            {transfer.type === "sell" && (
              <View style={styles.detailsColumn}>
                <Text style={styles.detailsLabel}>Sale Amount:</Text>
                <Text style={styles.detailsValue}>{transfer.saleAmount ? `$${transfer.saleAmount}` : "N/A"}</Text>
              </View>
            )}
            {transfer.type === "scrap" && (
              <View style={styles.detailsColumn}>
                <Text style={styles.detailsLabel}>Scrap Value:</Text>
                <Text style={styles.detailsValue}>{transfer.scrapValue ? `$${transfer.scrapValue}` : "N/A"}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Transport Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.detailsTitle}>Transport Details</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailsColumnThird}>
              <Text style={styles.detailsLabel}>Vehicle Number:</Text>
              <Text style={styles.detailsValue}>{transfer.transportDetails?.vehicleNo || "N/A"}</Text>
            </View>
            <View style={styles.detailsColumnThird}>
              <Text style={styles.detailsLabel}>Driver Name:</Text>
              <Text style={styles.detailsValue}>{transfer.transportDetails?.driverName || "N/A"}</Text>
            </View>
            <View style={styles.detailsColumnThird}>
              <Text style={styles.detailsLabel}>Driver Contact:</Text>
              <Text style={styles.detailsValue}>{transfer.transportDetails?.driverContact || "N/A"}</Text>
            </View>
          </View>
        </View>

        {/* Terms and Conditions */}
        <View style={styles.termsSection}>
          <Text style={styles.termsTitle}>Terms & Conditions:</Text>
          <View style={styles.termsList}>
            <Text style={styles.termsItem}>1. This challan must be presented at the time of delivery/receipt.</Text>
            <Text style={styles.termsItem}>2. The receiver must verify all details before accepting the machine.</Text>
            <Text style={styles.termsItem}>3. Any discrepancies must be reported within 24 hours of receipt.</Text>
            <Text style={styles.termsItem}>
              4. This document serves as proof of{" "}
              {transfer.type === "site_transfer" ? "transfer" : transfer.type === "sell" ? "sale" : "scrapping"}.
            </Text>
          </View>
        </View>

        {/* Signatures */}
        <View style={styles.signatureSection}>
          <View style={styles.signature}>
            <Text style={styles.signatureTitle}>Authorized Signature</Text>
            <Text style={styles.signatureSubtitle}>(Sender)</Text>
          </View>
          <View style={styles.signature}>
            <Text style={styles.signatureTitle}>{getSignatureTitle()}</Text>
            <Text style={styles.signatureSubtitle}>{getSignatureSubtitle()}</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default TransferChallanPDF
