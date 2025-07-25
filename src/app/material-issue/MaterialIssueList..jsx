"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Eye,
  FileText,
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { format, parseISO } from "date-fns";
import api from "@/services/api/api-service";
import { Spinner } from "@/components/ui/loader";

const MaterialIssueList = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSite, setFilterSite] = useState("all");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await api.get("/material-issues");
        const data = response.data;
        setIssues(data);
      } catch (err) {
        setError(err.message);
        // For development - using mock data when API fails
        // In production, you might want to show an error message instead
        // setIssues([mockIssue]); // Using the sample API data for development
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  // Filter issues based on search term and filters
  const filteredIssues = (issues || []).filter((issue) => {
    // Get from and to site names (if they exist)
    const fromSiteName = issue.items?.[0]?.fromSite?.name || "";
    const toSiteName = issue.items?.[0]?.toSite?.name || "";
    const issueNumber = issue.issueNumber || "";

    // Search term filter
    const matchesSearch =
      issueNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fromSiteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      toSiteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.items?.some((item) =>
        (item.Item?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      false ||
      issue.items?.some((item) =>
        (item.issueTo || "").toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      false;

    // Issue type filter
    const matchesType =
      filterType === "all" ||
      (issue.issueType || "").toLowerCase() === filterType.toLowerCase();

    // Status filter
    const matchesStatus =
      filterStatus === "all" ||
      (issue.status || "").toLowerCase() === filterStatus.toLowerCase();

    // Site filter
    const matchesSite =
      filterSite === "all" ||
      fromSiteName.includes(filterSite) ||
      toSiteName.includes(filterSite);

    return matchesSearch && matchesType && matchesStatus && matchesSite;
  });

  // Pagination logic
  const indexOfLastIssue = currentPage * itemsPerPage;
  const indexOfFirstIssue = indexOfLastIssue - itemsPerPage;
  const currentIssues = filteredIssues.slice(
    indexOfFirstIssue,
    indexOfLastIssue
  );
  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), "dd/MM/yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      case "returned":
        return <Badge variant="secondary">Returned</Badge>;
      default:
        return <Badge variant="secondary">{status || "Unknown"}</Badge>;
    }
  };

  // Get unique sites for filter dropdown
  const uniqueSites = [
    ...new Set(
      (issues || [])
        .flatMap(
          (issue) =>
            issue.items?.map((item) => [
              item.fromSite?.name?.split(",")[0],
              item.toSite?.name?.split(",")[0],
            ]) || []
        )
        .flat()
        .filter(Boolean)
    ),
  ];

  // Get unique issue types for filter dropdown
  const uniqueTypes = [
    ...new Set((issues || []).map((issue) => issue.issueType).filter(Boolean)),
  ];

  // Get unique statuses for filter dropdown
  const uniqueStatuses = [
    ...new Set((issues || []).map((issue) => issue.status).filter(Boolean)),
  ];

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType, filterStatus, filterSite]);

  if (loading) {
    return (
      <Spinner />
    );
  }

  if (error && !issues.length) {
    return (
      <div className="text-red-500">Error loading material issues: {error}</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Material Issues</h1>
        <Button>
          <Link to="/issues/new" className="flex items-center">
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
          {/* Search and Filters */}
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search issues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            {/* Filter options in responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {uniqueTypes.map((type) => (
                      <SelectItem key={type} value={type.toLowerCase()}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {uniqueStatuses.map((status) => (
                      <SelectItem key={status} value={status.toLowerCase()}>
                        {status}
                      </SelectItem>
                    ))}
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
                    {uniqueSites.map((site) => (
                      <SelectItem key={site} value={site}>
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
                    <TableHead className="w-[100px]">Issue No</TableHead>
                    <TableHead className="w-[100px]">Date</TableHead>
                    <TableHead className="hidden md:table-cell">Type</TableHead>
                    <TableHead className="hidden sm:table-cell">From</TableHead>
                    <TableHead className="hidden sm:table-cell">To</TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Items
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentIssues.length === 0 ? (
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
                    currentIssues.map((issue) => {
                      const fromSite =
                        issue.items?.[0]?.fromSite?.name?.split(",")[0] ||
                        "N/A";
                      const toSite =
                        issue.items?.[0]?.toSite?.name?.split(",")[0] || "N/A";

                      return (
                        <TableRow key={issue.id}>
                          <TableCell className="font-medium">
                            {issue.issueNumber}
                          </TableCell>
                          <TableCell>{formatDate(issue.issueDate)}</TableCell>
                          <TableCell className="capitalize hidden md:table-cell">
                            {issue.issueType}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {fromSite}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {toSite}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {issue.items?.length || 0}
                          </TableCell>
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
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>

        {/* Pagination */}
        {filteredIssues.length > 0 && (
          <CardFooter className="flex flex-col sm:flex-row items-center justify-between border-t px-6 py-4">
            <div className="text-sm text-muted-foreground mb-4 sm:mb-0">
              Showing {indexOfFirstIssue + 1} to{" "}
              {Math.min(indexOfLastIssue, filteredIssues.length)} of{" "}
              {filteredIssues.length} issues
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
                    <SelectItem value="5">5 </SelectItem>
                    <SelectItem value="10">10 </SelectItem>
                    <SelectItem value="20">20 </SelectItem>
                    <SelectItem value="50">50 </SelectItem>
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

export default MaterialIssueList;
