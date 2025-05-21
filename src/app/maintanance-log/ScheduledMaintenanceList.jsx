"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, AlertTriangle, Clock, CheckCircle } from "lucide-react"
import { format, isPast, isToday, addDays } from "date-fns"
import api from "@/services/api/api-service"

// Mock data for demonstration
const mockScheduledMaintenance = [
  {
    id: "1",
    title: "Regular Oil Change",
    type: "oil_change",
    dueDate: addDays(new Date(), 5).toISOString(),
    estimatedHours: 1,
    estimatedCost: 120,
    priority: "medium",
    assignedTo: "Mike Johnson",
    status: "scheduled",
  },
  {
    id: "2",
    title: "Transmission Service",
    type: "preventive",
    dueDate: addDays(new Date(), 15).toISOString(),
    estimatedHours: 3,
    estimatedCost: 450,
    priority: "high",
    assignedTo: "John Smith",
    status: "scheduled",
  },
  {
    id: "3",
    title: "Annual Inspection",
    type: "inspection",
    dueDate: addDays(new Date(), -2).toISOString(),
    estimatedHours: 2,
    estimatedCost: 200,
    priority: "high",
    assignedTo: "Sarah Williams",
    status: "overdue",
  },
  {
    id: "4",
    title: "Hydraulic System Check",
    type: "preventive",
    dueDate: addDays(new Date(), 0).toISOString(),
    estimatedHours: 1.5,
    estimatedCost: 180,
    priority: "medium",
    assignedTo: "Robert Brown",
    status: "due_today",
  },
  {
    id: "5",
    title: "Brake System Service",
    type: "preventive",
    dueDate: addDays(new Date(), 30).toISOString(),
    estimatedHours: 2,
    estimatedCost: 320,
    priority: "medium",
    assignedTo: "Mike Johnson",
    status: "scheduled",
  },
]

const ScheduledMaintenanceList = ({ machineId }) => {
  const [scheduledMaintenance, setScheduledMaintenance] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchScheduledMaintenancesByMachine = async (machineId) => {
    const res = await api.get(`/maintanance/scheduled/machine/${machineId}`);
    return res.data;
  };
  

  useEffect(() => {
    // In a real app, you would fetch data from your API
    // For demo purposes, we'll use the mock data
    const fetchData = async () => {
      const data = await fetchScheduledMaintenancesByMachine(machineId);
      setScheduledMaintenance(data);
      setLoading(false);
    };
    fetchData();
  }, [machineId])

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return <Badge variant="default">Medium</Badge>
      case "low":
        return <Badge variant="outline">Low</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const getStatusBadge = (status, dueDate) => {
    const date = new Date(dueDate)

    if (isPast(date) && !isToday(date)) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" /> Overdue
        </Badge>
      )
    }

    if (isToday(date)) {
      return (
        <Badge variant="warning" className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> Due Today
        </Badge>
      )
    }

    return (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
        <Calendar className="h-3 w-3" /> Scheduled
      </Badge>
    )
  }

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch (error) {
      return dateString
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-40">Loading scheduled maintenance...</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Due Date</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Est. Hours</TableHead>
            <TableHead>Est. Cost</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scheduledMaintenance.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                No scheduled maintenance found for this machine.
              </TableCell>
            </TableRow>
          ) : (
            scheduledMaintenance.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{formatDate(item.dueDate)}</TableCell>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{getPriorityBadge(item.priority)}</TableCell>
                <TableCell>{item.estimatedHours}</TableCell>
                <TableCell>₹{item.estimatedCost}</TableCell>
                <TableCell>{item.assignedTo}</TableCell>
                <TableCell>{getStatusBadge(item.status, item.dueDate)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <CheckCircle className="h-4 w-4" />
                    <span className="sr-only">Complete</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default ScheduledMaintenanceList
