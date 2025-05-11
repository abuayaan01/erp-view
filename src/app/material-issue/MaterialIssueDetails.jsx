"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import {
  ArrowLeft,
  Printer,
  CheckCircle,
  Clock,
  RotateCcw,
} from "lucide-react";
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
import { format, parseISO } from "date-fns";
import { PDFViewer } from "@react-pdf/renderer";
import MaterialIssuePDF from "./MaterialIssuePDF";
import api from "@/services/api/api-service";

const MaterialIssueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPdf, setShowPdf] = useState(false);

  const shouldPrint =
    new URLSearchParams(location.search).get("print") === "true";

  useEffect(() => {
    const fetchIssueDetails = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await api.get(`/material-issues/${id}`);

        const data = response.data;
        setIssue(data);

        // If print parameter is present, show PDF
        if (shouldPrint) {
          setShowPdf(true);
        }
      } catch (err) {
        setError(err.message);

        // For development - using mock data when API fails
        // In production, you might want to show an error message instead
        if (mockIssue.id === parseInt(id)) {
          setIssue(mockIssue);

          if (shouldPrint) {
            setShowPdf(true);
          }
        } else {
          // If issue not found, navigate back to list
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchIssueDetails();
  }, [id, navigate, shouldPrint]);

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

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), "dd/MM/yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const formatTime = (dateString) => {
    try {
      return format(parseISO(dateString), "HH:mm");
    } catch (error) {
      return "";
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
          >
            <CheckCircle className="h-3 w-3" /> Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1"
          >
            <Clock className="h-3 w-3" /> Pending
          </Badge>
        );
      case "returned":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1"
          >
            <RotateCcw className="h-3 w-3" /> Returned
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status || "Unknown"}</Badge>;
    }
  };

  const handlePrint = () => {
    setShowPdf(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  if (error && !issue) {
    return (
      <div className="text-red-500">Error loading issue details: {error}</div>
    );
  }

  if (!issue) {
    return (
      <div className="flex justify-center items-center h-64">
        Issue not found
      </div>
    );
  }

  // Get from and to site data
  const fromSite = issue.items?.[0]?.fromSite || {};
  const toSite = issue.items?.[0]?.toSite || {};

  // Format data for PDF
  const pdfData = {
    issueNo: issue.issueNumber,
    issueDate: issue.issueDate,
    issueTime: formatTime(issue.issueDate),
    issueLocation: fromSite.name,
    fromSite: fromSite.name,
    toSite: toSite.name,
    status: issue.status,
  };

  return (
    <div className="space-y-6">
      {!showPdf ? (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
              <h1 className="text-3xl font-bold tracking-tight">
                Material Issue: {issue.issueNumber}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(issue.status)}
              <Button onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" /> Print
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Issue Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Issue No</p>
                    <p className="font-medium">{issue.issueNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date & Time</p>
                    <p className="font-medium">
                      {formatDate(issue.issueDate)}{" "}
                      {formatTime(issue.issueDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Issue Type</p>
                    <p className="font-medium capitalize">{issue.issueType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className="font-medium">
                      {getStatusBadge(issue.status)}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Created At</p>
                    <p className="font-medium">{formatDate(issue.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Updated At</p>
                    <p className="font-medium">{formatDate(issue.updatedAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>From / To Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">From Site</p>
                    <p className="font-medium">{fromSite.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      From Site Code
                    </p>
                    <p className="font-medium">{fromSite.code}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">To Site</p>
                    <p className="font-medium">{toSite.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      To Site Code
                    </p>
                    <p className="font-medium">{toSite.code}</p>
                  </div>

                  {issue.items?.[0]?.issueTo
                    ?.toLowerCase()
                    ?.includes("vehicle") && (
                    <div>
                      <p className="text-sm text-muted-foreground">Vehicle</p>
                      <p className="font-medium">{issue.items[0].issueTo}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

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
                      <TableHead>Item</TableHead>
                      <TableHead>Part No.</TableHead>
                      <TableHead>HSN Code</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Issue To</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {issue.items.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">
                          {item.Item?.name || "N/A"}
                        </TableCell>
                        <TableCell>{item.Item?.partNumber || "N/A"}</TableCell>
                        <TableCell>{item.Item?.hsnCode || "N/A"}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell className="capitalize">
                          {item.issueTo || "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline">
              <Link to="/">Back to List</Link>
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-col h-screen">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Material Issue PDF Preview</h1>
            <Button variant="outline" onClick={() => setShowPdf(false)}>
              Back to Details
            </Button>
          </div>
          <div className="flex-1 border rounded">
            <PDFViewer width="100%" height="100%" className="border">
              <MaterialIssuePDF formData={pdfData} items={issue.items} />
            </PDFViewer>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialIssueDetails;
