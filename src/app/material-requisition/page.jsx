"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RequisitionTable } from "@/components/material-requisition/RequisitionTable"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useNavigate } from "react-router"

export function RequisitionsPage() {
  const [requisitions, setRequisitions] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  // Fetch requisitions
  useEffect(() => {
    const fetchRequisitions = async () => {
      setLoading(true)

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Mock requisitions data
        const mockRequisitions = [
          {
            id: 1,
            date: "2023-06-15",
            materialName: "Cement",
            materialId: 1,
            quantity: 50,
            unit: "Bags",
            urgency: "normal",
            site: "Project Alpha",
            requiredBy: "2023-06-30",
            status: "pending",
            requestedBy: "John Smith",
            justification: "Required for foundation work in Block A",
          },
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
            id: 3,
            date: "2023-06-13",
            materialName: "Bricks",
            materialId: 6,
            quantity: 2000,
            unit: "Pieces",
            urgency: "normal",
            site: "Project Gamma",
            requiredBy: "2023-06-25",
            status: "rejected",
            requestedBy: "Robert Davis",
            rejectedBy: "Michael Brown",
            rejectedDate: "2023-06-14",
            rejectionReason: "Sufficient stock already available at site",
            justification: "Needed for wall construction in Phase 2",
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

  // Navigate to create requisition page
  const handleCreateRequisition = () => {
    // In a real app, you would use React Router's navigate
    navigate("/material-requisition/new")
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Material Requisitions</h1>
          <p className="text-muted-foreground">View and manage all material requisitions</p>
        </div>
        <Button onClick={handleCreateRequisition} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          New Requisition
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Requisition List</CardTitle>
          <CardDescription>View all requisitions across sites and track their status</CardDescription>
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
            <RequisitionTable requisitions={requisitions} />
            // <div></div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

