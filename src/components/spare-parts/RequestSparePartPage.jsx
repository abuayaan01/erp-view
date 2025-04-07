"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { AlertCircle, Check, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function RequestSparePartPage() {
  const [spareParts, setSpareParts] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    partId: "",
    quantity: 1,
    requiredDate: "",
    priority: "normal",
    reason: "",
  })
  const [errors, setErrors] = useState({})
  const [selectedPart, setSelectedPart] = useState(null)

  // Fetch spare parts
  useEffect(() => {
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      const mockSpareParts = [
        { id: 1, name: "Oil Filter", partNo: "OF-1234", category: "Filters", currentStock: 23, site: "Project Alpha" },
        { id: 2, name: "Air Filter", partNo: "AF-5678", category: "Filters", currentStock: 15, site: "Project Beta" },
        { id: 3, name: "Brake Pad", partNo: "BP-9101", category: "Brakes", currentStock: 5, site: "Project Alpha" },
        {
          id: 4,
          name: "Fuel Pump",
          partNo: "FP-1121",
          category: "Fuel System",
          currentStock: 8,
          site: "Project Gamma",
        },
        { id: 5, name: "Alternator", partNo: "AL-3141", category: "Electrical", currentStock: 4, site: "Project Beta" },
        { id: 6, name: "Spark Plug", partNo: "SP-5161", category: "Ignition", currentStock: 50, site: "Project Alpha" },
        { id: 7, name: "Radiator", partNo: "RA-7181", category: "Cooling", currentStock: 2, site: "Project Gamma" },
      ]

      setSpareParts(mockSpareParts)
      setLoading(false)
    }, 1000)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    let parsedValue = value

    // Convert quantity to number
    if (name === "quantity") {
      parsedValue = Number.parseInt(value) || 1
    }

    setFormData({ ...formData, [name]: parsedValue })

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({ ...errors, [name]: null })
    }
  }

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value })

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({ ...errors, [name]: null })
    }

    // If part is selected, update the selected part details
    if (name === "partId") {
      const part = spareParts.find((p) => p.id.toString() === value)
      setSelectedPart(part)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Required fields validation
    if (!formData.partId) newErrors.partId = "Please select a spare part"
    if (!formData.quantity || formData.quantity < 1) newErrors.quantity = "Quantity must be at least 1"
    if (!formData.requiredDate) newErrors.requiredDate = "Required date is required"
    if (!formData.priority) newErrors.priority = "Priority is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      setSubmitting(true)

      // Simulate API call
      setTimeout(() => {
        console.log("Request submitted:", formData)

        // Show success toast
        toast({
          title: "Request Submitted",
          description: `Your request for ${selectedPart?.name} has been submitted successfully.`,
        })

        // Reset form
        setFormData({
          partId: "",
          quantity: 1,
          requiredDate: "",
          priority: "normal",
          reason: "",
        })
        setSelectedPart(null)
        setSubmitting(false)
      }, 1500)
    }
  }

  // Get today's date formatted as YYYY-MM-DD for the date input min value
  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Request Spare Part</h1>
        <p className="text-muted-foreground">Fill out the form below to request spare parts for your site</p>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Spare Part Request Form</CardTitle>
          <CardDescription>Complete all required fields to submit your request</CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Please correct the errors in the form before submitting.</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="partId" className={errors.partId ? "text-red-500" : ""}>
                  Select Spare Part <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.partId}
                  onValueChange={(value) => handleSelectChange("partId", value)}
                  disabled={loading}
                >
                  <SelectTrigger id="partId" className={errors.partId ? "border-red-500" : ""}>
                    <SelectValue placeholder={loading ? "Loading spare parts..." : "Select a spare part"} />
                  </SelectTrigger>
                  <SelectContent>
                    {loading ? (
                      <div className="flex items-center justify-center py-6">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : (
                      <SelectGroup>
                        <SelectLabel>Available Spare Parts</SelectLabel>
                        {spareParts.map((part) => (
                          <SelectItem key={part.id} value={part.id.toString()}>
                            {part.name} ({part.partNo}) - {part.currentStock} in stock
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    )}
                  </SelectContent>
                </Select>
                {errors.partId && <p className="text-red-500 text-sm">{errors.partId}</p>}
              </div>

              {selectedPart && (
                <div className="rounded-md bg-muted p-3">
                  <h4 className="text-sm font-medium mb-2">Selected Part Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Part Number:</span>
                      <p>{selectedPart.partNo}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Category:</span>
                      <p>{selectedPart.category}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Current Stock:</span>
                      <p>{selectedPart.currentStock} units</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Site:</span>
                      <p>{selectedPart.site}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity" className={errors.quantity ? "text-red-500" : ""}>
                    Quantity <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    className={errors.quantity ? "border-red-500" : ""}
                  />
                  {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requiredDate" className={errors.requiredDate ? "text-red-500" : ""}>
                    Required By Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="requiredDate"
                    name="requiredDate"
                    type="date"
                    min={today}
                    value={formData.requiredDate}
                    onChange={handleChange}
                    className={errors.requiredDate ? "border-red-500" : ""}
                  />
                  {errors.requiredDate && <p className="text-red-500 text-sm">{errors.requiredDate}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority" className={errors.priority ? "text-red-500" : ""}>
                    Priority Level <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.priority} onValueChange={(value) => handleSelectChange("priority", value)}>
                    <SelectTrigger id="priority" className={errors.priority ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.priority && <p className="text-red-500 text-sm">{errors.priority}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Request</Label>
                <Textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Explain why you need these parts..."
                  rows={3}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting} className="flex items-center gap-2">
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Submit Request
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

