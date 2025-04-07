"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Save, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export function LogbookForm({ onSubmit, initialData, onCancel }) {
  const defaultFormData = {
    date: new Date(),
    registrationNo: "",
    dieselOpeningBalance: 0,
    dieselIssue: 0,
    dieselClosingBalance: 0,
    openingKMReading: 0,
    closingKMReading: 0,
    openingHrsMeter: 0,
    closingHrsMeter: 0,
    workingDetail: "",
    assetCode: "",
    siteName: "",
    location: "",
  }

  const [formData, setFormData] = useState(defaultFormData)
  const [errors, setErrors] = useState({})
  const [sites, setSites] = useState([
    { id: 1, name: "Project Alpha" },
    { id: 2, name: "Project Beta" },
    { id: 3, name: "Project Gamma" },
  ])
  const [machines, setMachines] = useState([
    { id: 1, registrationNo: "MH-123456", assetCode: "AST-001" },
    { id: 2, registrationNo: "MH-789012", assetCode: "AST-002" },
    { id: 3, registrationNo: "MH-345678", assetCode: "AST-003" },
  ])

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        date: initialData.date ? new Date(initialData.date) : new Date(),
      })
    } else {
      setFormData(defaultFormData)
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    let parsedValue = value

    // Convert numeric fields to numbers
    if (
      [
        "dieselOpeningBalance",
        "dieselIssue",
        "dieselClosingBalance",
        "openingKMReading",
        "closingKMReading",
        "openingHrsMeter",
        "closingHrsMeter",
      ].includes(name)
    ) {
      parsedValue = Number.parseFloat(value) || 0
    }

    setFormData({ ...formData, [name]: parsedValue })

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({ ...errors, [name]: null })
    }
  }

  const handleDateChange = (date) => {
    setFormData({ ...formData, date })
  }

  const handleMachineChange = (registrationNo) => {
    const selectedMachine = machines.find((m) => m.registrationNo === registrationNo)
    setFormData({
      ...formData,
      registrationNo,
      assetCode: selectedMachine ? selectedMachine.assetCode : "",
    })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.date) newErrors.date = "Date is required"
    if (!formData.registrationNo) newErrors.registrationNo = "Machine number is required"
    if (!formData.siteName) newErrors.siteName = "Site name is required"

    // Validate numeric fields
    if (formData.closingKMReading < formData.openingKMReading) {
      newErrors.closingKMReading = "Closing KM cannot be less than opening KM"
    }

    if (formData.closingHrsMeter < formData.openingHrsMeter) {
      newErrors.closingHrsMeter = "Closing hours cannot be less than opening hours"
    }

    const dieselUsed = formData.dieselOpeningBalance + formData.dieselIssue - formData.dieselClosingBalance
    if (dieselUsed < 0) {
      newErrors.dieselClosingBalance = "Diesel usage calculation results in negative value"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      // Format date to string for API
      const formattedData = {
        ...formData,
        date: format(formData.date, "yyyy-MM-dd"),
      }
      onSubmit(formattedData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Date Field */}
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.date && "text-muted-foreground",
                  errors.date && "border-red-500",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.date ? format(formData.date, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={formData.date} onSelect={handleDateChange} initialFocus />
            </PopoverContent>
          </Popover>
          {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
        </div>

        {/* Machine Selection */}
        <div className="space-y-2">
          <Label htmlFor="registrationNo">Registration No / Machine No</Label>
          <Select value={formData.registrationNo} onValueChange={handleMachineChange}>
            <SelectTrigger className={cn(errors.registrationNo && "border-red-500")}>
              <SelectValue placeholder="Select machine" />
            </SelectTrigger>
            <SelectContent>
              {machines.map((machine) => (
                <SelectItem key={machine.id} value={machine.registrationNo}>
                  {machine.registrationNo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.registrationNo && <p className="text-red-500 text-sm">{errors.registrationNo}</p>}
        </div>

        {/* Asset Code */}
        <div className="space-y-2">
          <Label htmlFor="assetCode">Asset Code</Label>
          <Input
            id="assetCode"
            name="assetCode"
            value={formData.assetCode}
            onChange={handleChange}
            readOnly
            className="bg-muted"
          />
        </div>

        {/* Site Selection */}
        <div className="space-y-2">
          <Label htmlFor="siteName">Site Name</Label>
          <Select value={formData.siteName} onValueChange={(value) => setFormData({ ...formData, siteName: value })}>
            <SelectTrigger className={cn(errors.siteName && "border-red-500")}>
              <SelectValue placeholder="Select site" />
            </SelectTrigger>
            <SelectContent>
              {sites.map((site) => (
                <SelectItem key={site.id} value={site.name}>
                  {site.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.siteName && <p className="text-red-500 text-sm">{errors.siteName}</p>}
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" value={formData.location} onChange={handleChange} />
        </div>

        {/* Diesel Fields */}
        <div className="space-y-2">
          <Label htmlFor="dieselOpeningBalance">Diesel Opening Balance (L)</Label>
          <Input
            id="dieselOpeningBalance"
            name="dieselOpeningBalance"
            type="number"
            value={formData.dieselOpeningBalance}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dieselIssue">Diesel Issue (L)</Label>
          <Input
            id="dieselIssue"
            name="dieselIssue"
            type="number"
            value={formData.dieselIssue}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dieselClosingBalance">Diesel Closing Balance (L)</Label>
          <Input
            id="dieselClosingBalance"
            name="dieselClosingBalance"
            type="number"
            value={formData.dieselClosingBalance}
            onChange={handleChange}
            className={cn(errors.dieselClosingBalance && "border-red-500")}
          />
          {errors.dieselClosingBalance && <p className="text-red-500 text-sm">{errors.dieselClosingBalance}</p>}
        </div>

        {/* KM Readings */}
        <div className="space-y-2">
          <Label htmlFor="openingKMReading">Opening KM Reading</Label>
          <Input
            id="openingKMReading"
            name="openingKMReading"
            type="number"
            value={formData.openingKMReading}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="closingKMReading">Closing KM Reading</Label>
          <Input
            id="closingKMReading"
            name="closingKMReading"
            type="number"
            value={formData.closingKMReading}
            onChange={handleChange}
            className={cn(errors.closingKMReading && "border-red-500")}
          />
          {errors.closingKMReading && <p className="text-red-500 text-sm">{errors.closingKMReading}</p>}
        </div>

        {/* Hours Meter */}
        <div className="space-y-2">
          <Label htmlFor="openingHrsMeter">Opening Hours Meter</Label>
          <Input
            id="openingHrsMeter"
            name="openingHrsMeter"
            type="number"
            value={formData.openingHrsMeter}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="closingHrsMeter">Closing Hours Meter</Label>
          <Input
            id="closingHrsMeter"
            name="closingHrsMeter"
            type="number"
            value={formData.closingHrsMeter}
            onChange={handleChange}
            className={cn(errors.closingHrsMeter && "border-red-500")}
          />
          {errors.closingHrsMeter && <p className="text-red-500 text-sm">{errors.closingHrsMeter}</p>}
        </div>
      </div>

      {/* Working Details */}
      <div className="space-y-2">
        <Label htmlFor="workingDetail">Working Details</Label>
        <Textarea
          id="workingDetail"
          name="workingDetail"
          value={formData.workingDetail}
          onChange={handleChange}
          rows={3}
          placeholder="Enter details about the work performed"
        />
      </div>

      {/* Calculated Fields Preview */}
      {(formData.openingKMReading > 0 || formData.openingHrsMeter > 0) && (
        <div className="bg-muted p-4 rounded-md">
          <h3 className="font-medium mb-2">Calculated Values (Preview)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Total Run KM:</span>
              <p className="font-medium">{formData.closingKMReading - formData.openingKMReading}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Total Run Hours:</span>
              <p className="font-medium">{formData.closingHrsMeter - formData.openingHrsMeter}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Diesel Used (L):</span>
              <p className="font-medium">
                {formData.dieselOpeningBalance + formData.dieselIssue - formData.dieselClosingBalance}
              </p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Diesel Avg (KM/L):</span>
              <p className="font-medium">
                {(() => {
                  const dieselUsed =
                    formData.dieselOpeningBalance + formData.dieselIssue - formData.dieselClosingBalance
                  const kmRun = formData.closingKMReading - formData.openingKMReading
                  return dieselUsed > 0 && kmRun > 0 ? (kmRun / dieselUsed).toFixed(2) : "N/A"
                })()}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex items-center gap-2">
          <X className="h-4 w-4" />
          Cancel
        </Button>
        <Button type="submit" className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          {initialData ? "Update Entry" : "Save Entry"}
        </Button>
      </div>
    </form>
  )
}

