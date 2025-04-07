"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { FilterBar } from "./FilterBar";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router";

export function RequisitionTable({ requisitions: initialRequisitions }) {
  const [filteredRequisitions, setFilteredRequisitions] =
    useState(initialRequisitions);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  // In a real app, you would use React Router's useNavigate
  const navigate = useNavigate();

  const handleFilterChange = (filteredData) => {
    setFilteredRequisitions(filteredData);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Calculate pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredRequisitions.slice(
    indexOfFirstRow,
    indexOfLastRow
  );
  const totalPages = Math.ceil(filteredRequisitions.length / rowsPerPage);

  const handleViewRequisition = (id) => {
    navigate(`/material-requisition/${id}`);
  };

  return (
    <div className="space-y-4">
      <FilterBar
        requisitions={initialRequisitions}
        onFilterChange={handleFilterChange}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Req. ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Material</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Site</TableHead>
              <TableHead>Required By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRows.length > 0 ? (
              currentRows.map((req) => (
                <TableRow
                  key={req.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleViewRequisition(req.id)}
                >
                  <TableCell className="font-medium">
                    REQ-{req.id.toString().padStart(4, "0")}
                  </TableCell>
                  <TableCell>{req.date}</TableCell>
                  <TableCell>{req.materialName}</TableCell>
                  <TableCell>
                    {req.quantity} {req.unit}
                    {req.urgency === "urgent" && (
                      <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                    )}
                  </TableCell>
                  <TableCell>{req.site}</TableCell>
                  <TableCell>{req.requiredBy}</TableCell>
                  <TableCell>
                    <StatusBadge status={req.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewRequisition(req.id);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No requisitions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredRequisitions.length > rowsPerPage && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((page) => Math.min(page + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
