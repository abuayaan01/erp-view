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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useSelector } from "react-redux";

const MaterialRequisitionForward = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [requisition, setRequisition] = useState(null);
  const [itemGroups, setItemGroups] = useState([]);
  const [items, setItems] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forwardToSite, setForwardToSite] = useState("");
  const [forwardNotes, setForwardNotes] = useState("");
  const [sites, setSites] = useState(["Site A", "Site B", "Site C"]); // Mock sites
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

    const foundRequisition = requisitions.find((req) => req.id === id);

    if (foundRequisition) {
      setRequisition(foundRequisition);
      setItemGroups(storedItemGroups.data);
      setItems(storedItems.data);
      setUnits(storedUnits.data);

      // Filter out the requesting site from the available sites
      setSites((prevSites) =>
        prevSites.filter((site) => site !== foundRequisition.requestingSite)
      );
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

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      case "forwarded":
        return <Badge variant="info">Forwarded</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleForward = () => {
    if (!forwardToSite) {
      toast({
        title: "Validation Error",
        description: "Please select a site to forward this requisition to.",
        variant: "destructive",
      });
      return;
    }

    // Update requisition status to forwarded
    const requisitions = JSON.parse(localStorage.getItem("requisitions")) || [];
    const updatedRequisitions = requisitions.map((req) => {
      if (req.id === id) {
        return {
          ...req,
          status: "forwarded",
          forwardedToSite: forwardToSite,
          forwardNotes,
          forwardedBy: "Admin", // In a real app, this would be the current user
          forwardDate: new Date().toISOString(),
        };
      }
      return req;
    });

    localStorage.setItem("requisitions", JSON.stringify(updatedRequisitions));

    toast({
      title: "Requisition Forwarded",
      description: `The requisition has been forwarded to ${forwardToSite}.`,
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

  // Don't allow forwarding if not pending
  const canForward = requisition.status === "pending";

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
            Forward Requisition
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
            Review the requisition details before forwarding
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
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">{requisition.location}</p>
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
          <CardTitle>Requested Items</CardTitle>
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
                  <TableHead>Item Group</TableHead>
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
                    <TableCell>{getItemGroupName(item.itemGroupId)}</TableCell>
                    <TableCell>{getItemName(item.itemId)}</TableCell>
                    <TableCell>{item.partNo || "-"}</TableCell>
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
          <CardTitle>Forward to Site</CardTitle>
          <CardDescription>
            Select a site to forward this requisition to
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="forwardToSite">Forward To *</Label>
            <Select
              value={forwardToSite}
              onValueChange={setForwardToSite}
              disabled={!canForward}
            >
              <SelectTrigger id="forwardToSite">
                <SelectValue placeholder="Select site to forward to" />
              </SelectTrigger>
              <SelectContent>
                {sites.map((site, index) => (
                  <SelectItem key={index} value={site}>
                    {site}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="forwardNotes">Notes</Label>
            <Textarea
              id="forwardNotes"
              placeholder="Add any notes or instructions for the receiving site"
              value={forwardNotes}
              onChange={(e) => setForwardNotes(e.target.value)}
              disabled={!canForward}
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/requisitions")}>
            Cancel
          </Button>
          <Button
            onClick={handleForward}
            disabled={!canForward || !forwardToSite}
          >
            <Send className="mr-2 h-4 w-4" />
            Forward Requisition
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MaterialRequisitionForward;
