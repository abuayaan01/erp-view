"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Plus, Eye, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

const MaterialRequisitionList = () => {
  const [requisitions, setRequisitions] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    // Load requisitions from localStorage
    const storedRequisitions = JSON.parse(localStorage.getItem("requisitions")) || []
    setRequisitions(storedRequisitions)
  }, [])

  const getPriorityBadge = (priority) => {
    switch (priority.toLowerCase()) {
      case "urgent":
        return <Badge variant="destructive">Urgent</Badge>
      case "medium":
        return <Badge variant="default">Medium</Badge>
      case "low":
        return <Badge variant="outline">Low</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const getChargeTypeBadge = (chargeType) => {
    switch (chargeType) {
      case "foc":
        return <Badge variant="outline">FOC</Badge>
      case "chargeable":
        return <Badge variant="secondary">Chargeable</Badge>
      default:
        return <Badge variant="outline">{chargeType}</Badge>
    }
  }

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm")
    } catch (error) {
      return dateString
    }
  }

  const filteredRequisitions = requisitions.filter(
    (req) =>
      req.requisitionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.storeSection.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.preparedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.priority.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Material Requisitions</h1>
        <Button>
          <Link to="/requisitions/new" className="flex">
            <Plus className="mr-2 h-4 w-4" /> Create Requisition
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Search requisitions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Requisition No</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Store Section</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Charge Type</TableHead>
              <TableHead>Prepared By</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequisitions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  {searchTerm ? "No requisitions found matching your search." : "No requisitions created yet."}
                </TableCell>
              </TableRow>
            ) : (
              filteredRequisitions.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium">{req.requisitionNo}</TableCell>
                  <TableCell>{formatDate(req.date)}</TableCell>
                  <TableCell>{req.storeSection}</TableCell>
                  <TableCell>{req.location}</TableCell>
                  <TableCell>{getPriorityBadge(req.priority)}</TableCell>
                  <TableCell>{getChargeTypeBadge(req.chargeType)}</TableCell>
                  <TableCell>{req.preparedBy}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Link to={`/requisitions/view/${req.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Link to={`/requisitions/view/${req.id}?print=true`}>
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">Print</span>
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default MaterialRequisitionList
