"use client";

import { useState, useEffect } from "react";
import { LogbookForm } from "@/components/logbook/Logbook-form";
import { LogbookTable } from "@/components/logbook/Logbook-table";
import { LogbookFilters } from "@/components/logbook/Logbook-filters";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { ROLES } from "@/utils/roles";
import api from "@/services/api/api-service";
import TableSkeleton from "@/components/ui/table-skeleton";

export function LogbookPage() {
  const [logEntries, setLogEntries] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [activeTab, setActiveTab] = useState("view");
  const [tableLoader, setTableLoader] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: { from: null, to: null },
    machineNo: "",
    siteName: "",
    assetCode: "",
  });

  const fetchLogEntries = async () => {
    try {
      setTableLoader(true);
      const response = await api.get("/logbook");
      setLogEntries(response.data);
    } catch (error) {
      console.error("Error fetching logbook entries:", error);
      toast({
        title: "Something went wrong !",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setTableLoader(false);
    }
  };
  useEffect(() => {
    fetchLogEntries();
  }, []);

  const { user } = useSelector((state) => state.auth);
  const userRoleId = user?.roleId;

  const Allowed = [
    ROLES.MECHANICAL_STORE_MANAGER.id,
    ROLES.MECHANICAL_INCHARGE.id,
    ROLES.PROJECT_MANAGER.id,
  ].includes(userRoleId);

  const handleAddEntry = async (newEntry) => {
    // In a real app, this would make an API call first
    const calculatedEntry = {
      ...newEntry,
      // id: logEntries.length + 1,
      totalRunKM: newEntry.closingKmReading - newEntry.openingKmReading,
      dieselAvgKM: calculateDieselAvgKM(newEntry),
      totalRunHrsMeter: newEntry.closingHrsMeter - newEntry.openingHrsMeter,
      dieselAvgHrsMeter: calculateDieselAvgHrsMeter(newEntry),
    };
    // console.log(calculatedEntry);
    // return;
    try {
      const res = await api.post("/logbook", calculatedEntry);
      setLogEntries([...logEntries, res.data]);
      setIsFormOpen(false);
      setActiveTab("view");
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateEntry = (updatedEntry) => {
    // In a real app, this would make an API call first
    const calculatedEntry = {
      ...updatedEntry,
      totalRunKM: updatedEntry.closingKMReading - updatedEntry.openingKMReading,
      dieselAvgKM: calculateDieselAvgKM(updatedEntry),
      totalRunHrsMeter:
        updatedEntry.closingHrsMeter - updatedEntry.openingHrsMeter,
      dieselAvgHrsMeter: calculateDieselAvgHrsMeter(updatedEntry),
    };

    setLogEntries(
      logEntries.map((entry) =>
        entry.id === calculatedEntry.id ? calculatedEntry : entry
      )
    );
    setEditingEntry(null);
    setIsFormOpen(false);
    setActiveTab("view");
  };

  const handleDeleteEntry = (id) => {
    // In a real app, this would make an API call first
    setLogEntries(logEntries.filter((entry) => entry.id !== id));
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setIsFormOpen(true);
  };

  const calculateDieselAvgKM = (entry) => {
    const dieselUsed =
      entry.dieselOpeningBalance +
      entry.dieselIssue -
      entry.dieselClosingBalance;
    const kmRun = entry.closingKmReading - entry.openingKmReading;
    return dieselUsed > 0 && kmRun > 0
      ? Number.parseFloat((kmRun / dieselUsed).toFixed(2))
      : 0;
  };

  const calculateDieselAvgHrsMeter = (entry) => {
    const dieselUsed =
      entry.dieselOpeningBalance +
      entry.dieselIssue -
      entry.dieselClosingBalance;
    const hoursRun = entry.closingHrsMeter - entry.openingHrsMeter;
    return dieselUsed > 0 && hoursRun > 0
      ? Number.parseFloat((dieselUsed / hoursRun).toFixed(2))
      : 0;
  };

  const filteredEntries = logEntries.filter((entry) => {
    // Filter by date range
    if (filters.dateRange.from && filters.dateRange.to) {
      const entryDate = new Date(entry.date);
      const fromDate = new Date(filters.dateRange.from);
      const toDate = new Date(filters.dateRange.to);
      if (entryDate < fromDate || entryDate > toDate) return false;
    }

    // Filter by machine number
    if (
      filters.machineNo &&
      !entry.registrationNo
        .toLowerCase()
        .includes(filters.machineNo.toLowerCase())
    ) {
      return false;
    }

    // Filter by site name
    if (
      filters.siteName &&
      !entry.siteName.toLowerCase().includes(filters.siteName.toLowerCase())
    ) {
      return false;
    }

    // Filter by asset code
    if (
      filters.assetCode &&
      !entry.assetCode.toLowerCase().includes(filters.assetCode.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Machine Logbook</h1>
        {/* <Button
          onClick={() => {
            setIsFormOpen(true)
            setEditingEntry(null)
          }}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add New Entry
        </Button> */}
      </div>

      <Tabs
        defaultValue="view"
        value={activeTab}
        onValueChange={(value) => {
          if (value !== activeTab) setActiveTab(value);
        }}
        className="w-full"
      >
        {Allowed && (
          <TabsList className={`grid w-full max-w-md grid-cols-2`}>
            <TabsTrigger value="view">View Logs</TabsTrigger>

            <TabsTrigger value="form">
              {/* <TabsTrigger value="form" disabled={!isFormOpen}> */}
              {editingEntry ? "Edit Log Entry" : "New Log Entry"}
            </TabsTrigger>
          </TabsList>
        )}

        <TabsContent value="view" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logbook Entries</CardTitle>
              <CardDescription>
                View and manage machine logbook entries. Use the filters to
                narrow down results.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* <LogbookFilters filters={filters} setFilters={setFilters} /> */}
              {tableLoader ? (
                <div className="flex-1 flex flex-col justify-center">
                  <TableSkeleton cols={9} rows={6} />
                </div>
              ) : (
                <LogbookTable
                  entries={filteredEntries}
                  tableLoader={tableLoader}
                  onEdit={handleEditEntry}
                  onDelete={handleDeleteEntry}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="form" className={isFormOpen}>
          {/* <TabsContent value="form" className={isFormOpen ? "" : "hidden"}> */}
          <Card>
            <CardHeader>
              <CardTitle>
                {editingEntry ? "Edit Log Entry" : "New Log Entry"}
              </CardTitle>
              <CardDescription>
                {editingEntry
                  ? "Update the details for this logbook entry"
                  : "Fill in the details to create a new logbook entry"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LogbookForm
                onSubmit={editingEntry ? handleUpdateEntry : handleAddEntry}
                initialData={editingEntry}
                onCancel={() => {
                  setIsFormOpen(false);
                  setEditingEntry(null);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
