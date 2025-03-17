import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Loader from "@/components/ui/loader"
import { Separator } from "@/components/ui/separator"
import api from "@/services/api/api-service"
import { MapPin, Settings, Package } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "react-router"

// This would typically come from an API call
const siteData = {
  status: true,
  message: "Site fetched successfully",
  data: {
    id: 14,
    name: "Hazaribagh",
    code: "HZB",
    address: "Main Road",
    departmentId: 1,
    status: "active",
    createdAt: "2025-02-07T01:10:40.091Z",
    updatedAt: "2025-02-07T01:10:40.091Z",
    deletedAt: null,
    Department: {
      id: 1,
      name: "Mechanical",
    },
    Machinery: [
      {
        id: 30,
        machineName: "Light Box",
        capacity: "20L",
        ownerName: "Abu Ayaan",
        ownerType: "Company",
      },
      {
        id: 32,
        machineName: " Box",
        capacity: "2",
        ownerName: "Abu Ayaan",
        ownerType: "Company",
      },
    ],
  },
  timestamp: "2025-03-15T20:13:01.730Z",
}

export default function SiteDetailPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const params = useParams()
  // const { data } = siteData

  useEffect(() => {
    fetchSiteDetails(params.id);
  }, [params])

  const fetchSiteDetails = async (sid) => {
    try {
      setLoading(true);
      const res = await api.get(`/sites/${sid}`);
      setData(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }


  return (
    <div className="container mx-auto py-2 min-h-screen flex flex-col">
      {loading ? (
        <div className="flex-1 flex justify-center items-center">
          <Loader />
        </div>
      ) :
        (<div className="container py-4 px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{data.name}</h1>
              <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{data.address}</span>
              </div>
            </div>
            <Badge variant={data.status === "active" ? "success" : "destructive"} className="capitalize">
              {data.status}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Site Information</CardTitle>
                <CardDescription>Details about the site</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Site Code</p>
                    <p className="font-medium">{data.code}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Site ID</p>
                    <p className="font-medium">#{data.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created On</p>
                    <p className="font-medium">{new Date(data.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                    <p className="font-medium">
                      {new Date(data.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-xl">Department</CardTitle>
                  <CardDescription>Department information</CardDescription>
                </div>
                <Settings className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Department Name</p>
                    <p className="text-lg font-semibold">{data.Department.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Department ID</p>
                    <p className="text-lg font-semibold">#{data.Department.id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-xl font-bold mb-4">Machinery</h2>
          <Separator className="mb-6" />

          {data.Machinery.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.Machinery.map((machine) => (
                <Card key={machine.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle className="text-xl">{machine.machineName}</CardTitle>
                      <CardDescription>Machine ID: #{machine.id}</CardDescription>
                    </div>
                    <Package className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Capacity</p>
                          <p className="font-medium">{machine.capacity}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Owner Type</p>
                          <p className="font-medium">{machine.ownerType}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Owner Name</p>
                        <p className="font-medium">{machine.ownerName}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No machinery found for this site.</p>
            </div>
          )}
        </div>)}
    </div>
  )
}

