"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import api from "@/services/api/api-service";
import { fetchUnits } from "@/features/units/units-slice";

const UnitList = () => {
  const dispatch = useDispatch();
  const [units, setUnits] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState(null);
  const { toast } = useToast();
  const storedUnits = useSelector((state) => state.units) || [];
  const storedItems = useSelector((state) => state.items) || [];

  useEffect(() => {
    setUnits(storedUnits.data);
  }, []);

  const handleDelete = (id) => {
    const unit = units.find((unit) => unit.id === id);
    setUnitToDelete(unit);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // Check if this unit is used by any items
    const items = storedItems.data || [];
    const isUsed = items.some((item) => item.unit === unitToDelete.id);

    if (isUsed) {
      toast({
        title: "Cannot Delete",
        description: "This unit is being used by one or more items.",
        variant: "destructive",
      });
    } else {
      const updatedUnits = units.filter((unit) => unit.id !== unitToDelete.id);
      setUnits(updatedUnits);
      api
        .delete(`/units/${unitToDelete.id}`)
        .then((response) => {
          console.log("Unit deleted successfully:", response.data);
        })
        .catch((error) => {
          console.error("Error deleting unit:", error);
        });
      dispatch(fetchUnits());
      toast({
        title: "Unit Deleted",
        description: "The measurement unit has been deleted successfully.",
      });
    }

    setDeleteDialogOpen(false);
    setUnitToDelete(null);
  };

  const filteredUnits = units.filter(
    (unit) =>
      unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.shortName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Measurement Units</h1>
        <Button>
          <Link to="/units/new" className="flex">
            <Plus className="mr-2 h-4 w-4" /> Add Unit
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Search units..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Unit Name</TableHead>
              <TableHead>Short Name</TableHead>
              <TableHead>Decimal Places</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUnits.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-6 text-muted-foreground"
                >
                  {searchTerm
                    ? "No units found matching your search."
                    : "No measurement units added yet."}
                </TableCell>
              </TableRow>
            ) : (
              filteredUnits.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell className="font-medium">{unit.name}</TableCell>
                  <TableCell>{unit.shortName}</TableCell>
                  <TableCell>{unit.decimalPlaces}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Link to={`/units/edit/${unit.id}`}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(unit.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the unit "{unitToDelete?.name}". This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UnitList;
