import { MoreHorizontal } from "lucide-react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import api from "@/services/api/api-service";
import { toast } from "@/hooks/use-toast";
import { UpdateMachineCategory } from "@/components/add-primary-category-form";
import { useLoader } from "@/common/context/loader/loader-provider";
import { useDispatch } from "react-redux";
import { fetchMachineCategories } from "@/features/machine-category/machine-category-slice";
import { useNavigate } from "react-router";

export const columns = [
  {
    accessorKey: "id",
    header: "ID",
    className: "min-w-[60px] max-w-[60px] text-center",
  },
  {
    accessorKey: "name",
    header: "Machine Category",
  },
  {
    accessorKey: "primaryCategory.name",
    header: "Primary Category",
  },
  {
    accessorKey: "averageBase",
    header: "Average Base",
  },
  {
    accessorKey: "standardHrsRun",
    header: "Standard Hrs Run",
  },
  {
    accessorKey: "useFor",
    header: "Usage",
  },
  {
    accessorKey: "machineType",
    header: "Machine Type",
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => new Date(row.original.updatedAt).toLocaleDateString(),
  },
  {
    id: "actions",
    header: "Actions",
    className: "sticky-col",
    cell: ({ row }) => {
      const dispatch = useDispatch();
      const navigate = useNavigate();
      const { showLoader, hideLoader } = useLoader();
      const handleDelete = async (id) => {
        try {
          showLoader()
          await api.delete(`/category/machine/${id}`);
          toast({
            title: "Success",
            description: "Category deleted successfully.",
          });
          dispatch(fetchMachineCategories());
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to delete category.",
          });
        } finally {
          hideLoader();
        }
      };
      const handleEdit = () => {
        navigate('/machine-category/update', { state: { myData: row.original } });
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleEdit()}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(row.original.id)}
              className="text-red-500"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
