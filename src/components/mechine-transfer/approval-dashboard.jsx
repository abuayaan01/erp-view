"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle } from "lucide-react";
import Loader from "@/components/ui/loader";
import api from "@/services/api/api-service";

// Mock data for demonstration - replace with your API calls

export function ApprovalDashboard() {
  const { toast } = useToast();
  const [transfers, setTransfers] = useState([]);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await api.get("/transfers?status=Pending");
        if (res) {
          setTransfers(res.data);
        }
      } catch (error) {
        console.log(error);
        toast({
          title: "Something went wrong!",
          description: "Could not fetch list.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleApprove = async (transferId) => {
    // In a real application, you would send this data to your API

    try {
      setApprovalLoading(true);
      const res = await api.put(`/transfer/${transferId}/approve`);
      // Remove the transfer from the list
      setTransfers(transfers.filter((transfer) => transfer.id !== transferId));

      // Show success message
      toast({
        title: "Transfer Approved",
        description: `Transfer ${transferId} has been approved successfully`,
        variant: "default",
      });
    } catch (error) {
      // Show success message
      toast({
        title: "Transfer Approval Failed",
        description: `Transfer request ${transferId} cannot be initiated`,
        variant: "destructive",
      });
    } finally {
      setApprovalLoading(false);
    }
  };

  const openRejectDialog = (transfer) => {
    setSelectedTransfer(transfer);
    setRejectionReason("");
    setIsRejectDialogOpen(true);
  };

  const handleReject = () => {
    if (!rejectionReason) {
      toast({
        title: "Validation Error",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      });
      return;
    }

    // In a real application, you would send this data to your API
    console.log(
      `Rejecting transfer ${selectedTransfer.id} with reason: ${rejectionReason}`
    );

    // Remove the transfer from the list
    setTransfers(
      transfers.filter((transfer) => transfer.id !== selectedTransfer.id)
    );

    // Close the dialog
    setIsRejectDialogOpen(false);

    // Show success message
    toast({
      title: "Transfer Rejected",
      description: `Transfer ${selectedTransfer.id} has been rejected`,
      variant: "destructive",
    });
  };

  // {
  //   id: "TR-005",
  //   machine.machineName: "Excavator XL1000",
  //   machineId: "M005",
  //   currentSite.name: "Site D",
  //   destinationSite.name: "Site B",
  //   requester.name: "Jane Smith",
  //   createdAt: "2023-10-01",
  //   reason: "Machine maintenance completed, returning to original site",
  //   requestType: "Site Transfer",
  // },

  return loading ? (
    <div className="mx-auto min-h-[70vh] flex flex-col">
      <div className="flex-1 flex justify-center items-center">
        <Loader />
      </div>
    </div>
  ) : (
    <div className="space-y-6">
      {transfers.length > 0 ? (
        transfers.map((transfer) => (
          <Card key={transfer.id}>
            <CardHeader>
              <CardTitle className="text-xl">
                Transfer Request: {transfer.id}
              </CardTitle>
              <CardDescription>
                Requested by {transfer.requester.name} on {transfer.createdAt}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Machine Details</h3>
                  <p className="text-sm text-muted-foreground">
                    {transfer.machine.machineName} ({transfer.machineId})
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Request requestType</h3>
                  <p className="text-sm text-muted-foreground">
                    {transfer.requestType === "Site Transfer"
                      ? "Site Transfer"
                      : transfer.requestType === "Sell"
                      ? "Sell Machine"
                      : "Scrap Machine"}
                  </p>
                </div>
              </div>

              {transfer.requestType === "Site Transfer" && (
                <div>
                  <h3 className="text-sm font-medium">Transfer Route</h3>
                  <p className="text-sm text-muted-foreground">
                    {transfer.currentSite.name} →{" "}
                    {transfer.destinationSite.name}
                  </p>
                </div>
              )}

              {transfer.requestType === "Sell Machine" && (
                <div className="border rounded-md p-3 space-y-2">
                  <h3 className="text-sm font-medium">Buyer Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Buyer Name
                      </p>
                      <p className="text-sm">
                        {transfer.buyerDetails?.buyerName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Buyer Contact
                      </p>
                      <p className="text-sm">
                        {transfer.buyerDetails?.buyerContact}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Sale Amount
                      </p>
                      <p className="text-sm">
                        {transfer.buyerDetails?.saleAmount || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Current Site
                      </p>
                      <p className="text-sm">{transfer.currentSite.name}</p>
                    </div>
                  </div>
                </div>
              )}

              {transfer.requestType === "Scrap Machine" && (
                <div className="border rounded-md p-3 space-y-2">
                  <h3 className="text-sm font-medium">Scrap Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Scrap Vendor
                      </p>
                      <p className="text-sm">
                        {transfer.scrapDetails?.scrapVendor}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Scrap Value
                      </p>
                      <p className="text-sm">
                        {transfer.scrapDetails?.scrapValue || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Current Site
                      </p>
                      <p className="text-sm">{transfer.currentSite.name}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium">Request Reason</h3>
                <p className="text-sm text-muted-foreground">
                  {transfer.reason}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => openRejectDialog(transfer)}
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
              <Button
                loading={approvalLoading}
                onClick={() => handleApprove(transfer.id)}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </Button>
            </CardFooter>
          </Card>
        ))
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Pending Transfers</CardTitle>
            <CardDescription>
              There are no machine transfer requests pending for approval
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Transfer Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this transfer request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Enter rejection reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRejectDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
