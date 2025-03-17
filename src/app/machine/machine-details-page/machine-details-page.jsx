import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, FileText, Info, MapPin, Package, Settings, User } from "lucide-react"

// This would typically come from an API call
const machineryData = {
  status: true,
  message: "Machinery retrieved successfully",
  data: {
    id: 30,
    primaryCategoryId: 21,
    machineCategoryId: 8,
    erpCode: "ERP23",
    registrationNumber: "1672",
    machineNumber: "4263",
    machineCode: "MC025",
    chassisNumber: "9908",
    engineNumber: "9908",
    serialNumber: "9908",
    model: "V03",
    make: "Burgery",
    yom: 2023,
    purchaseDate: "2025-03-17T00:00:00.000Z",
    capacity: "20L",
    ownerName: "Abu Ayaan",
    ownerType: "Company",
    siteId: 14,
    isActive: true,
    machineName: "Light Box",
    fitnessCertificateExpiry: "1971-11-26T00:00:00.000Z",
    motorVehicleTaxDue: "1982-09-15T00:00:00.000Z",
    permitExpiryDate: "2024-12-16T00:00:00.000Z",
    nationalPermitExpiry: "1970-10-08T00:00:00.000Z",
    insuranceExpiry: "1982-04-25T00:00:00.000Z",
    pollutionCertificateExpiry: "1995-10-02T00:00:00.000Z",
    fitnessCertificateFile:
      "https://res.cloudinary.com/dzxk9rpao/image/upload/v1741393734/mani/zzjssqktwysbmapzzyh8.jpg",
    pollutionCertificateFile:
      "https://res.cloudinary.com/dzxk9rpao/image/upload/v1741393734/mani/tl0mdjlpidrtenzvrnwi.jpg",
    insuranceFile: "https://res.cloudinary.com/dzxk9rpao/image/upload/v1741393734/mani/irj2jb4eewmicuerwq0m.jpg",
    permitFile: "https://res.cloudinary.com/dzxk9rpao/image/upload/v1741393734/mani/iabrhni8yuz8zpveeapi.jpg",
    nationalPermitFile: "https://res.cloudinary.com/dzxk9rpao/image/upload/v1741393734/mani/n8khicg9mba1soe5umk3.jpg",
    motorVehicleTaxFile: "https://res.cloudinary.com/dzxk9rpao/image/upload/v1741393734/mani/wpienhr4n2290r44mjfc.jpg",
    machineImageFile: "https://res.cloudinary.com/dzxk9rpao/image/upload/v1741393734/mani/rjtfbkoxkb1wj0sm9bs4.jpg",
    status: "Idle",
    createdAt: "2025-03-08T00:28:55.550Z",
    updatedAt: "2025-03-08T00:28:55.550Z",
    deletedAt: null,
    primaryCategory: {
      id: 21,
      name: "LIGHT TOWER",
      createdAt: "2025-01-30T18:41:14.143Z",
      updatedAt: "2025-01-30T18:41:14.143Z",
    },
    machineCategory: {
      id: 8,
      name: "LIGHT TOWER",
      primaryCategoryId: 21,
      averageBase: "Time",
      standardKmRun: null,
      standardMileage: null,
      standardHrsRun: 200,
      ltrPerHour: null,
      remarks: "Portable lighting",
      useFor: "Construction",
      machineType: "Machine",
      unitPerHour: null,
      isApplicable: null,
      other: null,
      createdAt: "2025-01-30T18:44:14.232Z",
      updatedAt: "2025-01-30T18:44:14.232Z",
    },
    site: {
      id: 14,
      name: "Hazaribagh",
      code: "HZB",
      address: "Main Road",
      departmentId: 1,
      status: "active",
      createdAt: "2025-02-07T01:10:40.091Z",
      updatedAt: "2025-02-07T01:10:40.091Z",
      deletedAt: null,
    },
  },
  timestamp: "2025-03-15T20:25:35.892Z",
}

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return "N/A"
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Helper to check if a certificate is expired
const isExpired = (dateString) => {
  if (!dateString) return false
  const expiryDate = new Date(dateString)
  const today = new Date()
  return expiryDate < today
}

