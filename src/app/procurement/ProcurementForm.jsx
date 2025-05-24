"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Plus, Trash } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api/api-service";

const ProcurementForm = () => {
  const { requisitionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [requisition, setRequisition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [procurement, setProcurement] = useState({
    requisitionId: requisitionId,
    vendor: {
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: ""
    },
    expectedDeliveryDate: "",
    notes: "",
    items: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch requisition data
        const requisitionRes = await api.get(`/requisitions/${requisitionId}`);
        
        // Check if requisition is approved
        if (requisitionRes.data?.status?.toLowerCase() !== "approved") {
          toast({
            title: "Error",
            description: "Only approved requisitions can be procured",
            variant: "destructive",
          });
          // navigate("/requisitions");
          return;
        }
        
        setRequisition(requisitionRes.data);
        
        // Initialize procurement items based on requisition items
        const initialItems = requisitionRes.data.items.map(item => ({
          itemId: item.Item.id,
          name: item.Item.name,
          quantity: item.quantity,
          rate: 0,
          amount: 0,
          unitId: item.Item.unitId,
          unitName: item.Item.unitName || "",
        }));
        
        setProcurement(prev => ({
          ...prev,
          items: initialItems
        }));
        
      } catch (error) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to load data",
          variant: "destructive",
        });
        // navigate("/requisitions");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [requisitionId, navigate, toast]);

  const handleVendorChange = (field, value) => {
    setProcurement(prev => ({
      ...prev,
      vendor: {
        ...prev.vendor,
        [field]: value
      }
    }));
  };

  const handleDateChange = (e) => {
    setProcurement(prev => ({
      ...prev,
      expectedDeliveryDate: e.target.value
    }));
  };

  const handleNotesChange = (e) => {
    setProcurement(prev => ({
      ...prev,
      notes: e.target.value
    }));
  };

  const handleRateChange = (index, value) => {
    const numValue = parseFloat(value) || 0;
    const updatedItems = [...procurement.items];
    updatedItems[index].rate = numValue;
    updatedItems[index].amount = numValue * updatedItems[index].quantity;
    
    setProcurement(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate vendor details
    if (!procurement.vendor.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter vendor name",
        variant: "destructive",
      });
      return;
    }
    
    if (!procurement.vendor.contactPerson.trim()) {
      toast({
        title: "Error",
        description: "Please enter vendor contact person",
        variant: "destructive",
      });
      return;
    }
    
    if (!procurement.vendor.phone.trim()) {
      toast({
        title: "Error",
        description: "Please enter vendor phone number",
        variant: "destructive",
      });
      return;
    }
    
    if (!procurement.expectedDeliveryDate) {
      toast({
        title: "Error",
        description: "Please select an expected delivery date",
        variant: "destructive",
      });
      return;
    }
    
    // Validate rates
    const invalidItems = procurement.items.filter(item => item.rate <= 0);
    if (invalidItems.length > 0) {
      toast({
        title: "Error",
        description: "All items must have a rate greater than zero",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setSubmitting(true);
      
      // const response = await api.post('/procurements', procurement);
      
      // if (response.status) {
        toast({
          title: "Success",
          description: "Procurement created successfully",
        });
        navigate(`/procurements`);
      // } else {
      //   toast({
      //     title: "Error",
      //     description: response.data?.message || "Failed to create procurement",
      //     variant: "destructive",
      //   });
      // }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create procurement",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getTotalAmount = () => {
    return procurement.items.reduce((sum, item) => sum + item.amount, 0);
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
            onClick={() => navigate("/requisitions")}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Create Procurement for Requisition: {requisition?.requisitionNo}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="vendorName">Vendor Name *</Label>
                  <Input
                    id="vendorName"
                    value={procurement.vendor.name}
                    onChange={(e) => handleVendorChange('name', e.target.value)}
                    placeholder="Enter vendor name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact Person *</Label>
                  <Input
                    id="contactPerson"
                    value={procurement.vendor.contactPerson}
                    onChange={(e) => handleVendorChange('contactPerson', e.target.value)}
                    placeholder="Enter contact person name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vendorEmail">Email</Label>
                  <Input
                    id="vendorEmail"
                    type="email"
                    value={procurement.vendor.email}
                    onChange={(e) => handleVendorChange('email', e.target.value)}
                    placeholder="Enter vendor email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vendorPhone">Phone Number *</Label>
                  <Input
                    id="vendorPhone"
                    value={procurement.vendor.phone}
                    onChange={(e) => handleVendorChange('phone', e.target.value)}
                    placeholder="Enter phone number"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="vendorAddress">Address</Label>
                  <Input
                    id="vendorAddress"
                    value={procurement.vendor.address}
                    onChange={(e) => handleVendorChange('address', e.target.value)}
                    placeholder="Enter vendor address"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Procurement Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="expectedDeliveryDate">Expected Delivery Date *</Label>
                  <Input
                    id="expectedDeliveryDate"
                    type="date"
                    value={procurement.expectedDeliveryDate}
                    onChange={handleDateChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={procurement.notes}
                    onChange={handleNotesChange}
                    placeholder="Add any additional notes here..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sr. No</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Rate (₹)</TableHead>
                      <TableHead>Amount (₹)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {procurement.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.quantity} {item.unitName}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.rate}
                            onChange={(e) => handleRateChange(index, e.target.value)}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>₹{item.amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={4} className="text-right font-medium">
                        Total:
                      </TableCell>
                      <TableCell className="font-bold">
                        ₹{getTotalAmount().toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
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
              {submitting ? "Saving..." : "Save Procurement"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProcurementForm;