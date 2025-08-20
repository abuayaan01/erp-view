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
  },
  tableColLast: {
    padding: 5,
  },
  totalRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#000",
    fontWeight: "bold",
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

const ProcurementOrderPDF = ({ formData, items }) => {
  // Format date if needed
  const formatDisplayDate = (dateString) => {
    try {
      return format(parseISO(dateString), "dd-MMM-yyyy");
    } catch (error) {
      return dateString;
    }
  };

  // Calculate total amount
  const totalAmount = items?.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

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
            <Text>PO No: {formData.procurementNo}</Text>
            <Text>Date: {formatDisplayDate(formData.createdAt)}</Text>
            <Text>Expected Delivery: {formatDisplayDate(formData.expectedDelivery)}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>PROCUREMENT ORDER</Text>

        {/* Vendor/Company Sections */}
        <View style={styles.sectionContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vendor Details</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{formData.Vendor?.name}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Contact Person:</Text>
              <Text style={styles.value}>{formData.Vendor?.contactPerson}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{formData.Vendor?.email}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Phone:</Text>
              <Text style={styles.value}>{formData.Vendor?.phone || "N/A"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Address:</Text>
              <Text style={styles.value}>{formData.Vendor?.address}</Text>
            </View>
          </View>
          <View style={styles.sectionRight}>
            <Text style={styles.sectionTitle}>Order Details</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Status:</Text>
              <Text style={styles.value}>{formData.status?.toUpperCase()}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Requisition No:</Text>
              <Text style={styles.value}>{formData.Requisition?.requisitionNo}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>GST No.:</Text>
              <Text style={styles.value}>21AABCT4589R1ZP</Text>
            </View>
          </View>
        </View>

        {/* Note */}
        <View style={styles.noteBox}>
          <Text style={styles.noteText}>
            This Procurement Order is issued for the supply of materials as per the specifications mentioned below.
          </Text>
          <Text style={styles.noteText}>
            Please ensure timely delivery as per the agreed terms and conditions.
          </Text>
        </View>

        {/* Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { width: "8%" }]}>
              <Text>S.No.</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "8%" }]}>
              <Text>Item Code</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "8%" }]}>
              <Text>HSN Code</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "30%" }]}>
              <Text>Material Description</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "10%" }]}>
              <Text>Part No.</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "8%" }]}>
              <Text>UOM</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "8%" }]}>
              <Text>Quantity</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "10%" }]}>
              <Text>Rate (₹)</Text>
            </View>
            <View style={[styles.tableColHeaderLast, { width: "10%" }]}>
              <Text>Amount (₹)</Text>
            </View>
          </View>

          {/* Table Body */}
          {items.map((item, index) => (
            <View
              style={
                index === items.length - 1
                  ? styles.tableRowLast
                  : styles.tableRow
              }
              key={index}
            >
              <View style={[styles.tableCol, { width: "8%" }]}>
                <Text>{index + 1}</Text>
              </View>
              <View style={[styles.tableCol, { width: "8%" }]}>
                <Text>{item.RequisitionItem?.Item?.id || "-"}</Text>
              </View>
              <View style={[styles.tableCol, { width: "8%" }]}>
                <Text>{item.RequisitionItem?.Item?.hsnCode || "-"}</Text>
              </View>
              <View style={[styles.tableCol, { width: "30%" }]}>
                <Text>{item.RequisitionItem?.Item?.name || "-"}</Text>
              </View>
              <View style={[styles.tableCol, { width: "10%" }]}>
                <Text>{item.RequisitionItem?.Item?.partNumber || "-"}</Text>
              </View>
              <View style={[styles.tableCol, { width: "8%" }]}>
                <Text>{item.RequisitionItem?.Item?.Unit?.shortName || "Nos"}</Text>
              </View>
              <View style={[styles.tableCol, { width: "8%" }]}>
                <Text>{item.quantity}</Text>
              </View>
              <View style={[styles.tableCol, { width: "10%" }]}>
                <Text>
                  {parseFloat(item.rate || 0).toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </Text>
              </View>
              <View style={[styles.tableColLast, { width: "10%" }]}>
                <Text>
                  {parseFloat(item.amount || 0).toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </Text>
              </View>
            </View>
          ))}

          {/* Total Row */}
          <View style={styles.totalRow}>
            <View style={[styles.tableCol, { width: "82%" }]}>
              <Text>Total Amount</Text>
            </View>
            <View style={[styles.tableColLast, { width: "18%" }]}>
              <Text>
                ₹{totalAmount.toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* Narration */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontWeight: "bold" }}>Narration:</Text>
          <Text>Procurement order for materials as per requisition</Text>
          <Text>Status: {formData.status}</Text>
          {formData.notes && <Text>Notes: {formData.notes}</Text>}
        </View>

        {/* Footer with signatures */}
        <View style={styles.footer}>
          <View style={styles.signature}>
            <Text>Prepared By</Text>
          </View>
          <View style={styles.signature}>
            <Text>Checked By</Text>
          </View>
          <View style={styles.signature}>
            <Text>Approved By</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ProcurementOrderPDF;
