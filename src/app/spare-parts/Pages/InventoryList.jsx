"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockInventoryData = [
  {
    id: "1",
    name: "Hydraulic Pump",
    partNo: "HP-234",
    category: "Hydraulics",
    quantity: 10,
    minLevel: 5,
    site: "Kolkata Site A",
    lastUpdated: "2025-04-10T10:30:00Z",
  },
  {
    id: "2",
    name: "Bearing Block",
    partNo: "BB-112",
    category: "Mechanical",
    quantity: 3,
    minLevel: 5,
    site: "Delhi Site B",
    lastUpdated: "2025-04-15T12:00:00Z",
  },
  {
    id: "3",
    name: "Control Valve",
    partNo: "CV-556",
    category: "Pneumatics",
    quantity: 0,
    minLevel: 2,
    site: "Kolkata Site A",
    lastUpdated: "2025-04-12T08:45:00Z",
  },
  {
    id: "4",
    name: "Pressure Gauge",
    partNo: "PG-789",
    category: "Instruments",
    quantity: 15,
    minLevel: 4,
    site: "Mumbai Site C",
    lastUpdated: "2025-04-18T14:10:00Z",
  },
  {
    id: "5",
    name: "Rubber Seal Kit",
    partNo: "RSK-321",
    category: "Seals",
    quantity: 6,
    minLevel: 6,
    site: "Delhi Site B",
    lastUpdated: "2025-04-17T16:00:00Z",
  },
];

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterSite, setFilterSite] = useState("all");
  const [categories, setCategories] = useState([]);
  const [sites, setSites] = useState([]);

  useEffect(() => {
    // Load inventory from localStorage
    const storedInventory = mockInventoryData;
    // const storedInventory = JSON.parse(localStorage.getItem("inventory")) || [];
    setInventory(storedInventory);

    // Extract unique categories and sites
    const uniqueCategories = [
      ...new Set(storedInventory.map((item) => item.category)),
    ];
    const uniqueSites = [...new Set(storedInventory.map((item) => item.site))];

    setCategories(uniqueCategories);
    setSites(uniqueSites);
  }, []);

  const getStockStatus = (item) => {
    if (item.quantity <= 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (item.quantity <= item.minLevel) {
      return <Badge variant="warning">Low Stock</Badge>;
    } else {
      return <Badge variant="success">In Stock</Badge>;
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.partNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || item.category === filterCategory;
    const matchesSite = filterSite === "all" || item.site === filterSite;

    return matchesSearch && matchesCategory && matchesSite;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Spare Parts Inventory
        </h1>
        {/* <Button>
          <Link to="/inventory/add">
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Link>
        </Button> */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Spare Parts Inventory</CardTitle>
          <CardDescription>
            Manage your spare parts inventory across all sites
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, part number, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex flex-1 flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Select
                  value={filterCategory}
                  onValueChange={setFilterCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category, index) => (
                      <SelectItem key={index} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Select value={filterSite} onValueChange={setFilterSite}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by site" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sites</SelectItem>
                    {sites.map((site, index) => (
                      <SelectItem key={index} value={site}>
                        {site}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Part No.</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Min. Level</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-6 text-muted-foreground"
                    >
                      {searchTerm ||
                      filterCategory !== "all" ||
                      filterSite !== "all"
                        ? "No items found matching your search criteria."
                        : "No inventory items found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.partNo}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {item.quantity} {getStockStatus(item)}
                        </div>
                      </TableCell>
                      <TableCell>{item.minLevel}</TableCell>
                      <TableCell>{item.site}</TableCell>
                      <TableCell>{formatDate(item.lastUpdated)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Link to={`/inventory/${item.id}`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryList;
