"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "./StatusBadge"
import { ApprovalActions } from "./ApprovalActions"
import { QuantityApprovalInput } from "./QuantityApprovalInput"
import { RejectionReasonModal } from "./RejectionReasonModal"
import { toast } from "@/hooks/use-toast"
import { ArrowLeft, Calendar, Clock, FileText, MapPin, User, Check, X } from "lucide-react"

export function RequisitionDetail({ requisition: initialRequisition }) {
  const [requisition, setRequisition] = useState(initialRequisition)
  const [approvedQuantity, setApprovedQuantity] = useState(initialRequisition.quantity)
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Check if user has permission to approve/reject
  // In a real app, this would come from auth context
  const canApprove = true // Simulating warehouse manager or admin role

  const handleApprove = async () => {
    setIsProcessing(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update requisition status
      const updatedRequisition = {
        ...requisition,
        status: "approved",
        approvedQuantity: approvedQuantity,
        approvedBy: "John Doe", // Would come from auth context
        approvedDate: new Date().toISOString().split("T")[0],
      }

      setRequisition(updatedRequisition)

      toast({
        title: "Requisition Approved",
        description: `Requisition REQ-${requisition.id.toString().padStart(4, "0")} has been approved.`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Approval Failed",
        description: "There was an error approving the requisition. Please try again.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = (reason) => {
    setIsProcessing(true)

    // Simulate API call
    setTimeout(() => {
      // Update requisition status
      const updatedRequisition = {
        ...requisition,
        status: "rejected",
        rejectionReason: reason,
        rejectedBy: "John Doe", // Would come from auth context
        rejectedDate: new Date().toISOString().split("T")[0],
      }

      setRequisition(updatedRequisition)

      toast({
        title: "Requisition Rejected",
        description: `Requisition REQ-${requisition.id.toString().padStart(4, "0")} has been rejected.`,
      })

      setIsProcessing(false)
      setIsRejectionModalOpen(false)
    }, 1500)
  }

  const handleSendToProcurement = async () => {
    setIsProcessing(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update requisition status
      const updatedRequisition = {
        ...requisition,
        status: "procurement",
        sentToProcurementBy: "John Doe", // Would come from auth context
        sentToProcurementDate: new Date().toISOString().split("T")[0],
      }

      setRequisition(updatedRequisition)

      toast({
        title: "Sent to Procurement",
        description: `Requisition REQ-${requisition.id.toString().padStart(4, "0")} has been sent to procurement.`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Operation Failed",
        description: "There was an error sending the requisition to procurement. Please try again.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Requisition Details</h1>
          <p className="text-muted-foreground">
            REQ-{requisition.id.toString().padStart(4, "0")} • {requisition.date}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Material Information</CardTitle>
                  <CardDescription>Details of the requested material</CardDescription>
                </div>
                <StatusBadge status={requisition.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Material Name</p>
                  <p className="font-medium">{requisition.materialName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Quantity Requested</p>
                  <p className="font-medium">
                    {requisition.quantity} {requisition.unit}
                    {requisition.urgency === "urgent" && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                        Urgent
                      </span>
                    )}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Required By</p>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {requisition.requiredBy}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Project Site</p>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {requisition.site}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Justification</p>
                <p className="text-sm bg-muted p-3 rounded-md">{requisition.justification}</p>
              </div>

              {requisition.status === "approved" && (
                <div className="bg-green-50 p-3 rounded-md border border-green-100">
                  <h4 className="text-sm font-medium text-green-800 mb-2">Approval Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Approved By:</span>
                      <p className="font-medium">{requisition.approvedBy}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Approved Date:</span>
                      <p className="font-medium">{requisition.approvedDate}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Approved Quantity:</span>
                      <p className="font-medium">
                        {requisition.approvedQuantity} {requisition.unit}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {requisition.status === "rejected" && (
                <div className="bg-red-50 p-3 rounded-md border border-red-100">
                  <h4 className="text-sm font-medium text-red-800 mb-2">Rejection Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Rejected By:</span>
                      <p className="font-medium">{requisition.rejectedBy}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Rejected Date:</span>
                      <p className="font-medium">{requisition.rejectedDate}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-muted-foreground">Reason:</span>
                    <p className="text-sm mt-1">{requisition.rejectionReason}</p>
                  </div>
                </div>
              )}

              {requisition.status === "procurement" && (
                <div className="bg-indigo-50 p-3 rounded-md border border-indigo-100">
                  <h4 className="text-sm font-medium text-indigo-800 mb-2">Procurement Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Sent By:</span>
                      <p className="font-medium">{requisition.sentToProcurementBy}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Sent Date:</span>
                      <p className="font-medium">{requisition.sentToProcurementDate}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {canApprove && requisition.status === "pending" && (
            <Card>
              <CardHeader>
                <CardTitle>Approval Actions</CardTitle>
                <CardDescription>Review and take action on this requisition</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="approvedQuantity">Approved Quantity</Label>
                    <QuantityApprovalInput
                      value={approvedQuantity}
                      onChange={setApprovedQuantity}
                      max={requisition.quantity}
                      unit={requisition.unit}
                    />
                    <p className="text-xs text-muted-foreground">
                      You can approve a partial quantity if the full amount is not available
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <ApprovalActions
                  onApprove={handleApprove}
                  onReject={() => setIsRejectionModalOpen(true)}
                  onSendToProcurement={handleSendToProcurement}
                  isProcessing={isProcessing}
                />
              </CardFooter>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Request Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Requested By</p>
                <p className="font-medium flex items-center gap-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {requisition.requestedBy}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Request Date</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {requisition.date}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Urgency Level</p>
                <p className="font-medium flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  {requisition.urgency === "urgent" ? (
                    <span className="text-red-600">Urgent</span>
                  ) : (
                    <span>Normal</span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-primary text-primary-foreground rounded-full">
                    <FileText className="h-3 w-3" />
                    <div className="absolute -bottom-[calc(100%-theme(spacing.3))] left-1/2 h-[calc(100%-theme(spacing.3))] w-px -translate-x-1/2 bg-border" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Requisition Created</p>
                    <p className="text-sm text-muted-foreground">{requisition.date}</p>
                  </div>
                </div>

                {requisition.status !== "pending" && (
                  <div className="flex gap-3">
                    <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-primary text-primary-foreground rounded-full">
                      {requisition.status === "approved" ? (
                        <Check className="h-3 w-3" />
                      ) : requisition.status === "rejected" ? (
                        <X className="h-3 w-3" />
                      ) : (
                        <FileText className="h-3 w-3" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {requisition.status === "approved" && "Requisition Approved"}
                        {requisition.status === "rejected" && "Requisition Rejected"}
                        {requisition.status === "procurement" && "Sent to Procurement"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {requisition.status === "approved" && requisition.approvedDate}
                        {requisition.status === "rejected" && requisition.rejectedDate}
                        {requisition.status === "procurement" && requisition.sentToProcurementDate}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <RejectionReasonModal
        isOpen={isRejectionModalOpen}
        onClose={() => setIsRejectionModalOpen(false)}
        onSubmit={handleReject}
        isSubmitting={isProcessing}
      />
    </div>
  )
}

