"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

const ItemList = () => {
  const [items, setItems] = useState([])
  const [itemGroups, setItemGroups] = useState([])
  const [units, setUnits] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    // Load data from localStorage
    const storedItems = JSON.parse(localStorage.getItem("items")) || []
    const storedItemGroups = JSON.parse(localStorage.getItem("itemGroups")) || []
    const storedUnits = JSON.parse(localStorage.getItem("units")) || []

    setItems(storedItems)
    setItemGroups(storedItemGroups)
    setUnits(storedUnits)
  }, [])

  const getItemGroupName = (id) => {
    const group = itemGroups.find((g) => g.id === id)
    return group ? group.name : "Unknown Group"
  }

  const getUnitName = (id) => {
    const unit = units.find((u) => u.id === id)
    return unit ? unit.name : "Unknown Unit"
  }

  const handleDelete = (id) => {
    const item = items.find((item) => item.id === id)
    setItemToDelete(item)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    // Check if this item is used in any requisitions
    const requisitions = JSON.parse(localStorage.getItem("requisitions")) || []
    const isUsed = requisitions.some((req) => req.items.some((item) => item.itemId === itemToDelete.id))

    if (isUsed) {
      toast({
        title: "Cannot Delete",
        description: "This item is being used in one or more requisitions.",
        variant: "destructive",
      })
    } else {
      const updatedItems = items.filter((item) => item.id !== itemToDelete.id)
      setItems(updatedItems)
      localStorage.setItem("items", JSON.stringify(updatedItems))

      toast({
        title: "Item Deleted",
        description: "The item has been deleted successfully.",
      })
    }

    setDeleteDialogOpen(false)
    setItemToDelete(null)
  }

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.shortName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getItemGroupName(item.itemGroup).toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.partNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getUnitName(item.unit).toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.hsnCode?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Items</h1>
        <Button>
          <Link to="/items/new" className="flex">
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Name</TableHead>
              <TableHead>Short Name</TableHead>
              <TableHead>Item Group</TableHead>
              <TableHead>Part No</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>HSN Code</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  {searchTerm ? "No items found matching your search." : "No items added yet."}
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.shortName || "-"}</TableCell>
                  <TableCell>{getItemGroupName(item.itemGroup)}</TableCell>
                  <TableCell>{item.partNo || "-"}</TableCell>
                  <TableCell>{getUnitName(item.unit)}</TableCell>
                  <TableCell>{item.hsnCode || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Link to={`/items/edit/${item.id}`}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the item "{itemToDelete?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default ItemList
