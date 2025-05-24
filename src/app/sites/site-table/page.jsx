import Loader from "@/components/ui/loader";
import { useSelector } from "react-redux";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function SiteTable() {
  const { data, loading } = useSelector((state) => state.sites);
  return (
    <div className="container mx-auto py-2 min-h-screen flex flex-col">
        <DataTable columns={columns} data={data} loading={loading} />
    </div>
  );
}
