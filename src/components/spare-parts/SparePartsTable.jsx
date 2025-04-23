"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Edit, MoreHorizontal, Trash2, History, FileText } from "lucide-react"
import { EditSparePartModal } from "./EditSparePartModal"

export function SparePartsTable() {
  const spareParts = [
    {
      id: 1,
      name: "Brake Pad",
      partNo: "BP-123",
      category: "Brakes",
      currentStock: 10,
      minStockLevel: 5,
      site: "Warehouse A",
      lastUpdated: "2023-06-01",
    },
    {
      id: 2,
      name: "Oil Filter",
      partNo: "OF-456",
      category: "Engine",
      currentStock: 0,
      minStockLevel: 3,
      site: "Warehouse B",
      lastUpdated: "2023-06-05",
    },
    {
      id: 3,
      name: "Air Filter",
      partNo: "AF-789",
      category: "Engine",
      currentStock: 20,
      minStockLevel: 10,
      site: "Warehouse A",
      lastUpdated: "2023-06-10",
    }
  ]
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null })
  const [editModal, setEditModal] = useState({ open: false, part: null })
  const [historyModal, setHistoryModal] = useState({ open: false, part: null })
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // History mock data
  const getHistoryForPart = (partId) => {
    return [
      {
        id: 1,
        date: "2023-06-15",
        action: "Stock Update",
        quantity: "+5",
        user: "John Smith",
        notes: "Received new stock",
      },
      { id: 2, date: "2023-06-10", action: "Request", quantity: "-2", user: "Mike Brown", notes: "Emergency repair" },
      {
        id: 3,
        date: "2023-06-05",
        action: "Stock Update",
        quantity: "+10",
        user: "Sarah Johnson",
        notes: "Monthly resupply",
      },
      {
        id: 4,
        date: "2023-05-28",
        action: "Initial Stock",
        quantity: "+15",
        user: "Admin",
        notes: "Initial inventory",
      },
    ]
  }

  const startIndex = (page - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const paginatedParts = spareParts.slice(startIndex, endIndex)
  const totalPages = Math.ceil(spareParts.length / rowsPerPage)

  const handleHistoryClick = (part) => {
    setHistoryModal({ open: true, part, history: getHistoryForPart(part.id) })
  }

  const handleDeleteClick = (id) => {
    setDeleteConfirm({ open: true, id })
  }

  const handleEditClick = (part) => {
    setEditModal({ open: true, part })
  }

  // Function to render stock status badge
  const renderStockStatus = (currentStock, minStockLevel) => {
    if (currentStock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>
    } else if (currentStock < minStockLevel) {
      return (
        <Badge variant="warning" className="bg-amber-500">
          Low Stock
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800">
          In Stock
        </Badge>
      )
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Part No.</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead className="hidden md:table-cell">Min. Level</TableHead>
              <TableHead className="hidden md:table-cell">Site</TableHead>
              <TableHead className="hidden md:table-cell">Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedParts.length > 0 ? (
              paginatedParts.map((part) => (
                <TableRow key={part.id}>
                  <TableCell className="font-medium">{part.name}</TableCell>
                  <TableCell>{part.partNo}</TableCell>
                  <TableCell>{part.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {part.currentStock}
                      {renderStockStatus(part.currentStock, part.minStockLevel)}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{part.minStockLevel}</TableCell>
                  <TableCell className="hidden md:table-cell">{part.site}</TableCell>
                  <TableCell className="hidden md:table-cell">{part.lastUpdated}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditClick(part)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleHistoryClick(part)}>
                          <History className="mr-2 h-4 w-4" />
                          View History
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(part.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  No spare parts found. Add your first spare part to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {spareParts.length > rowsPerPage && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button variant="outline" size="sm" onClick={() => setPage(page > 1 ? page - 1 : 1)} disabled={page === 1}>
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Edit Modal */}
      {editModal.open && (
        <EditSparePartModal
          isOpen={editModal.open}
          onClose={() => setEditModal({ open: false, part: null })}
          part={editModal.part}
        />
      )}

      {/* History Modal */}
      <Dialog open={historyModal.open} onOpenChange={(open) => setHistoryModal({ ...historyModal, open })}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Part History - {historyModal.part?.name} ({historyModal.part?.partNo})
            </DialogTitle>
            <DialogDescription>View the transaction history for this spare part</DialogDescription>
          </DialogHeader>

          <div className="mt-4 rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historyModal.history?.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.action}</TableCell>
                    <TableCell className={record.quantity.startsWith("+") ? "text-green-600" : "text-red-600"}>
                      {record.quantity}
                    </TableCell>
                    <TableCell>{record.user}</TableCell>
                    <TableCell>{record.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setHistoryModal({ open: false, part: null })}>
              Close
            </Button>
            <Button className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Export History
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirm.open} onOpenChange={(open) => setDeleteConfirm({ ...deleteConfirm, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this spare part? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm({ open: false, id: null })}>
              Cancel
            </Button>
            <Button variant="destructive">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

