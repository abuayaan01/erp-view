import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import api from "@/services/api/api-service";
import Loader from "@/components/ui/loader";

export default function SiteTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSites();
  }, []);

  const getSites = async () => {
    try {
      setLoading(true);
      const res = await api.get("/sites");
      console.log(res.data);
      setData(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto py-2 min-h-screen flex flex-col">
      {loading ? (
        <div className="flex-1 flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <DataTable columns={columns} data={data} getSites={getSites} />
      )}
    </div>
  );
}
