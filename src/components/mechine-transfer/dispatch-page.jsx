"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Send, FileDown } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { TransferChallan } from "./transfer-challan"

// Update the mock data to include the new transfer types
// Replace the approvedTransfers array with this updated one
const approvedTransfers = [
  {
    id: "TR-002",
    machineName: "Bulldozer B500",
    machineId: "M002",
    fromSite: "Site C",
    toSite: "Site A",
    approvedBy: "Admin User",
    approvedDate: "2023-10-13",
    transferDate: "2023-10-13",
    transportDetails: {
      vehicleNo: "",
      driverName: "",
      driverContact: "",
    },
    type: "site_transfer",
  },
  {
    id: "TR-006",
    machineName: "Loader L200",
    machineId: "M006",
    fromSite: "Site B",
    toSite: "Site D",
    approvedBy: "Admin User",
    approvedDate: "2023-10-14",
    transferDate: "2023-10-14",
    transportDetails: {
      vehicleNo: "",
      driverName: "",
      driverContact: "",
    },
    type: "site_transfer",
  },
  {
    id: "TR-008",
    machineName: "Forklift F200",
    machineId: "M008",
    fromSite: "Site A",
    buyerName: "ABC Construction",
    buyerContact: "9876543210",
    saleAmount: "500000",
    approvedBy: "Admin User",
    approvedDate: "2023-10-19",
    transferDate: "2023-10-19",
    transportDetails: {
      vehicleNo: "",
      driverName: "",
      driverContact: "",
    },
    type: "sell",
  },
  {
    id: "TR-009",
    machineName: "Compactor C100",
    machineId: "M010",
    fromSite: "Site C",
    scrapVendor: "XYZ Recycling",
    scrapValue: "50000",
    approvedBy: "Admin User",
    approvedDate: "2023-10-17",
    transferDate: "2023-10-17",
    transportDetails: {
      vehicleNo: "",
      driverName: "",
      driverContact: "",
    },
    type: "scrap",
  },
]

