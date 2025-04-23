"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

const ItemGroupForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const isEditMode = !!id

  const [formData, setFormData] = useState({
    name: "",
    shortName: "",
    type: "",
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isEditMode) {
      // Load item group data for editing
      // const itemGroups = JSON.parse(localStorage.getItem("itemGroups")) || []
      const itemGroups = [
        { id: "grp1", name: "Electrical" },
        { id: "grp2", name: "Mechanical" },
        { id: "grp3", name: "Safety Equipment" },
      ];
      const itemGroup = itemGroups.find((group) => group.id === id)

      if (itemGroup) {
        setFormData({
          name: itemGroup.name,
          shortName: itemGroup.shortName,
          type: itemGroup.type,
        })
      } else {
        // If item group not found, redirect to list
        navigate("/item-groups")
        toast({
          title: "Item Group Not Found",
          description: "The item group you're trying to edit doesn't exist.",
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

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Item Group name is required"
    }

    if (!formData.shortName.trim()) {
      newErrors.shortName = "Short name is required"
    }

    if (!formData.type.trim()) {
      newErrors.type = "Item Type is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Get existing item groups
    const itemGroups = JSON.parse(localStorage.getItem("itemGroups")) || []

    if (isEditMode) {
      // Update existing item group
      const updatedItemGroups = itemGroups.map((group) => (group.id === id ? { ...group, ...formData } : group))

      localStorage.setItem("itemGroups", JSON.stringify(updatedItemGroups))

      toast({
        title: "Item Group Updated",
        description: "The item group has been updated successfully.",
      })
    } else {
      // Create new item group
      const newItemGroup = {
        id: Date.now().toString(),
        ...formData,
      }

      localStorage.setItem("itemGroups", JSON.stringify([...itemGroups, newItemGroup]))

      toast({
        title: "Item Group Created",
        description: "The new item group has been created successfully.",
      })
    }

    // Redirect to item groups list
    navigate("/item-groups")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate("/item-groups")}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{isEditMode ? "Edit Item Group" : "Add Item Group"}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? "Edit Item Group" : "Create New Item Group"}</CardTitle>
          <CardDescription>
            {isEditMode
              ? "Update the details of an existing item group"
              : "Add a new item group to categorize your inventory items"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Item Group Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter item group name"
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortName">Item Group Short Name *</Label>
              <Input
                id="shortName"
                name="shortName"
                value={formData.shortName}
                onChange={handleChange}
                placeholder="Enter short name"
              />
              {errors.shortName && <p className="text-sm text-destructive">{errors.shortName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Item Type *</Label>
              <Input
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                placeholder="Enter item type"
              />
              {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate("/item-groups")}>
              Cancel
            </Button>
            <Button type="submit">{isEditMode ? "Update" : "Create"}</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default ItemGroupForm
