import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { format } from "date-fns";

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
  },
  section: {
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    borderBottom: "1px solid #cccccc",
    paddingBottom: 20,
  },
  logo: {
    width: 100,
    height: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 5,
  },
  table: {
    display: "table",
    width: "100%",
    marginVertical: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#cccccc",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeaderRow: {
    backgroundColor: "#f2f2f2",
    flexDirection: "row",
  },
  tableCol: {
    padding: 5,
    borderStyle: "solid",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#cccccc",
  },
  tableHeaderCol: {
    padding: 5,
    fontWeight: "bold",
    borderStyle: "solid",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#cccccc",
  },
  colLabel: {
    width: "30%",
  },
  colValue: {
    width: "70%",
  },
  colFixed: {
    width: "50%",
  },
  divider: {
    height: 1,
    backgroundColor: "#cccccc",
    marginVertical: 10,
  },
  boldText: {
    fontWeight: "bold",
  },
  footer: {
    marginTop: 30,
    borderTop: "1px solid #cccccc",
    paddingTop: 20,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureBlock: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 30,
  },
  signatureLine: {
    width: 200,
    borderBottom: "1px solid #000000",
    marginBottom: 5,
  },
  watermark: {
    position: "absolute",
    top: "40%",
    left: "25%",
    opacity: 0.05,
    transform: "rotate(-30deg)",
    fontSize: 100,
  },
});

const PaymentSlipPDF = ({ payment, invoice, vendor }) => {
  // Format the date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd MMM yyyy");
    } catch (error) {
      return dateString;
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark for status */}
        <Text style={styles.watermark}>
          {payment.status.toUpperCase()}
        </Text>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Payment Slip</Text>
            <Text style={styles.subtitle}>Slip No: {payment.slipNo}</Text>
          </View>
          <View>
            <Text>Company Name</Text>
            <Text>Address Line 1</Text>
            <Text>Address Line 2</Text>
            <Text>Phone: +91 12345 67890</Text>
          </View>
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>Payment Details</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableHeaderCol, styles.colLabel]}>
                <Text>Payment Date</Text>
              </View>
              <View style={[styles.tableCol, styles.colValue]}>
                <Text>{formatDate(payment.paymentDate)}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableHeaderCol, styles.colLabel]}>
                <Text>Payment Status</Text>
              </View>
              <View style={[styles.tableCol, styles.colValue]}>
                <Text>{payment.status}</Text>
              </View>
            </View>
            {payment.paidAt && (
              <View style={styles.tableRow}>
                <View style={[styles.tableHeaderCol, styles.colLabel]}>
                  <Text>Paid On</Text>
                </View>
                <View style={[styles.tableCol, styles.colValue]}>
                  <Text>{formatDate(payment.paidAt)}</Text>
                </View>
              </View>
            )}
            <View style={styles.tableRow}>
              <View style={[styles.tableHeaderCol, styles.colLabel]}>
                <Text>Amount</Text>
              </View>
              <View style={[styles.tableCol, styles.colValue]}>
                <Text style={styles.boldText}>{formatCurrency(payment.amount)}</Text>
              </View>
            </View>
            
            {payment.remarks && (
              <View style={styles.tableRow}>
                <View style={[styles.tableHeaderCol, styles.colLabel]}>
                  <Text>Remarks</Text>
                </View>
                <View style={[styles.tableCol, styles.colValue]}>
                  <Text>{payment.remarks}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Vendor Information */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>Vendor Information</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableHeaderCol, styles.colLabel]}>
                <Text>Vendor Name</Text>
              </View>
              <View style={[styles.tableCol, styles.colValue]}>
                <Text>{vendor?.name || "N/A"}</Text>
              </View>
            </View>
            {vendor?.contactPerson && (
              <View style={styles.tableRow}>
                <View style={[styles.tableHeaderCol, styles.colLabel]}>
                  <Text>Contact Person</Text>
                </View>
                <View style={[styles.tableCol, styles.colValue]}>
                  <Text>{vendor.contactPerson}</Text>
                </View>
              </View>
            )}
            {vendor?.phoneNumber && (
              <View style={styles.tableRow}>
                <View style={[styles.tableHeaderCol, styles.colLabel]}>
                  <Text>Phone Number</Text>
                </View>
                <View style={[styles.tableCol, styles.colValue]}>
                  <Text>{vendor.phoneNumber}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Invoice Information */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>Invoice Information</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableHeaderCol, styles.colLabel]}>
                <Text>Invoice No</Text>
              </View>
              <View style={[styles.tableCol, styles.colValue]}>
                <Text>{invoice?.invoiceNo || "N/A"}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableHeaderCol, styles.colLabel]}>
                <Text>Invoice Date</Text>
              </View>
              <View style={[styles.tableCol, styles.colValue]}>
                <Text>{formatDate(invoice?.invoiceDate)}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableHeaderCol, styles.colLabel]}>
                <Text>Invoice Amount</Text>
              </View>
              <View style={[styles.tableCol, styles.colValue]}>
                <Text>{formatCurrency(invoice?.amount || 0)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payment Declaration */}
        <View style={styles.section}>
          <Text>
            This document serves as confirmation that payment has been 
            {payment.status.toLowerCase() === "paid" ? " made " : " scheduled "} 
            to the above vendor for the specified invoice. 
            {payment.remarks && ` Note: ${payment.remarks}`}
          </Text>
        </View>

        {/* Signature Blocks */}
        <View style={styles.footer}>
          <View style={styles.footerRow}>
            <View style={styles.signatureBlock}>
              <View style={styles.signatureLine}></View>
              <Text>Prepared By</Text>
            </View>
            
            <View style={styles.signatureBlock}>
              <View style={styles.signatureLine}></View>
              <Text>Authorized Signature</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PaymentSlipPDF;
