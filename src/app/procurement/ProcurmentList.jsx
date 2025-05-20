"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FileText, Filter, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api/api-service";

const useMockData = true;

const mockProcurements = [
  {
    id: "p1",
    procurementNo: "PO-1001",
    requisitionId: "r1",
    requisition: { requisitionNo: "REQ-2025" },
    vendorId: "v1",
    createdAt: "2025-05-10T10:00:00Z",
    expectedDeliveryDate: "2025-05-20T10:00:00Z",
    status: "pending",
    items: [
      { id: "i1", amount: 5000 },
      { id: "i2", amount: 1500 },
    ],
  },
  {
    id: "p2",
    procurementNo: "PO-1002",
    requisitionId: "r2",
    requisition: { requisitionNo: "REQ-2026" },
    vendorId: "v2",
    createdAt: "2025-05-12T12:30:00Z",
    expectedDeliveryDate: "2025-05-25T12:30:00Z",
    status: "delivered",
    items: [{ id: "i3", amount: 3000 }],
  },
  {
    id: "p3",
    procurementNo: "PO-1003",
    requisitionId: "r3",
    requisition: { requisitionNo: "REQ-2027" },
    vendorId: "v1",
    createdAt: "2025-05-14T08:45:00Z",
    expectedDeliveryDate: "2025-05-28T08:45:00Z",
    status: "partial",
    items: [
      { id: "i4", amount: 2000 },
      { id: "i5", amount: 1000 },
    ],
  },
];

const mockVendors = [
  { id: "v1", name: "Vendor One" },
  { id: "v2", name: "Vendor Two" },
];

const ProcurementList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [procurements, setProcurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);

      if (useMockData) {
        // Use mock data
        await new Promise((res) => setTimeout(res, 500)); // Simulate delay
        setProcurements(mockProcurements);
        setVendors(mockVendors);
      } else {
        // Actual API calls
        const [procurementsRes, vendorsRes] = await Promise.all([
          api.get("/procurements"),
          api.get("/vendors"),
        ]);
        setProcurements(procurementsRes.data || []);
        setVendors(vendorsRes.data || []);
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to load procurements",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [toast]);


  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return dateString || "-";
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "delivered":
        return <Badge variant="success">Delivered</Badge>;
      case "partial":
        return <Badge variant="warning">Partial</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status || "Unknown"}</Badge>;
    }
  };

  const getVendorName = (vendorId) => {
    const vendor = vendors.find((v) => v.id === vendorId);
    return vendor ? vendor.name : "Unknown";
  };

  const filteredProcurements = procurements.filter((procurement) => {
    // Apply search filter
    const searchLower = searchTerm.toLowerCase();
    const vendorName = getVendorName(procurement.vendorId);
    const requisitionNo = procurement.requisition?.requisitionNo || "";

    const matchesSearch =
      searchTerm === "" ||
      vendorName.toLowerCase().includes(searchLower) ||
      requisitionNo.toLowerCase().includes(searchLower) ||
      procurement.procurementNo?.toLowerCase().includes(searchLower);

    // Apply status filter
    const matchesStatus =
      filterStatus === "all" ||
      procurement.status?.toLowerCase() === filterStatus.toLowerCase();

    // Apply vendor filter
    const matchesVendor =
      selectedVendor === "" || procurement.vendorId === selectedVendor;

    return matchesSearch && matchesStatus && matchesVendor;
  });

  const handleAddInvoice = (procurementId) => {
    navigate(`/invoice/${procurementId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Procurements</h1>
        <Button onClick={() => navigate("/requisitions/list")}>
          <Plus className="mr-2 h-4 w-4" /> Create New Procurement
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="w-full sm:w-auto flex-1">
          <Input
            placeholder="Search by procurement #, vendor, or requisition #"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            icon={<Search className="h-4 w-4" />}
          />
        </div>

        <div className="w-full sm:w-auto min-w-[150px]">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-auto min-w-[200px]">
          <Select value={selectedVendor} onValueChange={setSelectedVendor}>
            <SelectTrigger>
              <SelectValue placeholder="Select Vendor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>All Vendors</SelectItem>
              {vendors.map((vendor) => (
                <SelectItem key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">Loading...</div>
      ) : filteredProcurements.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">No procurements found</p>
          {procurements.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters
            </p>
          )}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Procurement #</TableHead>
                <TableHead>Requisition #</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Expected Delivery</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProcurements.map((procurement) => {
                const totalAmount =
                  procurement.items?.reduce(
                    (sum, item) => sum + (item.amount || 0),
                    0
                  ) || 0;

                return (
                  <TableRow key={procurement.id}>
                    <TableCell>
                      <Button
                        variant="link"
                        onClick={() =>
                          navigate(`/procurements/${procurement.id}`)
                        }
                      >
                        {procurement.procurementNo}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="link"
                        onClick={() =>
                          navigate(`/requisitions/${procurement.requisitionId}`)
                        }
                      >
                        {procurement.requisition?.requisitionNo || "-"}
                      </Button>
                    </TableCell>
                    <TableCell>{getVendorName(procurement.vendorId)}</TableCell>
                    <TableCell>{formatDate(procurement.createdAt)}</TableCell>
                    <TableCell>
                      {formatDate(procurement.expectedDeliveryDate)}
                    </TableCell>
                    <TableCell>{getStatusBadge(procurement.status)}</TableCell>
                    <TableCell>₹{totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddInvoice(procurement.id)}
                        >
                          <FileText className="h-4 w-4" />
                          <span className="sr-only md:not-sr-only md:ml-2">
                            Add Invoice
                          </span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ProcurementList;
