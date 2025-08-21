"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  TrendingUp,
  TrendingDown,
  History,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/services/api/api-service";
import { Spinner } from "@/components/ui/loader";

const MaterialDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [item, setItem] = useState(null);
  const [itemGroup, setItemGroup] = useState(null);
  const [unit, setUnit] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [stockLogs, setStockLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [filterSite, setFilterSite] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [sites, setSites] = useState([]);

  useEffect(() => {
    const fetchInventoryByItemId = async () => {
      try {
        const response = await api.get(`/inventory/item/${id}`);
        if (!response.status || !response.data || response.data.length === 0) {
          toast({
            title: "No Inventory Found",
            description: "No inventory data available for this item.",
            variant: "destructive",
          });
          navigate("/inventory");
          return;
        }

        const firstRecord = response.data[0];
        const itemData = firstRecord.Item;
        const inventoryList = response.data.map((inv) => ({
          id: inv.id,
          itemId: inv.itemId,
          name: inv.Item?.name || "-",
          partNo: inv.Item?.partNumber || "-",
          hsnCode: inv.Item?.hsnCode || "-",
          category: inv.Item?.ItemGroup?.name || "Unknown",
          quantity: inv.quantity,
          minLevel: inv.minimumLevel,
          site: inv.Site?.name || "Unknown Site",
          lastUpdated: inv.updatedAt,
        }));
        const uniqueSites = [
          ...new Set(
            response.data.map((inv) => inv.Site?.name || "Unknown Site")
          ),
        ];

        setItem({
          id: itemData.id,
          name: itemData.name,
          partNo: itemData.partNumber,
        });

        setItemGroup(itemData.ItemGroup);
        setUnit(itemData.Unit);
        setInventory(inventoryList);
        setSites(uniqueSites);
      } catch (error) {
        console.log(error);
        toast({
          title: "Error fetching data",
          description: "Something went wrong while fetching inventory.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    const fetchStockLogs = async (itemId) => {
      try {
        const result = await api.get(`/inventory/stock-log/${itemId}`);
        const transformedLogs = result.data.map((log, index) => ({
          id: index, // Generate id if not provided by API
          date: new Date(log.dateTime),
          type: log.type,
          quantity: log.quantity,
          site: log.site,
          reference: log.reference,
          user: log.user,
        }));
        setStockLogs(transformedLogs);
      } catch (error) {
        console.log(error);
      }
    };
    fetchStockLogs(id);

    fetchInventoryByItemId();
  }, [id, navigate, toast]);

  const getStockStatus = (quantity, minLevel) => {
    if (quantity <= 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (quantity <= minLevel) {
      return <Badge variant="warning">Low Stock</Badge>;
    } else {
      return <Badge variant="success">In Stock</Badge>;
    }
  };

  const getTransactionBadge = (type, quantity) => {
    switch (type) {
      case "receipt":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
          >
            <TrendingUp className="h-3 w-3" /> Receipt
          </Badge>
        );
      case "issue":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1"
          >
            <TrendingDown className="h-3 w-3" /> Issue
          </Badge>
        );
      case "adjustment":
        return (
          <Badge
            variant="outline"
            className="bg-orange-50 text-orange-700 border-orange-200 flex items-center gap-1"
          >
            <AlertTriangle className="h-3 w-3" /> Adjustment
          </Badge>
        );
      case "transfer":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1"
          >
            <History className="h-3 w-3" /> Transfer
          </Badge>
        );
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "PPP p");
    } catch (error) {
      return dateString;
    }
  };

  // Calculate total stock across all sites
  const totalStock = inventory.reduce((sum, inv) => sum + inv.quantity, 0);

  // Filter stock logs
  const filteredStockLogs = stockLogs.filter((log) => {
    const matchesSite = filterSite === "all" || log.site === filterSite;
    const matchesType = filterType === "all" || log.type === filterType;
    return matchesSite && matchesType;
  });

  // Sort logs by date (newest first)
  const sortedStockLogs = [...filteredStockLogs].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  if (loading) {
    return <Spinner />;
  }

  if (!item) {
    return (
      <div className="flex justify-center items-center h-64">
        Item not found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/inventory")}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Material Details</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{item.name}</CardTitle>
              <CardDescription>
                {itemGroup?.name} • Part No: {item.partNo || "N/A"}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-muted-foreground" />
              <span className="text-xl font-semibold">
                {totalStock} {unit?.shortName || unit?.name}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Item Name</p>
              <p className="font-medium">{item.name}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Short Name</p>
              <p className="font-medium">{item.shortName || "N/A"}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Part Number</p>
              <p className="font-medium">{item.partNo || "N/A"}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="font-medium">{itemGroup?.name || "Unknown"}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Unit of Measurement
              </p>
              <p className="font-medium">{unit?.name || "Unknown"}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">HSN Code</p>
              <p className="font-medium">{item.hsnCode || "N/A"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Inventory Overview</TabsTrigger>
          <TabsTrigger value="history">Stock History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Inventory</CardTitle>
              <CardDescription>
                Current stock levels across all sites
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Site</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Minimum Level</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventory.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-6 text-muted-foreground"
                        >
                          No inventory data available.
                        </TableCell>
                      </TableRow>
                    ) : (
                      inventory.map((inv) => (
                        <TableRow key={inv.id}>
                          <TableCell className="font-medium">
                            {inv.site}
                          </TableCell>
                          <TableCell>
                            {inv.quantity} {unit?.shortName || unit?.name}
                          </TableCell>
                          <TableCell>
                            {inv.minLevel} {unit?.shortName || unit?.name}
                          </TableCell>
                          <TableCell>
                            {getStockStatus(inv.quantity, inv.minLevel)}
                          </TableCell>
                          <TableCell>{formatDate(inv.lastUpdated)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock Movement History</CardTitle>
              <CardDescription>
                Log of all stock movements for this item
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4 md:flex-row">
                {/* <div className="flex-1">
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
                </div> */}
                {/* <div className="flex-1">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by transaction type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="receipt">Receipt</SelectItem>
                      <SelectItem value="issue">Issue</SelectItem>
                      <SelectItem value="adjustment">Adjustment</SelectItem>
                      <SelectItem value="transfer">Transfer</SelectItem>
                      <SelectItem value="Requisition">Requisition</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Site</TableHead>
                      <TableHead>Reference</TableHead>
                      {/* <TableHead>User</TableHead> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedStockLogs.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-6 text-muted-foreground"
                        >
                          No stock movement history available.
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedStockLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>{formatDate(log.date)}</TableCell>
                          <TableCell>
                            {getTransactionBadge(log.type, log.quantity)}
                          </TableCell>
                          <TableCell
                            className={
                              log.type == "IN"
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {log.type == "IN" ? "+" : "-"}
                            {log.quantity} {unit?.shortName || unit?.name}
                          </TableCell>
                          <TableCell>{log.site}</TableCell>
                          <TableCell>{log.reference}</TableCell>
                          {/* <TableCell>{log.user}</TableCell> */}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MaterialDetails;
