"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function EditSparePartModal({ isOpen, onClose, part }) {
  const [formData, setFormData] = useState({
    name: "",
    partNo: "",
    category: "",
    currentStock: 0,
    minStockLevel: 0,
    site: "",
    description: "",
    location: "",
    price: 0,
    supplier: "",
  })

  const [errors, setErrors] = useState({})
  const [formTab, setFormTab] = useState("basic")

  // Load part data when it changes
  useEffect(() => {
    if (part) {
      setFormData({
        ...part,
        description: part.description || "",
        location: part.location || "",
        price: part.price || 0,
        supplier: part.supplier || "",
      })
    }
  }, [part])

  // Categories for the dropdown
  const categories = [
    "Filters",
    "Brakes",
    "Electrical",
    "Engine Parts",
    "Suspension",
    "Transmission",
    "Steering",
    "Cooling",
    "Fuel System",
    "Exhaust",
    "Ignition",
    "Other",
  ]

  // Sites for the dropdown
  const sites = ["Project Alpha", "Project Beta", "Project Gamma", "Central Warehouse"]

  const handleChange = (e) => {
    const { name, value } = e.target
    let newValue = value

    // Convert numeric fields to numbers
    if (["currentStock", "minStockLevel", "price"].includes(name)) {
      newValue = Number(value) || 0
    }

    setFormData({ ...formData, [name]: newValue })

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
  }

  const validateForm = () => {
    const newErrors = {}

    // Required fields validation
    if (!formData.name) newErrors.name = "Name is required"
    if (!formData.partNo) newErrors.partNo = "Part number is required"
    if (!formData.category) newErrors.category = "Category is required"
    if (!formData.site) newErrors.site = "Site is required"

    // Numeric fields validation
    if (formData.currentStock < 0) {
      newErrors.currentStock = "Current stock cannot be negative"
    }

    if (formData.minStockLevel < 0) {
      newErrors.minStockLevel = "Minimum stock level cannot be negative"
    }

    if (formData.price < 0) {
      newErrors.price = "Price cannot be negative"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      // In a real app, this would make an API call
      console.log("Updated part:", formData)
      onClose()
    }
  }

  const hasErrors = Object.keys(errors).length > 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Spare Part</DialogTitle>
          <DialogDescription>
            Update the details of {part?.name} ({part?.partNo}).
          </DialogDescription>
        </DialogHeader>

        {hasErrors && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Please correct the errors in the form before submitting.</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Tabs value={formTab} onValueChange={setFormTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="additional">Additional Details</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className={errors.name ? "text-red-500" : ""}>
                    Part Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="partNo" className={errors.partNo ? "text-red-500" : ""}>
                    Part Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="partNo"
                    name="partNo"
                    value={formData.partNo}
                    onChange={handleChange}
                    className={errors.partNo ? "border-red-500" : ""}
                  />
                  {errors.partNo && <p className="text-red-500 text-sm">{errors.partNo}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className={errors.category ? "text-red-500" : ""}>
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger id="category" className={errors.category ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categories</SelectLabel>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="site" className={errors.site ? "text-red-500" : ""}>
                    Site <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.site} onValueChange={(value) => handleSelectChange("site", value)}>
                    <SelectTrigger id="site" className={errors.site ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select site" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Sites</SelectLabel>
                        {sites.map((site) => (
                          <SelectItem key={site} value={site}>
                            {site}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors.site && <p className="text-red-500 text-sm">{errors.site}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentStock" className={errors.currentStock ? "text-red-500" : ""}>
                    Current Stock
                  </Label>
                  <Input
                    id="currentStock"
                    name="currentStock"
                    type="number"
                    value={formData.currentStock}
                    onChange={handleChange}
                    className={errors.currentStock ? "border-red-500" : ""}
                  />
                  {errors.currentStock && <p className="text-red-500 text-sm">{errors.currentStock}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minStockLevel" className={errors.minStockLevel ? "text-red-500" : ""}>
                    Minimum Stock Level
                  </Label>
                  <Input
                    id="minStockLevel"
                    name="minStockLevel"
                    type="number"
                    value={formData.minStockLevel}
                    onChange={handleChange}
                    className={errors.minStockLevel ? "border-red-500" : ""}
                  />
                  {errors.minStockLevel && <p className="text-red-500 text-sm">{errors.minStockLevel}</p>}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="additional" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" name="description" value={formData.description} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Storage Location</Label>
                  <Input id="location" name="location" value={formData.location} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className={errors.price ? "text-red-500" : ""}>
                    Unit Price
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    className={errors.price ? "border-red-500" : ""}
                  />
                  {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input id="supplier" name="supplier" value={formData.supplier} onChange={handleChange} />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

