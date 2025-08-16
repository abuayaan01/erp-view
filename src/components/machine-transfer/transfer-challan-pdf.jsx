import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import logo from "../../assets/icons/company-logo.jpeg";

// Create styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: "Helvetica",
    borderWidth: 1,
    borderColor: "#000",
    flexDirection: "column", // 👈 important
  },

  contentWrapper: {
    flexDirection: "column",
    flex: 1, // allow internal elements to grow/shrink
  },

  container: {
    borderWidth: 1,
    borderColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#000",
    padding: 10,
  },
  companyInfo: {
    width: "80%",
  },
  challanInfo: {
    width: "20%",
    textAlign: "right",
    flexDirection: "row",
    justifyContent: "center",
  },
  companyName: {
    fontSize: 16,
    fontWeight: "heavy",
    fontFamily: "Helvetica-Bold",
  },
  companyAddress: {
    fontSize: 10,
    marginTop: 2,
    color: "#555",
  },
  title: {
    fontSize: 12,
    fontWeight: "normal",
    textAlign: "center",
    borderBottomWidth: 1,
    borderColor: "#000",
    padding: 2,
  },
  challanDetails: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#000",
    // marginBottom: 10,
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
    // marginBottom: 10,
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#000",
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
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  detailsTitle: {
    fontSize: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
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
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#000",
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
    marginTop: 100,
    padding: 12,
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
});

