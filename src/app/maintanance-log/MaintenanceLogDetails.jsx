"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle, Clock, AlertTriangle, Calendar, User, DollarSign, Wrench, Package } from "lucide-react"
import { format } from "date-fns"

const MaintenanceLogDetails = ({ log, onBack }) => {
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
      return format(new Date(dateString), "MMMM d, yyyy 'at' h:mm a")
    } catch (error) {
      return dateString
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to List
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">{log.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            {getMaintenanceTypeBadge(log.type)}
            {getStatusBadge(log.status)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold">₹{log.cost}</div>
          <div className="text-sm text-muted-foreground">Cost</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Date</span>
          </div>
          <p>{formatDate(log.date)}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Technician</span>
          </div>
          <p>{log.technician}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wrench className="h-4 w-4" />
            <span>Hours at Service</span>
          </div>
          <p>{log.hoursAtService}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span>Cost</span>
          </div>
          <p>₹{log.cost}</p>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">Description</h4>
        <p className="text-muted-foreground">{log.description}</p>
      </div>

      {log.parts && (
        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2">
            <Package className="h-4 w-4" />
            Parts Used
          </h4>
          <p className="text-muted-foreground">{log.parts}</p>
        </div>
      )}

      {/* <div className="flex justify-end gap-2">
        <Button variant="outline">Download Report</Button>
        <Button variant="outline">Print</Button>
        <Button>Edit</Button>
      </div> */}
    </div>
  )
}

export default MaintenanceLogDetails
