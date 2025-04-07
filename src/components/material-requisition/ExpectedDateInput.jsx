"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function ExpectedDateInput({ value, onChange, isDisabled }) {
  // Get today's date formatted as YYYY-MM-DD for the date input min value
  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="space-y-2">
      <Label htmlFor="expectedDate">
        Expected Delivery Date
        <span className="text-red-500 ml-1">*</span>
      </Label>
      <Input
        id="expectedDate"
        type="date"
        min={today}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isDisabled}
      />
      <p className="text-xs text-muted-foreground">The expected date when the material will be delivered</p>
    </div>
  )
}

