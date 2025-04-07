"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "./StatusBadge"
import { ExpectedDateInput } from "./ExpectedDateInput"
import { toast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, ShoppingCart, Truck, Package, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ProcurementTable({ requisitions: initialRequisitions }) {
  const [requisitions, setRequisitions] = useState(initialRequisitions)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedRequisition, setSelectedRequisition] = useState(null)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [expectedDate, setExpectedDate] = useState("")
  const [procurementStatus, setProcurementStatus] = useState("ordered")

  // Filter requisitions based on search query and status
  const filteredRequisitions = requisitions.filter((req) => {
    // Search filter
    const matchesSearch =
      req.materialName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.site.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `REQ-${req.id.toString().padStart(4, "0")}`.toLowerCase().includes(searchQuery.toLowerCase())

    // Status filter
    const matchesStatus = statusFilter === "all" || req.procurementStatus === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleUpdateClick = (requisition) => {
    setSelectedRequisition(requisition)
    setProcurementStatus(requisition.procurementStatus || "ordered")
    setExpectedDate(requisition.expectedDate || "")
    setIsUpdateModalOpen(true)
  }

  const handleUpdateStatus = async () => {
    if (!selectedRequisition) return

    setIsProcessing(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update requisition status
      const updatedRequisitions = requisitions.map((req) => {
        if (req.id === selectedRequisition.id) {
          return {
            ...req,
            procurementStatus,
            expectedDate,
            updatedBy: "John Doe", // Would come from auth context
            updatedDate: new Date().toISOString().split("T")[0],
          }
        }
        return req
      })

      setRequisitions(updatedRequisitions)

      toast({
        title: "Procurement Status Updated",
        description: `Requisition REQ-${selectedRequisition.id.toString().padStart(4, "0")} has been updated.`,
      })

      setIsUpdateModalOpen(false)
      setSelectedRequisition(null)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "There was an error updating the procurement status. Please try again.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by material, site or requisition ID..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="ordered">Ordered</SelectItem>
              <SelectItem value="in-transit">In Transit</SelectItem>
              <SelectItem value="received">Received</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Req. ID</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Required By</TableHead>
                <TableHead>Expected Delivery</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequisitions.length > 0 ? (
                filteredRequisitions.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium">REQ-{req.id.toString().padStart(4, "0")}</TableCell>
                    <TableCell>{req.materialName}</TableCell>
                    <TableCell>
                      {req.quantity} {req.unit}
                      {req.urgency === "urgent" && (
                        <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                      )}
                    </TableCell>
                    <TableCell>{req.site}</TableCell>
                    <TableCell>{req.requiredBy}</TableCell>
                    <TableCell>{req.expectedDate || "Not set"}</TableCell>
                    <TableCell>
                      <StatusBadge status={req.procurementStatus || "pending"} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleUpdateClick(req)} className="h-8">
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No procurement items found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Update Modal */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Procurement Status</DialogTitle>
            <DialogDescription>Update the procurement status for {selectedRequisition?.materialName}</DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Procurement Status</label>
              <Select value={procurementStatus} onValueChange={setProcurementStatus} disabled={isProcessing}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="ordered">Ordered</SelectItem>
                  <SelectItem value="in-transit">In Transit</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <ExpectedDateInput value={expectedDate} onChange={setExpectedDate} isDisabled={isProcessing} />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateModalOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={isProcessing || (procurementStatus !== "pending" && !expectedDate)}
              className="flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  {procurementStatus === "ordered" && <ShoppingCart className="h-4 w-4" />}
                  {procurementStatus === "in-transit" && <Truck className="h-4 w-4" />}
                  {procurementStatus === "received" && <Package className="h-4 w-4" />}
                  Update Status
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

