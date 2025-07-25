"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/loader";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboardData } from "@/hooks/useDashboardData";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Building,
  Calendar,
  CheckCircle,
  Clipboard,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  Filter,
  Package,
  RefreshCw,
  TrendingUp,
  Truck,
  Users,
  Wrench,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

export function MainDashboard() {
  const [timeframe, setTimeframe] = useState("month");
  const [filters] = useState({
    siteId: 1,
    startDate: "2025-06-01",
    endDate: "2025-07-18",
  });

  const navigate = useNavigate();

  const { data, isLoading, isError, errors, refetchAll } =
    useDashboardData(filters);
  const {
    overview,
    alerts,
    recentActivities,
    machineStatus,
    sitesSummary,
    inventoryAlerts,
    maintenanceDue,
    procurementsPending,
    paymentsOutstanding,
    expensesMonthly,
  } = data;

  if (isLoading) {
    return (
      <Spinner />
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md border border-red-200">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <XCircle className="w-12 h-12 text-red-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Error Loading Dashboard
                </h3>
                <p className="text-gray-600 mt-1">{errors}</p>
              </div>
              <Button
                onClick={() => window.location.reload()}
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "operational":
      case "completed":
      case "approved":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100";
      case "maintenance":
      case "pending":
      case "in transit":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100";
      case "inactive":
      case "overdue":
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "operational":
      case "completed":
      case "approved":
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "maintenance":
      case "pending":
      case "in transit":
        return <Clock className="w-4 h-4 text-amber-500" />;
      case "inactive":
      case "overdue":
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Dashboard Overview
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Welcome back! Here's what's happening with your operations.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        {/* Overview Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Machines
                </CardTitle>
                <Truck className="w-5 h-5 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {overview?.totalMachines || 0}
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                <span className="text-sm text-blue-500">
                  +2.1% from last month
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 dark:border-green-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Active Sites
                </CardTitle>
                <Building className="w-5 h-5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {overview?.totalSites || 0}
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-500">
                  +1 new site this month
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 dark:border-orange-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Low Stock Items
                </CardTitle>
                <Package className="w-5 h-5 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {overview?.lowStockItems || 0}
              </div>
              <div className="flex items-center mt-2">
                <AlertTriangle className="w-4 h-4 text-orange-500 mr-1" />
                <span className="text-sm text-orange-500">
                  Requires attention
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Pending Requisitions
                </CardTitle>
                <Clipboard className="w-5 h-5 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {overview?.pendingRequisitions || 0}
              </div>
              <div className="flex items-center mt-2">
                <Clock className="w-4 h-4 text-purple-500 mr-1" />
                <span className="text-sm text-purple-500">
                  Awaiting approval
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="sticky top-0 z-10 bg-white dark:bg-gray-800 rounded-t-lg border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <CardTitle className="text-lg font-semibold">
                  Critical Alerts
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="destructive">
                  {alerts?.certificateExpiries?.length || 0}
                </Badge>
                <Button variant="ghost" size="sm" className="text-primary">
                  View All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {alerts?.certificateExpiries?.length > 0 ? (
              <div className="divide-y divide-red-100 dark:divide-red-900/20">
                {alerts.certificateExpiries.map((machine) => {
                  // Calculate days until expiry for each certificate
                  const now = new Date();
                  const expiries = [
                    {
                      type: "Pollution Cert.",
                      date: machine.pollutionCertificateExpiry,
                      daysLeft: Math.floor(
                        (new Date(machine.pollutionCertificateExpiry) - now) /
                          (1000 * 60 * 60 * 24)
                      ),
                    },
                    {
                      type: "Fitness Cert.",
                      date: machine.fitnessCertificateExpiry,
                      daysLeft: Math.floor(
                        (new Date(machine.fitnessCertificateExpiry) - now) /
                          (1000 * 60 * 60 * 24)
                      ),
                    },
                    {
                      type: "Insurance",
                      date: machine.insuranceExpiry,
                      daysLeft: Math.floor(
                        (new Date(machine.insuranceExpiry) - now) /
                          (1000 * 60 * 60 * 24)
                      ),
                    },
                    {
                      type: "Permit",
                      date: machine.permitExpiryDate,
                      daysLeft: Math.floor(
                        (new Date(machine.permitExpiryDate) - now) /
                          (1000 * 60 * 60 * 24)
                      ),
                    },
                    {
                      type: "Vehicle Tax",
                      date: machine.motorVehicleTaxDue,
                      daysLeft: Math.floor(
                        (new Date(machine.motorVehicleTaxDue) - now) /
                          (1000 * 60 * 60 * 24)
                      ),
                    },
                  ]
                    .filter((e) => e.date)
                    .sort((a, b) => a.daysLeft - b.daysLeft);

                  const nearestExpiry = expiries[0];

                  return (
                    <div
                      key={machine.id}
                      className="p-4 hover:bg-red-50/50 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/50 mt-0.5">
                            <AlertTriangle className="w-4 h-4 text-red-500 dark:text-red-400" />
                          </div>
                          <div className="min-w-0 space-y-1">
                            <div className="flex items-baseline gap-2">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {machine.machineName}
                              </h4>
                              <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                                {machine.registrationNumber || machine.erpCode}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                              <div className="flex items-center gap-1">
                                <Building className="w-3 h-3 text-gray-400" />
                                <span className="text-gray-500 dark:text-gray-400">
                                  {machine.site?.name ||
                                    `Site ${machine.siteId}`}
                                </span>
                              </div>

                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-gray-400" />
                                <span
                                  className={
                                    nearestExpiry.daysLeft <= 7
                                      ? "text-red-500 font-medium"
                                      : "text-gray-500 dark:text-gray-400"
                                  }
                                >
                                  {nearestExpiry.type} expires in{" "}
                                  {nearestExpiry.daysLeft} days
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <Badge
                                variant="outline"
                                className="text-xs capitalize"
                              >
                                {machine.status}
                              </Badge>
                              {machine.model && (
                                <Badge variant="outline" className="text-xs">
                                  {machine.make} {machine.model}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="shrink-0 text-gray-500 hover:text-primary"
                          onClick={() => {navigate(`/machine/${machine.id}`)}}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Additional expiry details */}
                      <div className="mt-3 pl-11">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                          {expiries.map((cert) => (
                            <div
                              key={`${machine.id}-${cert.type}`}
                              className="text-xs p-2 rounded border border-gray-200 dark:border-gray-700"
                            >
                              <div className="font-medium">{cert.type}</div>
                              <div
                                className={
                                  cert.daysLeft <= 30
                                    ? "text-red-500"
                                    : "text-gray-500 dark:text-gray-400"
                                }
                              >
                                {formatDate(cert.date)}
                              </div>
                              <div
                                className={
                                  cert.daysLeft <= 30
                                    ? "text-red-500 font-medium"
                                    : "text-gray-500 dark:text-gray-400"
                                }
                              >
                                {cert.daysLeft > 0
                                  ? `${cert.daysLeft}d left`
                                  : "Expired"}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 text-green-500 opacity-50" />
                <p className="mt-2">No critical alerts</p>
              </div>
            )}
          </CardContent>

          {/* Additional alert summaries */}
          {(alerts?.pendingApprovals > 0 || alerts?.maintenanceOverdue > 0) && (
            <CardFooter className="bg-gray-50 dark:bg-gray-800 border-t rounded-b-lg">
              <div className="flex flex-wrap items-center mt-4 gap-4">
                {alerts.pendingApprovals > 0 && (
                  <div className="flex items-center gap-2">
                    <Clipboard className="w-4 h-4 text-amber-500" />
                    <span className="text-sm">
                      <span className="font-medium">
                        {alerts.pendingApprovals}
                      </span>{" "}
                      pending approvals
                    </span>
                  </div>
                )}
                {alerts.maintenanceOverdue > 0 && (
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-red-500" />
                    <span className="text-sm">
                      <span className="font-medium">
                        {alerts.maintenanceOverdue}
                      </span>{" "}
                      overdue maintenance
                    </span>
                  </div>
                )}
              </div>
            </CardFooter>
          )}
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-4">
            {/* Machine Status */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-gray-500" />
                    <CardTitle className="text-lg font-semibold">
                      Machine Status Overview
                    </CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary">
                    View All
                  </Button>
                </div>
                <CardDescription>
                  Current operational status of all machines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="status">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="status">By Status</TabsTrigger>
                    <TabsTrigger value="site">By Site</TabsTrigger>
                    <TabsTrigger value="category">By Category</TabsTrigger>
                  </TabsList>

                  {/* Status Breakdown Tab */}
                  <TabsContent value="status" className="mt-4">
                    <div className="space-y-4">
                      {machineStatus?.statusBreakdown?.map((status) => (
                        <div
                          key={status.status}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                        >
                          <div className="flex items-center gap-3">
                            {getStatusIcon(status.status)}
                            <span className="font-medium">{status.status}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge className={getStatusColor(status.status)}>
                              {status.count}
                            </Badge>
                            <Progress
                              value={
                                (parseInt(status.count) /
                                  overview.totalMachines) *
                                100
                              }
                              className="w-32 h-2"
                              indicatorColor={
                                status.status === "In Use"
                                  ? "bg-blue-500"
                                  : status.status === "Idle"
                                  ? "bg-green-500"
                                  : "bg-yellow-500"
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Site Breakdown Tab */}
                  <TabsContent value="site" className="mt-4">
                    <div className="space-y-3">
                      {machineStatus?.siteWiseBreakdown?.map((site) => (
                        <div
                          key={`${site.siteId}-${site.count}`}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Building className="w-4 h-4 text-gray-500" />
                            <div className="min-w-0">
                              <p className="font-medium truncate">
                                {site.site?.name || `Site ${site.siteId}`}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Site ID: {site.siteId}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline">{site.count} machines</Badge>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Category Breakdown Tab */}
                  <TabsContent value="category" className="mt-4">
                    <div className="space-y-3">
                      {machineStatus?.categoryWiseBreakdown?.map((category) => (
                        <div
                          key={`${category.machineCategoryId}-${category.count}`}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Truck className="w-4 h-4 text-gray-500" />
                            <p className="font-medium truncate">
                              {category.machineCategory?.name ||
                                `Category ${category.machineCategoryId}`}
                            </p>
                          </div>
                          <Badge variant="outline">
                            {category.count} machines
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader className="sticky top-0 z-10 bg-white dark:bg-gray-800 rounded-t-lg border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-gray-500" />
                    <CardTitle className="text-lg font-semibold">
                      Recent Activities
                    </CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-2">
                <Tabs defaultValue="requisitions">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="requisitions">Requisitions</TabsTrigger>
                    <TabsTrigger value="transfers">Transfers</TabsTrigger>
                    <TabsTrigger value="issues">Issues</TabsTrigger>
                    <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                  </TabsList>

                  {/* Requisitions Tab */}
                  <TabsContent value="requisitions" className="mt-0">
                    {recentActivities?.recentRequisitions?.length > 0 ? (
                      <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {recentActivities?.recentRequisitions.map((req) => (
                          <div
                            key={req.id}
                            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3 min-w-0">
                                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/50 mt-0.5">
                                  <Clipboard className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                                </div>
                                <div className="min-w-0 space-y-1">
                                  <div className="flex items-baseline gap-2">
                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                      {req.requisitionNo}
                                    </h4>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                                      {req.requestedFor}
                                    </span>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                                    <div className="flex items-center gap-1">
                                      <Building className="w-3 h-3 text-gray-400" />
                                      <span className="text-gray-500 dark:text-gray-400 truncate">
                                        {req.requestingSite?.name ||
                                          "Unknown site"}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                      <Users className="w-3 h-3 text-gray-400" />
                                      <span className="text-gray-500 dark:text-gray-400">
                                        {req.preparedBy?.name || "Unknown user"}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3 text-gray-400" />
                                      <span className="text-gray-500 dark:text-gray-400">
                                        Due: {formatDate(req.dueDate)}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <Badge
                                      variant="outline"
                                      className="text-xs capitalize"
                                    >
                                      {req.chargeType}
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="text-xs capitalize"
                                    >
                                      {req.requestPriority}
                                    </Badge>
                                    <Badge
                                      className={getStatusColor(req.status)}
                                    >
                                      {req.status
                                        .replace(/([A-Z])/g, " $1")
                                        .trim()}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="shrink-0 text-gray-500 hover:text-primary"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                        <Clipboard className="w-12 h-12 opacity-50" />
                        <p className="mt-2">No recent requisitions</p>
                      </div>
                    )}
                  </TabsContent>

                  {/* Transfers Tab */}
                  <TabsContent value="transfers" className="mt-0">
                    {recentActivities?.recentTransfers?.length > 0 ? (
                      <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {recentActivities?.recentTransfers.map((transfer) => (
                          <div
                            key={transfer.id}
                            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3 min-w-0">
                                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50 mt-0.5">
                                  <Truck className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                                </div>
                                <div className="min-w-0 space-y-1">
                                  <div className="flex items-baseline gap-2">
                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                      {transfer.name}
                                    </h4>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                                      {transfer.machine?.machineName ||
                                        "Unknown machine"}
                                    </span>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                                    <div className="flex items-center gap-1">
                                      <ArrowUpRight className="w-3 h-3 text-gray-400" />
                                      <span className="text-gray-500 dark:text-gray-400">
                                        {transfer.currentSite?.name ||
                                          "Unknown site"}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                      <ArrowDownRight className="w-3 h-3 text-gray-400" />
                                      <span className="text-gray-500 dark:text-gray-400">
                                        {transfer.destinationSiteId
                                          ? `Site ${transfer.destinationSiteId}`
                                          : "Unknown destination"}
                                      </span>
                                    </div>

                                    {transfer.transportDetails
                                      ?.vehicleNumber && (
                                      <div className="flex items-center gap-1">
                                        <Truck className="w-3 h-3 text-gray-400" />
                                        <span className="text-gray-500 dark:text-gray-400">
                                          {
                                            transfer.transportDetails
                                              .vehicleNumber
                                          }
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <Badge
                                      variant="outline"
                                      className="text-xs capitalize"
                                    >
                                      {transfer.requestType}
                                    </Badge>
                                    <Badge
                                      className={getStatusColor(
                                        transfer.status
                                      )}
                                    >
                                      {transfer.status}
                                    </Badge>
                                    {transfer.dispatchedAt && (
                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatDate(transfer.dispatchedAt)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="shrink-0 text-gray-500 hover:text-primary"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                        <Truck className="w-12 h-12 opacity-50" />
                        <p className="mt-2">No recent transfers</p>
                      </div>
                    )}
                  </TabsContent>

                  {/* Issues Tab */}
                  <TabsContent value="issues" className="mt-0">
                    {recentActivities?.recentIssues?.length > 0 ? (
                      <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {recentActivities?.recentIssues.map((issue) => (
                          <div
                            key={issue.id}
                            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3 min-w-0">
                                <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/50 mt-0.5">
                                  <AlertCircle className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                                </div>
                                <div className="min-w-0 space-y-1">
                                  <div className="flex items-baseline gap-2">
                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                      {issue.issueNumber}
                                    </h4>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                                      {issue.issueType}
                                    </span>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                                    <div className="flex items-center gap-1">
                                      <Building className="w-3 h-3 text-gray-400" />
                                      <span className="text-gray-500 dark:text-gray-400">
                                        {issue.fromSite?.name || "Unknown site"}
                                      </span>
                                    </div>

                                    {issue.otherSiteId && (
                                      <div className="flex items-center gap-1">
                                        <Building className="w-3 h-3 text-gray-400" />
                                        <span className="text-gray-500 dark:text-gray-400">
                                          To Site {issue.otherSiteId}
                                        </span>
                                      </div>
                                    )}

                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3 text-gray-400" />
                                      <span className="text-gray-500 dark:text-gray-400">
                                        {formatDate(issue.issueDate)}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <Badge
                                      className={getStatusColor(issue.status)}
                                    >
                                      {issue.status}
                                    </Badge>
                                    {issue.approvedAt && (
                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                        Approved: {formatDate(issue.approvedAt)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="shrink-0 text-gray-500 hover:text-primary"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                        <AlertCircle className="w-12 h-12 opacity-50" />
                        <p className="mt-2">No recent issues</p>
                      </div>
                    )}
                  </TabsContent>

                  {/* Maintenance Tab */}
                  <TabsContent value="maintenance" className="mt-0">
                    {recentActivities?.recentMaintenance?.length > 0 ? (
                      <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {recentActivities?.recentMaintenance.map((maint) => (
                          <div
                            key={maint.id}
                            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3 min-w-0">
                                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/50 mt-0.5">
                                  <Wrench className="w-4 h-4 text-green-500 dark:text-green-400" />
                                </div>
                                <div className="min-w-0 space-y-1">
                                  <div className="flex items-baseline gap-2">
                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                      {maint.machine?.machineName ||
                                        "Unknown machine"}
                                    </h4>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                                      {maint.type.replace(/_/g, " ")}
                                    </span>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                                    <div className="flex items-center gap-1">
                                      <Building className="w-3 h-3 text-gray-400" />
                                      <span className="text-gray-500 dark:text-gray-400">
                                        {maint.machine?.siteId
                                          ? `Site ${maint.machine.siteId}`
                                          : "Unknown site"}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                      <DollarSign className="w-3 h-3 text-gray-400" />
                                      <span className="text-gray-500 dark:text-gray-400">
                                        {formatCurrency(maint.cost)}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3 text-gray-400" />
                                      <span className="text-gray-500 dark:text-gray-400">
                                        {formatDate(maint.date)}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <Badge
                                      className={getStatusColor(maint.status)}
                                    >
                                      {maint.status}
                                    </Badge>
                                    {maint.title && (
                                      <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {maint.title}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="shrink-0 text-gray-500 hover:text-primary"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                        <Wrench className="w-12 h-12 opacity-50" />
                        <p className="mt-2">No recent maintenance</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-4">
            {/* Sites Summary Card with Proper Data Mapping */}
            <Card>
              <CardHeader className="sticky top-0 z-10 bg-white dark:bg-gray-800 rounded-t-lg border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-gray-500" />
                    <CardTitle className="text-lg font-semibold">
                      Sites Summary
                    </CardTitle>
                  </div>
                  <Badge variant="outline" className="px-2 py-1 text-xs">
                    {sitesSummary?.length} sites
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {sitesSummary?.length > 0 ? (
                  <div className="max-h-[400px] overflow-y-auto">
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                      {sitesSummary?.map((site) => (
                        <div
                          key={site.id}
                          className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 min-w-0">
                              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50 mt-0.5">
                                <Building className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                              </div>
                              <div className="min-w-0 space-y-1">
                                <div className="flex items-baseline gap-2">
                                  <h4 className="font-medium text-gray-900 dark:text-white truncate">
                                    {site.name}
                                  </h4>
                                  <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                                    {site.code}
                                  </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                                  <div className="flex items-center gap-1">
                                    <Truck className="w-3 h-3 text-gray-400" />
                                    <span
                                      className={
                                        site.activeMachines === 0
                                          ? "text-red-500"
                                          : "text-gray-500 dark:text-gray-400"
                                      }
                                    >
                                      {site.activeMachines}/{site.totalMachines}{" "}
                                      machines active
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1">
                                    <Users className="w-3 h-3 text-gray-400" />
                                    <span className="text-gray-500 dark:text-gray-400">
                                      {site.totalUsers} user
                                      {site.totalUsers !== 1 ? "s" : ""}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  <Badge
                                    variant="outline"
                                    className="text-xs capitalize"
                                  >
                                    {site.department}
                                  </Badge>
                                  <Badge
                                    className={
                                      site.status === "active"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                                    }
                                  >
                                    {site.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="shrink-0 text-gray-500 hover:text-primary"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                    <Building className="w-12 h-12 opacity-50" />
                    <p className="mt-2">No sites data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Inventory Alerts - Scrollable Version */}
            <Card>
              <CardHeader className="sticky top-0 z-10 bg-white dark:bg-gray-800 rounded-t-lg border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-gray-500" />
                    <CardTitle className="text-lg font-semibold">
                      Inventory Alerts
                    </CardTitle>
                  </div>
                  <Badge variant="destructive">{inventoryAlerts?.length}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {inventoryAlerts.length > 0 ? (
                  <div className="relative">
                    {/* Scroll container with enhanced styling */}
                    <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                      <div className="divide-y divide-orange-100 dark:divide-orange-900/20">
                        {inventoryAlerts.map((item, index) => (
                          <div
                            key={item.id}
                            className="p-4 hover:bg-orange-50/50 dark:hover:bg-orange-900/30 transition-colors"
                          >
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3 min-w-0">
                                <div
                                  className={`p-2 rounded-full ${
                                    item.status === "Out of Stock"
                                      ? "bg-red-100 dark:bg-red-900/50"
                                      : "bg-orange-100 dark:bg-orange-900/50"
                                  }`}
                                >
                                  <Package
                                    className={`w-4 h-4 ${
                                      item.status === "Out of Stock"
                                        ? "text-red-500 dark:text-red-400"
                                        : "text-orange-500 dark:text-orange-400"
                                    }`}
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h4 className="font-medium text-gray-900 dark:text-white truncate">
                                    {item.Item.name}
                                  </h4>
                                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                                    <span
                                      className={`text-sm ${
                                        item.status === "Out of Stock"
                                          ? "text-red-600 dark:text-red-400"
                                          : "text-orange-600 dark:text-orange-400"
                                      }`}
                                    >
                                      Stock: {item.quantity}{" "}
                                      {item.Item.Unit.shortName}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                      Min Level: {item.minimumLevel}{" "}
                                      {item.Item.Unit.shortName}
                                    </span>
                                    <span
                                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                        item.status === "Out of Stock"
                                          ? "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"
                                          : "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300"
                                      }`}
                                    >
                                      {item.status}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      Site: {item.Site.code}
                                    </span>
                                    {item.Item.partNumber && (
                                      <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                        Part: {item.Item.partNumber}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                <AlertTriangle
                                  className={`w-5 h-5 shrink-0 ${
                                    item.status === "Out of Stock"
                                      ? "text-red-500"
                                      : "text-orange-500"
                                  }`}
                                />
                                <span className="text-xs text-gray-500 dark:text-gray-400 text-right max-w-[120px] truncate">
                                  {item.Site.name}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Scroll indicators */}
                    {inventoryAlerts.length > 5 && (
                      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white dark:from-gray-900 to-transparent pointer-events-none" />
                    )}

                    {/* Item counter */}
                    <div className="absolute top-2 right-2 bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 text-xs px-2 py-1 rounded-full">
                      {inventoryAlerts.length} alert
                      {inventoryAlerts.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                    <Package className="w-12 h-12 opacity-50" />
                    <p className="mt-2">No inventory alerts</p>
                  </div>
                )}
              </CardContent>
            </Card>
            {/* Maintenance Due */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-gray-500" />
                    <CardTitle className="text-lg font-semibold">
                      Maintenance Due
                    </CardTitle>
                  </div>
                  <Badge variant="destructive">{maintenanceDue?.length}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {maintenanceDue?.length > 0 ? (
                  <div className="space-y-3">
                    {maintenanceDue?.map((maint) => (
                      <div
                        key={maint.machineId}
                        className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                      >
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {maint.machineName}
                          </h4>
                          <p className="text-sm text-red-600 dark:text-red-400">
                            Due: {formatDate(maint.nextDueDate)}
                          </p>
                        </div>
                        <Clock className="w-5 h-5 text-red-500" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                    <Wrench className="w-12 h-12 opacity-50" />
                    <p className="mt-2">No maintenance due</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Pending Procurements */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-gray-500" />
                  <CardTitle className="text-lg font-semibold">
                    Pending Procurements
                  </CardTitle>
                </div>
                <Badge variant="secondary">{procurementsPending?.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {procurementsPending?.length > 0 ? (
                <div className="space-y-3">
                  {procurementsPending.map((proc) => (
                    <div
                      key={proc.procurementId}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          ID: {proc.procurementId}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatCurrency(proc.amount)}
                        </p>
                      </div>
                      <Badge className={getStatusColor(proc.status)}>
                        {proc.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <DollarSign className="w-12 h-12 opacity-50" />
                  <p className="mt-2">No pending procurements</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Outstanding Payments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-gray-500" />
                  <CardTitle className="text-lg font-semibold">
                    Outstanding Payments
                  </CardTitle>
                </div>
                <Badge variant="destructive">
                  {paymentsOutstanding?.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {paymentsOutstanding?.length > 0 ? (
                <div className="space-y-3">
                  {paymentsOutstanding.map((payment) => (
                    <div
                      key={payment.paymentId}
                      className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          ID: {payment.paymentId}
                        </h4>
                        <p className="text-sm text-amber-600 dark:text-amber-400">
                          {formatCurrency(payment.amount)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-amber-600 dark:text-amber-400">
                          Due: {formatDate(payment.dueDate)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <CreditCard className="w-12 h-12 opacity-50" />
                  <p className="mt-2">No outstanding payments</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Monthly Expenses */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-gray-500" />
                  <CardTitle className="text-lg font-semibold">
                    Monthly Expenses
                  </CardTitle>
                </div>
                <Button variant="ghost" size="sm" className="text-primary">
                  View Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {expensesMonthly?.length > 0 ? (
                <div className="space-y-3">
                  {JSON.stringify(expensesMonthly)}
                  {expensesMonthly.map((expense) => (
                    <div
                      key={expense.month}
                      className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {expense.month}
                        </h4>
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          {formatCurrency(expense.totalExpense)}
                        </p>
                      </div>
                      <TrendingUp className="w-5 h-5 text-blue-500" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <BarChart3 className="w-12 h-12 opacity-50" />
                  <p className="mt-2">No expense data</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
