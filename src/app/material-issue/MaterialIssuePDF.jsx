import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { format, parseISO } from "date-fns";

// Create styles
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

const MaterialIssuePDF = ({ formData, items }) => {
  // Format date if needed
  const formatDisplayDate = (dateString) => {
    try {
      return format(parseISO(dateString), "dd-MMM-yyyy");
    } catch (error) {
      return dateString;
    }
  };

  // Calculate total quantity
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  // Determine if it's a transfer or consumption
  const isTransfer =
    formData.issueType === "Site Transfer" ||
    (formData.toSite && formData.toSite !== "");

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
            <Text>Issue No: {formData.issueNo}</Text>
            <Text>Date: {formatDisplayDate(formData.issueDate)}</Text>
            <Text>Time: {formData.issueTime}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>
          {isTransfer ? "STOCK TRANSFER NOTE" : "MATERIAL ISSUE SLIP"}
        </Text>

        {/* From/To Sections */}
        <View style={styles.sectionContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>From</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Site:</Text>
              <Text style={styles.value}>{formData.fromSite}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Location:</Text>
              <Text style={styles.value}>{formData.fromSite}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>GST No.:</Text>
              <Text style={styles.value}>21AABCT4589R1ZP</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Contact Person:</Text>
              <Text style={styles.value}>SUKUMAR SAHU</Text>
            </View>
          </View>
          <View style={styles.sectionRight}>
            <Text style={styles.sectionTitle}>To</Text>
            {isTransfer ? (
              <>
                <View style={styles.row}>
                  <Text style={styles.label}>Site:</Text>
                  <Text style={styles.value}>{formData.toSite}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Location:</Text>
                  <Text style={styles.value}>{formData.toSite}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>GST No.:</Text>
                  <Text style={styles.value}>20AABCT4589R1ZR</Text>
                </View>
              </>
            ) : (
              // For consumption issues, show the issue destination
              <View style={styles.row}>
                <Text style={styles.label}>
                  {items[0]?.issueTo?.toLowerCase()?.includes("vehicle")
                    ? "Vehicle:"
                    : "Issue To:"}
                </Text>
                <Text style={styles.value}>{items[0]?.issueTo || "N/A"}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Note */}
        <View style={styles.noteBox}>
          <Text style={styles.noteText}>
            We are dispatching the following items basis for OUR OWN USE and Not
            For Sale/Resale.
          </Text>
          <Text style={styles.noteText}>
            And the concerned/Authority are requested to allow uninterrupted
            transport/Non of these materials.
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
              <Text>Part no.</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "8%" }]}>
              <Text>UOM</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "8%" }]}>
              <Text>MR QTY</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "10%" }]}>
              <Text>STN QTY</Text>
            </View>
            <View style={[styles.tableColHeaderLast, { width: "10%" }]}>
              <Text>Remarks</Text>
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
                <Text>{item.itemId || item.Item?.id || "-"}</Text>
              </View>
              <View style={[styles.tableCol, { width: "8%" }]}>
                <Text>{item.Item?.hsnCode || "-"}</Text>
              </View>
              <View style={[styles.tableCol, { width: "30%" }]}>
                <Text>{item.Item?.name || "-"}</Text>
              </View>
              <View style={[styles.tableCol, { width: "10%" }]}>
                <Text>{item.Item?.partNumber || "-"}</Text>
              </View>
              <View style={[styles.tableCol, { width: "8%" }]}>
                <Text>{item.Item?.unitId || "Nos"}</Text>
              </View>
              <View style={[styles.tableCol, { width: "8%" }]}>
                <Text>0</Text>
              </View>
              <View style={[styles.tableCol, { width: "10%" }]}>
                <Text>{item.quantity}</Text>
              </View>
              <View style={[styles.tableColLast, { width: "10%" }]}>
                <Text>-</Text>
              </View>
            </View>
          ))}

          {/* Total Row */}
          <View style={styles.totalRow}>
            <View style={[styles.tableCol, { width: "72%" }]}>
              <Text>Total</Text>
            </View>
            <View style={[styles.tableCol, { width: "8%" }]}>
              <Text>0</Text>
            </View>
            <View style={[styles.tableCol, { width: "10%" }]}>
              <Text>{totalQuantity}</Text>
            </View>
            <View style={[styles.tableColLast, { width: "10%" }]}>
              <Text></Text>
            </View>
          </View>
        </View>

        {/* Narrative */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontWeight: "bold" }}>Narration:</Text>
          <Text>
            Material issued for{" "}
            {isTransfer ? "transfer to " + formData.toSite : "consumption"}
          </Text>
          <Text>Status: {formData.status}</Text>
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

export default MaterialIssuePDF;
