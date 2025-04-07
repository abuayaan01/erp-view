"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ReceivedTable } from "./ReceivedTable"

export function ReceivePage() {
  const [requisitions, setRequisitions] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch requisitions
  useEffect(() => {
    const fetchRequisitions = async () => {
      setLoading(true)

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Mock requisitions data - only dispatched ones
        const mockRequisitions = [
          {
            id: 4,
            date: "2023-06-12",
            materialName: "Sand",
            materialId: 2,
            quantity: 15,
            unit: "Cubic Meters",
            urgency: "normal",
            site: "Project Alpha",
            requiredBy: "2023-06-22",
            status: "dispatched",
            requestedBy: "John Smith",
            approvedBy: "Michael Brown",
            approvedDate: "2023-06-13",
            approvedQuantity: 15,
            dispatchedBy: "James Wilson",
            dispatchedDate: "2023-06-14",
            transportDetails: {
              vehicleNumber: "MH-01-AB-1234",
              driverName: "Rajesh Kumar",
              driverContact: "9876543210",
            },
            justification: "Required for concrete mixing in Block B",
          },
          {
            id: 9,
            date: "2023-06-07",
            materialName: "Paint (White)",
            materialId: 11,
            quantity: 10,
            unit: "Gallons",
            urgency: "normal",
            site: "Project Beta",
            requiredBy: "2023-06-20",
            status: "dispatched",
            requestedBy: "Sarah Johnson",
            approvedBy: "Michael Brown",
            approvedDate: "2023-06-08",
            approvedQuantity: 10,
            dispatchedBy: "James Wilson",
            dispatchedDate: "2023-06-09",
            transportDetails: {
              vehicleNumber: "MH-01-EF-9012",
              driverName: "Amit Singh",
              driverContact: "9876543212",
            },
            justification: "Required for interior painting in Building 1",
          },
          {
            id: 5,
            date: "2023-06-11",
            materialName: "Plywood Sheets",
            materialId: 8,
            quantity: 30,
            unit: "Sheets",
            urgency: "normal",
            site: "Project Beta",
            requiredBy: "2023-06-18",
            status: "delivered",
            requestedBy: "Sarah Johnson",
            approvedBy: "Michael Brown",
            approvedDate: "2023-06-12",
            approvedQuantity: 30,
            dispatchedBy: "James Wilson",
            dispatchedDate: "2023-06-13",
            transportDetails: {
              vehicleNumber: "MH-01-CD-5678",
              driverName: "Suresh Patel",
              driverContact: "9876543211",
            },
            receivedBy: "Sarah Johnson",
            receivedDate: "2023-06-14",
            condition: "good",
            justification: "Required for formwork in Building 2",
          },
        ]

        setRequisitions(mockRequisitions)
      } catch (error) {
        console.error("Error fetching requisitions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRequisitions()
  }, [])

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Receive Materials</h1>
        <p className="text-muted-foreground">Confirm receipt of dispatched materials at your site</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dispatched Materials</CardTitle>
          <CardDescription>Confirm receipt and check condition of dispatched materials</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="flex flex-col items-center space-y-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-sm text-muted-foreground">Loading dispatched materials...</p>
              </div>
            </div>
          ) : (
            <ReceivedTable requisitions={requisitions} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

