import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon,
  Plus,
  Wrench,
  Trash2,
  Upload,
  FileText,
  ArrowLeft,
  PlusCircle,
} from "lucide-react";
import MaintenanceLogList from "./MaintenanceLogList";
import MaintenanceLogDetails from "./MaintenanceLogDetails";
import api from "@/services/api/api-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLocation, useParams } from "react-router";

const MaintenanceLogPage = () => {
  const [activeTab, setActiveTab] = useState("history");
  const [selectedLog, setSelectedLog] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [vendors, setVendors] = useState([]);
  const [formData, setFormData] = useState({
    type: "repair",
    date: new Date(),
    title: "",
    description: "",
    cost: "",
    technician: "",
    status: "completed",
    hoursAtService: "",
  });

  const { id: machineId } = useParams();
  const location = useLocation();
  const machineName = location.state?.machineName || "Machine";

  // Reset form when modal closes
  useEffect(() => {
    setShowAddForm(false);
    setSelectedLog(null);
    setVendors([]);
    setFormData({
      type: "repair",
      date: new Date(),
      title: "",
      description: "",
      cost: "",
      technician: "",
      status: "completed",
      hoursAtService: "",
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      date: date || new Date(),
    }));
  };

  const handleVendorsChange = (newVendors) => {
    setVendors(newVendors);
  };

  const createMaintenanceLog = async (data) => {
    const res = await api.post("/maintanance/logs", data);
    return res.data;
  };

  const handleViewLog = (log) => {
    setSelectedLog(log);
  };

  const fetchMaintenanceStatsByMachine = async (machineId) => {
    const res = await api.get(`/maintanance/stats/${machineId}`);
    return res.data;
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const data = await fetchMaintenanceStatsByMachine(machineId);
        setStats(data);
        setStatsLoading(false);
      } catch (error) {
        console.error("Failed to fetch maintenance stats:", error);
        setStatsLoading(false);
      }
    };

    if (machineId) {
      fetchStats();
    }
  }, [machineId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare the data with vendor information
    const maintenanceData = {
      machineId,
      ...formData,
      vendorAndPartsDetails: vendors,
      // totalCost: vendors.reduce((sum, vendor) => sum + vendor.totalCost, 0),
      // parts: vendors.flatMap((vendor) =>
      //   vendor.parts.map((part) => ({
      //     ...part,
      //     vendorName: vendor.name,
      //     vendorId: vendor.id,
      //   }))
      // ),
    };

    // console.log(maintenanceData);
    // return;

    createMaintenanceLog(maintenanceData)
      .then((res) => {
        console.log("Maintenance log created:", res.data);
        setShowAddForm(false);
        // Reset form
        setVendors([]);
        setFormData({
          type: "repair",
          date: new Date(),
          title: "",
          description: "",
          cost: "",
          technician: "",
          status: "completed",
          hoursAtService: "",
        });
      })
      .catch((error) => {
        console.error("Error creating maintenance log:", error);
      });
  };

  const handleBackToList = () => {
    setSelectedLog(null);
  };

  return (
    <div className="container ">
      <div className="sm:max-w-[1200px]s">
        <div className="flex justify-between">
          <div>
            <div className="text-3xl flex items-center font-bold gap-2">
              Maintenance Log
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              {machineName} (ID: {machineId})
            </div>
          </div>
          <div>
            <div>
              <Button
                className={"border my-2"}
                variant="ghost"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to details
              </Button>
            </div>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full mt-4"
        >
          <TabsList className="grid grid-cols-1 mb-4">
            <TabsTrigger value="history" disabled>
              Maintenance History
            </TabsTrigger>
            {/* <TabsTrigger value="stats">Maintenance Stats</TabsTrigger> */}
          </TabsList>

          <TabsContent value="history" className="space-y-4">
            {!selectedLog && !showAddForm && (
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Maintenance Records</h3>
                <Button onClick={() => setShowAddForm(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Record
                </Button>
              </div>
            )}

            {showAddForm && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">
                    Add Maintenance Record
                  </h3>
                  <Button variant="ghost" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>

                {/* Enhanced Maintenance Entry Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Maintenance Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) =>
                          handleSelectChange("type", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="repair">Repair</SelectItem>
                          <SelectItem value="inspection">Inspection</SelectItem>
                          <SelectItem value="servicing_500kms">
                            Servicing - 500kms
                          </SelectItem>
                          <SelectItem value="servicing_1000kms">
                            Servicing - 1000kms
                          </SelectItem>
                          <SelectItem value="servicing_2000kms">
                            Servicing - 2000kms
                          </SelectItem>
                          <SelectItem value="servicing_4000kms">
                            Servicing - 4000kms
                          </SelectItem>
                          <SelectItem value="parts_replacement">
                            Parts Replacement
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.date
                              ? format(formData.date, "PPP")
                              : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.date}
                            onSelect={handleDateChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Brief description of maintenance"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hoursAtService">Hours at Service</Label>
                      <Input
                        id="hoursAtService"
                        name="hoursAtService"
                        type="number"
                        value={formData.hoursAtService}
                        onChange={handleInputChange}
                        placeholder="Machine hours at service time"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="technician">Technician</Label>
                      <Input
                        id="technician"
                        name="technician"
                        value={formData.technician}
                        onChange={handleInputChange}
                        placeholder="Name of technician"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cost">Total Cost</Label>
                      <Input
                        id="cost"
                        name="cost"
                        type="number"
                        value={formData.cost}
                        onChange={handleInputChange}
                        placeholder="Total maintenance cost"
                      />
                    </div>

                    {/* <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          handleSelectChange("status", value)
                        }
                      >
                        <SelectTrigger className="w-full md:w-1/2">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="in_progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div> */}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Detailed description of the maintenance performed"
                      rows={3}
                    />
                  </div>

                  {/* Vendor Management Section */}
                  <VendorManager
                    vendors={vendors}
                    onVendorsChange={handleVendorsChange}
                    className="mt-6"
                  />

                  <div className="flex justify-end pt-4">
                    <Button type="submit" size="lg">
                      Save Maintenance Record
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {!showAddForm && selectedLog && (
              <MaintenanceLogDetails
                log={selectedLog}
                onBack={handleBackToList}
              />
            )}

            {!showAddForm && !selectedLog && (
              <MaintenanceLogList
                machineId={machineId}
                onViewLog={handleViewLog}
              />
            )}
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            {statsLoading ? (
              <div className="flex justify-center items-center h-40">
                Loading stats...
              </div>
            ) : stats ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Maintenance Summary */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2">
                    Maintenance Summary
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Total Records:
                      </span>
                      <span className="font-medium">{stats.totalRecords}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Last Maintenance:
                      </span>
                      <span className="font-medium">
                        {stats.lastMaintenanceDate
                          ? format(
                              new Date(stats.lastMaintenanceDate),
                              "MMMM d, yyyy"
                            )
                          : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Total Cost (YTD):
                      </span>
                      <span className="font-medium">
                        ₹{stats.totalCostYTD.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Maintenance Types */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2">
                    Maintenance Types
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Repairs:</span>
                      <span className="font-medium">
                        {stats.typeCounts.repair}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Preventive:</span>
                      <span className="font-medium">
                        {stats.typeCounts.preventive}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Inspections:
                      </span>
                      <span className="font-medium">
                        {stats.typeCounts.inspection}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Oil Changes:
                      </span>
                      <span className="font-medium">
                        {stats.typeCounts.oil_change}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Parts Replacements:
                      </span>
                      <span className="font-medium">
                        {stats.typeCounts.parts_replacement}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Maintenance Costs Chart Placeholder */}
                <div className="border rounded-lg p-4 md:col-span-2">
                  <h3 className="text-lg font-medium mb-2">
                    Maintenance Costs
                  </h3>
                  <div className="h-40 flex items-center justify-center bg-muted/20 rounded">
                    <p className="text-muted-foreground">
                      Cost chart would appear here
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-40">
                No maintenance stats found.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MaintenanceLogPage;

function VendorManager({ vendors = [], onVendorsChange, className = "" }) {
  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addVendor = () => {
    const newVendor = {
      id: generateId(),
      name: "",
      contactPerson: "",
      phone: "",
      email: "",
      address: "",
      parts: [],
    };
    onVendorsChange([...vendors, newVendor]);
  };

  const removeVendor = (vendorId) => {
    onVendorsChange(vendors.filter((v) => v.id !== vendorId));
  };

  const updateVendor = (vendorId, field, value) => {
    const updatedVendors = vendors.map((vendor) =>
      vendor.id === vendorId ? { ...vendor, [field]: value } : vendor
    );
    onVendorsChange(updatedVendors);
  };

  const addPart = (vendorId) => {
    const newPart = {
      id: generateId(),
      name: "",
      partNumber: "",
      quantity: 1,
      warrantyPeriod: "",
      warrantyStartDate: undefined,
      taxInvoiceFile: null, // ← NEW
      warrantyCardFile: null, // ← NEW
    };

    const updatedVendors = vendors.map((vendor) =>
      vendor.id === vendorId
        ? { ...vendor, parts: [...vendor.parts, newPart] }
        : vendor
    );
    onVendorsChange(updatedVendors);
  };

  const removePart = (vendorId, partId) => {
    const updatedVendors = vendors.map((vendor) =>
      vendor.id === vendorId
        ? { ...vendor, parts: vendor.parts.filter((p) => p.id !== partId) }
        : vendor
    );
    onVendorsChange(updatedVendors);
  };

  const updatePart = (vendorId, partId, field, value) => {
    const updatedVendors = vendors.map((vendor) =>
      vendor.id === vendorId
        ? {
            ...vendor,
            parts: vendor.parts.map((part) =>
              part.id === partId ? { ...part, [field]: value } : part
            ),
          }
        : vendor
    );
    onVendorsChange(updatedVendors);
  };

  const handleFileUpload = (vendorId, fileType, file) => {
    updateVendor(vendorId, fileType, file);
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Vendor & Parts Details</CardTitle>
          <Button
            type="button"
            onClick={addVendor}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Add Vendor
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {vendors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>
                No vendors added yet. Click "Add Vendor" to start tracking parts
                and suppliers.
              </p>
            </div>
          ) : (
            vendors.map((vendor, vendorIndex) => (
              <Card key={vendor.id} className="border-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">
                    Vendor {vendorIndex + 1}
                  </CardTitle>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeVendor(vendor.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Vendor Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Vendor Name</Label>
                      <Input
                        value={vendor.name}
                        onChange={(e) =>
                          updateVendor(vendor.id, "name", e.target.value)
                        }
                        placeholder="Vendor company name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contact Person</Label>
                      <Input
                        value={vendor.contactPerson}
                        onChange={(e) =>
                          updateVendor(
                            vendor.id,
                            "contactPerson",
                            e.target.value
                          )
                        }
                        placeholder="Contact person name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={vendor.phone}
                        onChange={(e) =>
                          updateVendor(vendor.id, "phone", e.target.value)
                        }
                        placeholder="Phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={vendor.email}
                        onChange={(e) =>
                          updateVendor(vendor.id, "email", e.target.value)
                        }
                        placeholder="Email address"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Textarea
                      value={vendor.address}
                      onChange={(e) =>
                        updateVendor(vendor.id, "address", e.target.value)
                      }
                      placeholder="Vendor address"
                      rows={2}
                    />
                  </div>

                  <Separator />

                  {/* Parts Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Parts Supplied</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addPart(vendor.id)}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Part
                      </Button>
                    </div>

                    {vendor.parts.map((part, partIndex) => (
                      <Card key={part.id} className="bg-muted/50">
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="font-medium">
                              Part {partIndex + 1}
                            </h5>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removePart(vendor.id, part.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label>Part Name</Label>
                              <Input
                                value={part.name}
                                onChange={(e) =>
                                  updatePart(
                                    vendor.id,
                                    part.id,
                                    "name",
                                    e.target.value
                                  )
                                }
                                placeholder="e.g., Brake Pad, Battery"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Part Number</Label>
                              <Input
                                value={part.partNumber}
                                onChange={(e) =>
                                  updatePart(
                                    vendor.id,
                                    part.id,
                                    "partNumber",
                                    e.target.value
                                  )
                                }
                                placeholder="Manufacturer part number"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Quantity</Label>
                              <Input
                                type="number"
                                min="1"
                                value={part.quantity}
                                onChange={(e) =>
                                  updatePart(
                                    vendor.id,
                                    part.id,
                                    "quantity",
                                    Number.parseInt(e.target.value) || 1
                                  )
                                }
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Warranty Period</Label>
                              <Input
                                value={part.warrantyPeriod}
                                onChange={(e) =>
                                  updatePart(
                                    vendor.id,
                                    part.id,
                                    "warrantyPeriod",
                                    e.target.value
                                  )
                                }
                                placeholder="e.g., 12 months, 2 years"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Warranty Start Date</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal"
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {part.warrantyStartDate
                                      ? format(part.warrantyStartDate, "PPP")
                                      : "Select date"}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <Calendar
                                    mode="single"
                                    selected={part.warrantyStartDate}
                                    onSelect={(date) =>
                                      updatePart(
                                        vendor.id,
                                        part.id,
                                        "warrantyStartDate",
                                        date
                                      )
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                          </div>

                          {/* Part-specific document upload */}
                          <div className="grid grid-cols-1 mt-4 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Tax Invoice</Label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={(e) =>
                                    updatePart(
                                      vendor.id,
                                      part.id,
                                      "taxInvoiceFile",
                                      e.target.files?.[0] || null
                                    )
                                  }
                                  className="hidden"
                                  id={`tax-invoice-${vendor.id}-${part.id}`}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() =>
                                    document
                                      .getElementById(
                                        `tax-invoice-${vendor.id}-${part.id}`
                                      )
                                      ?.click()
                                  }
                                  className="flex items-center gap-2"
                                >
                                  <Upload className="h-4 w-4" />
                                  Upload Invoice
                                </Button>
                                {part.taxInvoiceFile && (
                                  <div className="flex items-center gap-1 text-sm text-green-600">
                                    <FileText className="h-4 w-4" />
                                    {part.taxInvoiceFile.name}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Warranty Card</Label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={(e) =>
                                    updatePart(
                                      vendor.id,
                                      part.id,
                                      "warrantyCardFile",
                                      e.target.files?.[0] || null
                                    )
                                  }
                                  className="hidden"
                                  id={`warranty-card-${vendor.id}-${part.id}`}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() =>
                                    document
                                      .getElementById(
                                        `warranty-card-${vendor.id}-${part.id}`
                                      )
                                      ?.click()
                                  }
                                  className="flex items-center gap-2"
                                >
                                  <Upload className="h-4 w-4" />
                                  Upload Warranty
                                </Button>
                                {part.warrantyCardFile && (
                                  <div className="flex items-center gap-1 text-sm text-green-600">
                                    <FileText className="h-4 w-4" />
                                    {part.warrantyCardFile.name}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* <Separator /> */}

                  {/* Document Upload Section */}
                  {/* <div className="space-y-4">
                    <h4 className="font-semibold">Documents</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Tax Invoice</Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) =>
                              handleFileUpload(
                                vendor.id,
                                "taxInvoiceFile",
                                e.target.files?.[0] || null
                              )
                            }
                            className="hidden"
                            id={`tax-invoice-${vendor.id}`}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document
                                .getElementById(`tax-invoice-${vendor.id}`)
                                ?.click()
                            }
                            className="flex items-center gap-2"
                          >
                            <Upload className="h-4 w-4" />
                            Upload Invoice
                          </Button>
                          {vendor.taxInvoiceFile && (
                            <div className="flex items-center gap-1 text-sm text-green-600">
                              <FileText className="h-4 w-4" />
                              {vendor.taxInvoiceFile.name}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Warranty Card</Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) =>
                              handleFileUpload(
                                vendor.id,
                                "warrantyCardFile",
                                e.target.files?.[0] || null
                              )
                            }
                            className="hidden"
                            id={`warranty-card-${vendor.id}`}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document
                                .getElementById(`warranty-card-${vendor.id}`)
                                ?.click()
                            }
                            className="flex items-center gap-2"
                          >
                            <Upload className="h-4 w-4" />
                            Upload Warranty
                          </Button>
                          {vendor.warrantyCardFile && (
                            <div className="flex items-center gap-1 text-sm text-green-600">
                              <FileText className="h-4 w-4" />
                              {vendor.warrantyCardFile.name}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div> */}
                </CardContent>
              </Card>
            ))
          )}

          {/* Summary */}
          {/* {vendors.length > 0 && (
            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-background rounded-md">
                    <p className="text-sm text-muted-foreground">
                      Total Vendors
                    </p>
                    <p className="text-2xl font-bold">{vendors.length}</p>
                  </div>
                  <div className="p-4 bg-background rounded-md">
                    <p className="text-sm text-muted-foreground">Total Parts</p>
                    <p className="text-2xl font-bold">{getTotalParts()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )} */}
        </CardContent>
      </Card>
    </div>
  );
}
