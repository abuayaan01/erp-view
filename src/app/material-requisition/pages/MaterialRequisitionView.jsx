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
  ShieldCloseIcon, // Add this for reject button
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
import { useToast } from "@/hooks/use-toast";
import { PDFViewer } from "@react-pdf/renderer";
import MaterialRequisitionPDF from "./MaterialRequisitionPDF";
import { useSelector } from "react-redux";
import axios from "axios"; // Assuming you're using axios
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
        // Replace with your actual API endpoint
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
    // Trigger print if print parameter is present
    if (shouldPrint && requisition) {
      setShowPdf(true);
    }
  }, [shouldPrint, requisition]);

  const getItemGroupName = (groupId) => {
    const group = itemGroups.find((g) => g.id === groupId);
    return group ? group.name : "Unknown Group";
  };

  const getUnitName = (unitId) => {
    const unit = units.find((u) => u.id === unitId);
    return unit ? unit.shortName || unit.name : "";
  };

  const getPriorityBadge = (priority) => {
    switch (priority.toLowerCase()) {
      case "urgent":
        return <Badge className={"bg-red-500"}>Urgent</Badge>;
      case "high":
        return <Badge className={"bg-red-500"}>High</Badge>;
      case "medium":
        return <Badge className={"bg-orange-400"}>Medium</Badge>;
      case "low":
        return <Badge className={"bg-yellow-400"}>Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return dateString;
    }
  };

  const handlePrint = () => {
    setShowPdf(true);
  };

  const handleApprovalByHO = async () => {
    try {
      setApproving(true);
      // Call the approve API endpoint
      const response = await api.post(`/requisitions/${id}/ho-approve`);

      if (response.status) {
        toast({
          title: "Success",
          description: "Requisition has been approved successfully.",
        });

        // Update the local state with the new data
        setRequisition({
          ...requisition,
          status: "Approved",
          approvedAt: new Date().toISOString(),
          // The API might return the approvedBy information
          // which we could use to update the state more accurately
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
      // Call the approve API endpoint
      const response = await api.post(`/requisitions/${id}/pm-approve`);

      if (response.status) {
        toast({
          title: "Success",
          description: "Requisition has been approved successfully.",
        });

        // Update the local state with the new data
        setRequisition({
          ...requisition,
          status: "Approved",
          approvedAt: new Date().toISOString(),
          // The API might return the approvedBy information
          // which we could use to update the state more accurately
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

        // Refresh the requisition data to get updated issue status
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

        // Refresh the requisition data to get updated issue status
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

  // 3. Add function to get issue status badge
  const getIssueStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "issued":
        return <Badge className="bg-blue-500">Issued</Badge>;
      case "dispatched":
        return <Badge className="bg-indigo-500">Dispatched</Badge>;
      case "received":
        return <Badge className="bg-green-600">Received</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    if (!status) return <Badge variant="secondary">Unknown</Badge>;

    switch (status.toLowerCase()) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200 items-center gap-1"
          >
            <Clock className="h-3 w-3" /> Pending
          </Badge>
        );
      case "approvedbypm":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 items-center gap-1"
          >
            <CheckCircle className="h-3 w-3" /> Approved - PM
          </Badge>
        );
      case "approvedbyho":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200  items-center gap-1"
          >
            <CheckCircle className="h-3 w-3" /> Approved - HO
          </Badge>
        );
      case "forwarded":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200 items-center gap-1"
          >
            <Truck className="h-3 w-3" /> Forwarded
          </Badge>
        );
      case "partially_approved":
        return (
          <Badge
            variant="outline"
            className="bg-orange-50 text-orange-700 border-orange-200 items-center gap-1"
          >
            <AlertTriangle className="h-3 w-3" /> Partially Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 items-center gap-1"
          >
            <XCircle className="h-3 w-3" /> Rejected
          </Badge>
        );
      case "issued":
        return (
          <Badge
            variant="outline"
            className="bg-indigo-50 text-indigo-700 border-indigo-200 items-center gap-1"
          >
            <Truck className="h-3 w-3" /> Issued
          </Badge>
        );
      case "received":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 items-center gap-1"
          >
            <CheckCircle className="h-3 w-3" /> Received
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  if (!requisition) {
    return (
      <div className="flex justify-center items-center h-64">
        Requisition not found
      </div>
    );
  }

  function getApprovalButton() {
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
      } else return null;
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
  }

  function getProcurementButton() {
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
    } else return null;
  }

  function getIssueButton() {
    const isApprovedByHo = requisition.status.toLowerCase() === "approvedbyho";
    const isAdmin = userRoleLevel.role === "admin";
    if (isApprovedByHo && !isAdmin) {
      const isSameSite = currentUser.site.id == requisition.requestingSite.id;
      console.log(isApprovedByHo, isAdmin, isSameSite);
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
    } else return null;
  }

  function getClosureButton() {
    const handleCloseRequisition = async () => {
      try {
        setClose(true);
        // Call the approve API endpoint
        const response = await api.post(`/requisitions/${id}/complete`);

        if (response.status) {
          toast({
            title: "Success",
            description: "Requisition has been completed successfully.",
          });

          // Update the local state with the new data
          setRequisition({
            ...requisition,
            status: "Completed",
            approvedAt: new Date().toISOString(),
            // The API might return the approvedBy information
            // which we could use to update the state more accurately
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
            onClick={() => handleCloseRequisition()}
            className="bg-sky-600 hover:bg-sky-700"
            loading={close}
          >
            <ShieldCloseIcon className="mr-2 h-4 w-4" />
            Close
          </Button>
        );
      }
    } else return null;
  }

  return (
    <div className="space-y-6">
      {!showPdf ? (
        <>
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
                Material Requisition: {requisition.requisitionNo}
              </h1>
            </div>
            <div className="flex gap-2">
              {getApprovalButton()}
              {getProcurementButton()}
              {getIssueButton()}
              {getClosureButton()}
              <Button onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" /> Print
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Requisition Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Requisition No
                  </p>
                  <p className="font-medium">{requisition.requisitionNo}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Requested At</p>
                  <p className="font-medium">
                    {formatDate(requisition.requestedAt)}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Requested Site
                  </p>
                  <p className="font-medium">
                    {requisition.requestingSite?.name || "N/A"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Requested For</p>
                  <p className="font-medium">
                    {requisition.requestedFor || "N/A"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Charge Type</p>
                  <p className="font-medium">{requisition.chargeType}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Priority</p>
                  <div className="font-medium print:hidden">
                    {getPriorityBadge(requisition.requestPriority)}
                  </div>
                  <p className="font-medium hidden print:block">
                    {requisition.requestPriority}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="font-medium">
                    {requisition.dueDate
                      ? new Date(requisition.dueDate).toLocaleDateString()
                      : "Not specified"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Prepared By</p>
                  <p className="font-medium">
                    {requisition.preparedBy?.name || "N/A"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="font-medium print:hidden w-auto">
                    {getStatusBadge(requisition.status)}
                  </div>
                  <p className="font-medium hidden print:block">
                    {requisition.status}
                  </p>
                </div>

                {requisition.approvedById && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Approved By</p>
                    <p className="font-medium">
                      {requisition.approvedBy?.name || "N/A"}
                    </p>
                  </div>
                )}

                {requisition.approvedAt && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Approved At</p>
                    <p className="font-medium">
                      {formatDate(requisition.approvedAt)}
                    </p>
                  </div>
                )}
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
                      <TableHead>Part No</TableHead>
                      <TableHead>HSN Code</TableHead>
                      <TableHead>Quantity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requisition.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.Item?.name || "N/A"}</TableCell>
                        <TableCell>{item.Item?.partNumber || "-"}</TableCell>
                        <TableCell>{item.Item?.hsnCode || "-"}</TableCell>
                        <TableCell>
                          {item.quantity} {getUnitName(item.Item?.unitId)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {requisition.materialIssues &&
            requisition.materialIssues.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Material Issues</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {requisition.materialIssues.map((issue, index) => (
                      <div key={issue.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">
                                Issue Number
                              </p>
                              <p className="font-medium">{issue.issueNumber}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">
                                Issue Date
                              </p>
                              <p className="font-medium">
                                {issue.issueDate
                                  ? new Date(
                                      issue.issueDate
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">
                                Issue Type
                              </p>
                              <p className="font-medium">{issue.issueType}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">
                                Status
                              </p>
                              <div className="font-medium print:hidden">
                                {getIssueStatusBadge(issue.status)}
                              </div>
                              <p className="font-medium hidden print:block">
                                {issue.status}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">
                                From Site
                              </p>
                              <p className="font-medium">
                                {issue.siteId || "N/A"}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">
                                To Site
                              </p>
                              <p className="font-medium">
                                {issue.otherSiteId || "N/A"}
                              </p>
                            </div>
                          </div>

                          {/* Admin approval/rejection buttons */}
                          {userRoleLevel.role === "admin" &&
                            issue.status.toLowerCase() === "pending" && (
                              <div className="flex gap-2 ml-4">
                                <Button
                                  size="sm"
                                  onClick={() => handleIssueApproval(issue.id)}
                                  disabled={approvingIssue}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                  {approvingIssue ? "Approving..." : "Approve"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleIssueRejection(issue.id)}
                                  disabled={approvingIssue}
                                >
                                  ✕ Reject
                                </Button>
                              </div>
                            )}
                        </div>

                        {/* Issue Items */}
                        {issue.items && issue.items.length > 0 && (
                          <div className="mt-4">
                            <h4 className="font-medium mb-2">Items:</h4>
                            <div className="rounded-md border">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Sr. No</TableHead>
                                    <TableHead>Item</TableHead>
                                    <TableHead>Part No</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Issue To</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {issue.items.map((item, itemIndex) => (
                                    <TableRow key={itemIndex}>
                                      <TableCell>{itemIndex + 1}</TableCell>
                                      <TableCell>
                                        {item.Item?.name || "N/A"}
                                      </TableCell>
                                      <TableCell>
                                        {item.Item?.partNumber || "-"}
                                      </TableCell>
                                      <TableCell>
                                        {item.quantity}{" "}
                                        {getUnitName(item.Item?.unitId)}
                                      </TableCell>
                                      <TableCell>
                                        {item.issueTo || "N/A"}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
        </>
      ) : (
        <div className="flex flex-col h-screen">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Material Requisition Slip</h1>
            <Button variant="outline" onClick={() => setShowPdf(false)}>
              Back to Details
            </Button>
          </div>
          <div className="flex-1 border rounded">
            <PDFViewer width="100%" height="100%" className="border">
              <MaterialRequisitionPDF
                formData={{
                  ...requisition,
                  time: new Date(requisition.requestedAt).toLocaleTimeString(),
                }}
                items={requisition.items}
              />
            </PDFViewer>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialRequisitionView;
