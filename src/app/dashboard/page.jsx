"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useEffect, useState } from "react";

import api from "@/services/api/api-service";

export function MainDashboard() {
  const [timeframe, setTimeframe] = useState("month");
  const [filters] = useState({
    siteId: 1,
    startDate: "2025-06-01",
    endDate: "2025-07-18",
  });

  const [overview, setOverview] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [machineStatus, setMachineStatus] = useState([]);
  const [sitesSummary, setSitesSummary] = useState([]);
  const [inventoryAlerts, setInventoryAlerts] = useState([]);
  const [maintenanceDue, setMaintenanceDue] = useState([]);
  const [procurementsPending, setProcurementsPending] = useState([]);
  const [paymentsOutstanding, setPaymentsOutstanding] = useState([]);
  const [expensesMonthly, setExpensesMonthly] = useState([]);
  const [recentActivities, setRecentActivities] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("siteId", filters.siteId);
        params.append("dateRange[startDate]", filters.startDate);
        params.append("dateRange[endDate]", filters.endDate);

        const [
          overviewRes,
          alertsRes,
          activitiesRes,
          machineRes,
          sitesRes,
          invAlertsRes,
          maintRes,
          procRes,
          payRes,
          expRes,
        ] = await Promise.all([
          api.get(`/dashboard/overview?${params}`),
          api.get(`/dashboard/alerts?${params}`),
          api.get(`/dashboard/recent-activities?${params}`),
          api.get(`/dashboard/machines/status?${params}`),
          api.get(`/dashboard/sites/summary?${params}`),
          api.get(`/dashboard/inventory/alerts?${params}`),
          api.get(`/dashboard/maintenance/due?${params}`),
          api.get(`/dashboard/procurement/pending?${params}`),
          api.get(`/dashboard/payments/outstanding?${params}`),
          api.get(`/dashboard/expenses/monthly?${params}`),
        ]);

        setOverview(overviewRes.data);
        setAlerts(alertsRes.data.certificateExpiries || []);
        setRecentActivities(activitiesRes.data || {});
        setMachineStatus(machineRes.data || []);
        setSitesSummary(sitesRes.data || []);
        setInventoryAlerts(invAlertsRes.data || []);
        setMaintenanceDue(maintRes.data || []);
        setProcurementsPending(procRes.data || []);
        setPaymentsOutstanding(payRes.data || []);
        setExpensesMonthly(expRes.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data. Try refreshing.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [filters]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
          <span className="text-lg font-medium text-gray-600">
            Loading dashboard...
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-7xl">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
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
                <p className="text-gray-600 mt-1">{error}</p>
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
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
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </Button>
              </div>
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
                {overview.totalMachines || 0}
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
                {overview.totalSites || 0}
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
                {overview.lowStockItems || 0}
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
                {overview.pendingRequisitions || 0}
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

        {/* Critical Alerts */}
        {alerts.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center bg-red-50 dark:bg-red-900/20 px-6 py-4 border-b border-red-100 dark:border-red-800">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Critical Alerts
              </h2>
              <Badge variant="destructive" className="ml-2">
                {alerts.length}
              </Badge>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {alert.documentType} expires in {alert.daysLeft} days
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {alert.machineName} • Expires:{" "}
                          {formatDate(alert.expiryDate)}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
                                (parseInt(status.count) / overview.totalMachines) * 100
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
              <CardHeader className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b">
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
              <CardContent className="p-0">
                <Tabs defaultValue="requisitions">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="requisitions">Requisitions</TabsTrigger>
                    <TabsTrigger value="transfers">Transfers</TabsTrigger>
                    <TabsTrigger value="issues">Issues</TabsTrigger>
                    <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                  </TabsList>

                  {/* Requisitions Tab */}
                  <TabsContent value="requisitions" className="mt-0">
                    {recentActivities.recentRequisitions?.length > 0 ? (
                      <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {recentActivities.recentRequisitions.map((req) => (
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
                    {recentActivities.recentTransfers?.length > 0 ? (
                      <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {recentActivities.recentTransfers.map((transfer) => (
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
                    {recentActivities.recentIssues?.length > 0 ? (
                      <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {recentActivities.recentIssues.map((issue) => (
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
                    {recentActivities.recentMaintenance?.length > 0 ? (
                      <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {recentActivities.recentMaintenance.map((maint) => (
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
              <CardHeader className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-gray-500" />
                    <CardTitle className="text-lg font-semibold">
                      Sites Summary
                    </CardTitle>
                  </div>
                  <Badge variant="outline" className="px-2 py-1 text-xs">
                    {sitesSummary.length} sites
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {sitesSummary.length > 0 ? (
                  <div className="max-h-[400px] overflow-y-auto">
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                      {sitesSummary.map((site) => (
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
              <CardHeader className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-gray-500" />
                    <CardTitle className="text-lg font-semibold">
                      Inventory Alerts
                    </CardTitle>
                  </div>
                  <Badge variant="destructive">{inventoryAlerts.length}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {inventoryAlerts.length > 0 ? (
                  <div className="max-h-[400px] overflow-y-auto">
                    <div className="divide-y divide-orange-100 dark:divide-orange-900/20">
                      {inventoryAlerts.map((item) => (
                        <div
                          key={item.itemId}
                          className="p-4 hover:bg-orange-50/50 dark:hover:bg-orange-900/30 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/50">
                                <Package className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-medium text-gray-900 dark:text-white truncate">
                                  {item.itemName}
                                </h4>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                                  <span className="text-sm text-orange-600 dark:text-orange-400">
                                    Stock: {item.quantity}
                                  </span>
                                  {item.threshold && (
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                      Threshold: {item.threshold}
                                    </span>
                                  )}
                                  {item.category && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                      {item.category}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0" />
                          </div>
                        </div>
                      ))}
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
                  <Badge variant="destructive">{maintenanceDue.length}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {maintenanceDue.length > 0 ? (
                  <div className="space-y-3">
                    {maintenanceDue.map((maint) => (
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
                <Badge variant="secondary">{procurementsPending.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {procurementsPending.length > 0 ? (
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
                  {paymentsOutstanding.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {paymentsOutstanding.length > 0 ? (
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
              {expensesMonthly.length > 0 ? (
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
