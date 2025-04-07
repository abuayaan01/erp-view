"use client"

import { useState } from "react"
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, FileText } from "lucide-react"

// Update the mock data to include the new transfer types
// Replace the historyTransfers array with this updated one
const historyTransfers = [
  {
    id: "TR-001",
    machineName: "Excavator XL2000",
    fromSite: "Site A",
    toSite: "Site B",
    transferDate: "2023-10-15",
    status: "Approved",
    type: "site_transfer",
    logs: [
      { date: "2023-10-15 09:30", action: "Created", user: "John Doe" },
      { date: "2023-10-15 14:45", action: "Approved", user: "Admin User" },
    ],
  },
  {
    id: "TR-002",
    machineName: "Bulldozer B500",
    fromSite: "Site C",
    toSite: "Site A",
    transferDate: "2023-10-12",
    status: "Received",
    type: "site_transfer",
    logs: [
      { date: "2023-10-12 10:15", action: "Created", user: "Jane Smith" },
      { date: "2023-10-12 13:20", action: "Approved", user: "Admin User" },
      { date: "2023-10-13 09:10", action: "Dispatched", user: "Store Manager" },
      { date: "2023-10-14 11:30", action: "Received", user: "Site A Manager" },
    ],
  },
  {
    id: "TR-003",
    machineName: "Crane CR300",
    fromSite: "Site B",
    toSite: "Site D",
    transferDate: "2023-10-10",
    status: "Dispatched",
    type: "site_transfer",
    logs: [
      { date: "2023-10-10 08:45", action: "Created", user: "Mike Johnson" },
      { date: "2023-10-10 15:30", action: "Approved", user: "Admin User" },
      { date: "2023-10-11 10:20", action: "Dispatched", user: "Store Manager" },
    ],
  },
  {
    id: "TR-004",
    machineName: "Loader L100",
    fromSite: "Site A",
    toSite: "Site C",
    transferDate: "2023-10-05",
    status: "Received",
    type: "site_transfer",
    logs: [
      { date: "2023-10-05 11:20", action: "Created", user: "Sarah Williams" },
      { date: "2023-10-05 16:15", action: "Approved", user: "Admin User" },
      { date: "2023-10-06 09:30", action: "Dispatched", user: "Store Manager" },
      { date: "2023-10-07 14:45", action: "Received", user: "Site C Manager" },
    ],
  },
  {
    id: "TR-005",
    machineName: "Excavator XL1000",
    fromSite: "Site D",
    toSite: "Site B",
    transferDate: "2023-10-01",
    status: "Rejected",
    type: "site_transfer",
    logs: [
      { date: "2023-10-01 13:10", action: "Created", user: "David Brown" },
      { date: "2023-10-02 10:45", action: "Rejected", user: "Admin User", reason: "Machine needed at current site" },
    ],
  },
  {
    id: "TR-008",
    machineName: "Forklift F200",
    fromSite: "Site A",
    buyerName: "ABC Construction",
    transferDate: "2023-10-19",
    status: "Sold",
    type: "sell",
    logs: [
      { date: "2023-10-18 09:15", action: "Created", user: "Mike Johnson" },
      { date: "2023-10-19 11:30", action: "Approved", user: "Admin User" },
      { date: "2023-10-20 14:20", action: "Dispatched", user: "Store Manager" },
      { date: "2023-10-21 10:45", action: "Delivered", user: "Logistics Manager" },
    ],
  },
  {
    id: "TR-009",
    machineName: "Compactor C100",
    fromSite: "Site C",
    scrapVendor: "XYZ Recycling",
    transferDate: "2023-10-17",
    status: "Scrapped",
    type: "scrap",
    logs: [
      { date: "2023-10-16 10:30", action: "Created", user: "Sarah Williams" },
      { date: "2023-10-17 13:45", action: "Approved", user: "Admin User" },
      { date: "2023-10-18 09:20", action: "Dispatched", user: "Store Manager" },
      { date: "2023-10-19 11:15", action: "Delivered", user: "Logistics Manager" },
    ],
  },
]

// Update the statuses array to include new statuses
const statuses = ["All Statuses", "Pending", "Approved", "Dispatched", "Received", "Rejected", "Sold", "Scrapped"]

// Add a new transferTypes array for filtering
const transferTypes = ["All Types", "Site Transfer", "Sell", "Scrap"]

// Mock data for sites and machines
const sites = ["All Sites", "Site A", "Site B", "Site C", "Site D"]
const machines = [
  "All Machines",
  "Excavator XL2000",
  "Bulldozer B500",
  "Crane CR300",
  "Loader L100",
  "Excavator XL1000",
  "Forklift F200",
  "Compactor C100",
]

