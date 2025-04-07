"use client"

import { useState } from "react"
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
import { Loader2, X } from "lucide-react"

export function RejectionReasonModal({ isOpen, onClose, onSubmit, isSubmitting }) {
  const [reason, setReason] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError("Please provide a reason for rejection")
      return
    }

    onSubmit(reason)
  }

  const handleClose = () => {
    setReason("")
    setError("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Requisition</DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting this requisition. This will be visible to the requester.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="reason" className="text-sm font-medium">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="reason"
              placeholder="Enter reason for rejection..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                if (e.target.value.trim()) setError("")
              }}
              className={error ? "border-red-500" : ""}
              rows={4}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <X className="h-4 w-4" />
                Reject Requisition
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

