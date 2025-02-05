import Loader from "@/components/ui/loader";
import { DataTable } from "./data-table";
import { useDispatch, useSelector } from "react-redux";
import { columns } from "./columns";
import { fetchMachineCategories } from "@/features/machine-category/machine-category-slice";
import { useEffect } from "react";

export default function MachineCategoryPage() {
  const { data, loading } =
    useSelector((state) => state.machineCategories) || [];

  return (
    <div className="container mx-auto py-2 min-h-screen flex flex-col">
      {loading ? (
        <div className="flex-1 flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <DataTable columns={columns} data={data} />
      )}
    </div>
  );
}
