"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  CheckCircle,
  FileText,
  MapPin,
  Truck,
  X,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function MachineTransferDetail({
  transferData,
  onRefresh,
  userRole = "admin",
  userId = 1,
}) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [transportDetails, setTransportDetails] = useState({
    vehicleNumber: "",
    driverName: "",
    mobileNumber: "",
  });

  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [openDispatchDialog, setOpenDispatchDialog] = useState(false);
  const [openReceiveDialog, setOpenReceiveDialog] = useState(false);

  const transfer = transferData.data;

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Rejected
          </Badge>
        );
      case "dispatched":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Dispatched
          </Badge>
        );
      case "in transit":
        return (
          <Badge
            variant="outline"
            className="bg-orange-50 text-orange-700 border-orange-200"
          >
            In Transit
          </Badge>
        );
      case "received":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 border-emerald-200"
          >
            Received
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Handle approve action
  const handleApprove = async () => {
    setLoading(true);
    try {
      // In a real app, you would make an API call here
      // await fetch(`/api/transfers/${transfer.id}/approve`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ remarks })
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Transfer Approved",
        description: "The machine transfer has been approved successfully.",
      });

      if (onRefresh) onRefresh();
      setOpenApproveDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve the transfer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle reject action
  const handleReject = async () => {
    setLoading(true);
    try {
      // In a real app, you would make an API call here
      // await fetch(`/api/transfers/${transfer.id}/reject`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ remarks })
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Transfer Rejected",
        description: "The machine transfer has been rejected.",
      });

      if (onRefresh) onRefresh();
      setOpenRejectDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject the transfer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle dispatch action
  const handleDispatch = async () => {
    setLoading(true);
    try {
      // In a real app, you would make an API call here
      // await fetch(`/api/transfers/${transfer.id}/dispatch`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ transportDetails, remarks })
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Machine Dispatched",
        description: "The machine has been dispatched successfully.",
      });

      if (onRefresh) onRefresh();
      setOpenDispatchDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to dispatch the machine. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle receive action
  const handleReceive = async () => {
    setLoading(true);
    try {
      // In a real app, you would make an API call here
      // await fetch(`/api/transfers/${transfer.id}/receive`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ remarks })
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Machine Received",
        description: "The machine has been received successfully.",
      });

      if (onRefresh) onRefresh();
      setOpenReceiveDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Failed to mark the machine as received. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Determine which action buttons to show based on status and user role
  const showApproveButton =
    transfer.status === "Pending" &&
    (userRole === "admin" ||
      userRole === "project-manager" ||
      userRole === "mechanical-head" ||
      userRole === "source-pm");

  const showRejectButton =
    transfer.status === "Pending" &&
    (userRole === "admin" ||
      userRole === "project-manager" ||
      userRole === "mechanical-head" ||
      userRole === "source-pm");

  const showDispatchButton =
    transfer.status === "Approved" &&
    !transfer.dispatchedAt &&
    (userRole === "admin" || userRole === "site-manager");

  const showReceiveButton =
    transfer.status === "Dispatched" &&
    !transfer.receivedAt &&
    (userRole === "admin" || userRole === "site-manager");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{transfer.name}</h1>
          <p className="text-muted-foreground">Machine Transfer Request</p>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(transfer.status)}
          <Button variant="outline" onClick={() => navigate("/machine-transfer/list")}>
            Back
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Transfer Information</CardTitle>
            <CardDescription>
              Basic details about this transfer request
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Request ID
                </p>
                <p>{transfer.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Request Type
                </p>
                <p>{transfer.requestType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <div>{getStatusBadge(transfer.status)}</div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Self-Carrying
                </p>
                <p>{transfer.selfCarryingVehicle ? "Yes" : "No"}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Reason
              </p>
              <p className="mt-1">{transfer.reason || "No reason provided"}</p>
            </div>

            {transfer.remarks && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Remarks
                </p>
                <p className="mt-1">{transfer.remarks}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Machine Information */}
        <Card>
          <CardHeader>
            <CardTitle>Machine Details</CardTitle>
            <CardDescription>
              Information about the machine being transferred
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Machine Name
              </p>
              <p>{transfer.machine.machineName}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  ERP Code
                </p>
                <p>{transfer.machine.erpCode}</p>
              </div>
              {transfer.machine.registrationNumber && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Registration Number
                  </p>
                  <p>{transfer.machine.registrationNumber}</p>
                </div>
              )}
              {transfer.machine.machineNumber && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Machine Number
                  </p>
                  <p>{transfer.machine.machineNumber}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Site Information */}
        <Card>
          <CardHeader>
            <CardTitle>Site Information</CardTitle>
            <CardDescription>
              Current and destination site details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-muted p-2 rounded-full">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Current Site
                </p>
                <p className="font-medium">{transfer.currentSite.name}</p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-4">
              <div className="bg-muted p-2 rounded-full">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Destination Site
                </p>
                <p className="font-medium">{transfer.destinationSite.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline Information */}
        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
            <CardDescription>Request and approval timeline</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-muted p-2 rounded-full">
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="font-medium">Requested</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(transfer.createdAt)}
                  </p>
                </div>
                <p className="text-sm">by {transfer.requester.name}</p>
              </div>
            </div>

            {transfer.approvedAt && (
              <>
                <Separator />
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium">Approved</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(transfer.approvedAt)}
                      </p>
                    </div>
                    <p className="text-sm">
                      by {transfer.approver?.name || "Unknown"}
                    </p>
                  </div>
                </div>
              </>
            )}

            {transfer.rejectedAt && (
              <>
                <Separator />
                <div className="flex items-start gap-4">
                  <div className="bg-red-100 p-2 rounded-full">
                    <X className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium">Rejected</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(transfer.rejectedAt)}
                      </p>
                    </div>
                    <p className="text-sm">
                      by{" "}
                      {transfer.rejectedBy
                        ? "User ID: " + transfer.rejectedBy
                        : "Unknown"}
                    </p>
                    {transfer.rejectionRemarks && (
                      <p className="text-sm mt-1 text-muted-foreground">
                        "{transfer.rejectionRemarks}"
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {transfer.dispatchedAt && (
              <>
                <Separator />
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Truck className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium">Dispatched</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(transfer.dispatchedAt)}
                      </p>
                    </div>
                    <p className="text-sm">
                      by {transfer.dispatcher?.name || "Unknown"}
                    </p>
                  </div>
                </div>
              </>
            )}

            {transfer.receivedAt && (
              <>
                <Separator />
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-100 p-2 rounded-full">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium">Received</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(transfer.receivedAt)}
                      </p>
                    </div>
                    <p className="text-sm">
                      by {transfer.receiver?.name || "Unknown"}
                    </p>
                    {transfer.finalRemarks && (
                      <p className="text-sm mt-1 text-muted-foreground">
                        "{transfer.finalRemarks}"
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Transport Details */}
        {(transfer.transportDetails ||
          transfer.status === "Dispatched" ||
          transfer.status === "Received") && (
          <Card>
            <CardHeader>
              <CardTitle>Transport Details</CardTitle>
              <CardDescription>Information about the transport</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {transfer.transportDetails ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Vehicle Number
                      </p>
                      <p>{transfer.transportDetails.vehicleNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Driver Name
                      </p>
                      <p>{transfer.transportDetails.driverName}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Mobile Number
                    </p>
                    <p>{transfer.transportDetails.mobileNumber}</p>
                  </div>
                </>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No transport details</AlertTitle>
                  <AlertDescription>
                    Transport details will be added when the machine is
                    dispatched.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Action Buttons */}
      {(showApproveButton ||
        showRejectButton ||
        showDispatchButton ||
        showReceiveButton) && (
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>
              Available actions for this transfer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {showApproveButton && (
                <Dialog
                  open={openApproveDialog}
                  onOpenChange={setOpenApproveDialog}
                >
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Approve Transfer
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Approve Machine Transfer</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to approve this machine transfer
                        request?
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="approve-remarks">
                          Remarks (Optional)
                        </Label>
                        <Textarea
                          id="approve-remarks"
                          placeholder="Add any remarks or notes"
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setOpenApproveDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleApprove} disabled={loading}>
                        {loading ? "Processing..." : "Approve"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {showRejectButton && (
                <Dialog
                  open={openRejectDialog}
                  onOpenChange={setOpenRejectDialog}
                >
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="gap-2">
                      <X className="h-4 w-4" />
                      Reject Transfer
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reject Machine Transfer</DialogTitle>
                      <DialogDescription>
                        Please provide a reason for rejecting this transfer
                        request.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="reject-remarks">Rejection Reason</Label>
                        <Textarea
                          id="reject-remarks"
                          placeholder="Enter reason for rejection"
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setOpenRejectDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleReject}
                        disabled={loading || !remarks}
                      >
                        {loading ? "Processing..." : "Reject"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {showDispatchButton && (
                <Dialog
                  open={openDispatchDialog}
                  onOpenChange={setOpenDispatchDialog}
                >
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Truck className="h-4 w-4" />
                      Dispatch Machine
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Dispatch Machine</DialogTitle>
                      <DialogDescription>
                        Enter transport details to dispatch this machine.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="vehicle-number">Vehicle Number</Label>
                        <Input
                          id="vehicle-number"
                          placeholder="Enter vehicle number"
                          value={transportDetails.vehicleNumber}
                          onChange={(e) =>
                            setTransportDetails({
                              ...transportDetails,
                              vehicleNumber: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="driver-name">Driver Name</Label>
                        <Input
                          id="driver-name"
                          placeholder="Enter driver name"
                          value={transportDetails.driverName}
                          onChange={(e) =>
                            setTransportDetails({
                              ...transportDetails,
                              driverName: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mobile-number">Mobile Number</Label>
                        <Input
                          id="mobile-number"
                          placeholder="Enter mobile number"
                          value={transportDetails.mobileNumber}
                          onChange={(e) =>
                            setTransportDetails({
                              ...transportDetails,
                              mobileNumber: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dispatch-remarks">
                          Remarks (Optional)
                        </Label>
                        <Textarea
                          id="dispatch-remarks"
                          placeholder="Add any remarks or notes"
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setOpenDispatchDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleDispatch}
                        disabled={
                          loading ||
                          !transportDetails.vehicleNumber ||
                          !transportDetails.driverName ||
                          !transportDetails.mobileNumber
                        }
                      >
                        {loading ? "Processing..." : "Dispatch"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {showReceiveButton && (
                <Dialog
                  open={openReceiveDialog}
                  onOpenChange={setOpenReceiveDialog}
                >
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Receive Machine
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Receive Machine</DialogTitle>
                      <DialogDescription>
                        Confirm that you have received the machine at your site.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="receive-remarks">
                          Final Remarks (Optional)
                        </Label>
                        <Textarea
                          id="receive-remarks"
                          placeholder="Add any final remarks or notes about the condition of the machine"
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setOpenReceiveDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleReceive} disabled={loading}>
                        {loading ? "Processing..." : "Confirm Receipt"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
