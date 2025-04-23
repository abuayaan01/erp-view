"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation, Link } from "react-router-dom"
import { ArrowLeft, Printer, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { PDFViewer } from "@react-pdf/renderer"
import MaterialIssuePDF from "./MaterialIssuePDF"

// Mock data for material issues (same as in MaterialIssueList.jsx)
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
]

const MaterialIssueDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [issue, setIssue] = useState(null)
  const [showPdf, setShowPdf] = useState(false)

  const shouldPrint = new URLSearchParams(location.search).get("print") === "true"

  useEffect(() => {
    // Find the issue with the matching ID
    const foundIssue = mockIssues.find((issue) => issue.id === id)

    if (foundIssue) {
      setIssue(foundIssue)

      // If print parameter is present, show PDF
      if (shouldPrint) {
        setShowPdf(true)
      }
    } else {
      // If issue not found, navigate back to list
      navigate("/")
    }
  }, [id, navigate, shouldPrint])

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy")
    } catch (error) {
      return dateString
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
            <Clock className="h-3 w-3" /> Pending
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handlePrint = () => {
    setShowPdf(true)
  }

  if (!issue) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  // Format data for PDF
  const pdfData = {
    issueNo: issue.id,
    issueDate: issue.issueDate,
    issueTime: issue.issueTime,
    issueLocation: issue.issueLocation,
    fromSite: issue.fromSite,
    toSite: issue.toSite,
  }

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
              <h1 className="text-3xl font-bold tracking-tight">Material Issue: {issue.id}</h1>
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
                    <p className="font-medium">{issue.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date & Time</p>
                    <p className="font-medium">
                      {formatDate(issue.issueDate)} {issue.issueTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Issue Type</p>
                    <p className="font-medium capitalize">{issue.issueType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className="font-medium">{getStatusBadge(issue.status)}</div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Issue Location</p>
                    <p className="font-medium">{issue.issueLocation}</p>
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
                    <p className="font-medium">{issue.fromSite}</p>
                  </div>

                  {issue.issueType === "transfer" ? (
                    <div>
                      <p className="text-sm text-muted-foreground">To Site</p>
                      <p className="font-medium">{issue.toSite}</p>
                    </div>
                  ) : (
                    issue.items[0].issueTo === "vehicle" && (
                      <div>
                        <p className="text-sm text-muted-foreground">Vehicle</p>
                        <p className="font-medium">{issue.items[0].vehicleNumber}</p>
                      </div>
                    )
                  )}

                  {issue.items[0].issueTo === "vehicle" && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">KM Reading</p>
                        <p className="font-medium">{issue.items[0].vehicleKm || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Hours Meter</p>
                        <p className="font-medium">{issue.items[0].vehicleHours || "N/A"}</p>
                      </div>
                    </>
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
                      <TableHead>Item Group</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Issue To</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {issue.items.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{item.itemName}</TableCell>
                        <TableCell>{item.itemGroup}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell className="capitalize">{item.issueTo}</TableCell>
                        <TableCell>
                          {item.issueTo === "vehicle"
                            ? `${item.vehicleNumber} (KM: ${item.vehicleKm || "N/A"}, Hours: ${
                                item.vehicleHours || "N/A"
                              })`
                            : item.siteName}
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
  )
}

export default MaterialIssueDetails
