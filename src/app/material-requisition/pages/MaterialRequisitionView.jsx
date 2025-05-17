"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Printer, CheckCircle } from "lucide-react";
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

const MaterialRequisitionView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [requisition, setRequisition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [itemGroups, setItemGroups] = useState([]);
  const [units, setUnits] = useState([]);
  const [showPdf, setShowPdf] = useState(false);

  const storedItemGroups = useSelector((state) => state.itemGroups) || [];
  const storedUnits = useSelector((state) => state.units) || [];

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
          navigate("/requisitions/list");
        }
      } catch (error) {
        toast({
          title: "Requisition Not Found",
          description: "The requisition you're looking for doesn't exist.",
          variant: "destructive",
        });
        navigate("/requisitions/list");
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
        return <Badge variant="destructive">Urgent</Badge>;
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge variant="default">Medium</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
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

  const handleApprove = async () => {
    try {
      setApproving(true);
      // Call the approve API endpoint
      const response = await api.post(`/requisitions/${id}/approve`);
      
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
          description: response.data?.message || "Failed to approve requisition",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to approve requisition",
        variant: "destructive",
      });
    } finally {
      setApproving(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "approved":
        return <Badge variant="success">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "received":
        return <Badge variant="default">Received</Badge>;
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

  return (
    <div className="space-y-6">
      {!showPdf ? (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/requisitions/list")}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
              <h1 className="text-3xl font-bold tracking-tight">
                Material Requisition: {requisition.requisitionNo}
              </h1>
            </div>
            <div className="flex gap-2">
              {requisition.status.toLowerCase() === "pending" && (
                <Button 
                  variant="default" 
                  onClick={handleApprove} 
                  disabled={approving}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="mr-2 h-4 w-4" /> 
                  {approving ? "Approving..." : "Approve"}
                </Button>
              )}
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
                  <div className="font-medium print:hidden">
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