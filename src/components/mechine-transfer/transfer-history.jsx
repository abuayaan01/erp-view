"use client";

import { useEffect, useState } from "react";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, FileText } from "lucide-react";
import api from "@/services/api/api-service";

// Update the mock data to include the new transfer types
// Replace the historyTransfers array with this updated one

// Update the statuses array to include new statuses
const statuses = [
  "All Statuses",
  "Pending",
  "Approved",
  "Dispatched",
  "Received",
  "Rejected",
  "Sold",
  "Scrapped",
];

// Add a new transferTypes array for filtering
const transferTypes = ["All Types", "Site Transfer", "Sell", "Scrap"];

// Mock data for sites and machines
const sites = ["All Sites", "Site A", "Site B", "Site C", "Site D"];
const machines = [
  "All Machines",
  "Excavator XL2000",
  "Bulldozer B500",
  "Crane CR300",
  "Loader L100",
  "Excavator XL1000",
  "Forklift F200",
  "Compactor C100",
];

export function TransferHistory() {
  const [transfers, setTransfers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [siteFilter, setSiteFilter] = useState("All Sites");
  const [machineFilter, setMachineFilter] = useState("All Machines");
  // Add this after the machineFilter state declaration
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [selectedTransfer, setSelectedTransfer] = useState(null);

  // Update the filteredTransfers function to include type filtering
  // Replace the filteredTransfers constant with this updated one
  // const filteredTransfers = transfers.filter((transfer) => {
  //   const matchesSearch =
  //     transfer.machine?.machineName
  //       .toLowerCase()
  //       .includes(searchTerm.toLowerCase()) ||
  //     transfer.fromSite.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     (transfer.toSite &&
  //       transfer.toSite.toLowerCase().includes(searchTerm.toLowerCase()));

  //   const matchesStatus =
  //     statusFilter === "All Statuses" || transfer.status === statusFilter;
  //   const matchesSite =
  //     siteFilter === "All Sites" ||
  //     transfer.fromSite === siteFilter ||
  //     (transfer.toSite && transfer.toSite === siteFilter);
  //   const matchesMachine =
  //     machineFilter === "All Machines" ||
  //     transfer.machine.machineName === machineFilter;

  //   let matchesType = true;
  //   if (typeFilter !== "All Types") {
  //     if (typeFilter === "Site Transfer" && transfer.type !== "site_transfer")
  //       matchesType = false;
  //     if (typeFilter === "Sell" && transfer.type !== "sell")
  //       matchesType = false;
  //     if (typeFilter === "Scrap" && transfer.type !== "scrap")
  //       matchesType = false;
  //   }

  //   return (
  //     matchesSearch &&
  //     matchesStatus &&
  //     matchesSite &&
  //     matchesMachine &&
  //     matchesType
  //   );
  // });

  // Update the getStatusColor function to include new statuses
  // Replace the getStatusColor function with this updated one
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "Approved":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "Dispatched":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "Received":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "Sold":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "Scrapped":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const viewTransferLogs = (transfer) => {
    setSelectedTransfer(transfer);
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/transfers");
        if (res) {
          setTransfers(res.data); 
          console.log(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="space-y-4">
      {/* <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transfers..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div> */}

      {/* <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Select value={siteFilter} onValueChange={setSiteFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by site" />
            </SelectTrigger>
            <SelectContent>
              {sites.map((site) => (
                <SelectItem key={site} value={site}>
                  {site}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Select value={machineFilter} onValueChange={setMachineFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by machine" />
            </SelectTrigger>
            <SelectContent>
              {machines.map((machine) => (
                <SelectItem key={machine} value={machine}>
                  {machine}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              {transferTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div> */}

      <div className="rounded-md border">
        {/* Update the table header to include Type column */}
        <TableHeader>
          <TableRow>
            <TableHead>Transfer ID</TableHead>
            <TableHead>Machine Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>From → To</TableHead>
            <TableHead>Transfer Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        {/* Update the table body to display the transfer type and handle different types */}
        <TableBody>
          {transfers.length > 0 ? (
            transfers.map((transfer) => (
              <TableRow key={transfer.id}>
                <TableCell className="font-medium">{transfer.id}</TableCell>
                <TableCell>{transfer.machine?.machineName}</TableCell>
                <TableCell>
                  {transfer.requestType === "Site Transfer"
                    ? "Site Transfer"
                    : transfer.requestType === "Sell"
                    ? "Sell"
                    : "Scrap"}
                </TableCell>
                <TableCell>
                  {transfer.currentSite?.name} →{" "}
                  {transfer.requestType === "Site Transfer"
                    ? transfer.destinationSite?.name
                    : transfer.requestType === "Sell"
                    ? transfer.buyerName || "Buyer"
                    : transfer.scrapVendor || "Scrap"}
                </TableCell>
                <TableCell>
                  {new Date(transfer.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge
                    className={getStatusColor(transfer.status)}
                    variant="outline"
                  >
                    {transfer.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => viewTransferLogs(transfer)}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        View Logs
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Transfer Logs: {transfer.id}</DialogTitle>
                        <DialogDescription>
                          History of actions for this transfer
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">
                            Machine: {transfer.machine?.machineName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {transfer.requestType === "Site Transfer"
                              ? `From ${transfer.currentSite?.name} to ${transfer.destinationSite?.name}`
                              : transfer.requestType === "Sell"
                              ? `From ${transfer.currentSite?.name} to buyer: ${
                                  transfer.buyerName || "N/A"
                                }`
                              : `From ${
                                  transfer.currentSite?.name
                                } to scrap vendor: ${
                                  transfer.scrapVendor || "N/A"
                                }`}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">Activity Log</h3>
                          <div className="space-y-2">
                            {transfer?.logs?.map((log, index) => (
                              <div
                                key={index}
                                className="border-l-2 border-muted pl-4 py-1"
                              >
                                <p className="text-sm font-medium">
                                  {log?.action}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {log?.date} by {log.user}
                                </p>
                                {log?.reason && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Reason: {log.reason}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                No transfers found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </div>
    </div>
  );
}
