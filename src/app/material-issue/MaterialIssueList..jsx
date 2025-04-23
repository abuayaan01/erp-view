"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Eye, FileText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

// Mock data for material issues
const mockIssues = [
  {
    id: "ISS-0001",
    issueDate: "2023-04-15",
    issueTime: "09:30",
    issueType: "consumption",
    issueLocation: "MARKONA CANAL SITE",
    fromSite: "MARKONA CANAL",
    toSite: "",
    items: [
      {
        id: "1",
        itemId: "6",
        itemName: "Diesel",
        itemGroup: "Fuels",
        quantity: 50,
        unit: "LTR",
        balance: 950,
        issueTo: "vehicle",
        vehicleId: "1",
        vehicleNumber: "JH01AB1234",
        vehicleKm: "12500",
        vehicleHours: "350",
        siteId: "",
        siteName: "",
      },
    ],
    status: "completed",
  },
  {
    id: "ISS-0002",
    issueDate: "2023-04-16",
    issueTime: "14:15",
    issueType: "transfer",
    issueLocation: "MARKONA CANAL SITE",
    fromSite: "MARKONA CANAL",
    toSite: "TATA OFFICE",
    items: [
      {
        id: "2",
        itemId: "3",
        itemName: "Air Filter",
        itemGroup: "Spare Parts",
        quantity: 5,
        unit: "PCS",
        balance: 45,
        issueTo: "site",
        vehicleId: "",
        vehicleNumber: "",
        vehicleKm: "",
        vehicleHours: "",
        siteId: "2",
        siteName: "TATA OFFICE",
      },
      {
        id: "3",
        itemId: "4",
        itemName: "Oil Filter",
        itemGroup: "Spare Parts",
        quantity: 10,
        unit: "PCS",
        balance: 65,
        issueTo: "site",
        vehicleId: "",
        vehicleNumber: "",
        vehicleKm: "",
        vehicleHours: "",
        siteId: "2",
        siteName: "TATA OFFICE",
      },
    ],
    status: "completed",
  },
  {
    id: "ISS-0003",
    issueDate: "2023-04-17",
    issueTime: "11:45",
    issueType: "consumption",
    issueLocation: "JAMSHEDPUR SITE",
    fromSite: "JAMSHEDPUR SITE",
    toSite: "",
    items: [
      {
        id: "4",
        itemId: "1",
        itemName: "Engine Oil",
        itemGroup: "Lubricants",
        quantity: 20,
        unit: "LTR",
        balance: 480,
        issueTo: "vehicle",
        vehicleId: "2",
        vehicleNumber: "JH02CD5678",
        vehicleKm: "8700",
        vehicleHours: "420",
        siteId: "",
        siteName: "",
      },
    ],
    status: "completed",
  },
  {
    id: "ISS-0004",
    issueDate: "2023-04-18",
    issueTime: "16:30",
    issueType: "transfer",
    issueLocation: "TATA OFFICE",
    fromSite: "TATA OFFICE",
    toSite: "JAMSHEDPUR SITE",
    items: [
      {
        id: "5",
        itemId: "5",
        itemName: "Grease",
        itemGroup: "Consumables",
        quantity: 15,
        unit: "KG",
        balance: 185,
        issueTo: "site",
        vehicleId: "",
        vehicleNumber: "",
        vehicleKm: "",
        vehicleHours: "",
        siteId: "3",
        siteName: "JAMSHEDPUR SITE",
      },
    ],
    status: "pending",
  },
  {
    id: "ISS-0005",
    issueDate: "2023-04-19",
    issueTime: "10:00",
    issueType: "consumption",
    issueLocation: "MARKONA CANAL SITE",
    fromSite: "MARKONA CANAL",
    toSite: "",
    items: [
      {
        id: "6",
        itemId: "7",
        itemName: "Petrol",
        itemGroup: "Fuels",
        quantity: 30,
        unit: "LTR",
        balance: 770,
        issueTo: "vehicle",
        vehicleId: "3",
        vehicleNumber: "JH03EF9012",
        vehicleKm: "5600",
        vehicleHours: "280",
        siteId: "",
        siteName: "",
      },
    ],
    status: "pending",
  },
];

const MaterialIssueList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSite, setFilterSite] = useState("all");

  // Filter issues based on search term and filters
  const filteredIssues = mockIssues.filter((issue) => {
    // Search term filter
    const matchesSearch =
      issue.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.fromSite.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.toSite.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.items.some((item) =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      issue.items.some((item) =>
        item.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );

    // Issue type filter
    const matchesType = filterType === "all" || issue.issueType === filterType;

    // Status filter
    const matchesStatus =
      filterStatus === "all" || issue.status === filterStatus;

    // Site filter
    const matchesSite =
      filterSite === "all" ||
      issue.fromSite.includes(filterSite) ||
      issue.toSite.includes(filterSite);

    return matchesSearch && matchesType && matchesStatus && matchesSite;
  });

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Material Issues</h1>
        <Button>
          <Link to="/issues/new" className="flex">
            <Plus className="mr-2 h-4 w-4" /> Create Issue
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Material Issues</CardTitle>
          <CardDescription>View and manage all material issues</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search issues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex flex-1 flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="consumption">Consumption</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Select value={filterSite} onValueChange={setFilterSite}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by site" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sites</SelectItem>
                    <SelectItem value="MARKONA">MARKONA</SelectItem>
                    <SelectItem value="TATA">TATA</SelectItem>
                    <SelectItem value="JAMSHEDPUR">JAMSHEDPUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Issue No</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIssues.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-6 text-muted-foreground"
                    >
                      {searchTerm ||
                      filterType !== "all" ||
                      filterStatus !== "all" ||
                      filterSite !== "all"
                        ? "No material issues found matching your search criteria."
                        : "No material issues found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredIssues.map((issue) => (
                    <TableRow key={issue.id}>
                      <TableCell className="font-medium">{issue.id}</TableCell>
                      <TableCell>{formatDate(issue.issueDate)}</TableCell>
                      <TableCell className="capitalize">
                        {issue.issueType}
                      </TableCell>
                      <TableCell>{issue.fromSite}</TableCell>
                      <TableCell>
                        {issue.toSite ||
                          (issue.items[0].issueTo === "vehicle"
                            ? issue.items[0].vehicleNumber
                            : "N/A")}
                      </TableCell>
                      <TableCell>{issue.items.length}</TableCell>
                      <TableCell>{getStatusBadge(issue.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Link to={`/issues/${issue.id}`}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Link to={`/issues/${issue.id}?print=true`}>
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">Print</span>
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaterialIssueList;
