"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { FileText, FileDown, BarChart3 } from "lucide-react"

export function InventoryReportPage() {
  const [reportType, setReportType] = useState("stock-level")
  const [siteFilter, setSiteFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [dateRange, setDateRange] = useState({ from: "", to: "" })

  // Mock data for stock levels
  const stockLevelData = [
    { name: "Oil Filter", category: "Filters", currentStock: 23, minStockLevel: 10, site: "Project Alpha" },
    { name: "Air Filter", category: "Filters", currentStock: 15, minStockLevel: 8, site: "Project Beta" },
    { name: "Brake Pad", category: "Brakes", currentStock: 5, minStockLevel: 10, site: "Project Alpha" },
    { name: "Fuel Pump", category: "Fuel System", currentStock: 8, minStockLevel: 5, site: "Project Gamma" },
    { name: "Alternator", category: "Electrical", currentStock: 4, minStockLevel: 3, site: "Project Beta" },
    { name: "Spark Plug", category: "Ignition", currentStock: 50, minStockLevel: 20, site: "Project Alpha" },
    { name: "Radiator", category: "Cooling", currentStock: 2, minStockLevel: 5, site: "Project Gamma" },
  ]

  // Mock data for transactions
  const transactionData = [
    {
      id: 1,
      date: "2023-06-16",
      partName: "Oil Filter",
      action: "Received",
      quantity: 10,
      user: "John Smith",
      site: "Project Alpha",
    },
    {
      id: 2,
      date: "2023-06-15",
      partName: "Brake Pad",
      action: "Issued",
      quantity: 2,
      user: "Sarah Johnson",
      site: "Project Alpha",
    },
    {
      id: 3,
      date: "2023-06-14",
      partName: "Air Filter",
      action: "Received",
      quantity: 5,
      user: "Mike Brown",
      site: "Project Beta",
    },
    {
      id: 4,
      date: "2023-06-13",
      partName: "Radiator",
      action: "Issued",
      quantity: 1,
      user: "Lisa Davis",
      site: "Project Gamma",
    },
    {
      id: 5,
      date: "2023-06-12",
      partName: "Spark Plug",
      action: "Received",
      quantity: 20,
      user: "James Wilson",
      site: "Project Alpha",
    },
    {
      id: 6,
      date: "2023-06-11",
      partName: "Fuel Pump",
      action: "Issued",
      quantity: 2,
      user: "Robert Taylor",
      site: "Project Gamma",
    },
  ]

  // Filter data based on selected filters
  const filteredStockData = stockLevelData.filter((item) => {
    if (siteFilter !== "all" && item.site !== siteFilter) return false
    if (categoryFilter !== "all" && item.category !== categoryFilter) return false
    return true
  })

  const filteredTransactionData = transactionData.filter((item) => {
    if (siteFilter !== "all" && item.site !== siteFilter) return false

    // Filter by date range if provided
    if (dateRange.from && dateRange.to) {
      const itemDate = new Date(item.date)
      const fromDate = new Date(dateRange.from)
      const toDate = new Date(dateRange.to)
      if (itemDate < fromDate || itemDate > toDate) return false
    }

    return true
  })

  // Prepare data for charts
  const stockByCategory = Object.entries(
    stockLevelData.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.currentStock
      return acc
    }, {}),
  ).map(([name, value]) => ({ name, value }))

  const stockBySite = Object.entries(
    stockLevelData.reduce((acc, item) => {
      acc[item.site] = (acc[item.site] || 0) + item.currentStock
      return acc
    }, {}),
  ).map(([name, value]) => ({ name, value }))

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

  const handleExportCSV = () => {
    console.log("Exporting CSV report")
    // In a real app, this would generate a CSV file
  }

  const handleExportPDF = () => {
    console.log("Exporting PDF report")
    // In a real app, this would generate a PDF file
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Inventory Reports</h1>
        <p className="text-muted-foreground">Generate and view reports for spare parts inventory</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Settings</CardTitle>
          <CardDescription>Configure the report parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reportType">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger id="reportType">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stock-level">Current Stock Levels</SelectItem>
                  <SelectItem value="low-stock">Low Stock Items</SelectItem>
                  <SelectItem value="transactions">Transaction History</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteFilter">Site</Label>
              <Select value={siteFilter} onValueChange={setSiteFilter}>
                <SelectTrigger id="siteFilter">
                  <SelectValue placeholder="Select site" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sites</SelectItem>
                  <SelectItem value="Project Alpha">Project Alpha</SelectItem>
                  <SelectItem value="Project Beta">Project Beta</SelectItem>
                  <SelectItem value="Project Gamma">Project Gamma</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryFilter">Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger id="categoryFilter">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Filters">Filters</SelectItem>
                  <SelectItem value="Brakes">Brakes</SelectItem>
                  <SelectItem value="Electrical">Electrical</SelectItem>
                  <SelectItem value="Cooling">Cooling</SelectItem>
                  <SelectItem value="Fuel System">Fuel System</SelectItem>
                  <SelectItem value="Ignition">Ignition</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {reportType === "transactions" && (
              <div className="space-y-2">
                <Label htmlFor="dateRange">Date Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    id="dateFrom"
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                    placeholder="From"
                  />
                  <Input
                    id="dateTo"
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                    placeholder="To"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle>
                {reportType === "stock-level" && "Current Stock Levels"}
                {reportType === "low-stock" && "Low Stock Items"}
                {reportType === "transactions" && "Transaction History"}
              </CardTitle>
              <CardDescription>
                {siteFilter === "all" ? "All sites" : siteFilter} |
                {categoryFilter === "all" ? " All categories" : ` ${categoryFilter}`}
                {reportType === "transactions" &&
                  dateRange.from &&
                  dateRange.to &&
                  ` | ${dateRange.from} to ${dateRange.to}`}
              </CardDescription>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2" onClick={handleExportCSV}>
                <FileDown className="h-4 w-4" />
                CSV
              </Button>
              <Button variant="outline" className="flex items-center gap-2" onClick={handleExportPDF}>
                <FileText className="h-4 w-4" />
                PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="table" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="table" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Table View
              </TabsTrigger>
              <TabsTrigger value="chart" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Chart View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="table" className="pt-4">
              {(reportType === "stock-level" || reportType === "low-stock") && (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Part Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Current Stock</TableHead>
                        <TableHead>Min Stock Level</TableHead>
                        <TableHead>Site</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStockData
                        .filter((item) => reportType !== "low-stock" || item.currentStock < item.minStockLevel)
                        .map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>{item.currentStock}</TableCell>
                            <TableCell>{item.minStockLevel}</TableCell>
                            <TableCell>{item.site}</TableCell>
                            <TableCell>
                              {item.currentStock === 0 ? (
                                <span className="text-red-500">Out of Stock</span>
                              ) : item.currentStock < item.minStockLevel ? (
                                <span className="text-amber-500">Low Stock</span>
                              ) : (
                                <span className="text-green-500">In Stock</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {reportType === "transactions" && (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Part Name</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Site</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactionData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.date}</TableCell>
                          <TableCell className="font-medium">{item.partName}</TableCell>
                          <TableCell>{item.action}</TableCell>
                          <TableCell className={item.action === "Received" ? "text-green-600" : "text-red-600"}>
                            {item.action === "Received" ? "+" : "-"}
                            {item.quantity}
                          </TableCell>
                          <TableCell>{item.user}</TableCell>
                          <TableCell>{item.site}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="chart" className="pt-4">
              {(reportType === "stock-level" || reportType === "low-stock") && (
                <div className="space-y-6">
                  <div className="h-[400px]">
                    <h3 className="text-lg font-medium mb-2">Stock Levels by Part</h3>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={filteredStockData.filter(
                          (item) => reportType !== "low-stock" || item.currentStock < item.minStockLevel,
                        )}
                        margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="currentStock" name="Current Stock" fill="#3b82f6" />
                        <Bar dataKey="minStockLevel" name="Minimum Level" fill="#ef4444" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-[300px]">
                      <h3 className="text-lg font-medium mb-2">Stock by Category</h3>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={stockByCategory}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {stockByCategory.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="h-[300px]">
                      <h3 className="text-lg font-medium mb-2">Stock by Site</h3>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={stockBySite}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {stockBySite.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {reportType === "transactions" && (
                <div className="h-[400px]">
                  <h3 className="text-lg font-medium mb-2">Transaction History</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredTransactionData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" angle={-45} textAnchor="end" height={70} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="quantity" name="Quantity" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

