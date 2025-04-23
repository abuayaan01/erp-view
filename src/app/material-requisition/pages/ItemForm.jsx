"use client"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

const ItemForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const isEditMode = !!id

  const [formData, setFormData] = useState({
    name: "",
    shortName: "",
    itemGroup: "",
    partNo: "",
    unit: "",
    hsnCode: "",
  })

  const [itemGroups, setItemGroups] = useState([])
  const [units, setUnits] = useState([])
  const [errors, setErrors] = useState({})

  useEffect(() => {
    // Load item groups and units
    // const storedItemGroups = JSON.parse(localStorage.getItem("itemGroups")) || []
    // const storedUnits = JSON.parse(localStorage.getItem("units")) || []
    const storedItemGroups = [
      { id: "grp1", name: "Electrical" },
      { id: "grp2", name: "Mechanical" },
      { id: "grp3", name: "Safety Equipment" },
    ];

    const storedUnits = [
      { id: "unit1", name: "Meter" },
      { id: "unit2", name: "Piece" },
      { id: "unit3", name: "Set" },
    ];

    setItemGroups(storedItemGroups)
    setUnits(storedUnits)

    if (isEditMode) {
      // Load item data for editing
      const items = JSON.parse(localStorage.getItem("items")) || []
      const item = items.find((item) => item.id === id)

      if (item) {
        setFormData({
          name: item.name,
          shortName: item.shortName || "",
          itemGroup: item.itemGroup,
          partNo: item.partNo || "",
          unit: item.unit,
          hsnCode: item.hsnCode || "",
        })
      } else {
        // If item not found, redirect to list
        navigate("/items")
        toast({
          title: "Item Not Found",
          description: "The item you're trying to edit doesn't exist.",
          variant: "destructive",
        })
      }
    }
  }, [id, isEditMode, navigate, toast])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Item name is required"
    }

    if (!formData.itemGroup) {
      newErrors.itemGroup = "Item group is required"
    }

    if (!formData.unit) {
      newErrors.unit = "Unit is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Get existing items
    const items = JSON.parse(localStorage.getItem("items")) || []

    if (isEditMode) {
      // Update existing item
      const updatedItems = items.map((item) => (item.id === id ? { ...item, ...formData } : item))

      localStorage.setItem("items", JSON.stringify(updatedItems))

      toast({
        title: "Item Updated",
        description: "The item has been updated successfully.",
      })
    } else {
      // Create new item
      const newItem = {
        id: Date.now().toString(),
        ...formData,
      }

      localStorage.setItem("items", JSON.stringify([...items, newItem]))

      toast({
        title: "Item Created",
        description: "The new item has been created successfully.",
      })
    }

    // Redirect to items list
    navigate("/items")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate("/items")}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{isEditMode ? "Edit Item" : "Add Item"}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? "Edit Item" : "Create New Item"}</CardTitle>
          <CardDescription>
            {isEditMode ? "Update the details of an existing item" : "Add a new item to your inventory"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter item name"
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortName">Item Short Name</Label>
              <Input
                id="shortName"
                name="shortName"
                value={formData.shortName}
                onChange={handleChange}
                placeholder="Enter short name (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="itemGroup">Item Group *</Label>
              <Select value={formData.itemGroup} onValueChange={(value) => handleSelectChange("itemGroup", value)}>
                <SelectTrigger id="itemGroup">
                  <SelectValue placeholder="Select item group" />
                </SelectTrigger>
                <SelectContent>
                  {itemGroups.length === 0 ? (
                    <SelectItem value="" disabled>
                      No item groups available
                    </SelectItem>
                  ) : (
                    itemGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.itemGroup && <p className="text-sm text-destructive">{errors.itemGroup}</p>}
              {itemGroups.length === 0 && (
                <p className="text-sm text-amber-500">
                  No item groups available. Please{" "}
                  <Link to="/item-groups/new" className="underline">
                    create an item group
                  </Link>{" "}
                  first.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="partNo">Part No</Label>
              <Input
                id="partNo"
                name="partNo"
                value={formData.partNo}
                onChange={handleChange}
                placeholder="Enter part number (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Select value={formData.unit} onValueChange={(value) => handleSelectChange("unit", value)}>
                <SelectTrigger id="unit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.length === 0 ? (
                    <SelectItem value="" disabled>
                      No units available
                    </SelectItem>
                  ) : (
                    units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.unit && <p className="text-sm text-destructive">{errors.unit}</p>}
              {units.length === 0 && (
                <p className="text-sm text-amber-500">
                  No units available. Please{" "}
                  <Link to="/units/new" className="underline">
                    create a unit
                  </Link>{" "}
                  first.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hsnCode">HSN Code</Label>
              <Input
                id="hsnCode"
                name="hsnCode"
                value={formData.hsnCode}
                onChange={handleChange}
                placeholder="Enter HSN code (optional)"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate("/items")}>
              Cancel
            </Button>
            <Button type="submit">{isEditMode ? "Update" : "Create"}</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default ItemForm
