"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { MaterialSelector } from "./MaterialSelector"
import { QuantityInput } from "./QuantityInput"
import { UrgencyToggle } from "./UrgencyToggle"
import { SubmitButton } from "./SubmitButton"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function MaterialRequestForm() {
  const [formData, setFormData] = useState({
    materialId: "",
    materialName: "",
    quantity: 1,
    unit: "",
    urgency: "normal",
    justification: "",
    site: "",
    requiredBy: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock sites data
  const sites = [
    { id: 1, name: "Project Alpha" },
    { id: 2, name: "Project Beta" },
    { id: 3, name: "Project Gamma" },
  ]

  const handleMaterialSelect = (material) => {
    setFormData({
      ...formData,
      materialId: material.id,
      materialName: material.name,
      unit: material.unit,
    })

    // Clear error for this field if it exists
    if (errors.materialId) {
      setErrors({ ...errors, materialId: null })
    }
  }

  const handleQuantityChange = (quantity) => {
    setFormData({ ...formData, quantity })

    // Clear error for this field if it exists
    if (errors.quantity) {
      setErrors({ ...errors, quantity: null })
    }
  }

  const handleUrgencyChange = (urgency) => {
    setFormData({ ...formData, urgency })
  }

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

    if (!formData.materialId) newErrors.materialId = "Please select a material"
    if (!formData.quantity || formData.quantity < 1) newErrors.quantity = "Quantity must be at least 1"
    if (!formData.justification) newErrors.justification = "Justification is required"
    if (!formData.site) newErrors.site = "Please select a site"
    if (!formData.requiredBy) newErrors.requiredBy = "Required by date is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Show success toast
        toast({
          title: "Requisition Submitted",
          description: "Your material requisition has been submitted successfully.",
        })

        // Reset form
        setFormData({
          materialId: "",
          materialName: "",
          quantity: 1,
          unit: "",
          urgency: "normal",
          justification: "",
          site: "",
          requiredBy: "",
        })
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: "There was an error submitting your requisition. Please try again.",
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  // Get today's date formatted as YYYY-MM-DD for the date input min value
  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Material Requisition</h1>
          <p className="text-muted-foreground">Request materials for your site</p>
        </div>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Material Requisition Form</CardTitle>
          <CardDescription>Fill out this form to request materials for your project site</CardDescription>
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
                <Label htmlFor="material" className={errors.materialId ? "text-red-500" : ""}>
                  Select Material <span className="text-red-500">*</span>
                </Label>
                <MaterialSelector
                  onSelect={handleMaterialSelect}
                  selectedMaterialId={formData.materialId}
                  error={errors.materialId}
                />
                {errors.materialId && <p className="text-red-500 text-sm">{errors.materialId}</p>}
              </div>

              {formData.materialId && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity" className={errors.quantity ? "text-red-500" : ""}>
                      Quantity <span className="text-red-500">*</span>
                    </Label>
                    <QuantityInput
                      value={formData.quantity}
                      onChange={handleQuantityChange}
                      unit={formData.unit}
                      error={errors.quantity}
                    />
                    {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgency Level</Label>
                    <UrgencyToggle value={formData.urgency} onChange={handleUrgencyChange} />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="site" className={errors.site ? "text-red-500" : ""}>
                    Project Site <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="site"
                    name="site"
                    value={formData.site}
                    onChange={handleChange}
                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.site ? "border-red-500" : ""}`}
                  >
                    <option value="">Select a site</option>
                    {sites.map((site) => (
                      <option key={site.id} value={site.name}>
                        {site.name}
                      </option>
                    ))}
                  </select>
                  {errors.site && <p className="text-red-500 text-sm">{errors.site}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requiredBy" className={errors.requiredBy ? "text-red-500" : ""}>
                    Required By Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="requiredBy"
                    name="requiredBy"
                    type="date"
                    min={today}
                    value={formData.requiredBy}
                    onChange={handleChange}
                    className={errors.requiredBy ? "border-red-500" : ""}
                  />
                  {errors.requiredBy && <p className="text-red-500 text-sm">{errors.requiredBy}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="justification" className={errors.justification ? "text-red-500" : ""}>
                  Justification <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="justification"
                  name="justification"
                  value={formData.justification}
                  onChange={handleChange}
                  placeholder="Explain why these materials are needed..."
                  rows={3}
                  className={errors.justification ? "border-red-500" : ""}
                />
                {errors.justification && <p className="text-red-500 text-sm">{errors.justification}</p>}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <SubmitButton onClick={handleSubmit} isSubmitting={isSubmitting} />
        </CardFooter>
      </Card>
    </div>
  )
}

