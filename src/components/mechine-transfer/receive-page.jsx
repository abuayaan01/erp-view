"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Download } from "lucide-react"

// Update the mock data to include the new transfer types
// Replace the dispatchedTransfers array with this updated one
const dispatchedTransfers = [
  {
    id: "TR-003",
    machineName: "Crane CR300",
    machineId: "M003",
    fromSite: "Site B",
    toSite: "Site D",
    dispatchedBy: "Store Manager",
    dispatchDate: "2023-10-11",
    transportDetails: {
      vehicleNo: "XYZ-1234",
      driverName: "Robert Johnson",
      driverContact: "9876543210",
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
    dispatchedBy: "Store Manager",
    dispatchDate: "2023-10-19",
    transportDetails: {
      vehicleNo: "ABC-5678",
      driverName: "David Smith",
      driverContact: "8765432109",
    },
    type: "sell",
  },
  {
    id: "TR-009",
    machineName: "Compactor C100",
    machineId: "M010",
    fromSite: "Site C",
    scrapVendor: "XYZ Recycling",
    dispatchedBy: "Store Manager",
    dispatchDate: "2023-10-17",
    transportDetails: {
      vehicleNo: "DEF-9012",
      driverName: "Michael Brown",
      driverContact: "7654321098",
    },
    type: "scrap",
  },
]

export function ReceivePage() {
  const { toast } = useToast()
  const [transfers, setTransfers] = useState(dispatchedTransfers)
  const [remarks, setRemarks] = useState({})

  const handleRemarksChange = (transferId, value) => {
    setRemarks((prev) => ({
      ...prev,
      [transferId]: value,
    }))
  }

  // Update the handleReceive function to handle different transfer types
  // Replace the handleReceive function with this updated one
  const handleReceive = (transfer) => {
    // In a real application, you would send this data to your API
    console.log(`Receiving transfer ${transfer.id} with remarks:`, remarks[transfer.id] || "No remarks")

    // Remove the transfer from the list
    setTransfers(transfers.filter((t) => t.id !== transfer.id))

    // Show success message based on transfer type
    let message = ""
    if (transfer.type === "site_transfer") {
      message = `${transfer.machineName} has been received at ${transfer.toSite}`
    } else if (transfer.type === "sell") {
      message = `${transfer.machineName} has been delivered to buyer: ${transfer.buyerName}`
    } else if (transfer.type === "scrap") {
      message = `${transfer.machineName} has been delivered to scrap vendor: ${transfer.scrapVendor}`
    }

    toast({
      title: transfer.type === "site_transfer" ? "Machine Received" : "Delivery Confirmed",
      description: message,
      variant: "default",
    })
  }

  return (
    <div className="space-y-6">
      {transfers.length > 0 ? (
        transfers.map((transfer) => (
          <Card key={transfer.id}>
            {/* Update the CardHeader to show different titles based on transfer type */}
            {/* Replace the CardHeader section in the map function with this updated one */}
            <CardHeader>
              <CardTitle className="text-xl">
                {transfer.type === "site_transfer"
                  ? "Receive: "
                  : transfer.type === "sell"
                    ? "Confirm Buyer Delivery: "
                    : "Confirm Scrap Delivery: "}
                {transfer.id}
              </CardTitle>
              <CardDescription>
                Dispatched on {transfer.dispatchDate} by {transfer.dispatchedBy}
              </CardDescription>
            </CardHeader>

            {/* Update the CardContent to show different information based on transfer type */}
            {/* Replace the CardContent section in the map function with this updated one */}
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Machine Details</h3>
                  <p className="text-sm text-muted-foreground">
                    {transfer.machineName} ({transfer.machineId})
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">From Site</h3>
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
                  </div>
                </div>
              )}

              {transfer.type === "scrap" && (
                <div className="border rounded-md p-3 space-y-2">
                  <h3 className="text-sm font-medium">Scrap Details</h3>
                  <div>
                    <p className="text-xs text-muted-foreground">Scrap Vendor</p>
                    <p className="text-sm">{transfer.scrapVendor}</p>
                  </div>
                </div>
              )}

              <div className="border rounded-md p-4 space-y-2">
                <h3 className="text-sm font-medium">Transport Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Vehicle Number</p>
                    <p className="text-sm">{transfer.transportDetails.vehicleNo}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Driver Name</p>
                    <p className="text-sm">{transfer.transportDetails.driverName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Driver Contact</p>
                    <p className="text-sm">{transfer.transportDetails.driverContact}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Remarks (Machine Condition, Issues, etc.)</h3>
                <Textarea
                  placeholder="Enter remarks about the machine condition"
                  value={remarks[transfer.id] || ""}
                  onChange={(e) => handleRemarksChange(transfer.id, e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>

            {/* Update the Button text based on transfer type */}
            {/* Replace the Button in the CardFooter with this updated one */}
            <CardFooter className="flex justify-end">
              <Button onClick={() => handleReceive(transfer)} className="bg-green-600 text-white hover:bg-green-700">
                <Download className="mr-2 h-4 w-4" />
                {transfer.type === "site_transfer" ? "Receive Machine" : "Confirm Delivery"}
              </Button>
            </CardFooter>
          </Card>
        ))
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Dispatched Transfers</CardTitle>
            <CardDescription>There are no dispatched machine transfers waiting to be received</CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}

