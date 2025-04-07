"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DispatchTable } from "./DispatchTable"

export function DispatchPage() {
  const [requisitions, setRequisitions] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch requisitions
  useEffect(() => {
    const fetchRequisitions = async () => {
      setLoading(true)

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Mock requisitions data - only approved ones
        const mockRequisitions = [
          {
            id: 2,
            date: "2023-06-14",
            materialName: "Steel Rebar (10mm)",
            materialId: 4,
            quantity: 2,
            unit: "Tons",
            urgency: "urgent",
            site: "Project Beta",
            requiredBy: "2023-06-20",
            status: "approved",
            requestedBy: "Sarah Johnson",
            approvedBy: "Michael Brown",
            approvedDate: "2023-06-15",
            approvedQuantity: 2,
            justification: "Critical for structural work that is behind schedule",
          },
          {
            id: 7,
            date: "2023-06-09",
            materialName: "Gravel",
            materialId: 3,
            quantity: 10,
            unit: "Cubic Meters",
            urgency: "normal",
            site: "Project Alpha",
            requiredBy: "2023-06-25",
            status: "approved",
            requestedBy: "John Smith",
            approvedBy: "Michael Brown",
            approvedDate: "2023-06-10",
            approvedQuantity: 10,
            justification: "Required for foundation work in Block C",
          },
          {
            id: 8,
            date: "2023-06-08",
            materialName: "Electrical Wires",
            materialId: 10,
            quantity: 200,
            unit: "Meters",
            urgency: "normal",
            site: "Project Gamma",
            requiredBy: "2023-06-30",
            status: "approved",
            requestedBy: "Robert Davis",
            approvedBy: "Michael Brown",
            approvedDate: "2023-06-09",
            approvedQuantity: 200,
            justification: "Required for electrical work in Phase 1",
          },
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
        <h1 className="text-3xl font-bold">Dispatch Materials</h1>
        <p className="text-muted-foreground">Manage material dispatches to project sites</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Approved Requisitions</CardTitle>
          <CardDescription>Dispatch approved materials to their respective sites</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="flex flex-col items-center space-y-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-sm text-muted-foreground">Loading requisitions...</p>
              </div>
            </div>
          ) : (
            <DispatchTable requisitions={requisitions} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

