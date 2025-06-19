"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, CheckCircle, ShoppingCart, Truck, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSelector } from "react-redux"

const MaterialRequisitionReview = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [requisition, setRequisition] = useState(null)
  const [itemGroups, setItemGroups] = useState([])
  const [items, setItems] = useState([])
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviewNotes, setReviewNotes] = useState("")
  const [sites, setSites] = useState(["Site A", "Site B", "Site C"]) // Mock sites
  const [forwardToSite, setForwardToSite] = useState("")
  const [activeTab, setActiveTab] = useState("approved")
  const storedItemGroups = useSelector((state) => state.itemGroups) || [];
  const storedItems = useSelector((state) => state.items) || [];
  const storedUnits = useSelector((state) => state.units) || [];

  useEffect(() => {
    // Load data from localStorage
    const requisitions = [
        {
          id: 4,
          requisitionNo: "REQ-1001",
          date: "2025-04-20",
          location: "Site A",
          requestedFor: {
            type: "machine",
            value: "Excavator #3",
          },
          priority: "high",
          preparedBy: "John Doe",
          status: "approved",
          items: [
            {
              itemId: "item-001",
              unitId: "unit-001",
              quantity: 5,
            },
            {
              itemId: "item-002",
              unitId: "unit-002",
              quantity: 12,
            },
          ],
        },
      ];

    const foundRequisition = requisitions.find((req) => req.id == id)

    if (foundRequisition) {
      setRequisition(foundRequisition)
      setItemGroups(storedItemGroups.data)
      setItems(storedItems.data)
      setUnits(storedUnits.data)

      // Filter out sites that have already been involved
      setSites((prevSites) =>
        prevSites.filter(
          (site) => site !== foundRequisition.requestingSite && site !== foundRequisition.forwardedToSite,
        ),
      )
    } else {
      toast({
        title: "Requisition Not Found",
        description: "The requisition you're looking for doesn't exist.",
        variant: "destructive",
      })
      navigate("/requisitions")
    }

    setLoading(false)
  }, [id, navigate, toast])

  const getItemGroupName = (id) => {
    const group = itemGroups.find((g) => g.id === id)
    return group ? group.name : "Unknown Group"
  }

  const getItemName = (id) => {
    const item = items.find((i) => i.id === id)
    return item ? item.name : "Unknown Item"
  }

  const getUnitName = (id) => {
    const unit = units.find((u) => u.id === id)
    return unit ? unit.shortName || unit.name : ""
  }

  // Filter items based on approval status
  const approvedItems = requisition?.items.filter((item) => item.response?.canFulfill) || []
  const pendingItems = requisition?.items.filter((item) => !item.response?.canFulfill) || []

  const handleApprovePartial = () => {
    // Update requisition status to approved with partial fulfillment
    updateRequisitionStatus("approved", "partial_fulfillment")
  }

  const handlePurchaseRemaining = () => {
    // Mark remaining items for purchase (outside the app)
    updateRequisitionStatus("approved", "purchase_remaining")
  }

  const handleForwardRemaining = () => {
    if (!forwardToSite) {
      toast({
        title: "Validation Error",
        description: "Please select a site to forward the remaining items to.",
        variant: "destructive",
      })
      return
    }

    // Forward remaining items to another site
    updateRequisitionStatus("partially_forwarded", "forward_remaining", forwardToSite)
  }

  const updateRequisitionStatus = (status, action, forwardSite = null) => {
    // Update requisition status
    const requisitions = JSON.parse(localStorage.getItem("requisitions")) || []
    const updatedRequisitions = requisitions.map((req) => {
      if (req.id === id) {
        return {
          ...req,
          status,
          reviewAction: action,
          reviewNotes,
          reviewedBy: "Admin", // In a real app, this would be the current user
          reviewDate: new Date().toISOString(),
          secondForwardToSite: forwardSite,
        }
      }
      return req
    })

    localStorage.setItem("requisitions", JSON.stringify(updatedRequisitions))

    let actionMessage = ""
    switch (action) {
      case "partial_fulfillment":
        actionMessage = "The partial fulfillment has been approved."
        break
      case "purchase_remaining":
        actionMessage = "The remaining items will be purchased."
        break
      case "forward_remaining":
        actionMessage = `The remaining items have been forwarded to ${forwardSite}.`
        break
      default:
        actionMessage = "The requisition has been updated."
    }

    toast({
      title: "Review Complete",
      description: actionMessage,
    })

    navigate("/requisitions")
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  if (!requisition) {
    return <div className="flex justify-center items-center h-64">Requisition not found</div>
  }

  // Don't allow review if not partially approved
  const canReview = requisition.status === "partially_approved"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate("/requisitions")}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Review Partial Approval</h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" /> Partially Approved
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Requisition Details</CardTitle>
          <CardDescription>Review the requisition details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Requisition No</p>
              <p className="font-medium">{requisition.requisitionNo}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">{format(new Date(requisition.date), "PPP")}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Requesting Site</p>
              <p className="font-medium">{requisition.requestingSite}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Forwarded To</p>
              <p className="font-medium">{requisition.forwardedToSite}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Priority</p>
              <p className="font-medium capitalize">{requisition.priority}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Response Notes</p>
              <p className="font-medium">{requisition.responseNotes || "No notes provided"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="approved">Approved Items ({approvedItems.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending Items ({pendingItems.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="approved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approved Items</CardTitle>
              <CardDescription>Items that can be fulfilled by {requisition.forwardedToSite}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Part No</TableHead>
                      <TableHead>Requested Qty</TableHead>
                      <TableHead>Approved Qty</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvedItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          No items were approved.
                        </TableCell>
                      </TableRow>
                    ) : (
                      approvedItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{getItemName(item.itemId)}</TableCell>
                          <TableCell>{item.partNo || "-"}</TableCell>
                          <TableCell>
                            {item.quantity} {getUnitName(item.unitId)}
                          </TableCell>
                          <TableCell>
                            {item.response.quantity} {getUnitName(item.unitId)}
                          </TableCell>
                          <TableCell>{item.response.notes || "-"}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Items</CardTitle>
              <CardDescription>Items that cannot be fulfilled by {requisition.forwardedToSite}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Part No</TableHead>
                      <TableHead>Requested Qty</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                          All items were approved.
                        </TableCell>
                      </TableRow>
                    ) : (
                      pendingItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{getItemName(item.itemId)}</TableCell>
                          <TableCell>{item.partNo || "-"}</TableCell>
                          <TableCell>
                            {item.quantity} {getUnitName(item.unitId)}
                          </TableCell>
                          <TableCell>{item.response?.notes || "-"}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Review Decision</CardTitle>
          <CardDescription>Decide how to handle this partial approval</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reviewNotes">Notes</Label>
              <Textarea
                id="reviewNotes"
                placeholder="Add any notes or comments regarding your decision"
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                disabled={!canReview}
                rows={4}
              />
            </div>

            {pendingItems.length > 0 && (
              <div className="space-y-2 pt-4 border-t">
                <Label>For Remaining Items</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="forwardToSite">Forward To Another Site</Label>
                    <div className="flex items-center gap-2">
                      <Select value={forwardToSite} onValueChange={setForwardToSite} disabled={!canReview}>
                        <SelectTrigger id="forwardToSite">
                          <SelectValue placeholder="Select site to forward to" />
                        </SelectTrigger>
                        <SelectContent>
                          {sites.map((site, index) => (
                            <SelectItem key={index} value={site}>
                              {site}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={handleForwardRemaining}
                        disabled={!canReview || !forwardToSite}
                        className="whitespace-nowrap"
                      >
                        <Truck className="mr-2 h-4 w-4" />
                        Forward Remaining
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/requisitions")}>
            Cancel
          </Button>
          <div className="flex gap-2">
            {pendingItems.length > 0 && (
              <Button variant="outline" onClick={handlePurchaseRemaining} disabled={!canReview}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Purchase Remaining
              </Button>
            )}
            <Button variant="default" onClick={handleApprovePartial} disabled={!canReview}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve Partial Fulfillment
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default MaterialRequisitionReview
