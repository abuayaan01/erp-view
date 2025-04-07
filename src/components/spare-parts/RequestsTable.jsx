"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Check, X, MoreHorizontal, Truck, Package, Eye } from "lucide-react"

export function RequestsTable({ requests }) {
  const [actionDialog, setActionDialog] = useState({ open: false, type: null, request: null })
  const [remark, setRemark] = useState("")

  const handleApprove = (request) => {
    setActionDialog({ open: true, type: "approve", request })
  }

  const handleReject = (request) => {
    setActionDialog({ open: true, type: "reject", request })
  }

  const handleDispatch = (request) => {
    setActionDialog({ open: true, type: "dispatch", request })
  }

  const handleReceive = (request) => {
    setActionDialog({ open: true, type: "receive", request })
  }

  const handleDialogClose = () => {
    setActionDialog({ open: false, type: null, request: null })
    setRemark("")
  }

  const handleActionSubmit = () => {
    // In a real app, this would make an API call
    console.log(`Action ${actionDialog.type} for request ID ${actionDialog.request.id} with remark: ${remark}`)
    handleDialogClose()
  }

  // Function to render status badge
  const renderStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800">
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Approved
          </Badge>
        )
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      case "dispatched":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Dispatched
          </Badge>
        )
      case "received":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            Received
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Function to render action buttons based on status
  const renderActionButtons = (request) => {
    switch (request.status) {
      case "pending":
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleApprove(request)} className="text-green-600">
                <Check className="mr-2 h-4 w-4" />
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleReject(request)} className="text-red-600">
                <X className="mr-2 h-4 w-4" />
                Reject
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      case "approved":
        return (
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-1"
            onClick={() => handleDispatch(request)}
          >
            <Truck className="h-3 w-3" />
            Dispatch
          </Button>
        )
      case "dispatched":
        return (
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-1"
            onClick={() => handleReceive(request)}
          >
            <Package className="h-3 w-3" />
            Receive
          </Button>
        )
      case "received":
      case "rejected":
        return (
          <Button size="sm" variant="ghost" className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            View
          </Button>
        )
      default:
        return null
    }
  }

  // Render dialog content based on action type
  const renderDialogContent = () => {
    const request = actionDialog.request

    if (!request) return null

    switch (actionDialog.type) {
      case "approve":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Approve Request</DialogTitle>
              <DialogDescription>
                You are approving the request for {request.quantity} x {request.partName} ({request.partNo}) for{" "}
                {request.site}.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium">Remarks (optional)</label>
                <Textarea
                  placeholder="Add any instructions or remarks for this approval..."
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={handleDialogClose}>
                Cancel
              </Button>
              <Button className="flex items-center gap-2" onClick={handleActionSubmit}>
                <Check className="h-4 w-4" />
                Approve Request
              </Button>
            </DialogFooter>
          </>
        )
      case "reject":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Reject Request</DialogTitle>
              <DialogDescription>
                You are rejecting the request for {request.quantity} x {request.partName} ({request.partNo}) for{" "}
                {request.site}.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium">
                  Reason for rejection <span className="text-red-500">*</span>
                </label>
                <Textarea
                  placeholder="Provide a reason for rejection..."
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  required
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={handleDialogClose}>
                Cancel
              </Button>
              <Button variant="destructive" className="flex items-center gap-2" onClick={handleActionSubmit}>
                <X className="h-4 w-4" />
                Reject Request
              </Button>
            </DialogFooter>
          </>
        )
      case "dispatch":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Dispatch Parts</DialogTitle>
              <DialogDescription>
                Provide transportation details for dispatching {request.quantity} x {request.partName} to {request.site}
                .
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">
                    Vehicle Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter vehicle number"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Driver Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter driver name"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Dispatch Notes</label>
                <Textarea
                  placeholder="Enter any notes for this dispatch..."
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={handleDialogClose}>
                Cancel
              </Button>
              <Button className="flex items-center gap-2" onClick={handleActionSubmit}>
                <Truck className="h-4 w-4" />
                Dispatch Parts
              </Button>
            </DialogFooter>
          </>
        )
      case "receive":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Receive Parts</DialogTitle>
              <DialogDescription>
                Confirm receipt of {request.quantity} x {request.partName} at {request.site}.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="received-in-good-condition" className="rounded border-gray-300" />
                <label htmlFor="received-in-good-condition" className="text-sm font-medium">
                  Parts received in good condition
                </label>
              </div>
              <div>
                <label className="text-sm font-medium">Receipt Notes</label>
                <Textarea
                  placeholder="Enter any notes about the received parts..."
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={handleDialogClose}>
                Cancel
              </Button>
              <Button className="flex items-center gap-2" onClick={handleActionSubmit}>
                <Package className="h-4 w-4" />
                Confirm Receipt
              </Button>
            </DialogFooter>
          </>
        )
      default:
        return null
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Part Name</TableHead>
              <TableHead>Part No.</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Site</TableHead>
              <TableHead className="hidden md:table-cell">Requested By</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length > 0 ? (
              requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.partName}</TableCell>
                  <TableCell>{request.partNo}</TableCell>
                  <TableCell>{request.quantity}</TableCell>
                  <TableCell>{request.site}</TableCell>
                  <TableCell className="hidden md:table-cell">{request.requestedBy}</TableCell>
                  <TableCell className="hidden md:table-cell">{request.date}</TableCell>
                  <TableCell>{renderStatusBadge(request.status)}</TableCell>
                  <TableCell className="text-right">{renderActionButtons(request)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  No requests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Action Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => !open && handleDialogClose()}>
        <DialogContent>{renderDialogContent()}</DialogContent>
      </Dialog>
    </>
  )
}

