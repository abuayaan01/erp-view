"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus } from "lucide-react"

export function QuantityInput({ value, onChange, unit, error }) {
  const handleIncrement = () => {
    onChange(value + 1)
  }

  const handleDecrement = () => {
    if (value > 1) {
      onChange(value - 1)
    }
  }

  const handleInputChange = (e) => {
    const newValue = Number.parseInt(e.target.value, 10)
    if (!isNaN(newValue) && newValue >= 1) {
      onChange(newValue)
    } else if (e.target.value === "") {
      onChange(1)
    }
  }

  return (
    <div className="flex items-center">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleDecrement}
        disabled={value <= 1}
        className="rounded-r-none"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Input
        type="number"
        min="1"
        value={value}
        onChange={handleInputChange}
        className={`h-10 w-20 rounded-none text-center ${error ? "border-red-500" : ""}`}
      />
      <Button type="button" variant="outline" size="icon" onClick={handleIncrement} className="rounded-l-none">
        <Plus className="h-4 w-4" />
      </Button>
      {unit && <span className="ml-2 text-sm text-muted-foreground">{unit}</span>}
    </div>
  )
}

