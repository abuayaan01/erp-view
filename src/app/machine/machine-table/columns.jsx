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
// import { UpdateMachine } from "@/components/update-machine-form"; // Assume this component exists
import api from "@/services/api/api-service";
import { toast } from "@/hooks/use-toast";

export const columns = [
  {
    accessorKey: "PrimaryCategory",
    header: "Primary Category",
  },
  {
    accessorKey: "MachineCategory",
    header: "Machine Category",
  },
  {
    accessorKey: "ERPCode",
    header: "ERP Code",
  },
  {
    accessorKey: "RegistrationNo",
    header: "Registration No.",
  },
  {
    accessorKey: "MachineNo",
    header: "Machine No.",
  },
  {
    accessorKey: "Model",
    header: "Model",
  },
  {
    accessorKey: "Make",
    header: "Make",
  },
  {
    accessorKey: "YOM",
    header: "Year of Manufacture",
  },
  {
    accessorKey: "PurchaseDate",
    header: "Purchase Date",
  },
  {
    accessorKey: "Capacity",
    header: "Capacity",
  },
  {
    accessorKey: "FileNo",
    header: "File No.",
  },
  {
    accessorKey: "OwnerName",
    header: "Owner Name",
  },
  {
    accessorKey: "OwnerType",
    header: "Owner Type",
  },
  {
    accessorKey: "Site",
    header: "Site",
  },
  {
    accessorKey: "IsActive",
    header: "Is Active",
    cell: ({ row }) => (row.original.IsActive ? "Yes" : "No"),
  },
  {
    accessorKey: "Location",
    header: "Location",
  },
  {
    accessorKey: "FitnessForm38",
    header: "Fitness (FORM 38)",
  },
  {
    accessorKey: "MVTax",
    header: "MV TAX",
  },
  {
    accessorKey: "PermitDetails",
    header: "Permit Details",
  },
  {
    accessorKey: "Permit",
    header: "Permit",
  },
  {
    accessorKey: "NationalPermit",
    header: "National Permit",
  },
  {
    accessorKey: "InsuranceDate",
    header: "Insurance Date",
  },
  {
    accessorKey: "PollutionDate",
    header: "Pollution Date",
  },
  {
    id: "actions",
    header: "Actions",
    className: "sticky-col",
    cell: ({ row }) => {
      const handleDelete = async (id) => {
        const machineId = Number(id);
        try {
          await api.delete(`/machines/${machineId}`);
          toast({
            title: "Success",
            description: "Machine deleted successfully.",
          });
          // Trigger a re-fetch or update local state here if needed
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description:
              error.response?.data?.message || "Failed to delete the machine.",
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
              Update Machine
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(row.original.SrNo)}
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
