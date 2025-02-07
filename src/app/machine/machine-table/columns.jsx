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
// import { UpdateMachine } from "@/components/add-machine-form";

export const columns = [
  {
    accessorKey: "id",
    header: "ID",
    className: "min-w-[60px] max-w-[60px] text-center",
  },
  { accessorKey: "erpCode", header: "ERP Code" },
  { accessorKey: "registrationNumber", header: "Registration Number" },
  { accessorKey: "machineNumber", header: "Machine Number" },
  { accessorKey: "machineCode", header: "Machine Code" },
  { accessorKey: "chassisNumber", header: "Chassis Number" },
  { accessorKey: "engineNumber", header: "Engine Number" },
  { accessorKey: "serialNumber", header: "Serial Number" },
  { accessorKey: "model", header: "Model" },
  { accessorKey: "make", header: "Make" },
  { accessorKey: "yom", header: "Year of Manufacture" },
  {
    accessorKey: "purchaseDate",
    header: "Purchase Date",
    cell: ({ row }) => new Date(row.original.purchaseDate).toLocaleDateString(),
  },
  { accessorKey: "capacity", header: "Capacity" },
  { accessorKey: "ownerName", header: "Owner Name" },
  { accessorKey: "ownerType", header: "Owner Type" },
  { accessorKey: "siteId", header: "Site ID" },
  {
    accessorKey: "isActive",
    header: "Active Status",
    cell: ({ row }) => (row.original.isActive ? "Active" : "Inactive"),
  },
  { accessorKey: "machineName", header: "Machine Name" },
  { accessorKey: "status", header: "Status" },
  {
    accessorKey: "fitnessCertificateExpiry",
    header: "Fitness Expiry",
    cell: ({ row }) =>
      new Date(row.original.fitnessCertificateExpiry).toLocaleDateString(),
  },
  {
    accessorKey: "motorVehicleTaxDue",
    header: "MV Tax Due",
    cell: ({ row }) =>
      new Date(row.original.motorVehicleTaxDue).toLocaleDateString(),
  },
  {
    accessorKey: "permitExpiryDate",
    header: "Permit Expiry",
    cell: ({ row }) =>
      new Date(row.original.permitExpiryDate).toLocaleDateString(),
  },
  {
    accessorKey: "nationalPermitExpiry",
    header: "National Permit Expiry",
    cell: ({ row }) =>
      new Date(row.original.nationalPermitExpiry).toLocaleDateString(),
  },
  {
    accessorKey: "insuranceExpiry",
    header: "Insurance Expiry",
    cell: ({ row }) =>
      new Date(row.original.insuranceExpiry).toLocaleDateString(),
  },
  {
    accessorKey: "pollutionCertificateExpiry",
    header: "Pollution Expiry",
    cell: ({ row }) =>
      new Date(row.original.pollutionCertificateExpiry).toLocaleDateString(),
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
            <DropdownMenuItem onClick={(e) => e.preventDefault()}>
              {/* <UpdateMachine data={row.original} /> */}
              Edit
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
