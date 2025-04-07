"use client"

import { Button } from "@/components/ui/button"
import { Check, Loader2, ShoppingCart, X } from "lucide-react"

export function ApprovalActions({ onApprove, onReject, onSendToProcurement, isProcessing }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200"
        onClick={onApprove}
        disabled={isProcessing}
      >
        {isProcessing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
        Approve
      </Button>

      <Button
        variant="outline"
        className="bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 border-red-200"
        onClick={onReject}
        disabled={isProcessing}
      >
        <X className="h-4 w-4 mr-2" />
        Reject
      </Button>

      <Button
        variant="outline"
        className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 border-indigo-200"
        onClick={onSendToProcurement}
        disabled={isProcessing}
      >
        <ShoppingCart className="h-4 w-4 mr-2" />
        Send to Procurement
      </Button>
    </div>
  )
}

