"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  User,
  IndianRupee,
  Wrench,
  Package,
  Building,
  Phone,
  Mail,
  MapPin,
  FileText,
  Shield,
  Hash,
} from "lucide-react";
import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const MaintenanceLogDetails = ({ log, onBack }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
          >
            <CheckCircle className="h-3 w-3" /> Completed
          </Badge>
        );
      case "in_progress":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1"
          >
            <Clock className="h-3 w-3" /> In Progress
          </Badge>
        );
      case "scheduled":
        return (
          <Badge
            variant="outline"
            className="bg-orange-50 text-orange-700 border-orange-200 flex items-center gap-1"
          >
            <AlertTriangle className="h-3 w-3" /> Scheduled
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getMaintenanceTypeBadge = (type) => {
    switch (type) {
      case "repair":
        return <Badge variant="destructive">Repair</Badge>;
      case "preventive":
        return <Badge variant="default">Preventive</Badge>;
      case "inspection":
        return <Badge variant="secondary">Inspection</Badge>;
      case "oil_change":
        return <Badge variant="outline">Oil Change</Badge>;
      case "parts_replacement":
        return <Badge variant="warning">Parts Replacement</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy 'at' h:mm a");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to List
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">{log.title}</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Machine ID: {log.machineId}
          </p>
          <div className="flex items-center gap-2 mt-1">
            {getMaintenanceTypeBadge(log.type)}
            {getStatusBadge(log.status)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold">₹{log.cost}</div>
          <div className="text-sm text-muted-foreground">Total Cost</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Date</span>
          </div>
          <p>{formatDate(log.date)}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Technician</span>
          </div>
          <p>{log.technician}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wrench className="h-4 w-4" />
            <span>Hours at Service</span>
          </div>
          <p>{log.hoursAtService}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IndianRupee className="h-4 w-4" />
            <span>Cost</span>
          </div>
          <p>₹{log.cost}</p>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">Description</h4>
        <p className="text-muted-foreground">{log.description}</p>
      </div>

      {log.parts && (
        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2">
            <Package className="h-4 w-4" />
            Parts Used (Legacy)
          </h4>
          <p className="text-muted-foreground">{log.parts}</p>
        </div>
      )}

      {/* Vendor and Parts Details */}
      {log.vendorAndPartsDetails && log.vendorAndPartsDetails.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Building className="h-4 w-4" />
            Vendor & Parts Details
          </h4>

          <div className="grid gap-4">
            {log.vendorAndPartsDetails.map((vendor, vendorIndex) => (
              <Card key={vendor.id} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    {vendor.name}
                  </CardTitle>
                  <CardDescription>Vendor #{vendorIndex + 1}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Vendor Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>Contact Person</span>
                      </div>
                      <p>{vendor.contactPerson}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>Email</span>
                      </div>
                      <p>{vendor.email}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>Phone</span>
                      </div>
                      <p>{vendor.phone}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>Address</span>
                      </div>
                      <p>{vendor.address}</p>
                    </div>
                  </div>

                  {/* Parts Details */}
                  {vendor.parts && vendor.parts.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <h5 className="font-medium flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          Parts Supplied ({vendor.parts.length})
                        </h5>

                        <div className="grid gap-3">
                          {vendor.parts.map((part, partIndex) => (
                            <Card key={part.id} className="bg-muted/50">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                  <h6 className="font-medium">{part.name}</h6>
                                  <Badge variant="secondary">
                                    Qty: {part.quantity}
                                  </Badge>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                      <Hash className="h-3 w-3" />
                                      <span>Part Number</span>
                                    </div>
                                    <p>{part.partNumber}</p>
                                  </div>

                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                      <Shield className="h-3 w-3" />
                                      <span>Warranty Period</span>
                                    </div>
                                    <p>{part.warrantyPeriod}</p>
                                  </div>
                                </div>

                                {/* File attachments */}
                                <div className="mt-3 space-y-2">
                                  {part.taxInvoiceFile && (
                                    <div className="flex items-center justify-between p-2 bg-background rounded border">
                                      <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">
                                          Tax Invoice
                                        </span>
                                      </div>
                                      <Button variant="ghost" size="sm">
                                        <FileText className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  )}

                                  {part.warrantyCardFile && (
                                    <div className="flex items-center justify-between p-2 bg-background rounded border">
                                      <div className="flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">
                                          Warranty Card
                                        </span>
                                      </div>
                                      <Button variant="ghost" size="sm">
                                        <FileText className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  )}

                                  {!part.taxInvoiceFile &&
                                    !part.warrantyCardFile && (
                                      <p className="text-sm text-muted-foreground italic">
                                        No files attached
                                      </p>
                                    )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Timestamps */}
      <div className="space-y-4">
        <h4 className="font-medium">Timeline</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Created At</span>
            </div>
            <p>{formatDate(log.createdAt)}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Last Updated</span>
            </div>
            <p>{formatDate(log.updatedAt)}</p>
          </div>
        </div>
      </div>

      {/* <div className="flex justify-end gap-2">
        <Button variant="outline">Download Report</Button>
        <Button variant="outline">Print</Button>
        <Button>Edit</Button>
      </div> */}
    </div>
  );
};

export default MaintenanceLogDetails;
