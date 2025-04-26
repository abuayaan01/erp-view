"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Clock, AlertTriangle, Search, FileText } from "lucide-react"
import { format } from "date-fns"

// Mock data for demonstration
const mockMaintenanceLogs = [
  {
    id: "1",
    type: "repair",
    date: "2025-04-15T10:30:00",
    title: "Engine Repair",
    description: "Fixed engine knocking issue. Replaced pistons and connecting rods.",
    parts: "Pistons, Connecting rods, Gaskets",
    cost: 850,
    technician: "John Smith",
    status: "completed",
    hoursAtService: 2450,
  },
  {
    id: "2",
    type: "oil_change",
    date: "2025-03-22T14:15:00",
    title: "Regular Oil Change",
    description: "Changed engine oil and filter as part of regular maintenance.",
    parts: "Oil filter, Engine oil (10W-30)",
    cost: 120,
    technician: "Mike Johnson",
    status: "completed",
    hoursAtService: 2350,
  },
  {
    id: "3",
    type: "inspection",
    date: "2025-02-10T09:00:00",
    title: "Annual Inspection",
    description: "Performed annual safety and operational inspection.",
    parts: "",
    cost: 200,
    technician: "Sarah Williams",
    status: "completed",
    hoursAtService: 2200,
  },
  {
    id: "4",
    type: "preventive",
    date: "2025-01-05T11:45:00",
    title: "Preventive Maintenance",
    description: "Regular preventive maintenance including fluid checks, belt inspection, and brake testing.",
    parts: "Air filter, Fuel filter",
    cost: 350,
    technician: "Robert Brown",
    status: "completed",
    hoursAtService: 2100,
  },
  {
    id: "5",
    type: "parts_replacement",
    date: "2024-12-18T13:20:00",
    title: "Hydraulic Hose Replacement",
    description: "Replaced worn hydraulic hoses on the boom arm.",
    parts: "Hydraulic hoses, Fittings",
    cost: 420,
    technician: "John Smith",
    status: "completed",
    hoursAtService: 2000,
  },
  {
    id: "6",
    type: "repair",
    date: "2025-05-20T15:00:00",
    title: "Transmission Service",
    description: "Scheduled transmission service and fluid replacement.",
    parts: "Transmission fluid, Filter",
    cost: 510,
    technician: "Mike Johnson",
    status: "scheduled",
    hoursAtService: 2500,
  },
]

const MaintenanceLogList = ({ machineId, onViewLog }) => {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    // In a real app, you would fetch data from your API
    // For demo purposes, we'll use the mock data
    setTimeout(() => {
      setLogs(mockMaintenanceLogs)
      setLoading(false)
    }, 500)
  }, [machineId])

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Completed
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
            <Clock className="h-3 w-3" /> In Progress
          </Badge>
        )
      case "scheduled":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" /> Scheduled
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getMaintenanceTypeBadge = (type) => {
    switch (type) {
      case "repair":
        return <Badge variant="destructive">Repair</Badge>
      case "preventive":
        return <Badge variant="default">Preventive</Badge>
      case "inspection":
        return <Badge variant="secondary">Inspection</Badge>
      case "oil_change":
        return <Badge variant="outline">Oil Change</Badge>
      case "parts_replacement":
        return <Badge variant="warning">Parts Replacement</Badge>
      default:
        return <Badge>{type}</Badge>
    }
  }

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch (error) {
      return dateString
    }
  }

  // Filter logs based on search term and filters
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.technician.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === "all" || log.type === filterType
    const matchesStatus = filterStatus === "all" || log.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  if (loading) {
    return <div className="flex justify-center items-center h-40">Loading maintenance logs...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search maintenance logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex flex-1 flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="repair">Repair</SelectItem>
                <SelectItem value="preventive">Preventive</SelectItem>
                <SelectItem value="inspection">Inspection</SelectItem>
                <SelectItem value="oil_change">Oil Change</SelectItem>
                <SelectItem value="parts_replacement">Parts Replacement</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  {searchTerm || filterType !== "all" || filterStatus !== "all"
                    ? "No maintenance logs found matching your search criteria."
                    : "No maintenance logs found for this machine."}
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{formatDate(log.date)}</TableCell>
                  <TableCell>{getMaintenanceTypeBadge(log.type)}</TableCell>
                  <TableCell className="font-medium">{log.title}</TableCell>
                  <TableCell>{log.technician}</TableCell>
                  <TableCell>{log.hoursAtService}</TableCell>
                  <TableCell>${log.cost}</TableCell>
                  <TableCell>{getStatusBadge(log.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => onViewLog(log)}>
                      <FileText className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
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

export default MaintenanceLogList
