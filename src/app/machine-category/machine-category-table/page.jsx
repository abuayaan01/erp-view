import Loader, { Spinner } from "@/components/ui/loader";
import { DataTable } from "./data-table";
import { useDispatch, useSelector } from "react-redux";
import { columns } from "./columns";
import { fetchMachineCategories } from "@/features/machine-category/machine-category-slice";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function MachineCategoryPage() {
  const { data, loading } =
    useSelector((state) => state.machineCategories) || [];

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto min-h-screen flex flex-col">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Machine Category</h1>
        <div>
          <Link to="/machine-category/add">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Machine Category
            </Button>
          </Link>
        </div>
      </div>
      <DataTable columns={columns} data={data} loading={loading} />
    </div>
  );
}
