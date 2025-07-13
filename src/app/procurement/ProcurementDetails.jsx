import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Download,
  Edit,
  Trash2,
  CheckCircle,
  Truck,
  MoreVertical,
  FileText,
  Package,
  Building,
  Phone,
  Mail,
  MapPin,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/services/api/api-service";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { InvoiceForm } from "./InvoiceForm";
import { InvoicePaymentDialog } from "./InvoicePaymentDialog";

const ProcurementDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [procurement, setProcurement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const mockInvoices = [
    {
      id: "inv_001",
      invoiceNumber: "INV-2025-001",
      procurementId: "proc_001",
      procurementNumber: "PR-2025-001",
      vendor: {
        id: "ven_001",
        name: "ABC Suppliers Pvt Ltd",
        contactPerson: "Mr. Rajesh Kumar",
        email: "accounts@abcsuppliers.com",
        phone: "+91 9876543210",
        address: "123 Industrial Area, Mumbai, Maharashtra 400001",
        gstNumber: "22ABCDE1234F1Z5",
      },
      invoiceDate: "2025-01-15T00:00:00.000Z",
      dueDate: "2025-02-15T00:00:00.000Z",
      amount: 125000,
      taxAmount: 18750,
      totalAmount: 143750,
      status: "UNPAID", // UNPAID, PARTIALLY_PAID, PAID
      items: [
        {
          id: "item_001",
          name: "Stainless Steel Pipes",
          description: "304 Grade, 2-inch diameter",
          quantity: 50,
          unit: "meters",
          rate: 2000,
          amount: 100000,
          taxRate: 15,
          taxAmount: 15000,
        },
        {
          id: "item_002",
          name: "PVC Fittings",
          description: "2-inch connectors",
          quantity: 100,
          unit: "pieces",
          rate: 250,
          amount: 25000,
          taxRate: 15,
          taxAmount: 3750,
        },
      ],
      paymentTerms: "Net 30 days",
      notes: "Please include invoice number in payment reference",
      createdAt: "2025-01-10T09:30:00.000Z",
      updatedAt: "2025-01-10T09:30:00.000Z",
    },
  ];

  // Example of how to use in your component:
  const [invoices, setInvoices] = useState(mockInvoices);

  useEffect(() => {
    const fetchProcurement = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/procurements/${id}`);
        setProcurement(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch procurement:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProcurement();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      await api.patch(`/procurements/${id}/status`, { status: newStatus });
      setProcurement((prev) => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "ordered":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "Partial":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4" />;
      case "ordered":
        return <CheckCircle className="h-4 w-4" />;
      case "Delivered":
        return <Truck className="h-4 w-4" />;
      case "Partial":
        return <Package className="h-4 w-4" />;
      case "Cancelled":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleInvoiceSubmit = async (invoiceData) => {
    try {
      const formData = new FormData();
      formData.append("procurementId", invoiceData.procurementId);
      formData.append("invoiceNumber", invoiceData.invoiceNumber);
      formData.append("amount", invoiceData.amount);
      formData.append("invoiceDate", invoiceData.invoiceDate.toISOString());
      formData.append("notes", invoiceData.notes);
      if (invoiceData.file) {
        formData.append("file", invoiceData.file);
      }

      await api.post("/invoices", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setIsInvoiceDialogOpen(false);
      // Optionally refresh procurement data or show success message
    } catch (err) {
      console.error("Failed to submit invoice:", err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">Loading procurement details...</div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!procurement) {
    return <div>Procurement not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/procurements")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
          <h1 className="text-3xl font-bold">{procurement.procurementNo}</h1>
          <Badge
            className={`${getStatusColor(procurement.status)} px-3 py-1 border`}
          >
            {getStatusIcon(procurement.status)}
            <span className="ml-1 capitalize">{procurement.status}</span>
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          {/* <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button> */}
          <Dialog
            open={isInvoiceDialogOpen}
            onOpenChange={setIsInvoiceDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Add Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <InvoiceForm
                procurement={procurement}
                onSave={handleInvoiceSubmit}
              />
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {procurement.status === "Pending" && (
                <DropdownMenuItem onClick={() => handleStatusUpdate("ordered")}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </DropdownMenuItem>
              )}
              {procurement.status === "ordered" && (
                <DropdownMenuItem
                  onClick={() => handleStatusUpdate("Delivered")}
                >
                  <Truck className="h-4 w-4 mr-2" />
                  Mark as Delivered
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleStatusUpdate("Cancelled")}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Cancel Order
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Procurement No.
                  </p>
                  <p className="text-lg font-semibold">
                    {procurement.procurementNo}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Requisition No.
                  </p>
                  <p className="text-lg font-semibold">
                    REQ-{procurement.requisitionId}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Created Date
                  </p>
                  <p>
                    {format(new Date(procurement.createdAt), "dd MMM yyyy")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Expected Delivery
                  </p>
                  <p>
                    {format(
                      new Date(procurement.expectedDelivery),
                      "dd MMM yyyy"
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Amount
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{parseFloat(procurement.totalAmount).toLocaleString()}
                  </p>
                </div>
              </div>

              {procurement.notes && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-600">Notes</p>
                  <p className="mt-1 p-3 bg-gray-50 rounded-md">
                    {procurement.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Items ({procurement.ProcurementItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 bg-gray-50 p-4 border-b font-medium">
                  <div className="col-span-5">Item</div>
                  <div className="col-span-2 text-right">Quantity</div>
                  <div className="col-span-2 text-right">Rate</div>
                  <div className="col-span-3 text-right">Amount</div>
                </div>
                {procurement.ProcurementItems.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 p-4 border-b last:border-b-0"
                  >
                    <div className="col-span-5">
                      <p className="font-medium">
                        {item.RequisitionItem.Item.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.RequisitionItem.Item.shortName}
                      </p>
                    </div>
                    <div className="col-span-2 text-right">
                      {item.quantity} {item.RequisitionItem.Item.Unit.shortName}
                    </div>
                    <div className="col-span-2 text-right">
                      ₹{parseFloat(item.rate).toFixed(2)}
                    </div>
                    <div className="col-span-3 text-right font-semibold">
                      ₹{parseFloat(item.amount).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-end">
                <div className="text-right">
                  <p className="text-xl font-bold">
                    Total: ₹
                    {parseFloat(procurement.totalAmount).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Vendor Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Vendor Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-lg">
                    {procurement.Vendor.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {procurement.Vendor.contactPerson}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{procurement.Vendor.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{procurement.Vendor.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <span>{procurement.Vendor.address}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Status Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Created</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(procurement.createdAt), "dd MMM yyyy")}
                    </p>
                  </div>
                </div>

                {procurement.status === "ordered" && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Ordered</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(procurement.updatedAt), "dd MMM yyyy")}
                      </p>
                    </div>
                  </div>
                )}

                {procurement.status === "Delivered" && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Truck className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Delivered</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(procurement.updatedAt), "dd MMM yyyy")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* {procurement.invoices?.map((invoice) => ( */}
      {invoices?.map((invoice) => (
        <div key={invoice.id} className="border rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{invoice.invoiceNumber}</p>
              <p className="text-sm text-muted-foreground">
                Amount: ₹{parseFloat(invoice.amount).toLocaleString("en-IN")}
              </p>
            </div>
            <div className="flex gap-2">
              <InvoicePaymentDialog invoice={invoice} />
              {invoice.payment && (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={invoice.payment.slipUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    View Slip
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProcurementDetails;
