"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Printer, Save, Plus, Trash2 } from "lucide-react"
import MaterialIssuePDF from "./MaterialIssuePDF"
import { PDFViewer } from "@react-pdf/renderer"

// Mock data
const mockItemGroups = [
  { id: "1", name: "Lubricants" },
  { id: "2", name: "Spare Parts" },
  { id: "3", name: "Consumables" },
  { id: "4", name: "Fuels" },
]

const mockItems = [
  { id: "1", groupId: "1", name: "Engine Oil", unit: "LTR", balance: 500 },
  { id: "2", groupId: "1", name: "Gear Oil", unit: "LTR", balance: 300 },
  { id: "3", groupId: "2", name: "Air Filter", unit: "PCS", balance: 50 },
  { id: "4", groupId: "2", name: "Oil Filter", unit: "PCS", balance: 75 },
  { id: "5", groupId: "3", name: "Grease", unit: "KG", balance: 200 },
  { id: "6", groupId: "4", name: "Diesel", unit: "LTR", balance: 1000 },
  { id: "7", groupId: "4", name: "Petrol", unit: "LTR", balance: 800 },
]

const mockVehicles = [
  { id: "1", number: "JH01AB1234", type: "Truck" },
  { id: "2", number: "JH02CD5678", type: "Excavator" },
  { id: "3", number: "JH03EF9012", type: "Loader" },
]

const mockSites = [
  { id: "1", name: "MARKONA CANAL", code: "MARKONA-036" },
  { id: "2", name: "TATA OFFICE", code: "TATA-JAM" },
  { id: "3", name: "JAMSHEDPUR SITE", code: "JSR-SITE" },
]

