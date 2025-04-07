"use client"

import { useState } from "react"
import {Link} from "react-router"
import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Clock,
  Package,
  Truck,
  PenToolIcon as Tool,
  Clipboard,
  BookOpen,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Mock data for the dashboard
const mockStats = {
  totalMachines: 156,
  activeMachines: 132,
  underMaintenance: 18,
  idle: 6,
  sparePartsCount: 1245,
  lowStockItems: 28,
  pendingRequisitions: 12,
  completedRequisitions: 87,
  logbookEntries: 342,
  pendingApprovals: 8,
}

const mockExpiringDocuments = [
  {
    id: "DOC-001",
    machineId: "M001",
    machineName: "Excavator XL2000",
    documentType: "Insurance",
    expiryDate: "2023-11-15",
    daysLeft: 7,
    status: "critical", // critical: < 7 days, warning: < 30 days, normal: > 30 days
  },
  {
    id: "DOC-002",
    machineId: "M003",
    machineName: "Crane CR300",
    documentType: "Pollution Certificate",
    expiryDate: "2023-11-25",
    daysLeft: 17,
    status: "warning",
  },
  {
    id: "DOC-003",
    machineId: "M005",
    machineName: "Excavator XL1000",
    documentType: "Fitness Certificate",
    expiryDate: "2023-12-10",
    daysLeft: 32,
    status: "normal",
  },
  {
    id: "DOC-004",
    machineId: "M008",
    machineName: "Forklift F200",
    documentType: "Road Tax",
    expiryDate: "2023-11-18",
    daysLeft: 10,
    status: "warning",
  },
]

const mockRecentTransfers = [
  {
    id: "TR-001",
    machineName: "Excavator XL2000",
    fromSite: "Site A",
    toSite: "Site B",
    date: "2023-10-28",
    status: "Completed",
  },
  {
    id: "TR-002",
    machineName: "Bulldozer B500",
    fromSite: "Site C",
    toSite: "Site A",
    date: "2023-10-27",
    status: "In Transit",
  },
  {
    id: "TR-003",
    machineName: "Loader L100",
    fromSite: "Site A",
    toSite: "Site C",
    date: "2023-10-25",
    status: "Completed",
  },
]

const mockRecentRequisitions = [
  {
    id: "REQ-001",
    itemName: "Hydraulic Oil",
    quantity: 50,
    requestedBy: "John Doe",
    site: "Site A",
    date: "2023-10-28",
    status: "Pending",
  },
  {
    id: "REQ-002",
    itemName: "Air Filters",
    quantity: 20,
    requestedBy: "Jane Smith",
    site: "Site B",
    date: "2023-10-27",
    status: "Approved",
  },
  {
    id: "REQ-003",
    itemName: "Brake Pads",
    quantity: 12,
    requestedBy: "Mike Johnson",
    site: "Site C",
    date: "2023-10-26",
    status: "Completed",
  },
]

const mockLowStockItems = [
  {
    id: "PART-001",
    name: "Hydraulic Cylinder",
    currentStock: 5,
    minStock: 10,
    category: "Hydraulic Parts",
  },
  {
    id: "PART-002",
    name: "Air Filter Type A",
    currentStock: 8,
    minStock: 15,
    category: "Filters",
  },
  {
    id: "PART-003",
    name: "Engine Oil (5L)",
    currentStock: 12,
    minStock: 20,
    category: "Lubricants",
  },
  {
    id: "PART-004",
    name: "Brake Pads",
    currentStock: 6,
    minStock: 12,
    category: "Brake System",
  },
]

