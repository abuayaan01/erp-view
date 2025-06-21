import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Loader from "@/components/ui/loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/services/api/api-service";
import {
  Calendar,
  FileText,
  Info,
  MapPin,
  Package,
  Settings,
  User,
} from "lucide-react";
import PlacehoolderImage from "@/assets/images/placeholder-image.webp";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import MaintenanceLogModal from "@/app/maintanance-log/MaintenanceLogModal";
// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Helper to check if a certificate is expired
const isExpired = (dateString) => {
  if (!dateString) return false;
  const expiryDate = new Date(dateString);
  const today = new Date();
  return expiryDate < today;
};

const isExpiringSoon = (dateString, days = 30) => {
  if (!dateString) return false;

  const expiryDate = new Date(dateString);
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);

  return expiryDate >= today && expiryDate <= futureDate;
};

export default function MachineryDetailPage() {
  // const { data } = machineryData

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const params = useParams();
  const navigate = useNavigate();
  // const { data } = siteData

  useEffect(() => {
    fetchMachineDetails(params.id);
  }, [params]);

  const fetchMachineDetails = async (mid) => {
    try {
      setLoading(true);
      const res = await api.get(`/machinery/${mid}`);
      setData(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Certificate data for the documents tab
  const certificates = [
    {
      name: "Fitness Certificate",
      expiry: data?.fitnessCertificateExpiry,
      file: data?.fitnessCertificateFile,
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Pollution Certificate",
      expiry: data?.pollutionCertificateExpiry,
      file: data?.pollutionCertificateFile,
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Insurance",
      expiry: data?.insuranceExpiry,
      file: data?.insuranceFile,
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Permit",
      expiry: data?.permitExpiryDate,
      file: data?.permitFile,
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "National Permit",
      expiry: data?.nationalPermitExpiry,
      file: data?.nationalPermitFile,
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Motor Vehicle Tax",
      expiry: data?.motorVehicleTaxDue,
      file: data?.motorVehicleTaxFile,
      icon: <FileText className="h-5 w-5" />,
    },
  ];

  return (
    <div className="container mx-auto py-2 min-h-screen flex flex-col">
      {loading ? (
        <div className="flex-1 flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <div className="container mx-auto py-2 px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">
                  {data.machineName}
                </h1>
                <Badge
                  variant={data.status === "Active" ? "success" : "secondary"}
                  className="capitalize"
                >
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
              {/* <Button variant="outline" size="sm">
                Edit
              </Button> */}
              <Button
                size="sm"
                onClick={() => {
                  navigate(`/machine/${data.id}/logs`, {
                    state: { machineName: data?.machineName },
                  });
                }}
              >
                Maintainance Log
              </Button>
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
                        <CardTitle className="text-xl">
                          Machine Information
                        </CardTitle>
                        <CardDescription>
                          Basic details about the machine
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Machine ID
                            </p>
                            <p className="font-medium">#{data.id}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              ERP Code
                            </p>
                            <p className="font-medium">{data.erpCode}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Registration No.
                            </p>
                            <p className="font-medium">
                              {data.registrationNumber}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Machine No.
                            </p>
                            <p className="font-medium">{data.machineNumber}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Chassis No.
                            </p>
                            <p className="font-medium">{data.chassisNumber}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Engine No.
                            </p>
                            <p className="font-medium">{data.engineNumber}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Serial No.
                            </p>
                            <p className="font-medium">{data.serialNumber}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Capacity
                            </p>
                            <p className="font-medium">{data.capacity}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Year of Manufacture
                            </p>
                            <p className="font-medium">{data.yom}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Purchase Date
                            </p>
                            <p className="font-medium">
                              {formatDate(data.purchaseDate)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div>
                          <CardTitle className="text-xl">Ownership</CardTitle>
                          <CardDescription>
                            Ownership information
                          </CardDescription>
                        </div>
                        <User className="h-5 w-5 text-muted-foreground" />
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Owner Name
                            </p>
                            <p className="font-semibold">{data.ownerName}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Owner Type
                            </p>
                            <p className="font-medium">{data.ownerType}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Status
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                variant={
                                  data.isActive ? "success" : "destructive"
                                }
                              >
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
                          <CardDescription>
                            Machine category information
                          </CardDescription>
                        </div>
                        <Settings className="h-5 w-5 text-muted-foreground" />
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Primary Category
                            </p>
                            <p className="font-medium">
                              {data.primaryCategory.name}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Machine Category
                            </p>
                            <p className="font-medium">
                              {data.machineCategory.name}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Machine Type
                            </p>
                            <p className="font-medium">
                              {data.machineCategory.machineType}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Used For
                            </p>
                            <p className="font-medium">
                              {data.machineCategory.useFor || "NA"}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div>
                          <CardTitle className="text-xl">Performance</CardTitle>
                          <CardDescription>
                            Machine performance metrics
                          </CardDescription>
                        </div>
                        <Info className="h-5 w-5 text-muted-foreground" />
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Average Base
                            </p>
                            <p className="font-medium">
                              {data.machineCategory.averageBase}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Standard Hours Run
                            </p>
                            <p className="font-medium">
                              {data.machineCategory.standardHrsRun} hours
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Remarks
                            </p>
                            <p className="font-medium">
                              {data.machineCategory.remarks || "NA"}
                            </p>
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
                      <CardDescription>
                        View and manage machine documents
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {certificates.map((cert, index) => (
                          <div
                            key={index}
                            className="flex items-start p-4 border rounded-lg"
                          >
                            <div className="mr-4 mt-1">{cert.icon}</div>
                            <div className="flex-1">
                              <h3 className="font-medium">{cert.name}</h3>
                              <p
                                className={`text-sm ${
                                  isExpired(cert.expiry)
                                    ? "text-destructive"
                                    : isExpiringSoon(cert.expiry)
                                    ? "text-yellow-400"
                                    : "text-green-400"
                                }`}
                              >
                                Expires: {formatDate(cert.expiry)}
                                {isExpired(cert.expiry) && " (Expired)"}
                              </p>
                              <div className="mt-2">
                                <a
                                  href={cert.file}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`text-sm ${
                                    cert.file
                                      ? "text-primary hover:underline"
                                      : "text-muted-foreground"
                                  }`}
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
                      <CardDescription>
                        Current location of the machine
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 border rounded-lg">
                          <MapPin className="h-5 w-5 mt-1" />
                          <div>
                            <h3 className="font-medium">
                              {data?.site?.name} ({data?.site?.code})
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {data?.site?.address}
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                              Site ID: #{data?.site?.id}
                            </p>
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
                  <div className="relative overflow-hidden rounded-lg">
                    <img
                      src={data.machineImageFile || PlacehoolderImage}
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
                        <p className="text-sm text-muted-foreground">
                          {formatDate(data.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Last Updated</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(data.updatedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Purchased</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(data.purchaseDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* {!loading && (
        <MaintenanceLogModal
          machineId={data?.id}
          machineName={data?.machineName}
        />
      )} */}
    </div>
  );
}
