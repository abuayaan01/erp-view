"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "./StatusBadge"
import { ConditionRemarksInput } from "./ConditionRemarksInput"
import { ReceiveButton } from "./ReceiveButton"
import { toast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function ReceivedTable({ requisitions: initialRequisitions }) {
  const [requisitions, setRequisitions] = useState(initialRequisitions)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRequisition, setSelectedRequisition] = useState(null)
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [remarks, setRemarks] = useState("")
  const [condition, setCondition] = useState("good")

  // Filter requisitions based on search query
  const filteredRequisitions = requisitions.filter(
    (req) =>
      req.materialName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.site.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `REQ-${req.id.toString().padStart(4, "0")}`.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleReceiveClick = (requisition) => {
    setSelectedRequisition(requisition)
    setIsReceiveModalOpen(true)
    setRemarks("")
    setCondition("good")
  }

  const handleReceive = async () => {
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
            status: "delivered",
            condition,
            remarks,
            receivedBy: "John Doe", // Would come from auth context
            receivedDate: new Date().toISOString().split("T")[0],
          }
        }
        return req
      })

      setRequisitions(updatedRequisitions)

      toast({
        title: "Material Received",
        description: `Requisition REQ-${selectedRequisition.id.toString().padStart(4, "0")} has been marked as received.`,
      })

      setIsReceiveModalOpen(false)
      setSelectedRequisition(null)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Operation Failed",
        description: "There was an error marking the material as received. Please try again.",
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
                <TableHead>Dispatched Date</TableHead>
                <TableHead>Vehicle No.</TableHead>
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
                    </TableCell>
                    <TableCell>{req.site}</TableCell>
                    <TableCell>{req.dispatchedDate}</TableCell>
                    <TableCell>{req.transportDetails?.vehicleNumber}</TableCell>
                    <TableCell>
                      <StatusBadge status={req.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {req.status === "dispatched" && (
                        <Button variant="outline" size="sm" onClick={() => handleReceiveClick(req)} className="h-8">
                          Receive
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No dispatched materials found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Receive Modal */}
      <Dialog open={isReceiveModalOpen} onOpenChange={setIsReceiveModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Receive Material</DialogTitle>
            <DialogDescription>
              Confirm receipt of {selectedRequisition?.materialName} at {selectedRequisition?.site}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <ConditionRemarksInput
              condition={condition}
              onConditionChange={setCondition}
              remarks={remarks}
              onRemarksChange={setRemarks}
              isDisabled={isProcessing}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsReceiveModalOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <ReceiveButton onClick={handleReceive} isSubmitting={isProcessing} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

