"use client"

import { Button } from "@/components/ui/button"
import { Loader2, Package } from "lucide-react"

export function ReceiveButton({ onClick, isSubmitting }) {
  return (
    <Button onClick={onClick} disabled={isSubmitting} className="flex items-center gap-2">
      {isSubmitting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <Package className="h-4 w-4" />
          Confirm Receipt
        </>
      )}
    </Button>
  )
}

