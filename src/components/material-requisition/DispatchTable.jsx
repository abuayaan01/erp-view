"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "./StatusBadge"
import { TransportDetailsForm } from "./TransportDetailsForm"
import { DispatchButton } from "./DispatchButton"
import { toast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function DispatchTable({ requisitions: initialRequisitions }) {
  const [requisitions, setRequisitions] = useState(initialRequisitions)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRequisition, setSelectedRequisition] = useState(null)
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Filter requisitions based on search query
  const filteredRequisitions = requisitions.filter(
    (req) =>
      req.materialName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.site.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `REQ-${req.id.toString().padStart(4, "0")}`.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDispatchClick = (requisition) => {
    setSelectedRequisition(requisition)
    setIsDispatchModalOpen(true)
  }

  const handleDispatch = async (transportDetails) => {
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
            status: "dispatched",
            transportDetails,
            dispatchedBy: "John Doe", // Would come from auth context
            dispatchedDate: new Date().toISOString().split("T")[0],
          }
        }
        return req
      })

      setRequisitions(updatedRequisitions)

      toast({
        title: "Material Dispatched",
        description: `Requisition REQ-${selectedRequisition.id.toString().padStart(4, "0")} has been dispatched.`,
      })

      setIsDispatchModalOpen(false)
      setSelectedRequisition(null)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Dispatch Failed",
        description: "There was an error dispatching the material. Please try again.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by material, site or requisition ID..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
                <TableHead>Approved Date</TableHead>
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
                      {req.approvedQuantity || req.quantity} {req.unit}
                      {req.urgency === "urgent" && (
                        <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                      )}
                    </TableCell>
                    <TableCell>{req.site}</TableCell>
                    <TableCell>{req.requiredBy}</TableCell>
                    <TableCell>{req.approvedDate}</TableCell>
                    <TableCell>
                      <StatusBadge status={req.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {req.status === "approved" && (
                        <Button variant="outline" size="sm" onClick={() => handleDispatchClick(req)} className="h-8">
                          Dispatch
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No approved requisitions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Dispatch Modal */}
      <Dialog open={isDispatchModalOpen} onOpenChange={setIsDispatchModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dispatch Material</DialogTitle>
            <DialogDescription>
              Enter transport details for dispatching material to {selectedRequisition?.site}
            </DialogDescription>
          </DialogHeader>

          <TransportDetailsForm
            onSubmit={handleDispatch}
            onCancel={() => setIsDispatchModalOpen(false)}
            isSubmitting={isProcessing}
          />

          <DispatchButton onClick={() => {}} isSubmitting={isProcessing} />
        </DialogContent>
      </Dialog>
    </>
  )
}

