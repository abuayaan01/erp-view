import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import api from "@/services/api/api-service";

export default function SiteTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getSites();
  }, []);

  const getSites = async () => {
    try {
      const res = await api.get("/sites");
      console.log(res.data);
      setData(res.data);
    } catch (error) {
      console.log(error);
      // toast({
      //   variant: "destructive",
      //   title: "Uh oh! Something went wrong.",
      // });
    }
  };

  return (
    <div className="container mx-auto py-2">
      <DataTable columns={columns} data={data} getSites={getSites} />
    </div>
  );
}
