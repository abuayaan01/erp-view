"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  Truck,
  XCircle,
} from "lucide-react";
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
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const mockRequisitions = [
  {
    id: 1,
    requisitionNo: "REQ-001",
    date: "2025-04-20",
    requestingSite: "Site A",
    forwardedToSite: "Site B",
    priority: "urgent",
    status: "pending",
    preparedBy: "John Doe",
  },
  {
    id: 2,
    requisitionNo: "REQ-002",
    date: "2025-04-21",
    requestingSite: "Site B",
    forwardedToSite: "Site C",
    priority: "medium",
    status: "forwarded",
    preparedBy: "Alice Smith",
  },
  {
    id: 3,
    requisitionNo: "REQ-003",
    date: "2025-04-22",
    requestingSite: "Site C",
    forwardedToSite: "Site A",
    priority: "low",
    status: "approved",
    preparedBy: "Mark Taylor",
  },
  {
    id: 4,
    requisitionNo: "REQ-004",
    date: "2025-04-23",
    requestingSite: "Site A",
    forwardedToSite: "Site B",
    priority: "medium",
    status: "partially_approved",
    preparedBy: "Jane Williams",
  },
  {
    id: 5,
    requisitionNo: "REQ-005",
    date: "2025-04-24",
    requestingSite: "Site B",
    forwardedToSite: "Site A",
    priority: "urgent",
    status: "rejected",
    preparedBy: "Charlie Johnson",
  },
  {
    id: 6,
    requisitionNo: "REQ-006",
    date: "2025-04-25",
    requestingSite: "Site C",
    forwardedToSite: "Site A",
    priority: "low",
    status: "issued",
    preparedBy: "Natalie Brown",
  },
  {
    id: 7,
    requisitionNo: "REQ-007",
    date: "2025-04-25",
    requestingSite: "Site A",
    forwardedToSite: "Site B",
    priority: "medium",
    status: "received",
    preparedBy: "Ethan Davis",
  },
];
const MaterialRequisitionList = () => {
  const [requisitions, setRequisitions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSite, setFilterSite] = useState("all");
  const [sites, setSites] = useState([]);
  const [userRole, setUserRole] = useState("admin"); // In a real app, this would come from auth
  const [userSite, setUserSite] = useState("Site A"); // In a real app, this would come from auth

  useEffect(() => {
    // Load requisitions from localStorage
    const storedRequisitions =
      JSON.parse(localStorage.getItem("requisitions")) || mockRequisitions;
    setRequisitions(mockRequisitions);

    // Extract unique sites
    const uniqueSites = [
      ...new Set(storedRequisitions.map((req) => req.requestingSite)),
    ];
    setSites(uniqueSites);
  }, []);

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

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1"
          >
            <Clock className="h-3 w-3" /> Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1"
          >
            <CheckCircle className="h-3 w-3" /> Approved
          </Badge>
        );
      case "forwarded":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1"
          >
            <Truck className="h-3 w-3" /> Forwarded
          </Badge>
        );
      case "partially_approved":
        return (
          <Badge
            variant="outline"
            className="bg-orange-50 text-orange-700 border-orange-200 flex items-center gap-1"
          >
            <AlertTriangle className="h-3 w-3" /> Partially Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1"
          >
            <XCircle className="h-3 w-3" /> Rejected
          </Badge>
        );
      case "issued":
        return (
          <Badge
            variant="outline"
            className="bg-indigo-50 text-indigo-700 border-indigo-200 flex items-center gap-1"
          >
            <Truck className="h-3 w-3" /> Issued
          </Badge>
        );
      case "received":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
          >
            <CheckCircle className="h-3 w-3" /> Received
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const filteredRequisitions = requisitions.filter((req) => {
    // Filter by search term
    const matchesSearch =
      req.requisitionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.requestingSite.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.preparedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.priority.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by status
    const matchesStatus = filterStatus === "all" || req.status === filterStatus;

    // Filter by site
    const matchesSite =
      filterSite === "all" || req.requestingSite === filterSite;

    // Filter by user role and site
    if (userRole === "admin") {
      // Admin can see all requisitions
      return matchesSearch && matchesStatus && matchesSite;
    } else {
      // Regular users can only see their site's requisitions or requisitions forwarded to them
      return (
        matchesSearch &&
        matchesStatus &&
        matchesSite &&
        (req.requestingSite === userSite || req.forwardedToSite === userSite)
      );
    }
  });

  const getActionButtons = (req) => {
    if (userRole === "admin") {
      // Admin actions
      switch (req.status) {
        case "pending":
          return (
            <>
              <Button variant="ghost" size="icon" >
                <Link to={`/requisitions/view/${req.id}`}>
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" >
                <Link to={`/requisitions/forward/${req.id}`}>
                  <Truck className="h-4 w-4" />
                  <span className="sr-only">Forward</span>
                </Link>
              </Button>
            </>
          );
        case "forwarded":
          return (
            <Button variant="ghost" size="icon" >
              <Link to={`/requisitions/view/${req.id}`}>
                <Eye className="h-4 w-4" />
                <span className="sr-only">View</span>
              </Link>
            </Button>
          );
        case "partially_approved":
          return (
            <>
              <Button variant="ghost" size="icon" >
                <Link to={`/requisitions/view/${req.id}`}>
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" >
                <Link to={`/requisitions/review/${req.id}`}>
                  <CheckCircle className="h-4 w-4" />
                  <span className="sr-only">Review</span>
                </Link>
              </Button>
            </>
          );
        default:
          return (
            <Button variant="ghost" size="icon" >
              <Link to={`/requisitions/view/${req.id}`}>
                <Eye className="h-4 w-4" />
                <span className="sr-only">View</span>
              </Link>
            </Button>
          );
      }
    } else {
      // Regular user actions
      if (req.requestingSite === userSite) {
        // This is the user's own requisition
        if (req.status === "issued") {
          return (
            <>
              <Button variant="ghost" size="icon" >
                <Link to={`/requisitions/view/${req.id}`}>
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" >
                <Link to={`/requisitions/receive/${req.id}`}>
                  <CheckCircle className="h-4 w-4" />
                  <span className="sr-only">Receive</span>
                </Link>
              </Button>
            </>
          );
        } else {
          return (
            <Button variant="ghost" size="icon" >
              <Link to={`/requisitions/view/${req.id}`}>
                <Eye className="h-4 w-4" />
                <span className="sr-only">View</span>
              </Link>
            </Button>
          );
        }
      } else if (req.forwardedToSite === userSite) {
        // This requisition was forwarded to the user's site
        if (req.status === "forwarded") {
          return (
            <>
              <Button variant="ghost" size="icon" >
                <Link to={`/requisitions/view/${req.id}`}>
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" >
                <Link to={`/requisitions/respond/${req.id}`}>
                  <CheckCircle className="h-4 w-4" />
                  <span className="sr-only">Respond</span>
                </Link>
              </Button>
            </>
          );
        } else if (req.status === "approved") {
          return (
            <>
              <Button variant="ghost" size="icon" >
                <Link to={`/requisitions/view/${req.id}`}>
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" >
                <Link to={`/requisitions/issue/${req.id}`}>
                  <Truck className="h-4 w-4" />
                  <span className="sr-only">Issue</span>
                </Link>
              </Button>
            </>
          );
        } else {
          return (
            <Button variant="ghost" size="icon" >
              <Link to={`/requisitions/view/${req.id}`}>
                <Eye className="h-4 w-4" />
                <span className="sr-only">View</span>
              </Link>
            </Button>
          );
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Material Requisitions
        </h1>
        <Button>
          <Link to="/requisitions/new" className="flex">
            <Plus className="mr-2 h-4 w-4" /> Create Requisition
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1 relative">
          <Input
            placeholder="Search requisitions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex flex-1 flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="forwarded">Forwarded</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="partially_approved">
                  Partially Approved
                </SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="issued">Issued</SelectItem>
                <SelectItem value="received">Received</SelectItem>
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
                {sites.map((site, index) => (
                  <SelectItem key={index} value={site}>
                    {site}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Requisition No</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Requesting Site</TableHead>
              {userRole === "admin" && <TableHead>Forwarded To</TableHead>}
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Prepared By</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequisitions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={userRole === "admin" ? 8 : 7}
                  className="text-center py-6 text-muted-foreground"
                >
                  {searchTerm || filterStatus !== "all" || filterSite !== "all"
                    ? "No requisitions found matching your search."
                    : "No requisitions created yet."}
                </TableCell>
              </TableRow>
            ) : (
              filteredRequisitions.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium">
                    {req.requisitionNo}
                  </TableCell>
                  <TableCell>{formatDate(req.date)}</TableCell>
                  <TableCell>{req.requestingSite}</TableCell>
                  {userRole === "admin" && (
                    <TableCell>{req.forwardedToSite || "-"}</TableCell>
                  )}
                  <TableCell>{getPriorityBadge(req.priority)}</TableCell>
                  <TableCell>{getStatusBadge(req.status)}</TableCell>
                  <TableCell>{req.preparedBy}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {getActionButtons(req)}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MaterialRequisitionList;
