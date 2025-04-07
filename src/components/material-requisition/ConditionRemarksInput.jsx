"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

export function ConditionRemarksInput({ condition, onConditionChange, remarks, onRemarksChange, isDisabled }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Material Condition</Label>
        <RadioGroup
          value={condition}
          onValueChange={onConditionChange}
          className="flex flex-col space-y-1"
          disabled={isDisabled}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="good" id="condition-good" />
            <Label htmlFor="condition-good" className="font-normal">
              Good condition
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="damaged" id="condition-damaged" />
            <Label htmlFor="condition-damaged" className="font-normal">
              Damaged
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="partial" id="condition-partial" />
            <Label htmlFor="condition-partial" className="font-normal">
              Partial delivery
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="remarks">
          Remarks
          {condition !== "good" && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <Textarea
          id="remarks"
          value={remarks}
          onChange={(e) => onRemarksChange(e.target.value)}
          placeholder={
            condition !== "good"
              ? "Please provide details about the condition or issues..."
              : "Optional remarks about the received material..."
          }
          rows={3}
          disabled={isDisabled}
        />
        {condition !== "good" && !remarks && (
          <p className="text-sm text-red-500">Remarks are required when material is not in good condition</p>
        )}
      </div>
    </div>
  )
}

