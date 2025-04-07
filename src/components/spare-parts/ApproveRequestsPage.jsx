"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Check, X, Filter, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ApproveRequestsPage() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionDialog, setActionDialog] = useState({ open: false, type: null, request: null })
  const [remark, setRemark] = useState("")
  const [statusFilter, setStatusFilter] = useState("pending")

  // Fetch requests
  useEffect(() => {
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      const mockRequests = [
        {
          id: 1,
          partName: "Oil Filter",
          partNo: "OF-1234",
          quantity: 2,
          requestedBy: "John Smith",
          date: "2023-06-16",
          requiredBy: "2023-06-23",
          status: "pending",
          site: "Project Alpha",
          priority: "normal",
          reason: "Regular maintenance schedule",
        },
        {
          id: 2,
          partName: "Brake Pad",
          partNo: "BP-9101",
          quantity: 4,
          requestedBy: "Sarah Johnson",
          date: "2023-06-15",
          requiredBy: "2023-06-22",
          status: "pending",
          site: "Project Beta",
          priority: "high",
          reason: "Safety critical component showing wear",
        },
        {
          id: 3,
          partName: "Air Filter",
          partNo: "AF-5678",
          quantity: 1,
          requestedBy: "Mike Brown",
          date: "2023-06-14",
          requiredBy: "2023-06-30",
          status: "approved",
          site: "Project Gamma",
          priority: "normal",
          reason: "Scheduled replacement",
        },
        {
          id: 4,
          partName: "Fuel Pump",
          partNo: "FP-1121",
          quantity: 1,
          requestedBy: "Lisa Davis",
          date: "2023-06-13",
          requiredBy: "2023-06-20",
          status: "rejected",
          site: "Project Alpha",
          priority: "normal",
          reason: "Machine not operational",
        },
        {
          id: 5,
          partName: "Radiator",
          partNo: "RA-7181",
          quantity: 1,
          requestedBy: "James Wilson",
          date: "2023-06-12",
          requiredBy: "2023-06-15",
          status: "dispatched",
          site: "Project Beta",
          priority: "urgent",
          reason: "Machine overheating",
        },
        {
          id: 6,
          partName: "Spark Plug",
          partNo: "SP-5161",
          quantity: 6,
          requestedBy: "Robert Taylor",
          date: "2023-06-11",
          requiredBy: "2023-06-14",
          status: "received",
          site: "Project Gamma",
          priority: "low",
          reason: "Routine replacement",
        },
      ]

      setRequests(mockRequests)
      setLoading(false)
    }, 1200)
  }, [])

  const handleApprove = (request) => {
    setActionDialog({ open: true, type: "approve", request })
  }

  const handleReject = (request) => {
    setActionDialog({ open: true, type: "reject", request })
  }

  const handleDialogClose = () => {
    setActionDialog({ open: false, type: null, request: null })
    setRemark("")
  }

  const handleActionSubmit = () => {
    // In a real app, this would make an API call
    const { type, request } = actionDialog

    // Update the request status
    const updatedRequests = requests.map((req) => {
      if (req.id === request.id) {
        return { ...req, status: type === "approve" ? "approved" : "rejected" }
      }
      return req
    })

    setRequests(updatedRequests)

    // Show success toast
    toast({
      title: type === "approve" ? "Request Approved" : "Request Rejected",
      description: `Request for ${request.partName} has been ${type === "approve" ? "approved" : "rejected"}.`,
    })

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

  // Function to render priority badge
  const renderPriorityBadge = (priority) => {
    switch (priority) {
      case "low":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Low
          </Badge>
        )
      case "normal":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Normal
          </Badge>
        )
      case "high":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800">
            High
          </Badge>
        )
      case "urgent":
        return <Badge variant="destructive">Urgent</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  // Filter requests by status
  const filteredRequests = statusFilter === "all" ? requests : requests.filter((req) => req.status === statusFilter)

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Approve Spare Part Requests</h1>
        <p className="text-muted-foreground">Review and manage requests for spare parts</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle>Spare Part Requests</CardTitle>
              <CardDescription>Filter, approve or reject spare part requests</CardDescription>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Requests</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="dispatched">Dispatched</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading requests...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request Date</TableHead>
                      <TableHead>Part Name</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Requested By</TableHead>
                      <TableHead>Site</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.length > 0 ? (
                      filteredRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>{request.date}</TableCell>
                          <TableCell className="font-medium">
                            {request.partName}
                            <div className="text-xs text-muted-foreground">{request.partNo}</div>
                          </TableCell>
                          <TableCell>{request.quantity}</TableCell>
                          <TableCell>{request.requestedBy}</TableCell>
                          <TableCell>{request.site}</TableCell>
                          <TableCell>{renderPriorityBadge(request.priority)}</TableCell>
                          <TableCell>{renderStatusBadge(request.status)}</TableCell>
                          <TableCell className="text-right">
                            {request.status === "pending" && (
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-green-600"
                                  onClick={() => handleApprove(request)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600"
                                  onClick={() => handleReject(request)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                          {statusFilter === "all" ? "No requests found." : `No ${statusFilter} requests found.`}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 text-sm text-muted-foreground">
                Showing {filteredRequests.length} {statusFilter === "all" ? "total" : statusFilter} requests
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => !open && handleDialogClose()}>
        <DialogContent>
          {actionDialog.type === "approve" ? (
            <>
              <DialogHeader>
                <DialogTitle>Approve Request</DialogTitle>
                <DialogDescription>
                  You are approving the request for {actionDialog.request?.quantity} x {actionDialog.request?.partName}{" "}
                  ({actionDialog.request?.partNo}) for {actionDialog.request?.site}.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div className="rounded-md bg-muted p-3">
                  <h4 className="text-sm font-medium mb-2">Request Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Requested By:</span>
                      <p>{actionDialog.request?.requestedBy}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Required By:</span>
                      <p>{actionDialog.request?.requiredBy}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Priority:</span>
                      <p>{actionDialog.request?.priority}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Reason:</span>
                      <p>{actionDialog.request?.reason || "Not specified"}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Approval Notes (optional)</label>
                  <Textarea
                    placeholder="Add any instructions or notes for this approval..."
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
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Reject Request</DialogTitle>
                <DialogDescription>
                  You are rejecting the request for {actionDialog.request?.quantity} x {actionDialog.request?.partName}{" "}
                  ({actionDialog.request?.partNo}) for {actionDialog.request?.site}.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div className="rounded-md bg-muted p-3">
                  <h4 className="text-sm font-medium mb-2">Request Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Requested By:</span>
                      <p>{actionDialog.request?.requestedBy}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Required By:</span>
                      <p>{actionDialog.request?.requiredBy}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Priority:</span>
                      <p>{actionDialog.request?.priority}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Reason:</span>
                      <p>{actionDialog.request?.reason || "Not specified"}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Reason for Rejection <span className="text-red-500">*</span>
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
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

