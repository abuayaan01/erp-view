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
  Search,
  ChevronLeft,
  ChevronRight,
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
import { format, parseISO } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import api from "@/services/api/api-service";

const MaterialRequisitionList = () => {
  const [requisitions, setRequisitions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSite, setFilterSite] = useState("all");
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState("admin"); // In a real app, this would come from auth
  const [userSite, setUserSite] = useState(null); // In a real app, this would come from auth

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    // Fetch requisitions from API
    const fetchRequisitions = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await api.get("/requisitions");
        setRequisitions(response.data);

        // Extract unique sites
        const uniqueSites = [
          ...new Set(response?.data?.map((req) => req.requestingSite?.name)),
        ]?.filter(Boolean);
        setSites(uniqueSites);

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch requisitions:", err);
        setError(err.message);
        setLoading(false);

        // For development purposes, use mock data if API fails
        // In production, you might want to show an error message instead
        // setRequisitions(mockRequisitions);
      }
    };

    fetchRequisitions();
  }, []);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterSite]);

  const getPriorityBadge = (priority) => {
    if (!priority) return <Badge variant="secondary">Not Set</Badge>;

    switch (priority.toLowerCase()) {
      case "urgent":
      case "high":
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
    if (!status) return <Badge variant="secondary">Unknown</Badge>;

    switch (status.toLowerCase()) {
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
    if (!dateString) return "-";
    try {
      return format(parseISO(dateString), "dd/MM/yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const filteredRequisitions = requisitions?.filter((req) => {
    // Filter by search term
    const matchesSearch =
      req.requisitionNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.requestingSite?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      req.preparedBy?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.requestPriority?.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by status
    const matchesStatus =
      filterStatus === "all" || req.status?.toLowerCase() === filterStatus;

    // Filter by site
    const matchesSite =
      filterSite === "all" || req.requestingSite?.name === filterSite;

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
        (req.requestingSite?.name === userSite ||
          req.forwardedToSite === userSite)
      );
    }
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequisitions?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredRequisitions?.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getActionButtons = (req) => {
    if (userRole === "admin") {
      // Admin actions
      switch (req.status?.toLowerCase()) {
        case "pending":
          return (
            <>
              <Button variant="ghost" size="icon">
                <Link to={`/requisitions/view/${req.id}`}>
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon">
                <Link to={`/requisitions/forward/${req.id}`}>
                  <Truck className="h-4 w-4" />
                  <span className="sr-only">Forward</span>
                </Link>
              </Button>
            </>
          );
        case "forwarded":
          return (
            <Button variant="ghost" size="icon">
              <Link to={`/requisitions/view/${req.id}`}>
                <Eye className="h-4 w-4" />
                <span className="sr-only">View</span>
              </Link>
            </Button>
          );
        case "partially_approved":
          return (
            <>
              <Button variant="ghost" size="icon">
                <Link to={`/requisitions/view/${req.id}`}>
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon">
                <Link to={`/requisitions/review/${req.id}`}>
                  <CheckCircle className="h-4 w-4" />
                  <span className="sr-only">Review</span>
                </Link>
              </Button>
            </>
          );
        default:
          return (
            <Button variant="ghost" size="icon">
              <Link to={`/requisitions/view/${req.id}`}>
                <Eye className="h-4 w-4" />
                <span className="sr-only">View</span>
              </Link>
            </Button>
          );
      }
    } else {
      // Regular user actions
      if (req.requestingSite?.name === userSite) {
        // This is the user's own requisition
        if (req.status?.toLowerCase() === "issued") {
          return (
            <>
              <Button variant="ghost" size="icon">
                <Link to={`/requisitions/view/${req.id}`}>
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon">
                <Link to={`/requisitions/receive/${req.id}`}>
                  <CheckCircle className="h-4 w-4" />
                  <span className="sr-only">Receive</span>
                </Link>
              </Button>
            </>
          );
        } else {
          return (
            <Button variant="ghost" size="icon">
              <Link to={`/requisitions/view/${req.id}`}>
                <Eye className="h-4 w-4" />
                <span className="sr-only">View</span>
              </Link>
            </Button>
          );
        }
      } else if (req.forwardedToSite === userSite) {
        // This requisition was forwarded to the user's site
        if (req.status?.toLowerCase() === "forwarded") {
          return (
            <>
              <Button variant="ghost" size="icon">
                <Link to={`/requisitions/view/${req.id}`}>
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon">
                <Link to={`/requisitions/respond/${req.id}`}>
                  <CheckCircle className="h-4 w-4" />
                  <span className="sr-only">Respond</span>
                </Link>
              </Button>
            </>
          );
        } else if (req.status?.toLowerCase() === "approved") {
          return (
            <>
              <Button variant="ghost" size="icon">
                <Link to={`/requisitions/view/${req.id}`}>
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon">
                <Link to={`/requisitions/issue/${req.id}`}>
                  <Truck className="h-4 w-4" />
                  <span className="sr-only">Issue</span>
                </Link>
              </Button>
            </>
          );
        } else {
          return (
            <Button variant="ghost" size="icon">
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading requisitions...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">Error loading requisitions: {error}</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Material Requisitions
        </h1>
        <Button>
          <Link to="/requisitions/new" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" /> Create Requisition
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Material Requisitions</CardTitle>
          <CardDescription>
            View and manage material requisitions
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requisitions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            {/* Filter options in responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
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
              <div>
                <Select value={filterSite} onValueChange={setFilterSite}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by site" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sites</SelectItem>
                    {sites?.map((site, index) => (
                      <SelectItem key={index} value={site}>
                        {site}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Responsive table with data */}
          <div className="overflow-auto">
            <div className="rounded-md border min-w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Req No</TableHead>
                    <TableHead className="w-[90px]">Date</TableHead>
                    <TableHead className="hidden sm:table-cell">Site</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Prepared By
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Charge Type
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems?.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-6 text-muted-foreground"
                      >
                        {searchTerm ||
                        filterStatus !== "all" ||
                        filterSite !== "all"
                          ? "No requisitions found matching your search."
                          : "No requisitions created yet."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentItems?.map((req) => {
                      return (
                        <TableRow key={req.id}>
                          <TableCell className="font-medium">
                            {req.requisitionNo}
                          </TableCell>
                          <TableCell>{formatDate(req.requestedAt)}</TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {req.requestingSite?.name || "-"}
                          </TableCell>
                          <TableCell>
                            {getPriorityBadge(req.requestPriority)}
                          </TableCell>
                          <TableCell>{getStatusBadge(req.status)}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {req.preparedBy?.name || "-"}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {req.chargeType || "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {getActionButtons(req)}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>

        {/* Pagination */}
        {filteredRequisitions?.length > 0 && (
          <CardFooter className="flex flex-col sm:flex-row items-center justify-between border-t px-6 py-4">
            <div className="text-sm text-muted-foreground mb-4 sm:mb-0">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, filteredRequisitions.length)} of{" "}
              {filteredRequisitions.length} requisitions
            </div>
            <div className="flex items-center space-x-2">
              <div className="hidden sm:flex items-center space-x-2 mt-4 sm:mt-0">
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="h-8 w-24">
                    <SelectValue placeholder={itemsPerPage} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous page</span>
                </Button>

                <div className="flex items-center gap-1">
                  {/* Simplified responsive pagination - show limited page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((pageNum) => {
                      // Show first page, last page, current page, and pages around current
                      return (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 1 &&
                          pageNum <= currentPage + 1)
                      );
                    })
                    .map((pageNum, index, array) => {
                      // Add ellipsis when pages are skipped
                      const showEllipsisBefore =
                        index > 0 && pageNum > array[index - 1] + 1;
                      const showEllipsisAfter =
                        index < array.length - 1 &&
                        pageNum < array[index + 1] - 1;

                      return (
                        <div key={pageNum} className="flex items-center">
                          {showEllipsisBefore && (
                            <span className="px-2 text-muted-foreground">
                              ...
                            </span>
                          )}

                          <Button
                            variant={
                              currentPage === pageNum ? "default" : "outline"
                            }
                            size="sm"
                            className="w-8 h-8"
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </Button>

                          {showEllipsisAfter && (
                            <span className="px-2 text-muted-foreground">
                              ...
                            </span>
                          )}
                        </div>
                      );
                    })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next page</span>
                </Button>
              </div>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default MaterialRequisitionList;
