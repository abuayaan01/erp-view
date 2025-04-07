"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProcurementTable } from "./ProcurementTable"

export function ProcurementPage() {
  const [requisitions, setRequisitions] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch requisitions
  useEffect(() => {
    const fetchRequisitions = async () => {
      setLoading(true)

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Mock requisitions data - only procurement ones
        const mockRequisitions = [
          {
            id: 6,
            date: "2023-06-10",
            materialName: "PVC Pipes (4 inch)",
            materialId: 9,
            quantity: 100,
            unit: "Meters",
            urgency: "urgent",
            site: "Project Gamma",
            requiredBy: "2023-06-15",
            status: "procurement",
            requestedBy: "Robert Davis",
            sentToProcurementBy: "Michael Brown",
            sentToProcurementDate: "2023-06-11",
            procurementStatus: "ordered",
            expectedDate: "2023-06-20",
            justification: "Urgent requirement for drainage system",
          },
          {
            id: 10,
            date: "2023-06-06",
            materialName: "Alternator",
            materialId: 5,
            quantity: 2,
            unit: "Pieces",
            urgency: "urgent",
            site: "Project Alpha",
            requiredBy: "2023-06-12",
            status: "procurement",
            requestedBy: "John Smith",
            sentToProcurementBy: "Michael Brown",
            sentToProcurementDate: "2023-06-07",
            procurementStatus: "in-transit",
            expectedDate: "2023-06-18",
            justification: "Required for generator repair",
          },
          {
            id: 11,
            date: "2023-06-05",
            materialName: "Paint (Blue)",
            materialId: 12,
            quantity: 15,
            unit: "Gallons",
            urgency: "normal",
            site: "Project Gamma",
            requiredBy: "2023-06-25",
            status: "procurement",
            requestedBy: "Robert Davis",
            sentToProcurementBy: "Michael Brown",
            sentToProcurementDate: "2023-06-06",
            procurementStatus: "pending",
            justification: "Required for exterior painting",
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
        <h1 className="text-3xl font-bold">Procurement Tracking</h1>
        <p className="text-muted-foreground">Track and manage procurement of materials</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Procurement Items</CardTitle>
          <CardDescription>Update status and expected delivery dates for procurement items</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="flex flex-col items-center space-y-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-sm text-muted-foreground">Loading procurement items...</p>
              </div>
            </div>
          ) : (
            <ProcurementTable requisitions={requisitions} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

