import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { format } from "date-fns";

// Create styles - Note: PDF generation requires StyleSheet from @react-pdf/renderer
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
  statusText: {
    fontWeight: "bold",
  }
});

const MaterialRequisitionPDF = ({ formData, items }) => {
  // Calculate total quantity
  const totalQuantity = items.reduce((sum, item) => sum + Number(item.quantity), 0);
  
  // Format date safely
  const formatDateSafe = (dateString) => {
    try {
      return format(new Date(dateString), "dd-MMM-yyyy");
    } catch (error) {
      return dateString || "-";
    }
  };

  const getSanctionStatus = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "APPROVED";
      case "rejected":
        return "REJECTED";
      default:
        return "PENDING";
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>M/s B. P. C INFRAPROJECTS PVT LTD</Text>
            <Text style={styles.companyAddress}>Galaxia Mall, Unit - 12, 2nd Floor, Piska More, Ratu Road</Text>
            <Text style={styles.companyAddress}>Ranchi - 834005</Text>
          </View>
          <View style={styles.locationInfo}>
            <Text style={{ fontWeight: "bold" }}>{formData.requestingSite?.name || "N/A"}</Text>
            <Text>SITE CODE: {formData.requestingSite?.code || "N/A"}</Text>
            <Text>CONTACT: {formData.requestingSite?.mobileNumber || "N/A"}</Text>
            <Text>{formData.requestingSite?.address || "N/A"}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>MATERIAL REQUISITION SLIP</Text>

        {/* Project Details */}
        <View style={styles.projectDetails}>
          <View style={styles.projectLeft}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Site Name:</Text>
              <Text style={styles.detailValue}>{formData.requestingSite?.name || "N/A"}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Requisition No.:</Text>
              <Text style={styles.detailValue}>{formData.requisitionNo}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status:</Text>
              <Text style={styles.detailValue}>{formData.status}</Text>
            </View>
          </View>
          <View style={styles.projectRight}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Location:</Text>
              <Text style={styles.detailValue}>{formData.requestingSite?.address || "N/A"}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Request Date:</Text>
              <Text style={styles.detailValue}>
                {formatDateSafe(formData.requestedAt)} {formData.time || ""}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Charge Type:</Text>
              <Text style={styles.detailValue}>{formData.chargeType}</Text>
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
              <Text>Item ID</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "10%" }]}>
              <Text>Part No.</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "24%" }]}>
              <Text>Material Description</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "8%" }]}>
              <Text>HSN Code</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "8%" }]}>
              <Text>Req. Qty</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "8%" }]}>
              <Text>Issue Qty</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "8%" }]}>
              <Text>UOM</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "8%" }]}>
              <Text>Group</Text>
            </View>
            <View style={[styles.tableColHeaderLast, { width: "13%" }]}>
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
                <Text>{item.id || "-"}</Text>
              </View>
              <View style={[styles.tableCol, { width: "10%" }]}>
                <Text>{item.Item?.partNumber || "-"}</Text>
              </View>
              <View style={[styles.tableColLeft, { width: "24%" }]}>
                <Text>{item.Item?.name || "-"}</Text>
                <Text style={styles.statusText}>[SANCTION: {getSanctionStatus(formData.status)}]</Text>
              </View>
              <View style={[styles.tableCol, { width: "8%" }]}>
                <Text>{item.Item?.hsnCode || "-"}</Text>
              </View>
              <View style={[styles.tableCol, { width: "8%" }]}>
                <Text>{item.quantity}</Text>
              </View>
              <View style={[styles.tableCol, { width: "8%" }]}>
                <Text>-</Text>
              </View>
              <View style={[styles.tableCol, { width: "8%" }]}>
                <Text>{getUnitName(item.Item?.unitId)}</Text>
              </View>
              <View style={[styles.tableCol, { width: "8%" }]}>
                <Text>{getGroupName(item.Item?.itemGroupId)}</Text>
              </View>
              <View style={[styles.tableColLast, { width: "13%" }]}>
                <Text>Site: {formData.requestingSite?.name || "-"}</Text>
                <Text>Priority: {formData.requestPriority}</Text>
                <Text>Due Date: {formatDateSafe(formData.dueDate)}</Text>
              </View>
            </View>
          ))}

          {/* Total Row */}
          <View style={styles.totalRow}>
            <View style={[styles.tableCol, { width: "47%", textAlign: "right" }]}>
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
            <View style={[styles.tableColLast, { width: "21%" }]}>
              <Text></Text>
            </View>
          </View>
        </View>

        {/* Team Text */}
        <Text style={styles.teamText}>B.P.C INFRAPROJECTS TEAM</Text>

        {/* Footer with signatures */}
        <View style={styles.footer}>
          <View style={styles.signature}>
            <Text>Requisitioner</Text>
            <Text>{formData.preparedBy?.name || "N/A"}</Text>
          </View>
          <View style={styles.signature}>
            <Text>Approved By</Text>
            <Text>{formData.approvedBy?.name || "N/A"}</Text>
          </View>
          <View style={styles.signature}>
            <Text>Issuer</Text>
            <Text></Text>
          </View>
          <View style={styles.signature}>
            <Text>Store Manager</Text>
            <Text></Text>
          </View>
          <View style={styles.signature}>
            <Text>Receiver</Text>
            <Text>{formData.receivedBy?.name || "N/A"}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// Helper functions to get unit and group information
const getUnitName = (unitId) => {
  if (!unitId) return "-";
  
  // In a real implementation, this would look up the unit in the Redux store
  // Since we don't have access to the complete Redux store here, we'll just return a placeholder
  // In the actual component, this should be replaced with proper unit lookup
  const unitMap = {
    1: "KG",
    2: "PCS",
    3: "BOX",
    4: "BAG",
    5: "MTR",
    6: "SET",
    7: "PKT"
  };
  
  return unitMap[unitId] || "Unit";
};

const getGroupName = (groupId) => {
  if (!groupId) return "-";
  
  // In a real implementation, this would look up the group in the Redux store
  // Since we don't have access to the complete Redux store here, we'll just return a placeholder
  // In the actual component, this should be replaced with proper group lookup
  const groupMap = {
    1: "Construction",
    2: "Electrical",
    3: "Safety",
    4: "Tools",
    5: "Measuring",
    6: "Paint",
    7: "Plumbing",
    8: "Hardware"
  };
  
  return groupMap[groupId] || "Group";
};

export default MaterialRequisitionPDF;