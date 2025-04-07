"use client"

import { useState, useEffect } from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function MaterialSelector({ onSelect, selectedMaterialId, error }) {
  const [open, setOpen] = useState(false)
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch materials data
  useEffect(() => {
    // Simulate API call
    const fetchMaterials = async () => {
      setLoading(true)
      try {
        // Simulate delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock materials data
        const mockMaterials = [
          { id: 1, name: "Cement", category: "Construction", unit: "Bags", available: 150 },
          { id: 2, name: "Sand", category: "Construction", unit: "Cubic Meters", available: 75 },
          { id: 3, name: "Gravel", category: "Construction", unit: "Cubic Meters", available: 60 },
          { id: 4, name: "Steel Rebar (10mm)", category: "Steel", unit: "Tons", available: 25 },
          { id: 5, name: "Steel Rebar (12mm)", category: "Steel", unit: "Tons", available: 30 },
          { id: 6, name: "Bricks", category: "Construction", unit: "Pieces", available: 5000 },
          { id: 7, name: "Timber (2x4)", category: "Wood", unit: "Pieces", available: 200 },
          { id: 8, name: "Plywood Sheets", category: "Wood", unit: "Sheets", available: 80 },
          { id: 9, name: "PVC Pipes (4 inch)", category: "Plumbing", unit: "Meters", available: 300 },
          { id: 10, name: "Electrical Wires", category: "Electrical", unit: "Meters", available: 500 },
          { id: 11, name: "Paint (White)", category: "Finishing", unit: "Gallons", available: 45 },
          { id: 12, name: "Paint (Blue)", category: "Finishing", unit: "Gallons", available: 30 },
        ]

        setMaterials(mockMaterials)
      } catch (error) {
        console.error("Error fetching materials:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMaterials()
  }, [])

  // Filter materials based on search query
  const filteredMaterials = materials.filter(
    (material) =>
      material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get selected material name
  const selectedMaterial = materials.find((material) => material.id === selectedMaterialId)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between ${error ? "border-red-500" : ""}`}
        >
          {selectedMaterial ? selectedMaterial.name : "Select material..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Search materials..." onValueChange={setSearchQuery} />
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <CommandList>
              <CommandEmpty>No materials found.</CommandEmpty>
              <CommandGroup className="max-h-[300px] overflow-y-auto">
                {filteredMaterials.map((material) => (
                  <CommandItem
                    key={material.id}
                    value={material.name}
                    onSelect={() => {
                      onSelect(material)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn("mr-2 h-4 w-4", selectedMaterialId === material.id ? "opacity-100" : "opacity-0")}
                    />
                    <div className="flex flex-col">
                      <span>{material.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {material.category} • {material.available} {material.unit} available
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}

