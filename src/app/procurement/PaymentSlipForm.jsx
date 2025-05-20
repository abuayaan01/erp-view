"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, CheckCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import api from "@/services/api/api-service";

// Form validation schema
const paymentFormSchema = z.object({
  invoiceId: z.string({
    required_error: "Please select an invoice",
  }),
  paymentDate: z.date({
    required_error: "Payment date is required",
  }),
  amount: z.coerce
    .number()
    .min(0.01, "Amount must be greater than 0")
    .nonnegative("Amount cannot be negative"),
  remarks: z.string().optional(),
});

const PaymentSlipForm = () => {
  const { id } = useParams(); // If editing existing payment or creating from an invoice
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // State to track if we're creating from a specific invoice
  const [isFromInvoice, setIsFromInvoice] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [generatedPaymentSlip, setGeneratedPaymentSlip] = useState(null);

  // Initialize form
  const form = useForm({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      invoiceId: "",
      paymentDate: new Date(),
      amount: 0,
      remarks: "",
    },
  });

  useEffect(() => {
    const initialSetup = async () => {
      try {
        setLoading(true);
        
        // Check if we're coming from an invoice
        const isInvoicePayment = location.pathname.includes("invoice");
        setIsFromInvoice(isInvoicePayment);
        
        // Fetch unpaid invoices
        const response = await api.get("/invoices", {
          params: { status: "unpaid" }
        });
        
        if (response.status && response.data) {
          setInvoices(response.data.items || []);
          
          // If we have an ID, it means we're creating from a specific invoice
          if (id && isInvoicePayment) {
            const invoice = response.data.items.find(inv => inv.id === id);
            if (invoice) {
              setSelectedInvoice(invoice);
              form.setValue("invoiceId", invoice.id);
              form.setValue("amount", invoice.amount);
            } else {
              toast({
                title: "Invoice Not Found",
                description: "The invoice you're trying to pay was not found.",
                variant: "destructive",
              });
            //   navigate("/payments");
            }
          }
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch invoices",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to load form data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    initialSetup();
  }, [id, location.pathname, toast, navigate, form]);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      
      const response = await api.post("/payments", {
        ...data,
        paymentDate: format(data.paymentDate, "yyyy-MM-dd"),
        status: "Pending" 
      });
      
      if (response.status && response.data) {
        toast({
          title: "Success",
          description: "Payment slip created successfully",
        });
        
        setGeneratedPaymentSlip(response.data);
        
        // If user doesn't want to download/print, they can navigate away
        // navigate("/payments");
      } else {
        toast({
          title: "Error",
          description: response.data?.message || "Failed to create payment slip",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create payment slip",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInvoiceChange = (invoiceId) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      setSelectedInvoice(invoice);
      form.setValue("amount", invoice.amount);
    }
  };

  const handleDownloadPaymentSlip = async () => {
    if (!generatedPaymentSlip) return;
    
    try {
      setIsGeneratingPdf(true);
      const response = await api.get(`/payments/${generatedPaymentSlip.id}/download`, {
        responseType: 'blob'
      });
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payment-slip-${generatedPaymentSlip.slipNo}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download payment slip",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleViewAllPayments = () => {
    navigate("/payments");
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
            onClick={() => navigate("/payments")}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {generatedPaymentSlip ? "Payment Slip Generated" : "Create Payment Slip"}
          </h1>
        </div>
      </div>

      {!generatedPaymentSlip ? (
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="invoiceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice</FormLabel>
                      <Select
                        disabled={isFromInvoice}
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleInvoiceChange(value);
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an invoice" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {invoices.map((invoice) => (
                            <SelectItem key={invoice.id} value={invoice.id}>
                              {invoice.invoiceNo} - {invoice.vendor?.name} (₹{invoice.amount.toLocaleString('en-IN')})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select an unpaid invoice to generate payment slip
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedInvoice && (
                  <div className="bg-gray-50 p-4 rounded-md space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Invoice Number</p>
                        <p className="font-medium">{selectedInvoice.invoiceNo}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Vendor</p>
                        <p className="font-medium">{selectedInvoice.vendor?.name || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Invoice Date</p>
                        <p className="font-medium">
                          {selectedInvoice.invoiceDate ? format(new Date(selectedInvoice.invoiceDate), "dd MMM yyyy") : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Invoice Amount</p>
                        <p className="font-medium">₹{selectedInvoice.amount.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="paymentDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Payment Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Date when the payment is scheduled
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter amount"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Payment amount in rupees
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remarks (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Add any remarks or notes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={submitting || !selectedInvoice}
                  >
                    {submitting ? "Generating..." : "Generate Payment Slip"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Payment Slip Generated Successfully</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 border border-green-200 p-4 rounded-md mb-6 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-green-800">
                Payment slip has been generated successfully.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Payment Slip No</p>
                  <p className="font-medium">{generatedPaymentSlip.slipNo}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Invoice Number</p>
                  <p className="font-medium">{selectedInvoice?.invoiceNo || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Vendor</p>
                  <p className="font-medium">{selectedInvoice?.vendor?.name || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Payment Date</p>
                  <p className="font-medium">
                    {format(form.getValues("paymentDate"), "dd MMM yyyy")}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium">₹{Number(form.getValues("amount")).toLocaleString('en-IN')}</p>
                </div>
                {form.getValues("remarks") && (
                  <div className="space-y-1 col-span-2">
                    <p className="text-sm text-muted-foreground">Remarks</p>
                    <p className="font-medium">{form.getValues("remarks")}</p>
                  </div>
                )}
              </div>

              <div className="pt-6 flex flex-col sm:flex-row gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={handleViewAllPayments}
                >
                  View All Payments
                </Button>
                <Button
                  onClick={handleDownloadPaymentSlip}
                  disabled={isGeneratingPdf}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {isGeneratingPdf ? "Downloading..." : "Download Payment Slip"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PaymentSlipForm;