export function DispatchPage() {
  const { toast } = useToast()
  const [transfers, setTransfers] = useState(approvedTransfers)
  const [transportDetails, setTransportDetails] = useState({})
  const [selectedTransfer, setSelectedTransfer] = useState(null)
  const [challanOpen, setChallanOpen] = useState(false)

  const handleInputChange = (transferId, field, value) => {
    setTransportDetails((prev) => ({
      ...prev,
      [transferId]: {
        ...prev[transferId],
        [field]: value,
      },
    }))
  }

  // Update the handleDispatch function to handle different transfer types
  // Replace the handleDispatch function with this updated one
  const handleDispatch = (transfer) => {
    const details = transportDetails[transfer.id] || {}

    // Validate form
    if (!details.vehicleNo || !details.driverName || !details.driverContact) {
      toast({
        title: "Validation Error",
        description: "Please fill all transport details",
        variant: "destructive",
      })
      return
    }

    // In a real application, you would send this data to your API
    console.log(`Dispatching transfer ${transfer.id} with transport details:`, details)

    // Remove the transfer from the list
    setTransfers(transfers.filter((t) => t.id !== transfer.id))

    // Show success message based on transfer type
    let message = ""
    if (transfer.type === "site_transfer") {
      message = `${transfer.machineName} has been dispatched to ${transfer.toSite}`
    } else if (transfer.type === "sell") {
      message = `${transfer.machineName} has been dispatched to buyer: ${transfer.buyerName}`
    } else if (transfer.type === "scrap") {
      message = `${transfer.machineName} has been dispatched to scrap vendor: ${transfer.scrapVendor}`
    }

    toast({
      title: "Machine Dispatched",
      description: message,
      variant: "default",
    })
  }

  const handleViewChallan = (transfer) => {
    // Update the transfer with the current transport details
    const details = transportDetails[transfer.id] || {}
    const updatedTransfer = {
      ...transfer,
      transportDetails: {
        vehicleNo: details.vehicleNo || "",
        driverName: details.driverName || "",
        driverContact: details.driverContact || "",
      },
    }

    setSelectedTransfer(updatedTransfer)
    setChallanOpen(true)
  }

  return (
    <div className="space-y-6">
      {transfers.length > 0 ? (
        transfers.map((transfer) => (
          <Card key={transfer.id}>
            {/* Update the CardHeader to show different titles based on transfer type
            Replace the CardHeader section in the map function with this updated one */}
            <CardHeader>
              <CardTitle className="text-xl">
                {transfer.type === "site_transfer"
                  ? "Dispatch: "
                  : transfer.type === "sell"
                    ? "Deliver to Buyer: "
                    : "Deliver to Scrap Vendor: "}
                {transfer.id}
              </CardTitle>
              <CardDescription>
                Approved on {transfer.approvedDate} by {transfer.approvedBy}
              </CardDescription>
            </CardHeader>
            {/* Update the CardContent to show different information based on transfer type
            Replace the CardContent section in the map function with this updated one */}
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Machine Details</h3>
                  <p className="text-sm text-muted-foreground">
                    {transfer.machineName} ({transfer.machineId})
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Current Site</h3>
                  <p className="text-sm text-muted-foreground">{transfer.fromSite}</p>
                </div>
              </div>

              {transfer.type === "site_transfer" && (
                <div>
                  <h3 className="text-sm font-medium">Destination Site</h3>
                  <p className="text-sm text-muted-foreground">{transfer.toSite}</p>
                </div>
              )}

              {transfer.type === "sell" && (
                <div className="border rounded-md p-3 space-y-2">
                  <h3 className="text-sm font-medium">Buyer Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Buyer Name</p>
                      <p className="text-sm">{transfer.buyerName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Buyer Contact</p>
                      <p className="text-sm">{transfer.buyerContact}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Sale Amount</p>
                      <p className="text-sm">{transfer.saleAmount || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              )}

              {transfer.type === "scrap" && (
                <div className="border rounded-md p-3 space-y-2">
                  <h3 className="text-sm font-medium">Scrap Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Scrap Vendor</p>
                      <p className="text-sm">{transfer.scrapVendor}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Scrap Value</p>
                      <p className="text-sm">{transfer.scrapValue || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="border rounded-md p-4 space-y-4">
                <h3 className="text-sm font-medium">Transport Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`vehicleNo-${transfer.id}`}>Vehicle Number</Label>
                    <Input
                      id={`vehicleNo-${transfer.id}`}
                      placeholder="Enter vehicle number"
                      value={transportDetails[transfer.id]?.vehicleNo || ""}
                      onChange={(e) => handleInputChange(transfer.id, "vehicleNo", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`driverName-${transfer.id}`}>Driver Name</Label>
                    <Input
                      id={`driverName-${transfer.id}`}
                      placeholder="Enter driver name"
                      value={transportDetails[transfer.id]?.driverName || ""}
                      onChange={(e) => handleInputChange(transfer.id, "driverName", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`driverContact-${transfer.id}`}>Driver Contact</Label>
                    <Input
                      id={`driverContact-${transfer.id}`}
                      placeholder="Enter driver contact"
                      value={transportDetails[transfer.id]?.driverContact || ""}
                      onChange={(e) => handleInputChange(transfer.id, "driverContact", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => handleViewChallan(transfer)}>
                <FileDown className="mr-2 h-4 w-4" />
                View Challan
              </Button>
              {/* Update the Button text based on transfer type
              Replace the Button in the CardFooter with this updated one */}
              <Button onClick={() => handleDispatch(transfer)} className="bg-blue-600 text-white hover:bg-blue-700">
                <Send className="mr-2 h-4 w-4" />
                {transfer.type === "site_transfer"
                  ? "Dispatch Machine"
                  : transfer.type === "sell"
                    ? "Deliver to Buyer"
                    : "Deliver to Scrap Vendor"}
              </Button>
            </CardFooter>
          </Card>
        ))
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Approved Transfers</CardTitle>
            <CardDescription>There are no approved machine transfers waiting for dispatch</CardDescription>
          </CardHeader>
        </Card>
      )}

      <Dialog open={challanOpen} onOpenChange={setChallanOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedTransfer && <TransferChallan transfer={selectedTransfer} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

