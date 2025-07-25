import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font
} from '@react-pdf/renderer';
import { format } from 'date-fns';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 20,
    borderBottom: 2,
    borderBottomColor: '#000000',
    paddingBottom: 10
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666666'
  },
  section: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 4
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333'
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4
  },
  label: {
    width: '40%',
    fontWeight: 'bold',
    fontSize: 10
  },
  value: {
    width: '60%',
    fontSize: 10
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000000',
    marginBottom: 20
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row'
  },
  tableHeader: {
    backgroundColor: '#f1f1f1',
    fontWeight: 'bold'
  },
  tableCol: {
    width: '16.66%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000000',
    padding: 5
  },
  tableCell: {
    fontSize: 9,
    textAlign: 'left'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#666666',
    borderTop: 1,
    borderTopColor: '#cccccc',
    paddingTop: 10
  },
  totalSection: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#e8f4f8',
    borderRadius: 4
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right'
  }
});

const ProcurementOrderPDF = ({ data }) => {
  const procurement = data;
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>PROCUREMENT ORDER</Text>
          <Text style={styles.subtitle}>Purchase Order Document</Text>
        </View>

        {/* Procurement Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Procurement Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Procurement No:</Text>
            <Text style={styles.value}>{procurement.procurementNo}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{procurement.status?.toUpperCase()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Order Date:</Text>
            <Text style={styles.value}>
              {format(new Date(procurement.createdAt), 'dd MMM yyyy')}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Expected Delivery:</Text>
            <Text style={styles.value}>
              {format(new Date(procurement.expectedDelivery), 'dd MMM yyyy')}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Requisition No:</Text>
            <Text style={styles.value}>{procurement.Requisition?.requisitionNo}</Text>
          </View>
        </View>

        {/* Vendor Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vendor Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Vendor Name:</Text>
            <Text style={styles.value}>{procurement.Vendor?.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Contact Person:</Text>
            <Text style={styles.value}>{procurement.Vendor?.contactPerson}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{procurement.Vendor?.email}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{procurement.Vendor?.phone || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>{procurement.Vendor?.address}</Text>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          
          <View style={styles.table}>
            {/* Table Header */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Sr. No.</Text>
              </View>
              <View style={[styles.tableCol, { width: '25%' }]}>
                <Text style={styles.tableCell}>Item Name</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Part No.</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Unit</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Quantity</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Rate (₹)</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Amount (₹)</Text>
              </View>
            </View>

            {/* Table Rows */}
            {procurement.ProcurementItems?.map((item, index) => (
              <View style={styles.tableRow} key={item.id}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{index + 1}</Text>
                </View>
                <View style={[styles.tableCol, { width: '25%' }]}>
                  <Text style={styles.tableCell}>
                    {item.RequisitionItem?.Item?.name}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {item.RequisitionItem?.Item?.partNumber || 'N/A'}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {item.RequisitionItem?.Item?.Unit?.shortName}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item.quantity}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {parseFloat(item.rate).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {parseFloat(item.amount).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Total Amount */}
          <View style={styles.totalSection}>
            <View style={styles.row}>
              <Text style={styles.label}>Total Amount:</Text>
              <Text style={styles.totalAmount}>
                ₹{parseFloat(procurement.totalAmount).toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {procurement.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.value}>{procurement.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Generated on {format(new Date(), 'dd MMM yyyy, HH:mm')} | 
            Procurement Order: {procurement.procurementNo}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default ProcurementOrderPDF;
