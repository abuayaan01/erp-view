import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import api from "@/services/api/api-service";
import Loader from "@/components/ui/loader";

export default function UsersTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsersData();
  }, []);

  const fetchUsersData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users");
      if (res.status) {
        setData(res.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-2 min-h-screen flex flex-col">
      {loading ? (
        <div className="flex-1 flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <DataTable fetchUsersData={fetchUsersData} columns={columns} data={data} />
      )}
    </div>
  );
}
