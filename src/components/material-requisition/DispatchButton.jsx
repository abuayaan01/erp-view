"use client"

import { Button } from "@/components/ui/button"
import { Loader2, Truck } from "lucide-react"

export function DispatchButton({ onClick, isSubmitting }) {
  return (
    <div className="flex justify-end gap-2 mt-4">
      <Button type="submit" onClick={onClick} disabled={isSubmitting} className="flex items-center gap-2">
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Dispatching...
          </>
        ) : (
          <>
            <Truck className="h-4 w-4" />
            Dispatch Material
          </>
        )}
      </Button>
    </div>
  )
}

