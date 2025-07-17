import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  FileText,
  CheckCircle,
  AlertCircle,
  Truck,
  Package,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router";
import api from "@/services/api/api-service";

// Utility functions
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
      return <Clock className="h-3 w-3" />;
    case "ordered":
      return <CheckCircle className="h-3 w-3" />;
    case "Delivered":
      return <Truck className="h-3 w-3" />;
    case "Partial":
      return <Package className="h-3 w-3" />;
    case "Cancelled":
      return <AlertCircle className="h-3 w-3" />;
    default:
      return <FileText className="h-3 w-3" />;
  }
};

// Table Header Component
const TableHeader = () => (
  <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
    <div className="grid grid-cols-8 gap-4 text-sm font-medium text-gray-600">
      <div>Procurement #</div>
      <div>Requisition #</div>
      <div>Vendor</div>
      <div>Created Date</div>
      <div>Expected Delivery</div>
      <div>Status</div>
      <div>Total Amount</div>
      <div>Actions</div>
    </div>
  </div>
);

// Table Row Component
const TableRow = ({ procurement, navigate }) => (
  <div className="border-b border-gray-200 px-6 py-4 hover:bg-gray-50 transition-colors">
    <div className="grid grid-cols-8 gap-4 items-center">
      <div className="font-medium text-gray-900">
        {procurement.procurementNo}
      </div>

      <div className="text-gray-600">REQ-{procurement.requisitionId}</div>

      <div className="text-gray-900">{procurement.Vendor.name}</div>

      <div className="text-gray-600">
        {new Date(procurement.createdAt).toLocaleDateString("en-GB")}
      </div>

      <div className="text-gray-600">
        {new Date(procurement.expectedDelivery).toLocaleDateString("en-GB")}
      </div>

      <div>
        <Badge
          className={`${getStatusColor(
            procurement.status
          )} text-xs px-2 py-1 rounded-full border`}
        >
          {getStatusIcon(procurement.status)}
          <span className="ml-1">{procurement.status}</span>
        </Badge>
      </div>

      <div className="font-semibold text-gray-900">
        ₹{parseFloat(procurement.totalAmount).toLocaleString()}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="px-3 py-1 text-xs"
          onClick={() => navigate("/procurements/" + procurement.id)}
        >
          view
        </Button>
      </div>
    </div>
  </div>
);

// Filters Component
const ProcurementFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}) => (
  <Card className="mb-6">
    <CardContent className="pt-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by PO number, requisition, or vendor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="ordered">Ordered</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Partial">Partial</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ProcurementList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [procurements, setProcurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filteredProcurements = procurements?.filter((procurement) => {
    const matchesSearch =
      procurement.procurementNo
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      `REQ-${procurement.requisitionId}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      procurement.Vendor.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || procurement.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    const fetchProcurements = async () => {
      try {
        setLoading(true);
        const response = await api.get("/procurements");
        setProcurements(response.data); // Access the data array from the response
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch procurements:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProcurements();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading procurements...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500">Error loading procurements: {error}</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Procurement Orders</h1>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => navigate("/requisitions")}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Procurement
        </Button>
      </div>

      <ProcurementFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {filteredProcurements.length > 0 ? (
        <Card>
          <div className="overflow-hidden">
            <TableHeader />
            <div className="divide-y divide-gray-200">
              {filteredProcurements.map((procurement) => (
                <TableRow
                  key={procurement.id}
                  procurement={procurement}
                  navigate={navigate}
                />
              ))}
            </div>
          </div>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">
              No procurement orders found matching your criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProcurementList;
