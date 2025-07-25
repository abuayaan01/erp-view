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
import {
  Search,
  FileText,
  BookDown,
  MoreHorizontal,
  PlusCircle,
} from "lucide-react";
import api from "@/services/api/api-service";
import Loader, { Spinner } from "../ui/loader";
import { toast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import TableSkeleton from "../ui/table-skeleton";

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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Update the filteredTransfers function to include type filtering
  // Replace the filteredTransfers constant with this updated one
  const filteredTransfers = transfers.filter((transfer) => {
    const matchesSearch =
      transfer.machine?.machineName
        ?.toLowerCase()
        .includes(searchTerm?.toLowerCase()) ||
      transfer.fromSite?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      (transfer.toSite &&
        transfer.toSite?.toLowerCase().includes(searchTerm?.toLowerCase())) ||
      transfer.name?.toLowerCase().includes(searchTerm?.toLowerCase());

    const matchesStatus =
      statusFilter === "All Statuses" || transfer.status === statusFilter;
    const matchesSite =
      siteFilter === "All Sites" ||
      transfer.fromSite === siteFilter ||
      (transfer.toSite && transfer.toSite === siteFilter);
    const matchesMachine =
      machineFilter === "All Machines" ||
      transfer.machine.machineName === machineFilter;

    let matchesType = true;
    if (typeFilter !== "All Types") {
      if (
        typeFilter === "Site Transfer" &&
        transfer.requestType !== "Site Transfer"
      )
        matchesType = false;
      if (typeFilter === "Sell" && transfer.requestType !== "Sell")
        matchesType = false;
      if (typeFilter === "Scrap" && transfer.requestType !== "Scrap")
        matchesType = false;
    }

    return (
      matchesSearch &&
      matchesStatus &&
      matchesSite &&
      matchesMachine &&
      matchesType
    );
  });

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
    let logs = [
      {
        action: "Transfer Requested",
        date: "2025-04-20 10:15 AM",
        user: "John Doe",
        reason: "Machine needed for Site B expansion",
      },
      {
        action: "Approved by Mechanical Head",
        date: "2025-04-21 03:40 PM",
        user: "Sarah Connor",
        reason: "Urgent project requirement",
      },
      {
        action: "Dispatched from Site A",
        date: "2025-04-22 09:00 AM",
        user: "Michael Scott",
      },
      {
        action: "Received at Site B",
        date: "2025-04-23 04:25 PM",
        user: "Dwight Schrute",
      },
    ];
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await api.get("/transfers");
        if (res) {
          setTransfers(
            res.data.map((d) => {
              return { ...d, logs };
            })
          );
        }
      } catch (error) {
        console.log(error);
        toast({
          title: "Something went wrong!",
          description: "Could not fetch list.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <Spinner />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
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
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
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

        {/* <div className="flex-1">
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
        </div> */}

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
      </div>

      {loading ? (
        <div className="flex-1 flex justify-center">
          <TableSkeleton cols={6} rows={6} />
        </div>
      ) : (
        <div className="rounded-md border">
          {/* Update the table header to include Type column */}
          <table className="w-full">
            <TableHeader>
              <TableRow className="text-sm">
                <TableHead className="text-center">Transfer No.</TableHead>
                <TableHead className="text-center">Machine Name</TableHead>
                <TableHead className="text-center">Type</TableHead>
                <TableHead className="w-[250px] text-center">
                  From → To
                </TableHead>
                <TableHead className="text-center">Transfer Date</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            {/* Update the table body to display the transfer type and handle different types */}
            <TableBody>
              {transfers.length > 0 ? (
                filteredTransfers.map((transfer) => (
                  <TableRow
                    onDoubleClick={() => navigate(`./${transfer.id}`)}
                    className="text-sm text-center cursor-pointer"
                    key={transfer.id}
                  >
                    <TableCell>{transfer.name}</TableCell>
                    <TableCell>
                      {transfer.machine?.machineName || "NA"}
                    </TableCell>
                    <TableCell>
                      {transfer.requestType === "Site Transfer"
                        ? "Site Transfer"
                        : transfer.requestType === "Sell"
                        ? "Sell"
                        : "Scrap"}
                    </TableCell>
                    <TableCell>
                      {transfer.currentSite?.name || "NA"} →{" "}
                      {transfer.requestType === "Site Transfer"
                        ? transfer.destinationSite?.name || "NA"
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

                    {/* View Logs Code Transfer it to details page */}
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                            }}
                            variant="ghost"
                            size="icon"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={"w-full"}
                            onClick={() => {
                              navigate(`./${transfer.id}`);
                            }}
                          >
                            View Details
                          </Button>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
          </table>
        </div>
      )}
    </div>
  );
}
