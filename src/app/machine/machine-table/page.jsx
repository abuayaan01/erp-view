import Loader from "@/components/ui/loader";
import { useSelector } from "react-redux";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import TableSkeleton from "@/components/ui/table-skeleton";

export default function MachineTable() {
  const { data, loading } =
    useSelector((state) => state.machines) || [];

  return (
    <div className="container mx-auto py-2 min-h-screen flex flex-col">
        <DataTable columns={columns} data={data} loading={loading} />
    </div>
  );
}
