import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import { format } from "date-fns"

// Create styles - Note: PDF generation requires StyleSheet from @react-pdf/renderer
// We can't use Tailwind directly in PDFs, but we'll use Tailwind in the UI components
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
  projectDetails: {
    flexDirection: "row",
    marginBottom: 10,
  },
  projectLeft: {
    width: "50%",
  },
  projectRight: {
    width: "50%",
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  detailLabel: {
    width: "35%",
    fontWeight: "bold",
  },
  detailValue: {
    width: "65%",
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
    width: "18%",
    borderTopWidth: 1,
    borderTopColor: "#000",
    paddingTop: 5,
    textAlign: "center",
    fontSize: 7,
  },
  teamText: {
    marginBottom: 20,
    fontWeight: "bold",
  },
  pendingText: {
    fontWeight: "bold",
  },
})

const MaterialRequisitionPDF = ({ formData, items }) => {
  // Calculate total quantity
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>TRIVENI ENGICONS PVT LTD</Text>
            <Text style={styles.companyAddress}>Triveni Engicons Pvt Ltd, 3/6, H. S Tower, L Road,</Text>
            <Text style={styles.companyAddress}>Bistupur, Jamshedpur</Text>
            <Text style={styles.companyAddress}>JAMSHEDPUR</Text>
          </View>
          <View style={styles.locationInfo}>
            <Text style={{ fontWeight: "bold" }}>MARKONA 30547M TO 36247M</Text>
            <Text>SUPERINTENDING ENGINEER MARKONA CANAL</Text>
            <Text>DIVISION, MARKONA</Text>
            <Text>MARKONA</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>MATERIAL REQUISITION SLIP</Text>

        {/* Project Details */}
        <View style={styles.projectDetails}>
          <View style={styles.projectLeft}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Project Name :</Text>
              <Text style={styles.detailValue}>MARKONA 30547M TO 36247M</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Request No. :</Text>
              <Text style={styles.detailValue}>O36-2</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Issue No./Indent No. Date :</Text>
              <Text style={styles.detailValue}>{formData.requisitionNo}</Text>
            </View>
          </View>
          <View style={styles.projectRight}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Location For :</Text>
              <Text style={styles.detailValue}>MARKONA-036</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Request Date :</Text>
              <Text style={styles.detailValue}>
                {format(new Date(formData.date), "dd-MMM-yyyy")} {formData.time}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Department Name :</Text>
              <Text style={styles.detailValue}>MANAGEMENT</Text>
            </View>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { width: "5%" }]}>
              <Text>S. No.</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "8%" }]}>
              <Text>Item code</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "10%" }]}>
              <Text>Part No.</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "27%" }]}>
              <Text>Material Description</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "8%" }]}>
              <Text>Req. Qty</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "8%" }]}>
              <Text>Stock As MR Date</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "8%" }]}>
              <Text>Issue Qty</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "8%" }]}>
              <Text>UOM</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "8%" }]}>
              <Text>Sanction Qty</Text>
            </View>
            <View style={[styles.tableColHeaderLast, { width: "10%" }]}>
              <Text>Remark</Text>
            </View>
          </View>

          {/* Table Body */}
          {items.map((item, index) => (
            <View style={index === items.length - 1 ? styles.tableRowLast : styles.tableRow} key={index}>
              <View style={[styles.tableCol, { width: "5%" }]}>
                <Text>{index + 1}</Text>
              </View>
              <View style={[styles.tableCol, { width: "8%" }]}>
                <Text>{item.itemId}</Text>
              </View>
              <View style={[styles.tableCol, { width: "10%" }]}>
                <Text>{item.partNo || "-"}</Text>
              </View>
              <View style={[styles.tableColLeft, { width: "27%" }]}>
                <Text>{item.itemName}</Text>
                <Text style={styles.pendingText}>[SANCTION : PENDING]</Text>
              </View>
              <View style={[styles.tableCol, { width: "8%" }]}>
                <Text>{item.quantity}</Text>
              </View>
              <View style={[styles.tableCol, { width: "8%" }]}>
                <Text>0.000</Text>
              </View>
              <View style={[styles.tableCol, { width: "8%" }]}>
                <Text>-</Text>
              </View>
              <View style={[styles.tableCol, { width: "8%" }]}>
                <Text>{item.unit}</Text>
              </View>
              <View style={[styles.tableCol, { width: "8%" }]}>
                <Text>0.00</Text>
              </View>
              <View style={[styles.tableColLast, { width: "10%" }]}>
                <Text>
                  {item.issueTo === "vehicle" ? `Vehicle: ${item.vehicleNumber}` : `Site: ${item.siteName || "-"}`}
                </Text>
                <Text>Priority:MEDIUM</Text>
                <Text>Due Date: {format(new Date(), "dd-MMM-yyyy")}</Text>
              </View>
            </View>
          ))}

          {/* Total Row */}
          <View style={styles.totalRow}>
            <View style={[styles.tableCol, { width: "50%", textAlign: "right" }]}>
              <Text>Total</Text>
            </View>
            <View style={[styles.tableCol, { width: "8%" }]}>
              <Text>{totalQuantity}</Text>
            </View>
            <View style={[styles.tableCol, { width: "8%" }]}>
              <Text>-</Text>
            </View>
            <View style={[styles.tableCol, { width: "8%" }]}>
              <Text>-</Text>
            </View>
            <View style={[styles.tableCol, { width: "8%" }]}>
              <Text>-</Text>
            </View>
            <View style={[styles.tableCol, { width: "8%" }]}>
              <Text>0</Text>
            </View>
            <View style={[styles.tableColLast, { width: "10%" }]}>
              <Text></Text>
            </View>
          </View>
        </View>

        {/* Team Text */}
        <Text style={styles.teamText}>NWAY TEAM</Text>

        {/* Footer with signatures */}
        <View style={styles.footer}>
          <View style={styles.signature}>
            <Text>Requisitioner - Name & sign</Text>
          </View>
          <View style={styles.signature}>
            <Text>Approved By - Name & sign</Text>
          </View>
          <View style={styles.signature}>
            <Text>Issuer - Name & sign</Text>
          </View>
          <View style={styles.signature}>
            <Text>Store Manager - Name & sign</Text>
          </View>
          <View style={styles.signature}>
            <Text>Receiver - Name & sign</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default MaterialRequisitionPDF
