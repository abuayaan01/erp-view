import React from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TableSkeleton from "@/components/ui/table-skeleton";
import { Link } from "react-router";
import { Plus, PlusCircle } from "lucide-react";

export function DataTable({ columns, data, loading }) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({
    registrationNumber: false,
    make: false,
    FileNo: false,
    ownerName: false,
    ownerType: false,
    yom: false,
  });
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination: {
        ...pagination,
      },
    },
    onPaginationChange: setPagination,
  });

  return (
    <div className="">
      <div className="flex items-center justify-between gap-2 py-4">
        <div className="flex gap-4">
          <Input
            placeholder="Filter machines..."
            value={table.getColumn("machineName")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn("machineName")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="h-[500px] overflow-auto"
              align="end"
            >
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* <div>
          <Link to={`/machine/add`}>
            <Button>
              <Plus className="mr-2 mb-1 h-4 w-4" />
              <span>Add Machine</span>
            </Button>
          </Link>
        </div> */}
      </div>
      <div className="max-w-[95vw] lg:w-[80vw] overflow-x-auto rounded-md border">
        <div>
          {loading ? (
            <div className="flex-1 flex justify-center">
              <TableSkeleton />
            </div>
          ) : (
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          className={`text-xs min-w-[150px] text-nowrap ${
                            header.column.columnDef.className || ""
                          }`}
                          key={header.id}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          className={`text-xs py-[0.3rem] ${
                            cell.column.columnDef.className || ""
                          }`}
                          key={cell.id}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                          {!cell.getValue() &&
                            ![
                              "fitnessCertificateExpiry",
                              "motorVehicleTaxDue",
                              "permitExpiryDate",
                              "nationalPermitExpiry",
                              "insuranceExpiry",
                              "pollutionCertificateExpiry",
                              "actions",
                              "Documents"
                            ].includes(cell.column.id) &&
                            "NA"}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-12 text-left"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
