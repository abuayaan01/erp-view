"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"

export function QuantityApprovalInput({ value, onChange, max, unit }) {
  const [sliderValue, setSliderValue] = useState([value])

  // Update slider when value changes externally
  useEffect(() => {
    setSliderValue([value])
  }, [value])

  // Update value when slider changes
  const handleSliderChange = (newValue) => {
    setSliderValue(newValue)
    onChange(newValue[0])
  }

  // Update value when input changes
  const handleInputChange = (e) => {
    const newValue = Number.parseInt(e.target.value, 10)
    if (!isNaN(newValue) && newValue >= 1 && newValue <= max) {
      onChange(newValue)
      setSliderValue([newValue])
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input type="number" min="1" max={max} value={value} onChange={handleInputChange} className="w-20" />
        <span className="text-sm text-muted-foreground">
          of {max} {unit}
        </span>
      </div>

      <div className="px-1">
        <Slider value={sliderValue} min={1} max={max} step={1} onValueChange={handleSliderChange} />
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>1</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  )
}

