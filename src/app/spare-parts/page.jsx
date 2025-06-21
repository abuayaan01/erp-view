"use client";

import { AddSparePartModal } from "@/components/spare-parts/AddSparePartModal";
import { SparePartsTable } from "@/components/spare-parts/SparePartsTable";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export function SparePartsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [spareParts, setSpareParts] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalParts: 0,
    totalStock: 0,
    lowStockItems: 0,
    pendingRequests: 0,
  });

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
    ];

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
    ];

    setSpareParts(mockSpareParts);
    setRecentRequests(mockRequests);

    // Calculate statistics
    const totalPartsCount = mockSpareParts.length;
    const totalStockCount = mockSpareParts.reduce(
      (sum, part) => sum + part.currentStock,
      0
    );
    const lowStockCount = mockSpareParts.filter(
      (part) => part.currentStock < part.minStockLevel
    ).length;
    const pendingRequestsCount = mockRequests.filter(
      (req) => req.status === "pending"
    ).length;

    setStats({
      totalParts: totalPartsCount,
      totalStock: totalStockCount,
      lowStockItems: lowStockCount,
      pendingRequests: pendingRequestsCount,
    });
  }, []);

  // Handle adding a new spare part
  const handleAddSparePart = (newPart) => {
    const newPartWithId = {
      ...newPart,
      id: spareParts.length + 1,
      lastUpdated: new Date().toISOString().slice(0, 10),
    };
    setSpareParts([...spareParts, newPartWithId]);
    setStats((prev) => ({
      ...prev,
      totalParts: prev.totalParts + 1,
      totalStock: prev.totalStock + Number(newPart.currentStock),
      lowStockItems:
        newPart.currentStock < newPart.minStockLevel
          ? prev.lowStockItems + 1
          : prev.lowStockItems,
    }));
  };

  // Filter spare parts based on search query
  const filteredParts = spareParts.filter(
    (part) =>
      part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.partNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.site.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Spare Parts Management</h1>
          <p className="text-muted-foreground">
            Manage inventory, requests, and stock levels
          </p>
        </div>
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
            {loading ? (
            <div className="flex-1 flex flex-col justify-center">
              <TableSkeleton cols={9} rows={6} />
            </div>
          ) :
              <SparePartsTable spareParts={filteredParts} /> }
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal for adding new spare part */}
      <AddSparePartModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddSparePart}
      />
    </div>
  );
}
