"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, Clock, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

const MaterialReceive = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [requisition, setRequisition] = useState(null);
  const [itemGroups, setItemGroups] = useState([]);
  const [items, setItems] = useState([]);
  const [units, setUnits] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [receivedItems, setReceivedItems] = useState({});
  const [allReceived, setAllReceived] = useState(false);

  useEffect(() => {
    // Load data from localStorage
    const requisitions = [
      {
        id: "1",
        requisitionNo: "REQ-1001",
        date: "2025-04-20",
        location: "Site A",
        requestedFor: {
          type: "machine",
          value: "Excavator #3",
        },
        priority: "high",
        preparedBy: "John Doe",
        status: "approved",
        items: [
          {
            itemId: "item-001",
            unitId: "unit-001",
            quantity: 5,
          },
          {
            itemId: "item-002",
            unitId: "unit-002",
            quantity: 12,
          },
        ],
      },
    ];

    const storedItemGroups = [
      {
        id: "item-001",
        name: "Hydraulic Hose",
        partNo: "HH-4567",
        groupId: "group-001",
      },
      {
        id: "item-002",
        name: "Oil Filter",
        partNo: "OF-8821",
        groupId: "group-002",
      },
    ];

    const storedItems = [
      {
        id: "group-001",
        name: "Hydraulics",
      },
      {
        id: "group-002",
        name: "Engine Parts",
      },
    ];

    const storedUnits = [
      {
        id: "unit-001",
        name: "Piece",
        shortName: "pc",
      },
      {
        id: "unit-002",
        name: "Box",
        shortName: "box",
      },
    ];
    const storedInventory =
      JSON.parse(localStorage.getItem("inventory")) || mockInventoryData;

    const foundRequisition = requisitions.find((req) => req.id === id);

    if (foundRequisition) {
      setRequisition(foundRequisition);

      // Initialize received items state
      const initialReceivedState = {};
      foundRequisition.items.forEach((item) => {
        initialReceivedState[item.itemId] = item.received || false;
      });
      setReceivedItems(initialReceivedState);

      // Check if all items are already received
      const allItemsReceived = foundRequisition.items.every(
        (item) => item.received
      );
      setAllReceived(allItemsReceived);

      setItemGroups(storedItemGroups);
      setItems(storedItems);
      setUnits(storedUnits);
      setInventory(storedInventory);
    } else {
      toast({
        title: "Requisition Not Found",
        description: "The requisition you're looking for doesn't exist.",
        variant: "destructive",
      });
      navigate("/requisitions");
    }

    setLoading(false);
  }, [id, navigate, toast]);

  const getItemGroupName = (id) => {
    const group = itemGroups.find((g) => g.id === id);
    return group ? group.name : "Unknown Group";
  };

  const getItemName = (id) => {
    const item = items.find((i) => i.id === id);
    return item ? item.name : "Unknown Item";
  };

  const getUnitName = (id) => {
    const unit = units.find((u) => u.id === id);
    return unit ? unit.shortName || unit.name : "";
  };

  const getItemPartNo = (id) => {
    const item = items.find((i) => i.id === id);
    return item ? item.partNo || "-" : "-";
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <Badge variant="success">Approved</Badge>;
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      case "issued":
        return <Badge variant="info">Issued</Badge>;
      case "received":
        return (
          <Badge variant="success" className="bg-green-100 text-green-800">
            Received
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleToggleReceived = (itemId) => {
    setReceivedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleReceiveAll = () => {
    // Mark all items as received
    const updatedReceivedItems = {};
    Object.keys(receivedItems).forEach((itemId) => {
      updatedReceivedItems[itemId] = true;
    });
    setReceivedItems(updatedReceivedItems);
  };

  const handleSave = () => {
    // Update requisition status and items received status
    const requisitions = JSON.parse(localStorage.getItem("requisitions")) || [];
    const updatedRequisitions = requisitions.map((req) => {
      if (req.id === id) {
        // Update each item's received status
        const updatedItems = req.items.map((item) => ({
          ...item,
          received: receivedItems[item.itemId],
        }));

        // Check if all items are received
        const allItemsReceived = updatedItems.every((item) => item.received);

        return {
          ...req,
          status: allItemsReceived ? "received" : "issued",
          items: updatedItems,
        };
      }
      return req;
    });

    localStorage.setItem("requisitions", JSON.stringify(updatedRequisitions));

    // Update inventory for received items
    const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    const updatedInventory = [...inventory];

    Object.entries(receivedItems).forEach(([itemId, isReceived]) => {
      if (isReceived) {
        const reqItem = requisition.items.find(
          (item) => item.itemId === itemId
        );
        if (!reqItem) return;

        // Find if item exists in inventory
        const inventoryItemIndex = updatedInventory.findIndex(
          (invItem) => invItem.itemId === itemId
        );

        if (inventoryItemIndex >= 0) {
          // Update existing inventory item
          updatedInventory[inventoryItemIndex] = {
            ...updatedInventory[inventoryItemIndex],
            quantity:
              updatedInventory[inventoryItemIndex].quantity + reqItem.quantity,
            lastUpdated: new Date().toISOString(),
          };
        } else {
          // Add new inventory item
          updatedInventory.push({
            id: Date.now().toString(),
            itemId: itemId,
            partNo: getItemPartNo(itemId),
            name: getItemName(itemId),
            category: getItemGroupName(reqItem.itemGroupId),
            quantity: reqItem.quantity,
            minLevel: 5, // Default minimum level
            site: requisition.location,
            lastUpdated: new Date().toISOString(),
          });
        }
      }
    });

    localStorage.setItem("inventory", JSON.stringify(updatedInventory));

    toast({
      title: "Material Received",
      description: "The material receipt has been recorded successfully.",
    });

    navigate("/inventory");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  if (!requisition) {
    return (
      <div className="flex justify-center items-center h-64">
        Requisition not found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/requisitions")}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Receive Material
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(requisition.status)}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Requisition Details</CardTitle>
          <CardDescription>
            Review the requisition details before receiving materials
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Requisition No</p>
              <p className="font-medium">{requisition.requisitionNo}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">
                {format(new Date(requisition.date), "PPP")}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">{requisition.location}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Requested For</p>
              <p className="font-medium">
                {requisition.requestedFor.type.charAt(0).toUpperCase() +
                  requisition.requestedFor.type.slice(1)}
                : {requisition.requestedFor.value}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Priority</p>
              <p className="font-medium capitalize">{requisition.priority}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Prepared By</p>
              <p className="font-medium">{requisition.preparedBy}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Items to Receive</CardTitle>
            {!allReceived && (
              <Button variant="outline" size="sm" onClick={handleReceiveAll}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark All as Received
              </Button>
            )}
          </div>
          <CardDescription>Check the items you have received</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sr. No</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Part No</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requisition.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{getItemName(item.itemId)}</TableCell>
                    <TableCell>{getItemPartNo(item.itemId)}</TableCell>
                    <TableCell>
                      {item.quantity} {getUnitName(item.unitId)}
                    </TableCell>
                    <TableCell>
                      {receivedItems[item.itemId] ? (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
                        >
                          <CheckCircle className="h-3 w-3" /> Received
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1"
                        >
                          <Clock className="h-3 w-3" /> Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant={
                          receivedItems[item.itemId] ? "outline" : "default"
                        }
                        size="sm"
                        onClick={() => handleToggleReceived(item.itemId)}
                        disabled={allReceived}
                      >
                        {receivedItems[item.itemId]
                          ? "Undo"
                          : "Mark as Received"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/requisitions")}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={allReceived}>
            <Truck className="mr-2 h-4 w-4" />
            Confirm Receipt
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MaterialReceive;