export function MainDashboard() {
  const [timeframe, setTimeframe] = useState("week")
  const [alertsFilter, setAlertsFilter] = useState("all")

  // Filter alerts based on selected filter
  const filteredAlerts =
    alertsFilter === "all"
      ? mockExpiringDocuments
      : mockExpiringDocuments.filter((doc) =>
          alertsFilter === "critical" ? doc.status === "critical" : doc.status === "warning",
        )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your equipment management system.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Machines</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalMachines}</div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500 font-medium">{mockStats.activeMachines} active</span> •{" "}
              {mockStats.underMaintenance} in maintenance • {mockStats.idle} idle
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Spare Parts</CardTitle>
            <Tool className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.sparePartsCount}</div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="text-red-500 font-medium">{mockStats.lowStockItems} items low in stock</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Material Requisitions</CardTitle>
            <Clipboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.pendingRequisitions}</div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="text-yellow-500 font-medium">Pending approval</span> • {mockStats.completedRequisitions}{" "}
              completed
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Logbook Entries</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.logbookEntries}</div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="text-blue-500 font-medium">+24 new entries</span> this {timeframe}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Expiry Alerts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
            Document Expiry Alerts
          </h2>
          <Select value={alertsFilter} onValueChange={setAlertsFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter alerts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Alerts</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((doc) => (
              <Alert
                key={doc.id}
                variant={doc.status === "critical" ? "destructive" : doc.status === "warning" ? "default" : "outline"}
              >
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="flex items-center justify-between">
                  <span>
                    {doc.documentType} Expiring in {doc.daysLeft} days
                  </span>
                  <Badge
                    variant={
                      doc.status === "critical" ? "destructive" : doc.status === "warning" ? "default" : "outline"
                    }
                  >
                    {doc.status === "critical" ? "Critical" : doc.status === "warning" ? "Warning" : "Upcoming"}
                  </Badge>
                </AlertTitle>
                <AlertDescription className="flex justify-between items-center mt-2">
                  <span>
                    {doc.machineName} ({doc.machineId}) • Expires on {doc.expiryDate}
                  </span>
                  <Button variant="outline" size="sm">
                    Renew Now
                  </Button>
                </AlertDescription>
              </Alert>
            ))
          ) : (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>All Clear</AlertTitle>
              <AlertDescription>No document expiry alerts match your current filter.</AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        <Link href="/machine-transfer/new">
          <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <Truck className="h-8 w-8 mb-2 text-blue-500" />
              <p className="text-sm font-medium">New Transfer</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/spare-parts/request">
          <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <Tool className="h-8 w-8 mb-2 text-green-500" />
              <p className="text-sm font-medium">Request Parts</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/material-requisition/new">
          <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <Clipboard className="h-8 w-8 mb-2 text-yellow-500" />
              <p className="text-sm font-medium">New Requisition</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/logbook/add">
          <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <BookOpen className="h-8 w-8 mb-2 text-purple-500" />
              <p className="text-sm font-medium">Add Log Entry</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/machine-transfer/approve">
          <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <CheckCircle className="h-8 w-8 mb-2 text-red-500" />
              <p className="text-sm font-medium">Approvals</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/reports">
          <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <BarChart3 className="h-8 w-8 mb-2 text-orange-500" />
              <p className="text-sm font-medium">Reports</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
          <TabsTrigger value="requisitions">Requisitions</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Machine Status */}
            <Card className="md:col-span-2 lg:col-span-1">
              <CardHeader>
                <CardTitle>Machine Status</CardTitle>
                <CardDescription>Current status of all machines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Active</span>
                      <span className="font-medium">
                        {Math.round((mockStats.activeMachines / mockStats.totalMachines) * 100)}%
                      </span>
                    </div>
                    <Progress
                      value={Math.round((mockStats.activeMachines / mockStats.totalMachines) * 100)}
                      className="h-2 bg-muted"
                      indicatorClassName="bg-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Under Maintenance</span>
                      <span className="font-medium">
                        {Math.round((mockStats.underMaintenance / mockStats.totalMachines) * 100)}%
                      </span>
                    </div>
                    <Progress
                      value={Math.round((mockStats.underMaintenance / mockStats.totalMachines) * 100)}
                      className="h-2 bg-muted"
                      indicatorClassName="bg-yellow-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Idle</span>
                      <span className="font-medium">
                        {Math.round((mockStats.idle / mockStats.totalMachines) * 100)}%
                      </span>
                    </div>
                    <Progress
                      value={Math.round((mockStats.idle / mockStats.totalMachines) * 100)}
                      className="h-2 bg-muted"
                      indicatorClassName="bg-blue-500"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/machinery">
                  <Button variant="ghost" className="w-full" size="sm">
                    View All Machines
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Recent Transfers */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transfers</CardTitle>
                <CardDescription>Latest machine transfers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentTransfers.map((transfer) => (
                    <div key={transfer.id} className="flex items-start space-x-3">
                      <div
                        className={`mt-0.5 h-2 w-2 rounded-full ${
                          transfer.status === "Completed"
                            ? "bg-green-500"
                            : transfer.status === "In Transit"
                              ? "bg-blue-500"
                              : "bg-yellow-500"
                        }`}
                      />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{transfer.machineName}</p>
                        <p className="text-xs text-muted-foreground">
                          {transfer.fromSite} → {transfer.toSite}
                        </p>
                        <div className="flex items-center pt-1">
                          <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{transfer.date}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="ml-auto">
                        {transfer.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/machine-transfer">
                  <Button variant="ghost" className="w-full" size="sm">
                    View All Transfers
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Recent Requisitions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Requisitions</CardTitle>
                <CardDescription>Latest material requisitions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentRequisitions.map((req) => (
                    <div key={req.id} className="flex items-start space-x-3">
                      <div
                        className={`mt-0.5 h-2 w-2 rounded-full ${
                          req.status === "Completed"
                            ? "bg-green-500"
                            : req.status === "Approved"
                              ? "bg-blue-500"
                              : "bg-yellow-500"
                        }`}
                      />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{req.itemName}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {req.quantity} • {req.site}
                        </p>
                        <div className="flex items-center pt-1">
                          <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{req.date}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="ml-auto">
                        {req.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/material-requisition">
                  <Button variant="ghost" className="w-full" size="sm">
                    View All Requisitions
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          {/* Low Stock Items */}
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Items</CardTitle>
              <CardDescription>Spare parts that need to be restocked</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {mockLowStockItems.map((item) => (
                  <Card key={item.id} className="bg-muted/50 border-none">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.name}</span>
                          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
                            Low Stock
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">
                            Current: {item.currentStock} / Min: {item.minStock}
                          </div>
                          <Progress
                            value={Math.round((item.currentStock / item.minStock) * 100)}
                            className="h-2 bg-muted"
                            indicatorClassName={
                              item.currentStock < item.minStock * 0.5 ? "bg-red-500" : "bg-yellow-500"
                            }
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">{item.category}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/spare-parts/inventory">
                <Button variant="ghost" className="w-full" size="sm">
                  View Inventory
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Transfers Tab */}
        <TabsContent value="transfers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Machine Transfers</CardTitle>
              <CardDescription>Overview of all machine transfers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-muted/50 border-none">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <div className="text-3xl font-bold text-yellow-500 mb-1">8</div>
                      <p className="text-sm font-medium">Pending</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50 border-none">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <div className="text-3xl font-bold text-blue-500 mb-1">3</div>
                      <p className="text-sm font-medium">In Transit</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50 border-none">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <div className="text-3xl font-bold text-green-500 mb-1">24</div>
                      <p className="text-sm font-medium">Completed</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Recent Activity</h3>
                  <div className="space-y-2">
                    {mockRecentTransfers.map((transfer, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{transfer.machineName}</p>
                            <p className="text-xs text-muted-foreground">
                              {transfer.fromSite} → {transfer.toSite}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{transfer.status}</Badge>
                          <Button variant="ghost" size="icon">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">View All Transfers</Button>
              <Button>New Transfer</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Requisitions Tab */}
        <TabsContent value="requisitions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Material Requisitions</CardTitle>
              <CardDescription>Overview of all material requisitions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-muted/50 border-none">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <div className="text-3xl font-bold text-yellow-500 mb-1">12</div>
                      <p className="text-sm font-medium">Pending</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50 border-none">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <div className="text-3xl font-bold text-blue-500 mb-1">5</div>
                      <p className="text-sm font-medium">Approved</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50 border-none">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <div className="text-3xl font-bold text-purple-500 mb-1">7</div>
                      <p className="text-sm font-medium">In Process</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50 border-none">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <div className="text-3xl font-bold text-green-500 mb-1">87</div>
                      <p className="text-sm font-medium">Completed</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Recent Requisitions</h3>
                  <div className="space-y-2">
                    {mockRecentRequisitions.map((req, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center gap-2">
                          <Clipboard className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{req.itemName}</p>
                            <p className="text-xs text-muted-foreground">
                              Qty: {req.quantity} • Requested by: {req.requestedBy}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{req.status}</Badge>
                          <Button variant="ghost" size="icon">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">View All Requisitions</Button>
              <Button>New Requisition</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Spare Parts Inventory</CardTitle>
              <CardDescription>Overview of spare parts and inventory status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-muted/50 border-none">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <div className="text-3xl font-bold text-blue-500 mb-1">{mockStats.sparePartsCount}</div>
                      <p className="text-sm font-medium">Total Items</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50 border-none">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <div className="text-3xl font-bold text-red-500 mb-1">{mockStats.lowStockItems}</div>
                      <p className="text-sm font-medium">Low Stock</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50 border-none">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <div className="text-3xl font-bold text-green-500 mb-1">42</div>
                      <p className="text-sm font-medium">Items Received This Month</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Low Stock Items</h3>
                  <div className="space-y-2">
                    {mockLowStockItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.category} • Stock: {item.currentStock}/{item.minStock}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="destructive">Low Stock</Badge>
                          <Button variant="outline" size="sm">
                            Restock
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">View Inventory</Button>
              <Button>Order Parts</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

