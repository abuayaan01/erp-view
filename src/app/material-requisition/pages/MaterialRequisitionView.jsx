"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { PDFViewer } from "@react-pdf/renderer";
import MaterialRequisitionPDF from "./MaterialRequisitionPDF";
import { useSelector } from "react-redux";

const MaterialRequisitionView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const printRef = useRef();

  const [requisition, setRequisition] = useState(null);
  const [itemGroups, setItemGroups] = useState([]);
  const [items, setItems] = useState([]);
  const [units, setUnits] = useState([]);
  const [showPdf, setShowPdf] = useState(false);
  const storedItemGroups = useSelector((state) => state.itemGroups) || [];
  const storedItems = useSelector((state) => state.items) || [];
  const storedUnits = useSelector((state) => state.units) || [];

  const shouldPrint =
    new URLSearchParams(location.search).get("print") === "true";

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
            itemId: "1",
            name: "Hammer",
            itemGroupId: "1",
            unitId: "1",
            quantity: 5,
            partNumber: "PN-12345",
            ItemGroup: { name: "Tools" },
            Unit: { shortName: "pcs" },
            weight: "1.5 kg",
          },
          {
            itemId: "2",
            name: "Wrench",
            itemGroupId: "1",
            unitId: "2",
            quantity: 12,
            partNumber: "PN-123456",
            ItemGroup: { name: "Tools" },
            Unit: { shortName: "pcs" },
            weight: "0.5 kg",
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
    } else {
      toast({
        title: "Requisition Not Found",
        description: "The requisition you're looking for doesn't exist.",
        variant: "destructive",
      });
      navigate("/requisitions");
    }
  }, [id, navigate, toast]);

  useEffect(() => {
    // Trigger print if print parameter is present
    if (shouldPrint && requisition) {
      setShowPdf(true);
    }
  }, [shouldPrint, requisition]);

  const getItemGroupName = (id) => {
    const group = itemGroups.find((g) => g.id == id);
    return group ? group.name : "Unknown Group";
  };

  const getItemName = (id) => {
    const item = items.find((i) => i.id == id);
    return item ? item.name : "Unknown Item";
  };

  const getUnitName = (id) => {
    const unit = units.find((u) => u.id == id);
    return unit ? unit.shortName || unit.name : "";
  };

  const getPriorityBadge = (priority) => {
    switch (priority.toLowerCase()) {
      case "urgent":
        return <Badge variant="destructive">Urgent</Badge>;
      case "medium":
        return <Badge variant="default">Medium</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return dateString;
    }
  };

  const handlePrint = () => {
    setShowPdf(true);
  };

  if (!requisition) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div className="space-y-6">
      {!showPdf ? (
        <>
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
                Material Requisition: {requisition.requisitionNo}
              </h1>
            </div>
            <Button onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Requisition Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Requisition No
                  </p>
                  <p className="font-medium">{requisition.requisitionNo}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Date and Time</p>
                  <p className="font-medium">{formatDate(requisition.date)}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Store Section</p>
                  <p className="font-medium">
                    {requisition.storeSection === "main"
                      ? "Main Store"
                      : requisition.storeSection === "secondary"
                      ? "Secondary Store"
                      : requisition.storeSection === "warehouse"
                      ? "Warehouse"
                      : requisition.storeSection}
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
                  <p className="text-sm text-muted-foreground">Charge Type</p>
                  <p className="font-medium">
                    {requisition.chargeType === "foc" ? "FOC" : "Chargeable"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Priority</p>
                  <div className="font-medium print:hidden">
                    {getPriorityBadge(requisition.priority)}
                  </div>
                  <p className="font-medium hidden print:block">
                    {requisition.priority.charAt(0).toUpperCase() +
                      requisition.priority.slice(1)}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="font-medium">
                    {requisition.dueDate
                      ? new Date(requisition.dueDate).toLocaleDateString()
                      : "Not specified"}
                  </p>
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
              <CardTitle>Items</CardTitle>
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
                      <TableHead>Qty/Unit</TableHead>
                      <TableHead>Weight/Unit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requisition.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.ItemGroup.name}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.partNumber || "-"}</TableCell>
                        <TableCell>
                          {item.quantity} {item.Unit?.shortName}
                        </TableCell>
                        <TableCell>{item.weight || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="flex flex-col h-screen">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Material Requisition Slip</h1>
            <Button variant="outline" onClick={() => setShowPdf(false)}>
              Back to Details
            </Button>
          </div>
          <div className="flex-1 border rounded">
            <PDFViewer width="100%" height="100%" className="border">
              <MaterialRequisitionPDF
                formData={{
                  ...requisition,
                  time: new Date(requisition.date).toLocaleTimeString(),
                }}
                items={requisition.items.map((item) => ({
                  ...item,
                  itemName: getItemName(item.itemId),
                  unit: getUnitName(item.unitId),
                  issueTo: requisition.requestedFor.type,
                  vehicleNumber:
                    requisition.requestedFor.type === "vehicle"
                      ? requisition.requestedFor.value
                      : "",
                  siteName:
                    requisition.requestedFor.type !== "vehicle"
                      ? requisition.requestedFor.value
                      : "",
                }))}
              />
            </PDFViewer>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialRequisitionView;