export function TransferHistory() {
  const [transfers, setTransfers] = useState(historyTransfers)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Statuses")
  const [siteFilter, setSiteFilter] = useState("All Sites")
  const [machineFilter, setMachineFilter] = useState("All Machines")
  // Add this after the machineFilter state declaration
  const [typeFilter, setTypeFilter] = useState("All Types")
  const [selectedTransfer, setSelectedTransfer] = useState(null)

  // Update the filteredTransfers function to include type filtering
  // Replace the filteredTransfers constant with this updated one
  const filteredTransfers = transfers.filter((transfer) => {
    const matchesSearch =
      transfer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.machineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.fromSite.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transfer.toSite && transfer.toSite.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "All Statuses" || transfer.status === statusFilter
    const matchesSite =
      siteFilter === "All Sites" ||
      transfer.fromSite === siteFilter ||
      (transfer.toSite && transfer.toSite === siteFilter)
    const matchesMachine = machineFilter === "All Machines" || transfer.machineName === machineFilter

    let matchesType = true
    if (typeFilter !== "All Types") {
      if (typeFilter === "Site Transfer" && transfer.type !== "site_transfer") matchesType = false
      if (typeFilter === "Sell" && transfer.type !== "sell") matchesType = false
      if (typeFilter === "Scrap" && transfer.type !== "scrap") matchesType = false
    }

    return matchesSearch && matchesStatus && matchesSite && matchesMachine && matchesType
  })

  // Update the getStatusColor function to include new statuses
  // Replace the getStatusColor function with this updated one
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "Approved":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "Dispatched":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100"
      case "Received":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "Rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "Sold":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100"
      case "Scrapped":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const viewTransferLogs = (transfer) => {
    setSelectedTransfer(transfer)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transfers..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Select value={siteFilter} onValueChange={setSiteFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by site" />
            </SelectTrigger>
            <SelectContent>
              {sites.map((site) => (
                <SelectItem key={site} value={site}>
                  {site}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Select value={machineFilter} onValueChange={setMachineFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by machine" />
            </SelectTrigger>
            <SelectContent>
              {machines.map((machine) => (
                <SelectItem key={machine} value={machine}>
                  {machine}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Add a new filter for transfer type */}
        <div className="flex-1">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              {transferTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        {/* Update the table header to include Type column */}
        <TableHeader>
          <TableRow>
            <TableHead>Transfer ID</TableHead>
            <TableHead>Machine Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>From → To</TableHead>
            <TableHead>Transfer Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        {/* Update the table body to display the transfer type and handle different types */}
        <TableBody>
          {filteredTransfers.length > 0 ? (
            filteredTransfers.map((transfer) => (
              <TableRow key={transfer.id}>
                <TableCell className="font-medium">{transfer.id}</TableCell>
                <TableCell>{transfer.machineName}</TableCell>
                <TableCell>
                  {transfer.type === "site_transfer" ? "Site Transfer" : transfer.type === "sell" ? "Sell" : "Scrap"}
                </TableCell>
                <TableCell>
                  {transfer.fromSite} →{" "}
                  {transfer.type === "site_transfer"
                    ? transfer.toSite
                    : transfer.type === "sell"
                      ? transfer.buyerName || "Buyer"
                      : transfer.scrapVendor || "Scrap"}
                </TableCell>
                <TableCell>{transfer.transferDate}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(transfer.status)} variant="outline">
                    {transfer.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => viewTransferLogs(transfer)}>
                        <FileText className="h-4 w-4 mr-1" />
                        View Logs
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Transfer Logs: {transfer.id}</DialogTitle>
                        <DialogDescription>History of actions for this transfer</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">Machine: {transfer.machineName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {transfer.type === "site_transfer"
                              ? `From ${transfer.fromSite} to ${transfer.toSite}`
                              : transfer.type === "sell"
                                ? `From ${transfer.fromSite} to buyer: ${transfer.buyerName || "N/A"}`
                                : `From ${transfer.fromSite} to scrap vendor: ${transfer.scrapVendor || "N/A"}`}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">Activity Log</h3>
                          <div className="space-y-2">
                            {transfer.logs.map((log, index) => (
                              <div key={index} className="border-l-2 border-muted pl-4 py-1">
                                <p className="text-sm font-medium">{log.action}</p>
                                <p className="text-xs text-muted-foreground">
                                  {log.date} by {log.user}
                                </p>
                                {log.reason && (
                                  <p className="text-xs text-muted-foreground mt-1">Reason: {log.reason}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                No transfers found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </div>
    </div>
  )
}