const TransferChallanPDF = ({ transfer }) => {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd-MMM-yyyy");
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

  const getSignatureSubtitle = () => {
    if (transfer.requestType === "Site Transfer") return "(Receiver)";
    if (transfer.requestType === "Sell") return "(Buyer)";
    return "(Vendor)";
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>
                M/s B. P. C INFRAPROJECTS PVT LTD
              </Text>
              <Text style={styles.companyAddress}>
                Galaxia Mall, Unit - 12, 2nd Floor, Piska More,
              </Text>
              <Text style={styles.companyAddress}>
                Ratu Road Ranchi - 834005
              </Text>
              <Text style={styles.companyAddress}>Contact: +91 9471100887</Text>
            </View>
            <View style={styles.challanInfo}>
              <Image src={logo} style={{ width: 50, height: 50 }} />
            </View>
          </View>

          {/* Tittle */}
          <View>
            <Text style={styles.title}>{getChallanTitle()}</Text>
            {/* <Text style={styles.companyAddress}>
            Date: {formatDate(new Date().toISOString())}
          </Text> */}
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
                  {transfer.requestType === "Site Transfer"
                    ? "Site Transfer"
                    : transfer.requestType === "Sell"
                    ? "Machine Sell"
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
              <Text style={styles.sectionText}>
                Site : {transfer?.currentSite.name}
              </Text>
              <Text style={styles.sectionText}>
                Site Id : {transfer?.currentSite.id}
              </Text>
            </View>

            <View style={styles.toSection}>
              <Text style={styles.sectionTitle}>{getToTitle()}</Text>
              <Text style={styles.sectionName}>
                {transfer.requestType === "Site Transfer"
                  ? transfer.toSite
                  : transfer.requestType === "Sell"
                  ? transfer.buyerName
                  : transfer.scrapVendor}
              </Text>
              {transfer.requestType === "Sell" && (
                <>
                  <Text style={styles.sectionText}>
                    Contact: {transfer.buyerContact || "N/A"}
                  </Text>
                  {transfer.buyerAddress && (
                    <Text style={styles.sectionText}>
                      {transfer.buyerAddress}
                    </Text>
                  )}
                </>
              )}
              {transfer.requestType === "Scrap" && (
                <>
                  <Text style={styles.sectionText}>
                    Contact: {transfer.scrapVendorContact || "N/A"}
                  </Text>
                  {transfer.scrapVendorAddress && (
                    <Text style={styles.sectionText}>
                      {transfer.scrapVendorAddress}
                    </Text>
                  )}
                </>
              )}
              {transfer.requestType === "Site Transfer" && (
                <>
                  <Text style={styles.sectionText}>
                    Site : {transfer?.destinationSite.name}
                  </Text>
                  <Text style={styles.sectionText}>
                    Site Id : {transfer?.destinationSite.id}
                  </Text>
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
                <Text style={styles.detailsValue}>
                  {transfer.machine.machineName}
                </Text>
              </View>
              <View style={styles.detailsColumn}>
                <Text style={styles.detailsLabel}>Machine ID:</Text>
                <Text style={styles.detailsValue}>{transfer.machineId}</Text>
              </View>
              <View style={styles.detailsColumn}>
                <Text style={styles.detailsLabel}>Model:</Text>
                <Text style={styles.detailsValue}>
                  {transfer.model || "N/A"}
                </Text>
              </View>
              <View style={styles.detailsColumn}>
                <Text style={styles.detailsLabel}>Serial Number:</Text>
                <Text style={styles.detailsValue}>
                  {transfer.serialNumber || "N/A"}
                </Text>
              </View>
            </View>
          </View>

          {/* Transfer Details */}
          <View style={styles.detailsSection}>
            <Text style={styles.detailsTitle}>
              {transfer.requestType === "Site Transfer"
                ? "Transfer Details"
                : transfer.requestType === "Sell"
                ? "Sale Details"
                : "Scrap Details"}
            </Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailsColumn}>
                <Text style={styles.detailsLabel}>Date:</Text>
                <Text style={styles.detailsValue}>
                  {formatDate(transfer.approvedAt)}
                </Text>
              </View>
              <View style={styles.detailsColumn}>
                <Text style={styles.detailsLabel}>Approved By:</Text>
                <Text style={styles.detailsValue}>
                  {transfer?.approver?.name}
                </Text>
              </View>
              {transfer.requestType === "Sell" && (
                <View style={styles.detailsColumn}>
                  <Text style={styles.detailsLabel}>Sale Amount:</Text>
                  <Text style={styles.detailsValue}>
                    {transfer.saleAmount ? `$${transfer.saleAmount}` : "N/A"}
                  </Text>
                </View>
              )}
              {transfer.requestType === "Scrap" && (
                <View style={styles.detailsColumn}>
                  <Text style={styles.detailsLabel}>Scrap Value:</Text>
                  <Text style={styles.detailsValue}>
                    {transfer.scrapValue ? `$${transfer.scrapValue}` : "N/A"}
                  </Text>
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
                <Text style={styles.detailsValue}>
                  {transfer.transportDetails?.vehicleNumber || "N/A"}
                </Text>
              </View>
              <View style={styles.detailsColumnThird}>
                <Text style={styles.detailsLabel}>Driver Name:</Text>
                <Text style={styles.detailsValue}>
                  {transfer.transportDetails?.driverName || "N/A"}
                </Text>
              </View>
              <View style={styles.detailsColumnThird}>
                <Text style={styles.detailsLabel}>Driver Contact:</Text>
                <Text style={styles.detailsValue}>
                  {transfer.transportDetails?.mobileNumber || "N/A"}
                </Text>
              </View>
            </View>
          </View>

          {/* Terms and Conditions */}
          <View style={styles.termsSection}>
            <Text style={styles.termsTitle}>Terms & Conditions:</Text>
            <View style={styles.termsList}>
              <Text style={styles.termsItem}>
                1. This challan must be presented at the time of
                delivery/receipt.
              </Text>
              <Text style={styles.termsItem}>
                2. The receiver must verify all details before accepting the
                machine.
              </Text>
              <Text style={styles.termsItem}>
                3. Any discrepancies must be reported within 24 hours of
                receipt.
              </Text>
              <Text style={styles.termsItem}>
                4. This document serves as proof of{" "}
                {transfer.requestType === "Site Transfer"
                  ? "transfer"
                  : transfer.requestType === "Sell"
                  ? "sale"
                  : "scrapping"}
                .
              </Text>
            </View>
          </View>

          {/* Signatures */}
          <View style={{ flex: 1 }}></View>
          <View style={styles.signatureSection}>
            <View style={styles.signature}>
              <Text style={styles.signatureTitle}>Authorized Signature</Text>
              <Text style={styles.signatureSubtitle}>(Sender)</Text>
            </View>
            <View style={styles.signature}>
              <Text style={styles.signatureTitle}>{getSignatureTitle()}</Text>
              <Text style={styles.signatureSubtitle}>
                {getSignatureSubtitle()}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default TransferChallanPDF;
