import Loader, { Spinner } from "@/components/ui/loader";
import { useSelector } from "react-redux";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import TableSkeleton from "@/components/ui/table-skeleton";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function MachineTable() {
  const { data, loading } = useSelector((state) => state.machines) || [];

  if (loading) {
    return <Spinner />;
  }
  return (
    <div className="container mx-auto min-h-screen flex flex-col">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Machine</h1>
        <div>
          <Link to="/machine/add">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Machine
            </Button>
          </Link>
        </div>
      </div>
      <DataTable columns={columns} data={data} loading={loading} />
    </div>
  );
}
