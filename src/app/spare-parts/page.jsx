"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Package, AlertTriangle, Clock, PlusCircle, Layers } from "lucide-react"
import { SparePartsTable } from "@/components/spare-parts/SparePartsTable"
import { RequestsTable } from "@/components/spare-parts/RequestsTable"
import { AddSparePartModal } from "@/components/spare-parts/AddSparePartModal"

export function SparePartsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [spareParts, setSpareParts] = useState([])
  const [recentRequests, setRecentRequests] = useState([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [stats, setStats] = useState({
    totalParts: 0,
    totalStock: 0,
    lowStockItems: 0,
    pendingRequests: 0,
  })

  // Simulate data fetching
  useEffect(() => {
    // Mock data for spare parts
    const mockSpareParts = [
      {
        id: 1,
        name: "Oil Filter",
        partNo: "OF-1234",
        category: "Filters",
        currentStock: 23,
        minStockLevel: 10,
        site: "Project Alpha",
        lastUpdated: "2023-06-15",
      },
      {
        id: 2,
        name: "Air Filter",
        partNo: "AF-5678",
        category: "Filters",
        currentStock: 15,
        minStockLevel: 8,
        site: "Project Beta",
        lastUpdated: "2023-06-10",
      },
      {
        id: 3,
        name: "Brake Pad",
        partNo: "BP-9101",
        category: "Brakes",
        currentStock: 5,
        minStockLevel: 10,
        site: "Project Alpha",
        lastUpdated: "2023-06-12",
      },
      {
        id: 4,
        name: "Fuel Pump",
        partNo: "FP-1121",
        category: "Fuel System",
        currentStock: 8,
        minStockLevel: 5,
        site: "Project Gamma",
        lastUpdated: "2023-06-11",
      },
      {
        id: 5,
        name: "Alternator",
        partNo: "AL-3141",
        category: "Electrical",
        currentStock: 4,
        minStockLevel: 3,
        site: "Project Beta",
        lastUpdated: "2023-06-09",
      },
      {
        id: 6,
        name: "Spark Plug",
        partNo: "SP-5161",
        category: "Ignition",
        currentStock: 50,
        minStockLevel: 20,
        site: "Project Alpha",
        lastUpdated: "2023-06-14",
      },
      {
        id: 7,
        name: "Radiator",
        partNo: "RA-7181",
        category: "Cooling",
        currentStock: 2,
        minStockLevel: 5,
        site: "Project Gamma",
        lastUpdated: "2023-06-08",
      },
    ]

    // Mock data for recent requests
    const mockRequests = [
      {
        id: 101,
        partName: "Brake Pad",
        partNo: "BP-9101",
        quantity: 2,
        requestedBy: "John Smith",
        date: "2023-06-15",
        status: "pending",
        site: "Project Alpha",
      },
      {
        id: 102,
        partName: "Radiator",
        partNo: "RA-7181",
        quantity: 1,
        requestedBy: "Sarah Johnson",
        date: "2023-06-14",
        status: "approved",
        site: "Project Gamma",
      },
      {
        id: 103,
        partName: "Oil Filter",
        partNo: "OF-1234",
        quantity: 5,
        requestedBy: "Mike Brown",
        date: "2023-06-13",
        status: "rejected",
        site: "Project Alpha",
      },
      {
        id: 104,
        partName: "Fuel Pump",
        partNo: "FP-1121",
        quantity: 1,
        requestedBy: "Lisa Davis",
        date: "2023-06-12",
        status: "dispatched",
        site: "Project Gamma",
      },
      {
        id: 105,
        partName: "Air Filter",
        partNo: "AF-5678",
        quantity: 3,
        requestedBy: "James Wilson",
        date: "2023-06-11",
        status: "received",
        site: "Project Beta",
      },
    ]

    setSpareParts(mockSpareParts)
    setRecentRequests(mockRequests)

    // Calculate statistics
    const totalPartsCount = mockSpareParts.length
    const totalStockCount = mockSpareParts.reduce((sum, part) => sum + part.currentStock, 0)
    const lowStockCount = mockSpareParts.filter((part) => part.currentStock < part.minStockLevel).length
    const pendingRequestsCount = mockRequests.filter((req) => req.status === "pending").length

    setStats({
      totalParts: totalPartsCount,
      totalStock: totalStockCount,
      lowStockItems: lowStockCount,
      pendingRequests: pendingRequestsCount,
    })
  }, [])

  // Handle adding a new spare part
  const handleAddSparePart = (newPart) => {
    const newPartWithId = {
      ...newPart,
      id: spareParts.length + 1,
      lastUpdated: new Date().toISOString().slice(0, 10),
    }
    setSpareParts([...spareParts, newPartWithId])
    setStats((prev) => ({
      ...prev,
      totalParts: prev.totalParts + 1,
      totalStock: prev.totalStock + Number(newPart.currentStock),
      lowStockItems: newPart.currentStock < newPart.minStockLevel ? prev.lowStockItems + 1 : prev.lowStockItems,
    }))
  }

  // Filter spare parts based on search query
  const filteredParts = spareParts.filter(
    (part) =>
      part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.partNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.site.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Spare Parts Management</h1>
          <p className="text-muted-foreground">Manage inventory, requests, and stock levels</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add New Spare Part
        </Button>
      </div>

      {/* Dashboard cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Spare Parts</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalParts}</div>
            <p className="text-xs text-muted-foreground">Unique parts in inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStock}</div>
            <p className="text-xs text-muted-foreground">Units across all locations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Items below minimum level</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{stats.pendingRequests}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Search by name, part number, category or site..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tabs for Inventory and Requests */}
      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="requests">Recent Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Spare Parts Inventory</CardTitle>
              <CardDescription>
                Manage your spare parts inventory across all sites.
                <Badge variant="outline" className="ml-2">
                  {filteredParts.length} items
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SparePartsTable spareParts={filteredParts} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Requests</CardTitle>
              <CardDescription>
                View and manage recent spare part requests.
                <Badge variant="outline" className="ml-2">
                  {recentRequests.length} requests
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RequestsTable requests={recentRequests} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal for adding new spare part */}
      <AddSparePartModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddSparePart} />
    </div>
  )
}