export default function MachineryDetailPage() {
  const { data } = machineryData

  // Certificate data for the documents tab
  const certificates = [
    {
      name: "Fitness Certificate",
      expiry: data.fitnessCertificateExpiry,
      file: data.fitnessCertificateFile,
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Pollution Certificate",
      expiry: data.pollutionCertificateExpiry,
      file: data.pollutionCertificateFile,
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Insurance",
      expiry: data.insuranceExpiry,
      file: data.insuranceFile,
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Permit",
      expiry: data.permitExpiryDate,
      file: data.permitFile,
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "National Permit",
      expiry: data.nationalPermitExpiry,
      file: data.nationalPermitFile,
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Motor Vehicle Tax",
      expiry: data.motorVehicleTaxDue,
      file: data.motorVehicleTaxFile,
      icon: <FileText className="h-5 w-5" />,
    },
  ]

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{data.machineName}</h1>
            <Badge variant={data.status === "Active" ? "success" : "secondary"} className="capitalize">
              {data.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2 mt-2 text-muted-foreground">
            <Package className="h-4 w-4" />
            <span>
              {data.machineCode} • {data.make} {data.model}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Edit
          </Button>
          <Button size="sm">Maintenance Log</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Machine Information</CardTitle>
                    <CardDescription>Basic details about the machine</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Machine ID</p>
                        <p className="font-medium">#{data.id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">ERP Code</p>
                        <p className="font-medium">{data.erpCode}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Registration No.</p>
                        <p className="font-medium">{data.registrationNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Machine No.</p>
                        <p className="font-medium">{data.machineNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Chassis No.</p>
                        <p className="font-medium">{data.chassisNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Engine No.</p>
                        <p className="font-medium">{data.engineNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Serial No.</p>
                        <p className="font-medium">{data.serialNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Capacity</p>
                        <p className="font-medium">{data.capacity}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Year of Manufacture</p>
                        <p className="font-medium">{data.yom}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Purchase Date</p>
                        <p className="font-medium">{formatDate(data.purchaseDate)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle className="text-xl">Ownership</CardTitle>
                      <CardDescription>Ownership information</CardDescription>
                    </div>
                    <User className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Owner Name</p>
                        <p className="text-lg font-semibold">{data.ownerName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Owner Type</p>
                        <p className="font-medium">{data.ownerType}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Status</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={data.isActive ? "success" : "destructive"}>
                            {data.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle className="text-xl">Category</CardTitle>
                      <CardDescription>Machine category information</CardDescription>
                    </div>
                    <Settings className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Primary Category</p>
                        <p className="font-medium">{data.primaryCategory.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Machine Category</p>
                        <p className="font-medium">{data.machineCategory.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Machine Type</p>
                        <p className="font-medium">{data.machineCategory.machineType}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Used For</p>
                        <p className="font-medium">{data.machineCategory.useFor}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle className="text-xl">Performance</CardTitle>
                      <CardDescription>Machine performance metrics</CardDescription>
                    </div>
                    <Info className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Average Base</p>
                        <p className="font-medium">{data.machineCategory.averageBase}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Standard Hours Run</p>
                        <p className="font-medium">{data.machineCategory.standardHrsRun} hours</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Remarks</p>
                        <p className="font-medium">{data.machineCategory.remarks}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Documents & Certificates</CardTitle>
                  <CardDescription>View and manage machine documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {certificates.map((cert, index) => (
                      <div key={index} className="flex items-start p-4 border rounded-lg">
                        <div className="mr-4 mt-1">{cert.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-medium">{cert.name}</h3>
                          <p
                            className={`text-sm ${isExpired(cert.expiry) ? "text-destructive" : "text-muted-foreground"}`}
                          >
                            Expires: {formatDate(cert.expiry)}
                            {isExpired(cert.expiry) && " (Expired)"}
                          </p>
                          <div className="mt-2">
                            <a
                              href={cert.file}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline"
                            >
                              View Document
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="location" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Site Location</CardTitle>
                  <CardDescription>Current location of the machine</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 border rounded-lg">
                      <MapPin className="h-5 w-5 mt-1" />
                      <div>
                        <h3 className="font-medium">
                          {data.site.name} ({data.site.code})
                        </h3>
                        <p className="text-sm text-muted-foreground">{data.site.address}</p>
                        <p className="text-sm text-muted-foreground mt-2">Site ID: #{data.site.id}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Machine Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <img
                  src={data.machineImageFile || "/placeholder.svg"}
                  alt={data.machineName}
                  fill
                  className="object-cover"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
              <CardDescription>Machine history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Created</p>
                    <p className="text-sm text-muted-foreground">{formatDate(data.createdAt)}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Last Updated</p>
                    <p className="text-sm text-muted-foreground">{formatDate(data.updatedAt)}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Purchased</p>
                    <p className="text-sm text-muted-foreground">{formatDate(data.purchaseDate)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

