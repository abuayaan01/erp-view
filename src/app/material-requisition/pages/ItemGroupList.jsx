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

const ItemGroupList = () => {
  const [itemGroups, setItemGroups] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemGroupToDelete, setItemGroupToDelete] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    // Load item groups from localStorage
    // const storedItemGroups = JSON.parse(localStorage.getItem("itemGroups")) || []
    const storedItemGroups = [
      { id: "grp1", name: "Electrical" },
      { id: "grp2", name: "Mechanical" },
      { id: "grp3", name: "Safety Equipment" },
    ];
    setItemGroups(storedItemGroups)
  }, [])

  const handleDelete = (id) => {
    const itemGroup = itemGroups.find((group) => group.id === id)
    setItemGroupToDelete(itemGroup)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    // Check if this item group is used by any items
    const items = JSON.parse(localStorage.getItem("items")) || []
    const isUsed = items.some((item) => item.itemGroup === itemGroupToDelete.id)

    if (isUsed) {
      toast({
        title: "Cannot Delete",
        description: "This item group is being used by one or more items.",
        variant: "destructive",
      })
    } else {
      const updatedItemGroups = itemGroups.filter((group) => group.id !== itemGroupToDelete.id)
      setItemGroups(updatedItemGroups)
      localStorage.setItem("itemGroups", JSON.stringify(updatedItemGroups))

      toast({
        title: "Item Group Deleted",
        description: "The item group has been deleted successfully.",
      })
    }

    setDeleteDialogOpen(false)
    setItemGroupToDelete(null)
  }

  const filteredItemGroups = itemGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Item Groups</h1>
        <Button>
          <Link to="/item-groups/new" className="flex">
            <Plus className="mr-2 h-4 w-4" /> Add Item Group
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Search item groups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Group</TableHead>
              <TableHead>Short Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItemGroups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  {searchTerm ? "No item groups found matching your search." : "No item groups added yet."}
                </TableCell>
              </TableRow>
            ) : (
              filteredItemGroups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell className="font-medium">{group.name}</TableCell>
                  <TableCell>{group.shortName}</TableCell>
                  <TableCell>{group.type}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Link to={`/item-groups/edit/${group.id}`}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(group.id)}>
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
              This will permanently delete the item group "{itemGroupToDelete?.name}". This action cannot be undone.
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

export default ItemGroupList
