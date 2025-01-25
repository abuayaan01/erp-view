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
import { UpdateSite } from "@/components/add-site-form";
import api from "@/services/api/api-service";
import { toast } from "@/hooks/use-toast";

export const columns = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Site name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "code",
    header: "Site Code",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const handleDelete = async (id) => {
        const sid = Number(id);
        try {
          await api.delete(`/sites/${sid}`);
          toast({
            title: "Success",
            description: "Site deleted successfully.",
          });
          // Trigger a re-fetch or update local state here if needed
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description:
              error.response?.data?.message || "Failed to delete the site.",
          });
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
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <UpdateSite data={row.original} />
            </DropdownMenuItem>
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
