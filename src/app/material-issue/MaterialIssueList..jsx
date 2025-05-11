"use client";

import { useState, useEffect } from "react";
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
import { format, parseISO } from "date-fns";
import api from "@/services/api/api-service";

const MaterialIssueList = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSite, setFilterSite] = useState("all");

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
        setIssues([mockIssue]); // Using the sample API data for development
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sample API data for development/testing
  const mockIssue = {
    id: 29,
    issueNumber: "ISS-029",
    issueDate: "2025-05-10T07:22:40.968Z",
    issueType: "Site Transfer",
    status: "Returned",
    createdAt: "2025-05-10T07:22:40.969Z",
    updatedAt: "2025-05-10T07:22:41.203Z",
    items: [
      {
        id: 60,
        materialIssueId: 29,
        itemId: 1,
        quantity: 1,
        issueTo: "Vehicle A",
        siteId: 35,
        otherSiteId: 33,
        Item: {
          id: 1,
          name: "Cable Roll",
          shortName: "Cable",
          partNumber: "CR-001",
          hsnCode: "8544",
          itemGroupId: 1,
          unitId: 1,
          itemGroup: null,
        },
        fromSite: {
          id: 35,
          name: "EMRS Phase 2, Bansjor, Simdega, Jharkhand Project Site",
          code: "SITE-035",
          address: "EMRS Phase 2, Bansjor, Simdega, Jharkhand Project Site",
          pincode: "835201",
          mobileNumber: "9471185488",
          departmentId: 1,
          status: "active",
          createdAt: "2025-05-09T06:15:54.139Z",
          updatedAt: "2025-05-09T06:15:54.185Z",
          deletedAt: null,
        },
        toSite: {
          id: 33,
          name: "Logistic Park, Nirsha, Dhanbad, Jharkhand Project Site",
          code: "SITE-033",
          address: "Logistic Park, Nirsha, Dhanbad, Jharkhand Project Site",
          pincode: "828205",
          mobileNumber: "7739039393",
          departmentId: 1,
          status: "active",
          createdAt: "2025-05-09T06:09:25.974Z",
          updatedAt: "2025-05-09T06:09:26.032Z",
          deletedAt: null,
        },
      },
      {
        id: 59,
        materialIssueId: 29,
        itemId: 2,
        quantity: 5,
        issueTo: "Vehicle A",
        siteId: 35,
        otherSiteId: 33,
        Item: {
          id: 2,
          name: "Switch",
          shortName: "Switch",
          partNumber: "SW-001",
          hsnCode: "8536",
          itemGroupId: 1,
          unitId: 2,
          itemGroup: null,
        },
        fromSite: {
          id: 35,
          name: "EMRS Phase 2, Bansjor, Simdega, Jharkhand Project Site",
          code: "SITE-035",
          address: "EMRS Phase 2, Bansjor, Simdega, Jharkhand Project Site",
          pincode: "835201",
          mobileNumber: "9471185488",
          departmentId: 1,
          status: "active",
          createdAt: "2025-05-09T06:15:54.139Z",
          updatedAt: "2025-05-09T06:15:54.185Z",
          deletedAt: null,
        },
        toSite: {
          id: 33,
          name: "Logistic Park, Nirsha, Dhanbad, Jharkhand Project Site",
          code: "SITE-033",
          address: "Logistic Park, Nirsha, Dhanbad, Jharkhand Project Site",
          pincode: "828205",
          mobileNumber: "7739039393",
          departmentId: 1,
          status: "active",
          createdAt: "2025-05-09T06:09:25.974Z",
          updatedAt: "2025-05-09T06:09:26.032Z",
          deletedAt: null,
        },
      },
    ],
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading material issues...
      </div>
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
                    {uniqueTypes.map((type) => (
                      <SelectItem key={type} value={type.toLowerCase()}>
                        {type}
                      </SelectItem>
                    ))}
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
                    {uniqueStatuses.map((status) => (
                      <SelectItem key={status} value={status.toLowerCase()}>
                        {status}
                      </SelectItem>
                    ))}
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
                  filteredIssues.map((issue) => {
                    const fromSite =
                      issue.items?.[0]?.fromSite?.name?.split(",")[0] || "N/A";
                    const toSite =
                      issue.items?.[0]?.toSite?.name?.split(",")[0] || "N/A";

                    return (
                      <TableRow key={issue.id}>
                        <TableCell className="font-medium">
                          {issue.issueNumber}
                        </TableCell>
                        <TableCell>{formatDate(issue.issueDate)}</TableCell>
                        <TableCell className="capitalize">
                          {issue.issueType}
                        </TableCell>
                        <TableCell>{fromSite}</TableCell>
                        <TableCell>{toSite}</TableCell>
                        <TableCell>{issue.items?.length || 0}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default MaterialIssueList;
