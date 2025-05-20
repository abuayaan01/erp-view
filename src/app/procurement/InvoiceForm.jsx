"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api/api-service";

const InvoiceForm = () => {
  const { procurementId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [procurement, setProcurement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [invoice, setInvoice] = useState({
    procurementId: procurementId,
    invoiceNumber: "",
    invoiceDate: "",
    amount: 0,
    notes: "",
    file: null,
  });
  const [filePreview, setFilePreview] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // const response = await api.get(`/procurements/${procurementId}`);
        // setProcurement(response.data);
        setProcurement({
          id: 101,
          procurementNo: "PROC-2025-0005",
          expectedDeliveryDate: "2025-05-25T00:00:00.000Z",
          createdAt: "2025-05-15T12:30:00.000Z",
          vendor: {
            id: 11,
            name: "ABC Supplies Pvt. Ltd.",
          },
          requisition: {
            id: 55,
            requisitionNo: "REQ-2025-0234",
          },
          items: [
            {
              id: 1,
              name: "Mild Steel Rods",
              quantity: 50,
              rate: 1200,
              amount: 60000,
            },
            {
              id: 2,
              name: "Bearing Set",
              quantity: 10,
              rate: 4500,
              amount: 45000,
            },
            {
              id: 3,
              name: "Lubricant Oil Can",
              quantity: 20,
              rate: 500,
              amount: 10000,
            },
          ],
        });

        // Set default invoice amount based on procurement total
        const totalAmount =
          response.data.items?.reduce(
            (sum, item) => sum + (item.amount || 0),
            0
          ) || 0;

        setInvoice((prev) => ({
          ...prev,
          amount: totalAmount,
        }));
      } catch (error) {
        toast({
          title: "Error",
          description:
            error.response?.data?.message || "Failed to load procurement data",
          variant: "destructive",
        });
        // navigate("/procurements/list");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [procurementId, navigate, toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoice((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInvoice((prev) => ({
        ...prev,
        file: file,
      }));

      // Create a preview URL for the file
      const fileUrl = URL.createObjectURL(file);
      setFilePreview({
        name: file.name,
        type: file.type,
        size: file.size,
        url: fileUrl,
      });
    }
  };

  const clearFile = () => {
    setInvoice((prev) => ({
      ...prev,
      file: null,
    }));

    if (filePreview?.url) {
      URL.revokeObjectURL(filePreview.url);
    }
    setFilePreview(null);
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!invoice.invoiceNumber.trim()) {
      toast({
        title: "Error",
        description: "Invoice number is required",
        variant: "destructive",
      });
      return;
    }

    if (!invoice.invoiceDate) {
      toast({
        title: "Error",
        description: "Invoice date is required",
        variant: "destructive",
      });
      return;
    }

    if (invoice.amount <= 0) {
      toast({
        title: "Error",
        description: "Invoice amount must be greater than zero",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);

      // Create FormData if there's a file to upload
      let requestData = invoice;

      if (invoice.file) {
        const formData = new FormData();
        formData.append("procurementId", invoice.procurementId);
        formData.append("invoiceNumber", invoice.invoiceNumber);
        formData.append("invoiceDate", invoice.invoiceDate);
        formData.append("amount", invoice.amount);
        formData.append("notes", invoice.notes);
        formData.append("file", invoice.file);

        requestData = formData;
      }

      const response = await api.post("/invoices", requestData, {
        headers: invoice.file
          ? {
              "Content-Type": "multipart/form-data",
            }
          : {},
      });

      if (response.status) {
        toast({
          title: "Success",
          description: "Invoice added successfully",
        });

        // Navigate to payment form for this invoice
        navigate(`/payment/${response.data.id}`);
      } else {
        toast({
          title: "Error",
          description: response.data?.message || "Failed to add invoice",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add invoice",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return dateString || "-";
    }
  };

  const getVendorName = () => {
    return procurement?.vendor?.name || "Unknown Vendor";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/procurements/list")}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Add Invoice for Procurement: {procurement?.procurementNo}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Procurement Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Procurement No
                  </p>
                  <p className="font-medium">{procurement?.procurementNo}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Requisition No
                  </p>
                  <p className="font-medium">
                    {procurement?.requisition?.requisitionNo || "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Vendor</p>
                  <p className="font-medium">{getVendorName()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Created Date</p>
                  <p className="font-medium">
                    {formatDate(procurement?.createdAt)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Expected Delivery
                  </p>
                  <p className="font-medium">
                    {formatDate(procurement?.expectedDeliveryDate)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-medium">
                    ₹
                    {procurement?.items
                      ?.reduce((sum, item) => sum + (item.amount || 0), 0)
                      .toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber">Invoice Number*</Label>
                  <Input
                    id="invoiceNumber"
                    name="invoiceNumber"
                    value={invoice.invoiceNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invoiceDate">Invoice Date*</Label>
                  <Input
                    id="invoiceDate"
                    name="invoiceDate"
                    type="date"
                    value={invoice.invoiceDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₹)*</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={invoice.amount}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    name="notes"
                    value={invoice.notes}
                    onChange={handleInputChange}
                    placeholder="Add any additional notes here..."
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="file">Upload Invoice (Optional)</Label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div
                        className={`border-2 border-dashed rounded-md p-6 ${
                          filePreview
                            ? "border-green-500 bg-green-50"
                            : "border-gray-300"
                        } flex flex-col items-center justify-center cursor-pointer`}
                        onClick={() =>
                          document.getElementById("file-upload").click()
                        }
                      >
                        <input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                          accept=".pdf,.png,.jpg,.jpeg"
                        />
                        {filePreview ? (
                          <div className="flex flex-col items-center">
                            <p className="text-sm font-medium">
                              {filePreview.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatBytes(filePreview.size)}
                            </p>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-sm font-medium">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PDF, PNG, JPG or JPEG (max. 10MB)
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    {filePreview && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={clearFile}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove file</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="mr-2 h-4 w-4" />
              {submitting ? "Saving..." : "Save Invoice & Create Payment"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;
