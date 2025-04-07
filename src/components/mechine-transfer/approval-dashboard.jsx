"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, XCircle } from "lucide-react"

// Mock data for demonstration - replace with your API calls
const pendingTransfers = [
  {
    id: "TR-001",
    machineName: "Excavator XL2000",
    machineId: "M001",
    fromSite: "Site A",
    toSite: "Site B",
    requestedBy: "John Doe",
    requestDate: "2023-10-15",
    reason: "Required for new project at Site B",
    type: "site_transfer",
  },
  {
    id: "TR-005",
    machineName: "Excavator XL1000",
    machineId: "M005",
    fromSite: "Site D",
    toSite: "Site B",
    requestedBy: "Jane Smith",
    requestDate: "2023-10-01",
    reason: "Machine maintenance completed, returning to original site",
    type: "site_transfer",
  },
  {
    id: "TR-006",
    machineName: "Forklift F200",
    machineId: "M008",
    fromSite: "Site A",
    buyerName: "ABC Construction",
    buyerContact: "9876543210",
    saleAmount: "500000",
    requestedBy: "Mike Johnson",
    requestDate: "2023-10-18",
    reason: "Machine is outdated and no longer needed. Replacement already purchased.",
    type: "sell",
  },
  {
    id: "TR-007",
    machineName: "Compactor C100",
    machineId: "M010",
    fromSite: "Site C",
    scrapVendor: "XYZ Recycling",
    scrapValue: "50000",
    requestedBy: "Sarah Williams",
    requestDate: "2023-10-16",
    reason: "Machine is damaged beyond repair and not economical to fix.",
    type: "scrap",
  },
]

export function ApprovalDashboard() {
  const { toast } = useToast()
  const [transfers, setTransfers] = useState(pendingTransfers)
  const [rejectionReason, setRejectionReason] = useState("")
  const [selectedTransfer, setSelectedTransfer] = useState(null)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)

  const handleApprove = (transferId) => {
    // In a real application, you would send this data to your API
    console.log(`Approving transfer ${transferId}`)

    // Remove the transfer from the list
    setTransfers(transfers.filter((transfer) => transfer.id !== transferId))

    // Show success message
    toast({
      title: "Transfer Approved",
      description: `Transfer ${transferId} has been approved successfully`,
      variant: "default",
    })
  }

  const openRejectDialog = (transfer) => {
    setSelectedTransfer(transfer)
    setRejectionReason("")
    setIsRejectDialogOpen(true)
  }

  const handleReject = () => {
    if (!rejectionReason) {
      toast({
        title: "Validation Error",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      })
      return
    }

    // In a real application, you would send this data to your API
    console.log(`Rejecting transfer ${selectedTransfer.id} with reason: ${rejectionReason}`)

    // Remove the transfer from the list
    setTransfers(transfers.filter((transfer) => transfer.id !== selectedTransfer.id))

    // Close the dialog
    setIsRejectDialogOpen(false)

    // Show success message
    toast({
      title: "Transfer Rejected",
      description: `Transfer ${selectedTransfer.id} has been rejected`,
      variant: "destructive",
    })
  }

  return (
    <div className="space-y-6">
      {transfers.length > 0 ? (
        transfers.map((transfer) => (
          <Card key={transfer.id}>
            <CardHeader>
              <CardTitle className="text-xl">Transfer Request: {transfer.id}</CardTitle>
              <CardDescription>
                Requested by {transfer.requestedBy} on {transfer.requestDate}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Machine Details</h3>
                  <p className="text-sm text-muted-foreground">
                    {transfer.machineName} ({transfer.machineId})
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Request Type</h3>
                  <p className="text-sm text-muted-foreground">
                    {transfer.type === "site_transfer"
                      ? "Site Transfer"
                      : transfer.type === "sell"
                        ? "Sell Machine"
                        : "Scrap Machine"}
                  </p>
                </div>
              </div>

              {transfer.type === "site_transfer" && (
                <div>
                  <h3 className="text-sm font-medium">Transfer Route</h3>
                  <p className="text-sm text-muted-foreground">
                    {transfer.fromSite} → {transfer.toSite}
                  </p>
                </div>
              )}

              {transfer.type === "sell" && (
                <div className="border rounded-md p-3 space-y-2">
                  <h3 className="text-sm font-medium">Buyer Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Buyer Name</p>
                      <p className="text-sm">{transfer.buyerName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Buyer Contact</p>
                      <p className="text-sm">{transfer.buyerContact}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Sale Amount</p>
                      <p className="text-sm">{transfer.saleAmount || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Current Site</p>
                      <p className="text-sm">{transfer.fromSite}</p>
                    </div>
                  </div>
                </div>
              )}

              {transfer.type === "scrap" && (
                <div className="border rounded-md p-3 space-y-2">
                  <h3 className="text-sm font-medium">Scrap Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Scrap Vendor</p>
                      <p className="text-sm">{transfer.scrapVendor}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Scrap Value</p>
                      <p className="text-sm">{transfer.scrapValue || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Current Site</p>
                      <p className="text-sm">{transfer.fromSite}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium">Request Reason</h3>
                <p className="text-sm text-muted-foreground">{transfer.reason}</p>
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
              <Button onClick={() => handleApprove(transfer.id)} className="bg-green-600 text-white hover:bg-green-700">
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
            <CardDescription>There are no machine transfer requests pending for approval</CardDescription>
          </CardHeader>
        </Card>
      )}

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Transfer Request</DialogTitle>
            <DialogDescription>Please provide a reason for rejecting this transfer request.</DialogDescription>
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
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReject} className="bg-red-600 text-white hover:bg-red-700">
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

