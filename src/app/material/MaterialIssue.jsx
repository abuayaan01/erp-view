"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MaterialIssue = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [requisition, setRequisition] = useState(null);
  const [itemGroups, setItemGroups] = useState([]);
  const [items, setItems] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [issueNo, setIssueNo] = useState(
    `ISS-${Date.now().toString().slice(-6)}`
  );
  const [issueDate, setIssueDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [issuedBy, setIssuedBy] = useState("");
  const [remarks, setRemarks] = useState("");

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

    const foundRequisition = requisitions.find((req) => req.id === id);

    if (foundRequisition) {
      setRequisition(foundRequisition);
      setItemGroups(storedItemGroups);
      setItems(storedItems);
      setUnits(storedUnits);
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
        return <Badge variant="success">Received</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleIssue = () => {
    if (!issuedBy.trim()) {
      toast({
        title: "Validation Error",
        description:
          "Please enter the name of the person issuing the materials.",
        variant: "destructive",
      });
      return;
    }

    // Update requisition status to issued
    const requisitions = JSON.parse(localStorage.getItem("requisitions")) || [];
    const updatedRequisitions = requisitions.map((req) => {
      if (req.id === id) {
        return {
          ...req,
          status: "issued",
          issueNo,
          issueDate,
          issuedBy,
          issueRemarks: remarks,
          issueTimestamp: new Date().toISOString(),
        };
      }
      return req;
    });

    localStorage.setItem("requisitions", JSON.stringify(updatedRequisitions));

    // Create a material issue record
    const issues = JSON.parse(localStorage.getItem("materialIssues")) || [];
    const newIssue = {
      id: Date.now().toString(),
      issueNo,
      issueDate,
      issuedBy,
      remarks,
      requisitionId: requisition.id,
      requisitionNo: requisition.requisitionNo,
      location: requisition.location,
      requestedFor: requisition.requestedFor,
      items: requisition.items,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem(
      "materialIssues",
      JSON.stringify([...issues, newIssue])
    );

    toast({
      title: "Material Issued",
      description: "The material has been issued successfully.",
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

  // Don't allow issuing if not approved or already issued/received
  const canIssue = requisition.status === "approved";

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
          <h1 className="text-3xl font-bold tracking-tight">Issue Material</h1>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(requisition.status)}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Requisition Details</CardTitle>
          <CardDescription>
            Review the requisition details before issuing materials
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
          <CardTitle>Items to Issue</CardTitle>
          <CardDescription>
            Review the items requested in this requisition
          </CardDescription>
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
                  <TableHead>Unit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requisition.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{getItemName(item.itemId)}</TableCell>
                    <TableCell>{getItemPartNo(item.itemId)}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{getUnitName(item.unitId)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Issue Information</CardTitle>
          <CardDescription>
            Enter details about this material issue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issueNo">Issue No</Label>
              <Input
                id="issueNo"
                value={issueNo}
                onChange={(e) => setIssueNo(e.target.value)}
                disabled={!canIssue}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input
                id="issueDate"
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                disabled={!canIssue}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issuedBy">Issued By *</Label>
              <Input
                id="issuedBy"
                value={issuedBy}
                onChange={(e) => setIssuedBy(e.target.value)}
                placeholder="Enter name of person issuing materials"
                disabled={!canIssue}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Input
                id="remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Any additional notes about this issue"
                disabled={!canIssue}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/requisitions")}>
            Cancel
          </Button>
          <Button onClick={handleIssue} disabled={!canIssue}>
            <Send className="mr-2 h-4 w-4" />
            Issue Material
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MaterialIssue;
