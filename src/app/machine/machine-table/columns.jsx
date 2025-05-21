import { FileImage, MoreHorizontal } from "lucide-react";
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
import { useDispatch } from "react-redux";
import { useLoader } from "@/common/context/loader/loader-provider";
import { fetchMachines } from "@/features/machine/machine-slice";
import { useNavigate } from "react-router";
// import { UpdateMachine } from "@/components/add-machine-form";

export const columns = [
  {
    accessorKey: "id",
    header: "ID",
    className: "min-w-[60px] max-w-[60px] text-center",
  },
  { accessorKey: "machineName", header: "Machine Name" },
  { accessorKey: "machineNumber", header: "Machine Number" },
  { accessorKey: "machineCode", header: "Machine Code" },
  { accessorKey: "erpCode", header: "ERP Code" },
  { accessorKey: "registrationNumber", header: "Registration Number" },
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
    accessorKey: "site",
    header: "Site Location",
    cell: ({ row }) => {
      return <>{row.original.site?.name}</>;
    },
  },
  {
    header: "Documents",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 text-blue-600">
              <span>View Files</span>
              <FileImage className="ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* <DropdownMenuLabel>Available Files</DropdownMenuLabel>
            <DropdownMenuSeparator /> */}

            {/* Fitness Certificate File */}
            {row.original.fitnessCertificateFile ? (
              <DropdownMenuItem>
                <a
                  href={row.original.fitnessCertificateFile}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Fitness Certificate
                </a>
              </DropdownMenuItem>
            ) : <DropdownMenuLabel className="text-xs text-center">Not Available</DropdownMenuLabel>}

            {/* Motor Vehicle Tax File */}
            {row.original.motorVehicleTaxFile && (
              <DropdownMenuItem>
                <a
                  href={row.original.motorVehicleTaxFile}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Motor Vehicle Tax File
                </a>
              </DropdownMenuItem>
            )}

            {/* Permit File */}
            {row.original.permitFile && (
              <DropdownMenuItem>
                <a
                  href={row.original.permitFile}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Permit File
                </a>
              </DropdownMenuItem>
            )}

            {/* National Permit File */}
            {row.original.nationalPermitFile && (
              <DropdownMenuItem>
                <a
                  href={row.original.nationalPermitFile}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  National Permit File
                </a>
              </DropdownMenuItem>
            )}

            {/* Insurance File */}
            {row.original.insuranceFile && (
              <DropdownMenuItem>
                <a
                  href={row.original.insuranceFile}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Insurance File
                </a>
              </DropdownMenuItem>
            )}

            {/* Pollution Certificate File */}
            {row.original.pollutionCertificateFile && (
              <DropdownMenuItem>
                <a
                  href={row.original.pollutionCertificateFile}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Pollution Certificate File
                </a>
              </DropdownMenuItem>
            )}

            {/* Machine Image File */}
            {row.original.machineImageFile && (
              <DropdownMenuItem>
                <a
                  href={row.original.machineImageFile}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Machine Image File
                </a>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: "fitnessCertificateExpiry",
    header: "Fitness Expiry",
    cell: ({ row }) =>
      row.original.fitnessCertificateExpiry != null ? new Date(row.original.fitnessCertificateExpiry).toLocaleDateString() : "NA",
  },
  {
    accessorKey: "motorVehicleTaxDue",
    header: "MV Tax Due",
    cell: ({ row }) =>
     row.original.motorVehicleTaxDue != null ? new Date(row.original.motorVehicleTaxDue).toLocaleDateString() : "NA",
  },
  {
    accessorKey: "permitExpiryDate",
    header: "Permit Expiry",
    cell: ({ row }) =>
     row.original.permitExpiryDate != null ? new Date(row.original.permitExpiryDate).toLocaleDateString() : "NA",
  },
  {
    accessorKey: "nationalPermitExpiry",
    header: "National Permit Expiry",
    cell: ({ row }) =>
      row.original.nationalPermitExpiry != null ? new Date(row.original.nationalPermitExpiry).toLocaleDateString() : "NA",
  },
  {
    accessorKey: "insuranceExpiry",
    header: "Insurance Expiry",
    cell: ({ row }) =>
      row.original.insuranceExpiry != null ? new Date(row.original.insuranceExpiry).toLocaleDateString() : "NA",
  },
  {
    accessorKey: "pollutionCertificateExpiry",
    header: "Pollution Expiry",
    cell: ({ row }) =>
      row.original.pollutionCertificateExpiry != null ? new Date(row.original.pollutionCertificateExpiry).toLocaleDateString() : "NA",
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
    accessorKey: "isActive",
    header: "Active Status",
    cell: ({ row }) => (row.original.isActive ? "Active" : "Inactive"),
  },
  { accessorKey: "status", header: "Status" },
  {
    id: "actions",
    header: "Actions",
    className: "sticky-col",
    cell: ({ row }) => {
      const dispatch = useDispatch();
      const { showLoader, hideLoader } = useLoader();
      const navigate = useNavigate();

      const handleDelete = async (id) => {
        const machineId = Number(id);
        try {
          showLoader();
          await api.delete(`/machinery/${machineId}`);
          toast({
            title: "Success",
            description: "Machine deleted successfully.",
          });
          dispatch(fetchMachines());
          // Trigger a re-fetch or update local state here if needed
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description:
              error.response?.data?.message || "Failed to delete the machine.",
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
            {/* <DropdownMenuItem onClick={(e) => e.preventDefault()}> */}
            {/* <UpdateMachine data={row.original} /> */}
            {/* Edit */}
            {/* </DropdownMenuItem> */}
            <DropdownMenuItem
              onClick={() => navigate(`/machines/${row.original.id}`)}
            >
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate(`/machines/edit/${row.original.id}`)}
            >
              Edit
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
