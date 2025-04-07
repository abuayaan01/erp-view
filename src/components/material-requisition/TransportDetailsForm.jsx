"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function TransportDetailsForm({ onSubmit, onCancel, isSubmitting }) {
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    driverName: "",
    driverContact: "",
    notes: "",
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({ ...errors, [name]: null })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.vehicleNumber) newErrors.vehicleNumber = "Vehicle number is required"
    if (!formData.driverName) newErrors.driverName = "Driver name is required"
    if (!formData.driverContact) newErrors.driverContact = "Driver contact is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vehicleNumber" className={errors.vehicleNumber ? "text-red-500" : ""}>
            Vehicle Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="vehicleNumber"
            name="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={handleChange}
            placeholder="Enter vehicle number"
            className={errors.vehicleNumber ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.vehicleNumber && <p className="text-sm text-red-500">{errors.vehicleNumber}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="driverName" className={errors.driverName ? "text-red-500" : ""}>
              Driver Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="driverName"
              name="driverName"
              value={formData.driverName}
              onChange={handleChange}
              placeholder="Enter driver name"
              className={errors.driverName ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.driverName && <p className="text-sm text-red-500">{errors.driverName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="driverContact" className={errors.driverContact ? "text-red-500" : ""}>
              Driver Contact <span className="text-red-500">*</span>
            </Label>
            <Input
              id="driverContact"
              name="driverContact"
              value={formData.driverContact}
              onChange={handleChange}
              placeholder="Enter driver contact"
              className={errors.driverContact ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.driverContact && <p className="text-sm text-red-500">{errors.driverContact}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Dispatch Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Enter any notes for this dispatch..."
            rows={3}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </form>
  )
}

