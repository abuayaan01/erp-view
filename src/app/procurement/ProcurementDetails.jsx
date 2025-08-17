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
  Receipt,
  CreditCard,
  Eye,
  Plus,
  Calendar,
  DollarSign,
  User,
  Activity,
  Paperclip,
  PlusCircle,
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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InvoiceForm from "./InvoiceForm";
import { InvoicePaymentDialog } from "./InvoicePaymentDialog";
import { pdf } from "@react-pdf/renderer";
import ProcurementOrderPDF from "./ProcurementOrderPDF";
import { Spinner } from "@/components/ui/loader";

const ProcurementDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [procurement, setProcurement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  console.log(invoices)

  const handlePaymentCreated = (payment) => {
    setInvoices((prevInvoices) =>
      prevInvoices.map((invoice) =>
        invoice.id === payment.invoiceId
          ? { ...invoice, payments: [...(invoice.payments || []), payment] }
          : invoice
      )
    );
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    try {
      const blob = await pdf(
        <ProcurementOrderPDF data={procurement} />
      ).toBlob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Procurement_Order_${procurement.procurementNo}.pdf`;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      // Handle error (show toast notification, etc.)
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  useEffect(() => {
    const fetchProcurement = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/procurements/${id}`);
        setProcurement(response.data);
        setInvoices(
          response.data.invoices.map((invoice) => {
            return {
              ...invoice,
              vendorName: response.data?.Vendor?.name,
            };
          })
        );
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

      if (invoiceData.files && invoiceData.files.length > 0) {
        invoiceData.files.forEach((file) => {
          formData.append("files", file);
        });
      }

      console.log(invoiceData.files);

      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      // return;

      await api.post("/invoices", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setIsInvoiceDialogOpen(false);
      // Switch to invoices tab after creating invoice
      setActiveTab("invoices");
    } catch (err) {
      console.error("Failed to submit invoice:", err);
    }
  };

  const calculateTotalPayments = (invoice) => {
    return (
      invoice.payments?.reduce(
        (sum, payment) => sum + parseFloat(payment.amount),
        0
      ) || 0
    );
  };

  const getInvoiceStatus = (invoice) => {
    const totalPayments = calculateTotalPayments(invoice);
    const invoiceAmount = parseFloat(invoice.amount);

    if (totalPayments === 0)
      return { status: "Unpaid", color: "bg-red-100 text-red-800" };
    if (totalPayments >= invoiceAmount)
      return { status: "Paid", color: "bg-green-100 text-green-800" };
    return { status: "Partial", color: "bg-orange-100 text-orange-800" };
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg font-semibold">Error: {error}</p>
          <Button
            variant="outline"
            onClick={() => navigate("/procurements")}
            className="mt-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Procurements
          </Button>
        </div>
      </div>
    );
  }

  if (!procurement) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Procurement not found</p>
          <Button
            variant="outline"
            onClick={() => navigate("/procurements")}
            className="mt-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Procurements
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="rounded-lg shadow-sm mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {procurement.procurementNo}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Created on{" "}
                  {format(new Date(procurement.createdAt), "dd MMM yyyy")}
                </p>
              </div>
              <Badge
                className={`${getStatusColor(
                  procurement.status
                )} px-3 py-1 border`}
              >
                {getStatusIcon(procurement.status)}
                <span className="ml-1 capitalize">{procurement.status}</span>
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="hover:bg-gray-100"
                onClick={handleDownloadPDF}
                disabled={isGeneratingPdf}
              >
                <Download className="h-4 w-4 mr-2" />
                {isGeneratingPdf ? "Generating..." : "Download PDF"}
              </Button>
              <Dialog
                open={isInvoiceDialogOpen}
                onOpenChange={setIsInvoiceDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="hover:bg-blue-50 hover:text-blue-600"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
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
                    <DropdownMenuItem
                      onClick={() => handleStatusUpdate("ordered")}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Order
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
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3 bg-white rounded-lg shadow-sm border">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="items" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Items ({procurement.ProcurementItems.length})
            </TabsTrigger>
            <TabsTrigger value="invoices" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Invoices ({invoices.length})
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Stats */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-600">
                            Total Amount
                          </p>
                          <p className="text-2xl font-bold text-blue-900">
                            ₹
                            {parseFloat(
                              procurement.totalAmount
                            ).toLocaleString()}
                          </p>
                        </div>
                        <DollarSign className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-600">
                            Items
                          </p>
                          <p className="text-2xl font-bold text-green-900">
                            {procurement.ProcurementItems.length}
                          </p>
                        </div>
                        <Package className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-purple-600">
                            Invoices
                          </p>
                          <p className="text-2xl font-bold text-purple-900">
                            {invoices.length}
                          </p>
                        </div>
                        <Receipt className="h-8 w-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Order Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Order Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">
                            Procurement No.
                          </p>
                          <p className="text-lg font-semibold">
                            {procurement.procurementNo}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">
                            Requisition No.
                          </p>
                          <p className="text-lg font-semibold">
                            REQ-{procurement.requisitionId}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">
                            Created Date
                          </p>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <p>
                              {format(
                                new Date(procurement.createdAt),
                                "dd MMM yyyy"
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">
                            Expected Delivery
                          </p>
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-gray-500" />
                            <p>
                              {format(
                                new Date(procurement.expectedDelivery),
                                "dd MMM yyyy"
                              )}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">
                            Status
                          </p>
                          <Badge
                            className={`${getStatusColor(
                              procurement.status
                            )} px-3 py-1 border`}
                          >
                            {getStatusIcon(procurement.status)}
                            <span className="ml-1 capitalize">
                              {procurement.status}
                            </span>
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {procurement.notes && (
                      <div className="mt-6">
                        <p className="text-sm font-medium text-gray-600 mb-2">
                          Notes
                        </p>
                        <div className="bg-gray-50 rounded-lg p-4 border">
                          <p className="text-gray-700">{procurement.notes}</p>
                        </div>
                      </div>
                    )}
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
                    <div className="space-y-4">
                      <div>
                        <p className="font-semibold text-lg ">
                          {procurement.Vendor?.name}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <User className="h-4 w-4" />
                          <span>{procurement.Vendor.contactPerson}</span>
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">
                            {procurement.Vendor.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">
                            {procurement.Vendor.phone}
                          </span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                          <span className="text-gray-700">
                            {procurement.Vendor.address}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Status Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
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
                            {format(
                              new Date(procurement.createdAt),
                              "dd MMM yyyy"
                            )}
                          </p>
                        </div>
                      </div>

                      {procurement.status === "ordered" && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">Approved</p>
                            <p className="text-sm text-gray-600">
                              {format(
                                new Date(procurement.updatedAt),
                                "dd MMM yyyy"
                              )}
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
                              {format(
                                new Date(procurement.updatedAt),
                                "dd MMM yyyy"
                              )}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Items Tab */}
          <TabsContent value="items">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Items ({procurement.ProcurementItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="min-w-full rounded-lg border">
                    <div className="grid grid-cols-12 p-4 border-b font-medium text-sm">
                      <div className="col-span-5">Item</div>
                      <div className="col-span-2 text-center">Quantity</div>
                      <div className="col-span-2 text-center">Rate</div>
                      <div className="col-span-3 text-right">Amount</div>
                    </div>
                    {procurement.ProcurementItems.map((item, index) => (
                      <div
                        key={item.id}
                        className={`grid grid-cols-12 p-4 border-b last:border-b-0 hover:bg-gray-50 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }`}
                      >
                        <div className="col-span-5">
                          <p className="font-medium ">
                            {item.RequisitionItem.Item?.name}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {item.RequisitionItem.Item.shortName}
                          </p>
                        </div>
                        <div className="col-span-2 text-center">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                            {item.quantity}{" "}
                            {item.RequisitionItem.Item.Unit.shortName}
                          </span>
                        </div>
                        <div className="col-span-2 text-center">
                          <span className="font-medium">
                            ₹{parseFloat(item.rate).toFixed(2)}
                          </span>
                        </div>
                        <div className="col-span-3 text-right">
                          <span className="font-semibold text-green-600">
                            ₹{parseFloat(item.amount).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <div className="bg-gray-50 rounded-lg p-4 min-w-[200px]">
                    <p className="text-xl font-bold text-gray-900">
                      Total: ₹
                      {parseFloat(procurement.totalAmount).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5" />
                    Invoices ({invoices.length})
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {invoices.length === 0 ? (
                  <div className="text-center py-12">
                    <Receipt className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-2">
                      No invoices yet
                    </p>
                    <p className="text-gray-400 text-sm mb-4">
                      Add your first invoice to start tracking payments
                    </p>
                    <Dialog
                      open={isInvoiceDialogOpen}
                      onOpenChange={setIsInvoiceDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button>
                          <PlusCircle className="h-4 w-4 mr-2" />
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
                  </div>
                ) : (
                  <div className="space-y-6">
                    {invoices.map((invoice) => {
                      const invoiceStatus = getInvoiceStatus(invoice);
                      const totalPayments = calculateTotalPayments(invoice);
                      const remainingAmount =
                        parseFloat(invoice.amount) - totalPayments;
                      const paymentProgress =
                        (totalPayments / parseFloat(invoice.amount)) * 100;

                      return (
                        <div
                          key={invoice.id}
                          className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                          {/* Header Section */}
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <Receipt className="h-6 w-6 text-blue-600" />
                                <h3 className="text-xl font-semibold text-gray-900">
                                  Invoice #{invoice.invoiceNumber}
                                </h3>
                                <Badge
                                  className={`${invoiceStatus.color} px-3 py-1`}
                                >
                                  {invoiceStatus.status}
                                </Badge>
                              </div>

                              {/* Invoice Metadata */}
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                                <div>
                                  <p className="text-gray-600 mb-1">
                                    Invoice Date
                                  </p>
                                  <p className="font-medium">
                                    {format(
                                      new Date(invoice.invoiceDate),
                                      "dd MMM yyyy"
                                    )}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-600 mb-1">Created</p>
                                  <p className="font-medium">
                                    {format(
                                      new Date(invoice.createdAt),
                                      "dd MMM yyyy"
                                    )}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-600 mb-1">
                                    Last Updated
                                  </p>
                                  <p className="font-medium">
                                    {format(
                                      new Date(invoice.updatedAt),
                                      "dd MMM yyyy"
                                    )}
                                  </p>
                                </div>
                              </div>

                              {/* Notes Section */}
                              {invoice.notes && (
                                <div className="mb-4">
                                  <p className="text-gray-600 text-sm mb-1">
                                    Notes
                                  </p>
                                  <p className="text-gray-800 bg-gray-50 p-2 rounded text-sm">
                                    {invoice.notes}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 ml-4">
                              <InvoicePaymentDialog
                                invoice={invoice}
                                onPaymentCreated={handlePaymentCreated}
                              />
                            </div>
                          </div>

                          {/* Financial Summary */}
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <p className="text-blue-600 text-sm font-medium mb-1">
                                Invoice Amount
                              </p>
                              <p className="text-2xl font-bold text-blue-700">
                                ₹
                                {parseFloat(invoice.amount).toLocaleString(
                                  "en-IN"
                                )}
                              </p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                              <p className="text-green-600 text-sm font-medium mb-1">
                                Paid Amount
                              </p>
                              <p className="text-2xl font-bold text-green-700">
                                ₹{totalPayments.toLocaleString("en-IN")}
                              </p>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg">
                              <p className="text-red-600 text-sm font-medium mb-1">
                                Outstanding
                              </p>
                              <p className="text-2xl font-bold text-red-700">
                                ₹{remainingAmount.toLocaleString("en-IN")}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-gray-600 text-sm font-medium mb-1">
                                Progress
                              </p>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{
                                      width: `${Math.min(
                                        paymentProgress,
                                        100
                                      )}%`,
                                    }}
                                  />
                                </div>
                                <span className="text-sm font-medium">
                                  {Math.round(paymentProgress)}%
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* File Attachments */}
                          {invoice.files && (
                            <div className="mb-6">
                              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                                <Paperclip className="h-4 w-4" />
                                Attachments
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {invoice?.files && (
                                  <Button
                                    key={invoice?.files}
                                    variant="outline"
                                    size="sm"
                                    className="text-blue-600 hover:text-blue-700"
                                    // asChild
                                  >
                                    <a
                                      href={invoice?.files?.files}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center text-sm gap-1"
                                    >
                                      <FileText className="h-8 w-8" />
                                      View Attachments
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Payment History */}
                          {invoice.payments && invoice.payments.length > 0 && (
                            <div className="border-t pt-6">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                                  <CreditCard className="h-5 w-5 text-gray-600" />
                                  Payment History
                                  <Badge variant="secondary" className="ml-2">
                                    {invoice.payments.length} payment
                                    {invoice.payments.length !== 1 ? "s" : ""}
                                  </Badge>
                                </h4>
                              </div>

                              <div className="space-y-3">
                                {invoice.payments
                                  .sort(
                                    (a, b) =>
                                      new Date(b.paymentDate) -
                                      new Date(a.paymentDate)
                                  )
                                  .map((payment) => (
                                    <div
                                      key={payment.id}
                                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                                    >
                                      <div className="flex items-center gap-4">
                                        <div
                                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                            payment.status === "COMPLETED"
                                              ? "bg-green-100"
                                              : "bg-orange-100"
                                          }`}
                                        >
                                          <CreditCard
                                            className={`h-5 w-5 ${
                                              payment.status === "COMPLETED"
                                                ? "text-green-600"
                                                : "text-orange-600"
                                            }`}
                                          />
                                        </div>
                                        <div className="flex-1">
                                          <div className="flex items-center gap-3 mb-1">
                                            <p className="font-semibold text-lg text-gray-900">
                                              ₹
                                              {parseFloat(
                                                payment.amount
                                              ).toLocaleString("en-IN")}
                                            </p>
                                            <Badge
                                              variant={
                                                payment.status === "COMPLETED"
                                                  ? "success"
                                                  : "warning"
                                              }
                                            >
                                              {payment.status}
                                            </Badge>
                                          </div>
                                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                            <div>
                                              <span className="font-medium">
                                                Method:
                                              </span>{" "}
                                              {payment.paymentMethod}
                                            </div>
                                            <div>
                                              <span className="font-medium">
                                                Date:
                                              </span>{" "}
                                              {format(
                                                new Date(payment.paymentDate),
                                                "dd MMM yyyy"
                                              )}
                                            </div>
                                            <div>
                                              <span className="font-medium">
                                                Reference:
                                              </span>{" "}
                                              {payment.referenceNumber}
                                            </div>
                                            <div>
                                              <span className="font-medium">
                                                Created:
                                              </span>{" "}
                                              {format(
                                                new Date(payment.createdAt),
                                                "dd MMM yyyy"
                                              )}
                                            </div>
                                          </div>
                                          {payment.remarks && (
                                            <p className="text-sm text-gray-600 mt-2 italic">
                                              "{payment.remarks}"
                                            </p>
                                          )}
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        {payment.slipUrl && (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            // asChild
                                          >
                                            <a
                                              href={payment.slipUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="flex items-center gap-1"
                                            >
                                              <Download className="h-4 w-4" />
                                              Receipt
                                            </a>
                                          </Button>
                                        )}
                                        {/* <Button variant="ghost" size="sm">
                                          <MoreVertical className="h-4 w-4" />
                                        </Button> */}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}

                          {/* Empty Payment State */}
                          {(!invoice.payments ||
                            invoice.payments.length === 0) && (
                            <div className="border-t pt-6">
                              <div className="text-center py-8 bg-gray-50 rounded-lg">
                                <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 mb-2">
                                  No payments recorded
                                </p>
                                <p className="text-gray-400 text-sm">
                                  Add a payment to track progress on this
                                  invoice
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProcurementDetails;
