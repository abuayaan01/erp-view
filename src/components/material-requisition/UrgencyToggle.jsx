"use client"

import { Toggle } from "@/components/ui/toggle"
import { AlertTriangle, Clock } from "lucide-react"

export function UrgencyToggle({ value, onChange }) {
  return (
    <div className="flex gap-2">
      <Toggle
        variant="outline"
        pressed={value === "normal"}
        onPressedChange={() => onChange("normal")}
        className="data-[state=on]:bg-green-100 data-[state=on]:text-green-800 data-[state=on]:border-green-200"
      >
        <Clock className="h-4 w-4 mr-2" />
        Normal
      </Toggle>
      <Toggle
        variant="outline"
        pressed={value === "urgent"}
        onPressedChange={() => onChange("urgent")}
        className="data-[state=on]:bg-red-100 data-[state=on]:text-red-800 data-[state=on]:border-red-200"
      >
        <AlertTriangle className="h-4 w-4 mr-2" />
        Urgent
      </Toggle>
    </div>
  )
}