const MaterialIssueForm = () => {
  const [issueType, setIssueType] = useState("consumption")
  const [selectedItemGroup, setSelectedItemGroup] = useState("")
  const [selectedItem, setSelectedItem] = useState("")
  const [quantity, setQuantity] = useState("")
  const [issueTo, setIssueTo] = useState("vehicle")
  const [selectedVehicle, setSelectedVehicle] = useState("")
  const [selectedSite, setSelectedSite] = useState("")
  const [vehicleKm, setVehicleKm] = useState("")
  const [vehicleHours, setVehicleHours] = useState("")
  const [issueItems, setIssueItems] = useState([])
  const [showPdf, setShowPdf] = useState(false)
  const [formData, setFormData] = useState({
    issueNo: `ISS-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`,
    issueDate: format(new Date(), "yyyy-MM-dd"),
    issueTime: format(new Date(), "HH:mm"),
    issueLocation: "MARKONA CANAL SITE",
    fromSite: "MARKONA CANAL",
    toSite: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleAddItem = () => {
    if (!selectedItem || !quantity || Number.parseFloat(quantity) <= 0) {
      alert("Please select an item and enter a valid quantity")
      return
    }

    const item = mockItems.find((i) => i.id === selectedItem)
    const itemGroup = mockItemGroups.find((g) => g.id === selectedItemGroup)

    if (!item) return

    // Check if quantity exceeds balance
    if (Number.parseFloat(quantity) > item.balance) {
      alert(`Quantity exceeds available balance of ${item.balance} ${item.unit}`)
      return
    }

    const newItem = {
      id: Date.now().toString(),
      itemId: selectedItem,
      itemName: item.name,
      itemGroup: itemGroup?.name || "",
      quantity: Number.parseFloat(quantity),
      unit: item.unit,
      balance: item.balance,
      issueTo: issueTo,
      vehicleId: selectedVehicle,
      vehicleNumber: mockVehicles.find((v) => v.id === selectedVehicle)?.number || "",
      vehicleKm: vehicleKm,
      vehicleHours: vehicleHours,
      siteId: selectedSite,
      siteName: mockSites.find((s) => s.id === selectedSite)?.name || "",
    }

    setIssueItems([...issueItems, newItem])

    // Reset form fields
    setSelectedItem("")
    setQuantity("")
    setVehicleKm("")
    setVehicleHours("")
  }

  const handleRemoveItem = (id) => {
    setIssueItems(issueItems.filter((item) => item.id !== id))
  }

  const handleSave = () => {
    if (issueItems.length === 0) {
      alert("Please add at least one item")
      return
    }

    // In a real application, you would save to a database here
    alert("Material issue saved successfully!")
  }

  const handlePrint = () => {
    if (issueItems.length === 0) {
      alert("Please add at least one item")
      return
    }

    setShowPdf(true)
  }

  const filteredItems = selectedItemGroup ? mockItems.filter((item) => item.groupId === selectedItemGroup) : []

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      {!showPdf ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Material Issue</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" /> Save
              </Button>
              <Button onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" /> Print
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Material Issue Details</CardTitle>
              <CardDescription>Enter the details for material issue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="issueNo">Material Issue No</Label>
                  <Input id="issueNo" name="issueNo" value={formData.issueNo} onChange={handleInputChange} readOnly />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issueDate">Issue Date</Label>
                  <Input
                    id="issueDate"
                    name="issueDate"
                    type="date"
                    value={formData.issueDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issueTime">Time</Label>
                  <Input
                    id="issueTime"
                    name="issueTime"
                    type="time"
                    value={formData.issueTime}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Issue Type</Label>
                <RadioGroup value={issueType} onValueChange={setIssueType} className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="consumption" id="consumption" />
                    <Label htmlFor="consumption">Consumption/Site</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="transfer" id="transfer" />
                    <Label htmlFor="transfer">Transfer</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="issueLocation">Issue Location</Label>
                <Input
                  id="issueLocation"
                  name="issueLocation"
                  value={formData.issueLocation}
                  onChange={handleInputChange}
                  placeholder="Enter issue location"
                />
              </div>

              {issueType === "transfer" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fromSite">From Site</Label>
                    <Select
                      value={formData.fromSite}
                      onValueChange={(value) => setFormData({ ...formData, fromSite: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select from site" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockSites.map((site) => (
                          <SelectItem key={site.id} value={site.name}>
                            {site.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="toSite">To Site</Label>
                    <Select
                      value={formData.toSite}
                      onValueChange={(value) => setFormData({ ...formData, toSite: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select to site" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockSites.map((site) => (
                          <SelectItem key={site.id} value={site.name}>
                            {site.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="border p-4 rounded-md space-y-4">
                <h3 className="font-medium">Add Items</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="itemGroup">Item Group *</Label>
                    <Select value={selectedItemGroup} onValueChange={setSelectedItemGroup}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select item group" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockItemGroups.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="item">Item *</Label>
                    <Select value={selectedItem} onValueChange={setSelectedItem} disabled={!selectedItemGroup}>
                      <SelectTrigger>
                        <SelectValue placeholder={selectedItemGroup ? "Select item" : "Select item group first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredItems.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity *</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="quantity"
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="Enter quantity"
                      />
                      <div className="w-16 text-sm">
                        {selectedItem && mockItems.find((i) => i.id === selectedItem)?.unit}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Balance Quantity</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      value={selectedItem ? mockItems.find((i) => i.id === selectedItem)?.balance || "" : ""}
                      readOnly
                      disabled
                    />
                    <div className="w-16 text-sm">
                      {selectedItem && mockItems.find((i) => i.id === selectedItem)?.unit}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Issue To</Label>
                  <RadioGroup value={issueTo} onValueChange={setIssueTo} className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="vehicle" id="vehicle" />
                      <Label htmlFor="vehicle">Vehicle</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="site" id="site" />
                      <Label htmlFor="site">Other Site</Label>
                    </div>
                  </RadioGroup>
                </div>

                {issueTo === "vehicle" ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vehicle">Vehicle No *</Label>
                      <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select vehicle" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockVehicles.map((vehicle) => (
                            <SelectItem key={vehicle.id} value={vehicle.id}>
                              {vehicle.number}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="km">KM</Label>
                      <Input
                        id="km"
                        type="number"
                        value={vehicleKm}
                        onChange={(e) => setVehicleKm(e.target.value)}
                        placeholder="Enter KM reading"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hours">Hours Meter</Label>
                      <Input
                        id="hours"
                        type="number"
                        value={vehicleHours}
                        onChange={(e) => setVehicleHours(e.target.value)}
                        placeholder="Enter hours meter reading"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="site">Site Name *</Label>
                    <Select value={selectedSite} onValueChange={setSelectedSite}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select site" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockSites.map((site) => (
                          <SelectItem key={site.id} value={site.id}>
                            {site.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button onClick={handleAddItem} disabled={!selectedItem || !quantity}>
                    <Plus className="mr-2 h-4 w-4" /> Add Item
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sr. No</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Issue To</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {issueItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          No items added yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      issueItems.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{item.itemName}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell>{item.issueTo === "vehicle" ? "Vehicle" : "Site"}</TableCell>
                          <TableCell>
                            {item.issueTo === "vehicle"
                              ? `${item.vehicleNumber} (KM: ${item.vehicleKm || "N/A"}, Hours: ${
                                  item.vehicleHours || "N/A"
                                })`
                              : item.siteName}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => window.location.reload()}>
                Reset
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" /> Save
                </Button>
                <Button onClick={handlePrint}>
                  <Printer className="mr-2 h-4 w-4" /> Print
                </Button>
              </div>
            </CardFooter>
          </Card>
        </>
      ) : (
        <div className="flex flex-col h-screen">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Material Issue PDF Preview</h1>
            <Button variant="outline" onClick={() => setShowPdf(false)}>
              Back to Form
            </Button>
          </div>
          <div className="flex-1 border rounded">
            <PDFViewer width="100%" height="100%" className="border">
              <MaterialIssuePDF formData={formData} items={issueItems} />
            </PDFViewer>
          </div>
        </div>
      )}
    </div>
  )
}

export default MaterialIssueForm
