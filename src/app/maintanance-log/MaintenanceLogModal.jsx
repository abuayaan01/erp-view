"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Plus, Wrench } from "lucide-react"
import MaintenanceLogList from "./MaintenanceLogList"
import MaintenanceLogDetails from "./MaintenanceLogDetails"
import ScheduledMaintenanceList from "./ScheduledMaintenanceList"

const MaintenanceLogModal = ({ isOpen, onClose, machineId, machineName }) => {
  const [activeTab, setActiveTab] = useState("history")
  const [selectedLog, setSelectedLog] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    type: "repair",
    date: new Date(),
    title: "",
    description: "",
    parts: "",
    cost: "",
    technician: "",
    status: "completed",
    hoursAtService: "",
  })

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowAddForm(false)
      setSelectedLog(null)
      setFormData({
        type: "repair",
        date: new Date(),
        title: "",
        description: "",
        parts: "",
        cost: "",
        technician: "",
        status: "completed",
        hoursAtService: "",
      })
    }
  }, [isOpen])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      date,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, you would save this to your backend
    console.log("Submitting maintenance log:", formData)

    // For demo purposes, we'll just close the form
    setShowAddForm(false)

    // You could also refresh the logs list here
  }

  const handleViewLog = (log) => {
    setSelectedLog(log)
  }

  const handleBackToList = () => {
    setSelectedLog(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Maintenance Log
          </DialogTitle>
          <DialogDescription>
            {machineName} (ID: {machineId})
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="history">Maintenance History</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled Maintenance</TabsTrigger>
            <TabsTrigger value="stats">Maintenance Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-4">
            {!selectedLog && !showAddForm && (
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Maintenance Records</h3>
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Record
                </Button>
              </div>
            )}

            {showAddForm && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Add Maintenance Record</h3>
                  <Button variant="ghost" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Maintenance Type</Label>
                      <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="repair">Repair</SelectItem>
                          <SelectItem value="preventive">Preventive Maintenance</SelectItem>
                          <SelectItem value="inspection">Inspection</SelectItem>
                          <SelectItem value="oil_change">Oil Change</SelectItem>
                          <SelectItem value="parts_replacement">Parts Replacement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.date ? format(formData.date, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={formData.date} onSelect={handleDateChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Brief description of maintenance"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hoursAtService">Hours at Service</Label>
                      <Input
                        id="hoursAtService"
                        name="hoursAtService"
                        type="number"
                        value={formData.hoursAtService}
                        onChange={handleInputChange}
                        placeholder="Machine hours at service time"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="technician">Technician</Label>
                      <Input
                        id="technician"
                        name="technician"
                        value={formData.technician}
                        onChange={handleInputChange}
                        placeholder="Name of technician"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cost">Cost</Label>
                      <Input
                        id="cost"
                        name="cost"
                        type="number"
                        value={formData.cost}
                        onChange={handleInputChange}
                        placeholder="Cost of maintenance"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="parts">Parts Used</Label>
                    <Input
                      id="parts"
                      name="parts"
                      value={formData.parts}
                      onChange={handleInputChange}
                      placeholder="Parts used in maintenance"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Detailed description of the maintenance performed"
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit">Save Record</Button>
                  </div>
                </form>
              </div>
            )}

            {!showAddForm && selectedLog && <MaintenanceLogDetails log={selectedLog} onBack={handleBackToList} />}

            {!showAddForm && !selectedLog && <MaintenanceLogList machineId={machineId} onViewLog={handleViewLog} />}
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Scheduled Maintenance</h3>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Schedule Maintenance
              </Button>
            </div>
            <ScheduledMaintenanceList machineId={machineId} />
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">Maintenance Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Records:</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Maintenance:</span>
                    <span className="font-medium">April 15, 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Next Scheduled:</span>
                    <span className="font-medium">June 20, 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Cost (YTD):</span>
                    <span className="font-medium">$2,450.00</span>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">Maintenance Types</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Repairs:</span>
                    <span className="font-medium">4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Preventive:</span>
                    <span className="font-medium">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Inspections:</span>
                    <span className="font-medium">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Oil Changes:</span>
                    <span className="font-medium">1</span>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4 md:col-span-2">
                <h3 className="text-lg font-medium mb-2">Maintenance Costs</h3>
                <div className="h-40 flex items-center justify-center bg-muted/20 rounded">
                  <p className="text-muted-foreground">Cost chart would appear here</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default MaintenanceLogModal
