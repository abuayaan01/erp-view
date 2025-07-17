"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  X,
  Clock,
  ArrowLeft,
  Printer,
  CheckCircle,
  Package,
  DoorClosed,
  ShieldCloseIcon,
  User,
  Calendar,
  MapPin,
  AlertTriangle,
  FileText,
  Truck,
  XCircle,
  Building,
  Phone,
  Mail,
  DollarSign,
  TrendingUp,
  Eye,
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { PDFViewer } from "@react-pdf/renderer";
import MaterialRequisitionPDF from "./MaterialRequisitionPDF";
import { useSelector } from "react-redux";
import api from "@/services/api/api-service";
import { getIdByRole, useUserRoleLevel } from "@/utils/roles";

const MaterialRequisitionView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const { user: currentUser } = useSelector((state) => state.auth);

  const [requisition, setRequisition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [close, setClose] = useState(false);
  const [itemGroups, setItemGroups] = useState([]);
  const [units, setUnits] = useState([]);
  const [showPdf, setShowPdf] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const storedItemGroups = useSelector((state) => state.itemGroups) || [];
  const storedUnits = useSelector((state) => state.units) || [];
  const userRoleLevel = useUserRoleLevel();
  const [approvingIssue, setApprovingIssue] = useState(false);

  const shouldPrint =
    new URLSearchParams(location.search).get("print") === "true";

  useEffect(() => {
    const fetchRequisition = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/requisitions/${id}`);
        if (response.status && response.data) {
          setRequisition(response.data);
          setItemGroups(storedItemGroups.data || []);
          setUnits(storedUnits.data || []);
        } else {
          toast({
            title: "Error",
            description: response.data.message || "Failed to fetch requisition",
            variant: "destructive",
          });
          navigate("/requisitions");
        }
      } catch (error) {
        toast({
          title: "Requisition Not Found",
          description: "The requisition you're looking for doesn't exist.",
          variant: "destructive",
        });
        navigate("/requisitions");
      } finally {
        setLoading(false);
      }
    };

    fetchRequisition();
  }, [id, navigate, toast, storedItemGroups, storedUnits]);

  useEffect(() => {
    if (shouldPrint && requisition) {
      setShowPdf(true);
    }
  }, [shouldPrint, requisition]);

  // Utility functions
  const getItemGroupName = (groupId) => {
    const group = itemGroups.find((g) => g.id === groupId);
    return group ? group.name : "Unknown Group";
  };

  const getUnitName = (unitId) => {
    const unit = units.find((u) => u.id === unitId);
    return unit ? unit.shortName || unit.name : "";
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      urgent: { color: "bg-red-500", icon: AlertTriangle },
      high: { color: "bg-red-400", icon: TrendingUp },
      medium: { color: "bg-orange-400", icon: Clock },
      low: { color: "bg-yellow-400", icon: Clock },
    };

    const config = priorityConfig[priority.toLowerCase()] || {};
    const Icon = config.icon || Clock;

    return (
      <Badge
        className={`${
          config.color || "bg-gray-400"
        } text-white flex items-center gap-1`}
      >
        <Icon className="h-3 w-3" />
        {priority}
      </Badge>
    );
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color: "bg-yellow-50 text-yellow-700 border-yellow-200",
        icon: Clock,
      },
      approvedbypm: {
        color: "bg-blue-50 text-blue-700 border-blue-200",
        icon: CheckCircle,
      },
      approvedbyho: {
        color: "bg-green-50 text-green-700 border-green-200",
        icon: CheckCircle,
      },
      forwarded: {
        color: "bg-purple-50 text-purple-700 border-purple-200",
        icon: Truck,
      },
      rejected: {
        color: "bg-red-50 text-red-700 border-red-200",
        icon: XCircle,
      },
      issued: {
        color: "bg-indigo-50 text-indigo-700 border-indigo-200",
        icon: Package,
      },
      received: {
        color: "bg-green-50 text-green-700 border-green-200",
        icon: CheckCircle,
      },
    };

    const config = statusConfig[status.toLowerCase()] || {
      color: "bg-gray-50 text-gray-700 border-gray-200",
      icon: Clock,
    };
    const Icon = config.icon;

    return (
      <Badge
        variant="outline"
        className={`${config.color} flex items-center gap-1`}
      >
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  const getProcurementStatusBadge = (status) => {
    const statusConfig = {
      ordered: {
        color: "bg-blue-50 text-blue-700 border-blue-200",
        icon: ShoppingCart,
      },
      delivered: {
        color: "bg-green-50 text-green-700 border-green-200",
        icon: CheckCircle,
      },
      cancelled: {
        color: "bg-red-50 text-red-700 border-red-200",
        icon: XCircle,
      },
      pending: {
        color: "bg-yellow-50 text-yellow-700 border-yellow-200",
        icon: Clock,
      },
    };

    const config = statusConfig[status.toLowerCase()] || {
      color: "bg-gray-50 text-gray-700 border-gray-200",
      icon: Clock,
    };
    const Icon = config.icon;

    return (
      <Badge
        variant="outline"
        className={`${config.color} flex items-center gap-1`}
      >
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  const getIssueStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color: "bg-yellow-50 text-yellow-700 border-yellow-200",
        icon: Clock,
      },
      approved: {
        color: "bg-green-50 text-green-700 border-green-200",
        icon: CheckCircle,
      },
      issued: {
        color: "bg-blue-50 text-blue-700 border-blue-200",
        icon: Package,
      },
      dispatched: {
        color: "bg-indigo-50 text-indigo-700 border-indigo-200",
        icon: Truck,
      },
      received: {
        color: "bg-green-50 text-green-700 border-green-200",
        icon: CheckCircle,
      },
      rejected: {
        color: "bg-red-50 text-red-700 border-red-200",
        icon: XCircle,
      },
    };

    const config = statusConfig[status.toLowerCase()] || {
      color: "bg-gray-50 text-gray-700 border-gray-200",
      icon: Clock,
    };
    const Icon = config.icon;

    return (
      <Badge
        variant="outline"
        className={`${config.color} flex items-center gap-1`}
      >
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  // Action handlers
  const handlePrint = () => {
    setShowPdf(true);
  };

  const handleApprovalByHO = async () => {
    try {
      setApproving(true);
      const response = await api.post(`/requisitions/${id}/ho-approve`);

      if (response.status) {
        toast({
          title: "Success",
          description: "Requisition has been approved successfully.",
        });

        setRequisition({
          ...requisition,
          status: "Approved",
          approvedAt: new Date().toISOString(),
        });
      } else {
        toast({
          title: "Error",
          description:
            response.data?.message || "Failed to approve requisition",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to approve requisition",
        variant: "destructive",
      });
    } finally {
      setApproving(false);
    }
  };

  const handleApprovalByPm = async () => {
    try {
      setApproving(true);
      const response = await api.post(`/requisitions/${id}/pm-approve`);

      if (response.status) {
        toast({
          title: "Success",
          description: "Requisition has been approved successfully.",
        });

        setRequisition({
          ...requisition,
          status: "Approved",
          approvedAt: new Date().toISOString(),
        });
      } else {
        toast({
          title: "Error",
          description:
            response.data?.message || "Failed to approve requisition",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to approve requisition",
        variant: "destructive",
      });
    } finally {
      setApproving(false);
    }
  };

  const handleIssueApproval = async (issueId) => {
    try {
      setApprovingIssue(true);
      const response = await api.post(`/material-issues/${issueId}/approve`);

      if (response.status) {
        toast({
          title: "Success",
          description: "Material issue has been approved successfully.",
        });

        const updatedResponse = await api.get(`/requisitions/${id}`);
        if (updatedResponse.status && updatedResponse.data) {
          setRequisition(updatedResponse.data);
        }
      } else {
        toast({
          title: "Error",
          description:
            response.data?.message || "Failed to approve material issue",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to approve material issue",
        variant: "destructive",
      });
    } finally {
      setApprovingIssue(false);
    }
  };

  const handleIssueRejection = async (issueId) => {
    try {
      setApprovingIssue(true);
      const response = await api.post(`/material-issues/${issueId}/reject`);

      if (response.status) {
        toast({
          title: "Success",
          description: "Material issue has been rejected successfully.",
        });

        const updatedResponse = await api.get(`/requisitions/${id}`);
        if (updatedResponse.status && updatedResponse.data) {
          setRequisition(updatedResponse.data);
        }
      } else {
        toast({
          title: "Error",
          description:
            response.data?.message || "Failed to reject material issue",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to reject material issue",
        variant: "destructive",
      });
    } finally {
      setApprovingIssue(false);
    }
  };

  // Button generators
  const getApprovalButton = () => {
    const isPending = requisition.status.toLowerCase() === "pending";
    const isApprovedByPm = requisition.status.toLowerCase() === "approvedbypm";
    const isProjectManager =
      currentUser.roleId === getIdByRole("Project Manager");
    const isAdmin = userRoleLevel.role === "admin";

    if (isPending && isProjectManager) {
      const isSameSite = currentUser.site.id == requisition.requestingSite.id;
      if (isSameSite) {
        return (
          <Button
            variant="default"
            onClick={handleApprovalByPm}
            disabled={approving}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            {approving ? "Forwarding..." : "Forward to Head Office"}
          </Button>
        );
      }
      return null;
    } else if (isApprovedByPm && isAdmin) {
      return (
        <Button
          variant="default"
          onClick={handleApprovalByHO}
          disabled={approving}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          {approving ? "Approving..." : "Approve"}
        </Button>
      );
    }

    return null;
  };

  const getProcurementButton = () => {
    const isApprovedByHo = requisition.status.toLowerCase() === "approvedbyho";
    if (isApprovedByHo) {
      const isAdmin = userRoleLevel.role === "admin";
      if (isAdmin) {
        return (
          <Button
            variant="default"
            onClick={() =>
              navigate(`/procure/new?requisitionId=${requisition.id}`)
            }
            className="bg-purple-600 hover:bg-purple-700"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Procure
          </Button>
        );
      }
    }
    return null;
  };

  const getIssueButton = () => {
    const isApprovedByHo = requisition.status.toLowerCase() === "approvedbyho";
    const isAdmin = userRoleLevel.role === "admin";
    if (isApprovedByHo && !isAdmin) {
      const isSameSite = currentUser.site.id == requisition.requestingSite.id;
      if (!isSameSite) {
        return (
          <Button
            variant="default"
            onClick={() => navigate(`/issues/new?req_id=${requisition.id}`)}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Package className="mr-2 h-4 w-4" />
            Issue
          </Button>
        );
      }
    }
    return null;
  };

  const getClosureButton = () => {
    const handleCloseRequisition = async () => {
      try {
        setClose(true);
        const response = await api.post(`/requisitions/${id}/complete`);

        if (response.status) {
          toast({
            title: "Success",
            description: "Requisition has been completed successfully.",
          });

          setRequisition({
            ...requisition,
            status: "Completed",
            approvedAt: new Date().toISOString(),
          });
        } else {
          toast({
            title: "Error",
            description:
              response.data?.message || "Failed to complete requisition",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description:
            error.response?.data?.message || "Failed to complete requisition",
          variant: "destructive",
        });
      } finally {
        setClose(false);
      }
    };

    const isApprovedByHo = requisition.status.toLowerCase() === "approvedbyho";
    if (isApprovedByHo) {
      const isAdmin = userRoleLevel.role === "admin";
      if (isAdmin) {
        return (
          <Button
            variant="default"
            onClick={handleCloseRequisition}
            className="bg-sky-600 hover:bg-sky-700"
            disabled={close}
          >
            <ShieldCloseIcon className="mr-2 h-4 w-4" />
            {close ? "Closing..." : "Close"}
          </Button>
        );
      }
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!requisition) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Requisition not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!showPdf ? (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/requisitions")}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  {requisition.requisitionNo}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Material Requisition Details
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {getApprovalButton()}
              {getProcurementButton()}
              {getIssueButton()}
              {getClosureButton()}
              <Button onClick={handlePrint} variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
            </div>
          </div>

          {/* Status and Priority Banner */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  Status:
                </span>
                {getStatusBadge(requisition.status)}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  Priority:
                </span>
                {getPriorityBadge(requisition.requestPriority)}
              </div>
            </div>
            <div className="text-sm text-gray-500">
              <Calendar className="inline h-4 w-4 mr-1" />
              Created: {formatDate(requisition.requestedAt)}
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="items">Items</TabsTrigger>
              <TabsTrigger value="procurements">Procurements</TabsTrigger>
              <TabsTrigger value="issues">Issues</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Requisition No</p>
                        <p className="font-medium">
                          {requisition.requisitionNo}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Charge Type</p>
                        <p className="font-medium">{requisition.chargeType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Due Date</p>
                        <p className="font-medium">
                          {requisition.dueDate
                            ? new Date(requisition.dueDate).toLocaleDateString()
                            : "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Requested For</p>
                        <p className="font-medium">
                          {requisition.requestedFor || "N/A"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Site Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Site Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Requesting Site</p>
                      <p className="font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        {requisition.requestingSite?.name || "N/A"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Personnel Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personnel
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Prepared By</p>
                      <p className="font-medium">
                        {requisition.preparedBy?.name || "N/A"}
                      </p>
                    </div>
                    {requisition.approvedBy && (
                      <div>
                        <p className="text-sm text-gray-600">Approved By</p>
                        <p className="font-medium">
                          {requisition.approvedBy.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(requisition.approvedAt)}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Items Tab */}
            <TabsContent value="items">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Requisition Items ({requisition.items.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Sr. No</TableHead>
                          <TableHead>Item Name</TableHead>
                          <TableHead>Part No</TableHead>
                          <TableHead>HSN Code</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Unit</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {requisition.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {index + 1}
                            </TableCell>
                            <TableCell>{item.Item?.name || "N/A"}</TableCell>
                            <TableCell>
                              {item.Item?.partNumber || "-"}
                            </TableCell>
                            <TableCell>{item.Item?.hsnCode || "-"}</TableCell>
                            <TableCell className="font-medium">
                              {item.quantity}
                            </TableCell>
                            <TableCell>
                              {getUnitName(item.Item?.unitId)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Procurements Tab */}
            <TabsContent value="procurements">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Procurement Orders ({requisition.procurements?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {requisition.procurements &&
                  requisition.procurements.length > 0 ? (
                    <div className="space-y-4">
                      {requisition.procurements.map((procurement, index) => (
                        <div
                          key={procurement.id}
                          className="border rounded-lg p-4 bg-gray-50"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold">
                                  {procurement.procurementNo}
                                </h3>
                                {getProcurementStatusBadge(procurement.status)}
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <p className="text-sm text-gray-600">
                                    Vendor
                                  </p>
                                  <p className="font-medium">
                                    {procurement.Vendor?.name || "N/A"}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {procurement.Vendor?.contactPerson}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">
                                    Total Amount
                                  </p>
                                  <p className="font-medium text-green-600">
                                    {formatCurrency(procurement.totalAmount)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">
                                    Expected Delivery
                                  </p>
                                  <p className="font-medium">
                                    {procurement.expectedDelivery
                                      ? new Date(
                                          procurement.expectedDelivery
                                        ).toLocaleDateString()
                                      : "Not specified"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  navigate(`/procurements/${procurement.id}`)
                                }
                              >
                                <Eye className="mr-1 h-3 w-3" />
                                View Details
                              </Button>
                            </div>
                          </div>

                          {/* Vendor Contact Info */}
                          {procurement.Vendor && (
                            <div className="mt-4 p-3 bg-white rounded border">
                              <h4 className="font-medium text-sm mb-2">
                                Vendor Contact Information
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-gray-400" />
                                  <span>{procurement.Vendor.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-gray-400" />
                                  <span>{procurement.Vendor.email}</span>
                                </div>
                                <div className="flex items-start gap-2 md:col-span-2">
                                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                  <span>{procurement.Vendor.address}</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {procurement.notes && (
                            <div className="mt-3 p-3 bg-blue-50 rounded border">
                              <p className="text-sm">
                                <strong>Notes:</strong> {procurement.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">
                        No procurement orders found
                      </p>
                      <p className="text-sm text-gray-400">
                        Procurement orders will appear here once created
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Issues Tab */}
            <TabsContent value="issues">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Material Issues ({requisition.materialIssues?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {requisition.materialIssues &&
                  requisition.materialIssues.length > 0 ? (
                    <div className="space-y-4">
                      {requisition.materialIssues.map((issue, index) => (
                        <div
                          key={issue.id}
                          className="border rounded-lg p-4 bg-gray-50"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold">
                                  {issue.issueNumber}
                                </h3>
                                {getIssueStatusBadge(issue.status)}
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <p className="text-sm text-gray-600">
                                    Issue Type
                                  </p>
                                  <p className="font-medium">
                                    {issue.issueType}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">
                                    Issue Date
                                  </p>
                                  <p className="font-medium">
                                    {new Date(
                                      issue.issueDate
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">
                                    From Site
                                  </p>
                                  <p className="font-medium">
                                    {issue.fromSite?.name || "N/A"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">
                                    To Site
                                  </p>
                                  <p className="font-medium">
                                    {issue.toSite?.name || "N/A"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              {issue.status.toLowerCase() === "pending" &&
                                userRoleLevel.role === "admin" && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        handleIssueApproval(issue.id)
                                      }
                                      disabled={approvingIssue}
                                      className="border-green-500 text-green-600 hover:bg-green-50"
                                    >
                                      <CheckCircle className="mr-1 h-3 w-3" />
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        handleIssueRejection(issue.id)
                                      }
                                      disabled={approvingIssue}
                                      className="border-red-500 text-red-600 hover:bg-red-50"
                                    >
                                      <XCircle className="mr-1 h-3 w-3" />
                                      Reject
                                    </Button>
                                  </>
                                )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => navigate(`/issues/${issue.id}`)}
                              >
                                <Eye className="mr-1 h-3 w-3" />
                                View Details
                              </Button>
                            </div>
                          </div>

                          {/* Issue Items */}
                          <div className="mt-4 p-3 bg-white rounded border">
                            <h4 className="font-medium text-sm mb-2">
                              Issue Items
                            </h4>
                            <div className="rounded-md border">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Item Name</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Unit</TableHead>
                                    <TableHead>Issue To</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {issue.items.map((item, itemIndex) => (
                                    <TableRow key={itemIndex}>
                                      <TableCell>
                                        {item.Item?.name || "N/A"}
                                      </TableCell>
                                      <TableCell className="font-medium">
                                        {item.quantity}
                                      </TableCell>
                                      <TableCell>
                                        {getUnitName(item.Item?.unitId)}
                                      </TableCell>
                                      <TableCell>{item.issueTo}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>

                          {/* Approval/Rejection Information */}
                          {issue.approvedBy && (
                            <div className="mt-3 p-3 bg-green-50 rounded border">
                              <p className="text-sm">
                                <strong>Approved By:</strong>{" "}
                                {issue.approvedBy.name}
                              </p>
                              <p className="text-sm">
                                <strong>Approved At:</strong>{" "}
                                {formatDate(issue.approvedAt)}
                              </p>
                            </div>
                          )}

                          {issue.rejectedBy && (
                            <div className="mt-3 p-3 bg-red-50 rounded border">
                              <p className="text-sm">
                                <strong>Rejected By:</strong>{" "}
                                {issue.rejectedBy.name}
                              </p>
                              <p className="text-sm">
                                <strong>Rejected At:</strong>{" "}
                                {formatDate(issue.rejectedAt)}
                              </p>
                              {issue.rejectionReason && (
                                <p className="text-sm">
                                  <strong>Reason:</strong>{" "}
                                  {issue.rejectionReason}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No material issues found</p>
                      <p className="text-sm text-gray-400">
                        Material issues will appear here once created
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Print Preview</h1>
            <Button
              onClick={() => setShowPdf(false)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Close Preview
            </Button>
          </div>
          <div className="w-full h-screen border rounded-lg overflow-hidden">
            <PDFViewer width="100%" height="100%">
              <MaterialRequisitionPDF
                requisition={requisition}
                itemGroups={itemGroups}
                units={units}
              />
            </PDFViewer>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialRequisitionView;
