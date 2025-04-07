"use client"

import { Button } from "@/components/ui/button"
import { Check, Loader2 } from "lucide-react"

export function SubmitButton({ onClick, isSubmitting }) {
  return (
    <Button type="submit" onClick={onClick} disabled={isSubmitting} className="flex items-center gap-2">
      {isSubmitting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Submitting...
        </>
      ) : (
        <>
          <Check className="h-4 w-4" />
          Submit Requisition
        </>
      )}
    </Button>
  )
}

