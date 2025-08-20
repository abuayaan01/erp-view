import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/loader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import api from "@/services/api/api-service"
import { MapPin } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import SiteInformationTab from "./tabs/SiteInformationTab"
import MachineryTab from "./tabs/MachineryTab"
import InventoryTab from "./tabs/InventoryTab"
import UsersTab from "./tabs/UsersTab"

export default function SiteDetailPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState()
  const params = useParams()

  useEffect(() => {
    fetchSiteDetails(params.id)
  }, [params])

  const fetchSiteDetails = async (sid) => {
    try {
      setLoading(true)
      const res = await api.get(`/sites/${sid}`)
      setData(res.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-2 min-h-screen flex flex-col">
      {loading ? (
        <Spinner />
      ) : (
        <div className="container py-4 px-4 max-w-5xl">
          {/* Site Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-lg font-bold tracking-tight">{data.name}</h1>
              <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{data.address}</span>
              </div>
            </div>
            <Badge variant={data.status === "active" ? "success" : "destructive"} className="capitalize">
              {data.status}
            </Badge>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="site-info" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="site-info">Site Information</TabsTrigger>
              <TabsTrigger value="machinery">Machinery</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              {/* <TabsTrigger value="users">Users</TabsTrigger> */}
            </TabsList>

            <TabsContent value="site-info" className="mt-6">
              <SiteInformationTab data={data} />
            </TabsContent>

            <TabsContent value="machinery" className="mt-6">
              <MachineryTab machinery={data.Machinery} />
            </TabsContent>

            <TabsContent value="inventory" className="mt-6">
              <InventoryTab siteId={data.id} />
            </TabsContent>

            <TabsContent value="users" className="mt-6">
              <UsersTab siteId={data.id} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
