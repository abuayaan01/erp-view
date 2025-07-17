import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import api from "@/services/api/api-service";
import {
  AlertCircle,
  Calendar,
  Eye,
  FileText,
  Package,
  Plus,
  User
} from "lucide-react";
import { useEffect, useState } from "react";

const ProcurementForm = () => {
  // Get requisition ID from URL params (you can pass this as a prop instead)
  const requisitionId =
    new URLSearchParams(window.location.search).get("requisitionId") || "1";

  const [formData, setFormData] = useState({
    requisitionId: requisitionId,
    vendorId: "",
    expectedDelivery: "",
    notes: "",
  });

  const [requisition, setRequisition] = useState(null);
  const [procurementItems, setProcurementItems] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [showNewVendorForm, setShowNewVendorForm] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingRequisition, setFetchingRequisition] = useState(false);
  const [fetchingVendors, setFetchingVendors] = useState(false);

  // Mock API for demonstration - replace with your actual A

  const navigateBack = () => {
    // Mock navigation - replace with your actual navigation
    console.log("Navigating back to requisitions");
    window.history.back();
  };

  // New vendor form
  const [newVendor, setNewVendor] = useState({
    name: "",
    email: "",
    contactPerson: "",
    address: "",
    // gstNumber: "",
  });

  // Fetch requisition details
  const fetchRequisition = async () => {
    if (!requisitionId) {
      toast({
        title: "Error",
        description: "No requisition ID provided",
        variant: "destructive",
      });
      navigateBack();
      return;
    }

    try {
      setFetchingRequisition(true);
      const response = await api.get(`/requisitions/${requisitionId}`);

      if (response.status && response.data) {
        setRequisition(response.data);

        // Map requisition items to procurement items
        if (response.data.items) {
          const items = response.data.items.map((item) => ({
            id: item.id,
            name: item.Item?.name || "NA",
            partNumber: item.Item?.partNumber || "NA",
            quantity: item.quantity || item.requestedQuantity,
            unitPrice: item.unitPrice || item.estimatedPrice || 0,
            procurementQuantity: item.quantity || item.requestedQuantity,
            rate: item.unitPrice || item.estimatedPrice || 0,
            amount:
              (item.quantity || item.requestedQuantity) *
              (item.unitPrice || item.estimatedPrice || 0),
            unit: item.unit,
          }));
          setProcurementItems(items);
        }

        // Set form data
        setFormData((prev) => ({
          ...prev,
          requisitionId: response.data.id.toString(),
        }));
      } else {
        toast({
          title: "Error",
          description: response.data?.message || "Failed to fetch requisition",
          variant: "destructive",
        });
        navigateBack();
      }
    } catch (error) {
      console.error("Error fetching requisition:", error);
      toast({
        title: "Requisition Not Found",
        description: "The requisition you're looking for doesn't exist.",
        variant: "destructive",
      });
      navigateBack();
    } finally {
      setFetchingRequisition(false);
    }
  };

  // Fetch vendors
  const fetchVendors = async () => {
    try {
      setFetchingVendors(true);
      const response = await api.get('/vendors');
      if (response.status && response.data) {
        setVendors(response.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch vendors",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
      toast({
        title: "Error",
        description: "Failed to fetch vendors",
        variant: "destructive",
      });
    } finally {
      setFetchingVendors(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchRequisition();
    fetchVendors();
  }, [requisitionId]);

  const handleItemUpdate = (itemId, field, value) => {
    setProcurementItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          if (field === "procurementQuantity" || field === "rate") {
            updatedItem.amount =
              updatedItem.procurementQuantity * updatedItem.rate;
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const handleNewVendorSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/vendors", newVendor);

      if (response.status && response.data) {
        const newVendorData = response.data;
        setVendors((prev) => [...prev, newVendorData]);
        setFormData((prev) => ({
          ...prev,
          vendorId: newVendorData.id.toString(),
        }));
        setShowNewVendorForm(false);
        setNewVendor({
          name: "",
          email: "",
          contactPerson: "",
          address: "",
          // gstNumber: "",
        });

        toast({
          title: "Success",
          description: "Vendor created successfully",
        });
      } else {
        toast({
          title: "Error",
          description: response.data?.message || "Failed to create vendor",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating vendor:", error);
      toast({
        title: "Error",
        description: "Failed to create vendor",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const procurementData = {
        requisitionId: parseInt(formData.requisitionId),
        vendorId: parseInt(formData.vendorId),
        expectedDelivery: formData.expectedDelivery,
        notes: formData.notes,
        items: procurementItems.map((item) => ({
          requisitionItemId: item.id,
          quantity: item.procurementQuantity,
          rate: item.rate,
          amount: item.amount,
        })),
        totalAmount: calculateTotal(),
      };

      const response = await api.post("/procurements", procurementData);

      if (response.status && response.data) {
        toast({
          title: "Success",
          description: "Procurement created successfully",
        });

        // Reset form or navigate
        navigateBack();
      } else {
        toast({
          title: "Error",
          description: response.data?.message || "Failed to create procurement",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating procurement:", error);
      toast({
        title: "Error",
        description: "Failed to create procurement",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setShowReviewModal(false);
    }
  };

  const calculateTotal = () => {
    return procurementItems.reduce((sum, item) => sum + item.amount, 0);
  };

  const VendorTooltip = ({ vendor }) => (
    <div className="p-3 bg-gray-50 rounded-lg">
      <p className="font-medium">{vendor.name}</p>
      <p className="text-sm text-gray-600">{vendor.email}</p>
      <p className="text-sm text-gray-600">{vendor.contactPerson}</p>
      {vendor.address && (
        <p className="text-sm text-gray-600">{vendor.address}</p>
      )}
      {/* {vendor.gstNumber && (
        <p className="text-sm text-gray-600">GST: {vendor.gstNumber}</p>
      )} */}
    </div>
  );

  // Loading state
  if (fetchingRequisition) {
    return (
      <div className=" p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading requisition details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state - if no requisition found
  if (!requisition) {
    return (
      <div className=" p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">Requisition not found</p>
            <Button onClick={() => navigateBack()} className="mt-4">
              Back to Requisitions
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ax-w-6xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create New Procurement</h1>
        <Button variant="outline" onClick={() => navigateBack()}>
          Back to Requisitions
        </Button>
      </div>

      {/* Requisition Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Requisition Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Requisition Number</Label>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">
                  {requisition.requisitionNo || requisition.number}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Site</Label>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">
                  {requisition.requestingSite?.name || "NA"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Requested Date</Label>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">
                  {new Date(
                    requisition.requestedAt || requisition.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <div className="p-3 bg-gray-50 rounded-lg">
                <Badge variant="outline">{requisition.status}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vendor Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Select Vendor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Label htmlFor="vendor">Existing Vendor</Label>
                <Select
                  value={formData.vendorId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, vendorId: value }))
                  }
                  disabled={fetchingVendors}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        fetchingVendors
                          ? "Loading vendors..."
                          : "Select a vendor"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id.toString()}>
                        <div className="flex items-center justify-between w-full">
                          <span>{vendor.name}</span>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Vendor Details</DialogTitle>
                              </DialogHeader>
                              <VendorTooltip vendor={vendor} />
                            </DialogContent>
                          </Dialog>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowNewVendorForm(true)}
                  className="whitespace-nowrap"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Vendor
                </Button>
              </div>
            </div>

            {/* New Vendor Form */}
            {showNewVendorForm && (
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle className="text-lg">Add New Vendor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div onSubmit={handleNewVendorSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="vendorName">Vendor Name *</Label>
                        <Input
                          id="vendorName"
                          value={newVendor.name}
                          onChange={(e) =>
                            setNewVendor((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          required
                          placeholder="Enter vendor name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="vendorEmail">Email *</Label>
                        <Input
                          id="vendorEmail"
                          type="email"
                          value={newVendor.email}
                          onChange={(e) =>
                            setNewVendor((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          required
                          placeholder="Enter email address"
                        />
                      </div>
                      <div>
                        <Label htmlFor="vendorcontactPerson">Contact Person *</Label>
                        <Input
                          id="vendorcontactPerson"
                          value={newVendor.contactPerson}
                          onChange={(e) =>
                            setNewVendor((prev) => ({
                              ...prev,
                              contactPerson: e.target.value,
                            }))
                          }
                          required
                          placeholder="Enter contactPerson number"
                        />
                      </div>
                      {/* <div>
                        <Label htmlFor="vendorGst">GST Number</Label>
                        <Input
                          id="vendorGst"
                          value={newVendor.gstNumber}
                          onChange={(e) =>
                            setNewVendor((prev) => ({
                              ...prev,
                              gstNumber: e.target.value,
                            }))
                          }
                          placeholder="Enter GST number"
                        />
                      </div> */}
                    </div>
                    <div>
                      <Label htmlFor="vendorAddress">Address</Label>
                      <Textarea
                        id="vendorAddress"
                        value={newVendor.address}
                        onChange={(e) =>
                          setNewVendor((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                        placeholder="Enter vendor address"
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleNewVendorSubmit}
                        disabled={loading}
                      >
                        {loading ? "Creating..." : "Create Vendor"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowNewVendorForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Item Adjustment */}
      {procurementItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Items & Pricing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center font-medium bg-gray-50 p-4 border-b">
                  <div className="flex-1">Item</div>
                  <div className="w-28">Part Number</div>
                  <div className="w-20">Req Qty</div>
                  <div className="w-24">Proc Qty</div>
                  <div className="w-24">Rate</div>
                  <div className="w-24">Amount</div>
                </div>
                {procurementItems.map((item) => (
                  <div key={item.id} className="flex items-center p-4 border-b">
                    <div className="flex-1 font-medium">{item.name}</div>
                    <div className="w-28">{item.partNumber}</div>
                    <div className="w-20">{item.quantity}</div>
                    <div className="w-24">
                      <Input
                        type="number"
                        value={item.procurementQuantity}
                        onChange={(e) =>
                          handleItemUpdate(
                            item.id,
                            "procurementQuantity",
                            parseInt(e.target.value) || 0
                          )
                        }
                        max={item.quantity}
                        min={1}
                        className="w-20"
                      />
                    </div>
                    <div className="w-24">
                      <Input
                        type="number"
                        value={item.rate}
                        onChange={(e) =>
                          handleItemUpdate(
                            item.id,
                            "rate",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        min={0}
                        step="0.01"
                        className="w-24"
                      />
                    </div>
                    <div className="w-24 font-medium">
                      ₹{item.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <div className="text-right">
                <p className="text-lg font-semibold">
                  Total Amount: ₹{calculateTotal().toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delivery & Additional Info */}
      {procurementItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Delivery & Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expectedDelivery">Expected Delivery Date</Label>
                <Input
                  id="expectedDelivery"
                  type="date"
                  value={formData.expectedDelivery}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      expectedDelivery: e.target.value,
                    }))
                  }
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder="Additional notes or requirements"
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      {procurementItems.length > 0 && formData.vendorId && (
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => navigateBack()}>
            Cancel
          </Button>
          <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
            <DialogTrigger asChild>
              <Button>Review & Submit</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Review Procurement Order</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Requisition:</p>
                    <p>{requisition?.requisitionNo || requisition?.number}</p>
                  </div>
                  <div>
                    <p className="font-medium">Vendor:</p>
                    <p>
                      {
                        vendors.find(
                          (v) => v.id === parseInt(formData.vendorId)
                        )?.name
                      }
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Expected Delivery:</p>
                    <p>
                      {formData.expectedDelivery
                        ? new Date(
                            formData.expectedDelivery
                          ).toLocaleDateString()
                        : "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Total Amount:</p>
                    <p className="font-bold">₹{calculateTotal().toFixed(2)}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="font-medium mb-2">Items:</p>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center font-medium bg-gray-50 p-4 border-b">
                        <div className="flex-1">Item</div>
                        <div className="w-20">Quantity</div>
                        <div className="w-24">Rate</div>
                        <div className="w-24">Amount</div>
                      </div>
                      {procurementItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center p-4 border-b"
                        >
                          <div className="flex-1">{item.name}</div>
                          <div className="w-20">{item.procurementQuantity}</div>
                          <div className="w-24">₹{item.rate.toFixed(2)}</div>
                          <div className="w-24">₹{item.amount.toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowReviewModal(false)}
                  >
                    Back to Edit
                  </Button>
                  <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? "Creating..." : "Create Procurement"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default ProcurementForm;
