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
import { useLoader } from "@/common/context/loader/loader-provider";
import { toast } from "@/hooks/use-toast";
import api from "@/services/api/api-service";

export const columns = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "phone",
    header: "Phone No.",
  },
  {
    accessorKey: "roleId",
    header: "Designation",
    cell: ({ row }) => {
      if (row.original.roleId == 1)
        return "Admin"
      else if (row.original.roleId == 2)
        return "Mechanical Head"
      else if (row.original.roleId == 3)
        return "Mechanical Manager"
      else if (row.original.roleId == 4)
        return "Site Incharge"
      else if (row.original.roleId == 5)
        return "Store Manager"
      else if (row.original.roleId == 6)
        return "Project Manager"
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, fetchUsersData}) => {
      const { showLoader, hideLoader } = useLoader();
      const handleDelete = async (id) => {
        const uid = Number(id);
        try {
          showLoader()
          await api.delete(`/users/${uid}`);
          toast({
            title: "Success",
            description: "User deleted successfully.",
          });
          fetchUsersData();
          // Trigger a re-fetch or update local state here if needed
        } catch (error) {
          console.log(error)
          toast({
            variant: "destructive",
            title: "Error",
            description:
              error.response?.data?.message || "Failed to delete the user.",
          });
        } finally {
          hideLoader();
        }
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
            {/* <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText("Abu Ayaan")}
            >
              Edit
            </DropdownMenuItem> */}
            <DropdownMenuItem
              onClick={() => handleDelete(row.original.id)}
              className={"text-red-500"}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
