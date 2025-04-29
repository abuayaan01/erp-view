"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useSelector } from "react-redux";

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

const MaterialRequisitionRespond = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [requisition, setRequisition] = useState(null);
  const [itemGroups, setItemGroups] = useState([]);
  const [items, setItems] = useState([]);
  const [units, setUnits] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responseNotes, setResponseNotes] = useState("");
  const [responseType, setResponseType] = useState("full"); // full, partial, reject
  const [itemResponses, setItemResponses] = useState({});
  const storedItemGroups = useSelector((state) => state.itemGroups) || [];
  const storedItems = useSelector((state) => state.items) || [];
  const storedUnits = useSelector((state) => state.units) || [];

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
    const storedInventory = mockInventoryData;

    const foundRequisition = requisitions?.find((req) => req.id == id);

    if (foundRequisition) {
      setRequisition(foundRequisition);
      setItemGroups(storedItemGroups.data);
      setItems(storedItems.data);
      setUnits(storedUnits.data);
      setInventory(storedInventory.data);

      // Initialize item responses
      const initialResponses = {};
      foundRequisition.items.forEach((item) => {
        initialResponses[item.itemId] = {
          canFulfill: true,
          quantity: item.quantity,
          notes: "",
        };
      });
      setItemResponses(initialResponses);
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
    const item = items?.find((i) => i.id === id);
    return item ? item.name : "Unknown Item";
  };

  const getUnitName = (id) => {
    const unit = units?.find((u) => u.id === id);
    return unit ? unit.shortName || unit.name : "";
  };

  const getItemStock = (itemId) => {
    // Find item in inventory for this site
    const inventoryItem = inventory?.find(
      (item) =>
        item.itemId === itemId && item.site === requisition.forwardedToSite
    );
    return inventoryItem ? inventoryItem.quantity : 0;
  };

  const handleItemResponseChange = (itemId, field, value) => {
    setItemResponses((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value,
      },
    }));

    // Check if any items can't be fulfilled completely
    const anyPartial = Object.values(itemResponses).some(
      (response) =>
        !response.canFulfill ||
        response.quantity <
          requisition.items?.find((i) => i.itemId === itemId)?.quantity
    );

    if (anyPartial) {
      setResponseType("partial");
    } else {
      setResponseType("full");
    }
  };

  const handleReject = () => {
    updateRequisitionStatus("rejected");
  };

  const handleApprove = () => {
    if (responseType === "full") {
      updateRequisitionStatus("approved");
    } else {
      updateRequisitionStatus("partially_approved");
    }
  };

  const updateRequisitionStatus = (status) => {
    // Update requisition status
    const requisitions = JSON.parse(localStorage.getItem("requisitions")) || [];
    const updatedRequisitions = requisitions.map((req) => {
      if (req.id === id) {
        // Update each item with response data
        const updatedItems = req.items.map((item) => ({
          ...item,
          response: itemResponses[item.itemId],
        }));

        return {
          ...req,
          status,
          responseNotes,
          respondedBy: requisition.forwardedToSite, // The site that responded
          responseDate: new Date().toISOString(),
          items: updatedItems,
        };
      }
      return req;
    });

    localStorage.setItem("requisitions", JSON.stringify(updatedRequisitions));

    toast({
      title:
        status === "rejected" ? "Requisition Rejected" : "Requisition Approved",
      description:
        status === "rejected"
          ? "The requisition has been rejected."
          : status === "partially_approved"
          ? "The requisition has been partially approved."
          : "The requisition has been approved.",
    });

    navigate("/requisitions");
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

  // Don't allow response if not forwarded
  const canRespond = requisition.status === "forwarded";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/requisitions/list")}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Respond to Requisition
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200"
          >
            Forwarded
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Requisition Details</CardTitle>
          <CardDescription>
            Review the requisition details before responding
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
              <p className="text-sm text-muted-foreground">Requesting Site</p>
              <p className="font-medium">{requisition.requestingSite}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Forwarded To</p>
              <p className="font-medium">{requisition.forwardedToSite}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Priority</p>
              <p className="font-medium capitalize">{requisition.priority}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Forward Notes</p>
              <p className="font-medium">
                {requisition.forwardNotes || "No notes provided"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Requested Items</CardTitle>
          <CardDescription>
            Indicate which items you can provide
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Part No</TableHead>
                  <TableHead>Requested Qty</TableHead>
                  <TableHead>Available Stock</TableHead>
                  <TableHead>Can Fulfill</TableHead>
                  <TableHead>Quantity to Issue</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requisition.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{getItemName(item.itemId)}</TableCell>
                    <TableCell>{item.partNo || "-"}</TableCell>
                    <TableCell>
                      {item.quantity} {getUnitName(item.unitId)}
                    </TableCell>
                    <TableCell>
                      {getItemStock(item.itemId)} {getUnitName(item.unitId)}
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={itemResponses[item.itemId]?.canFulfill}
                        onCheckedChange={(checked) =>
                          handleItemResponseChange(
                            item.itemId,
                            "canFulfill",
                            checked
                          )
                        }
                        disabled={!canRespond}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        max={item.quantity}
                        value={itemResponses[item.itemId]?.quantity}
                        onChange={(e) =>
                          handleItemResponseChange(
                            item.itemId,
                            "quantity",
                            Number.parseFloat(e.target.value) || 0
                          )
                        }
                        disabled={
                          !canRespond || !itemResponses[item.itemId]?.canFulfill
                        }
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={itemResponses[item.itemId]?.notes}
                        onChange={(e) =>
                          handleItemResponseChange(
                            item.itemId,
                            "notes",
                            e.target.value
                          )
                        }
                        disabled={!canRespond}
                        placeholder="Any notes"
                        className="w-full"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Response</CardTitle>
          <CardDescription>
            Provide your response to this requisition
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="responseNotes">Notes</Label>
              <Textarea
                id="responseNotes"
                placeholder="Add any notes or comments regarding your response"
                value={responseNotes}
                onChange={(e) => setResponseNotes(e.target.value)}
                disabled={!canRespond}
                rows={4}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/requisitions")}>
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!canRespond}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button
              variant="default"
              onClick={handleApprove}
              disabled={!canRespond}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {responseType === "full" ? "Approve" : "Partially Approve"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MaterialRequisitionRespond;
