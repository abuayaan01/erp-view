"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"

export function FilterBar({ requisitions, onFilterChange }) {
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    site: "all",
    dateFrom: "",
    dateTo: "",
  })

  // Extract unique sites from requisitions
  const sites = ["all", ...new Set(requisitions.map((req) => req.site))]

  // Apply filters whenever they change
  useEffect(() => {
    const filteredData = requisitions.filter((req) => {
      // Search filter (check material name, req ID, etc.)
      if (
        filters.search &&
        !req.materialName.toLowerCase().includes(filters.search.toLowerCase()) &&
        !`REQ-${req.id.toString().padStart(4, "0")}`.includes(filters.search)
      ) {
        return false
      }

      // Status filter
      if (filters.status !== "all" && req.status !== filters.status) {
        return false
      }

      // Site filter
      if (filters.site !== "all" && req.site !== filters.site) {
        return false
      }

      // Date range filter
      if (filters.dateFrom && filters.dateTo) {
        const reqDate = new Date(req.date)
        const fromDate = new Date(filters.dateFrom)
        const toDate = new Date(filters.dateTo)

        if (reqDate < fromDate || reqDate > toDate) {
          return false
        }
      }

      return true
    })
    onFilterChange(filteredData)
  }, [filters, requisitions,])
  // }, [filters, requisitions, onFilterChange])

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "all",
      site: "all",
      dateFrom: "",
      dateTo: "",
    })
  }

  const hasActiveFilters = () => {
    return filters.search || filters.status !== "all" || filters.site !== "all" || filters.dateFrom || filters.dateTo
  }

  return (
    <div className="space-y-4 bg-muted/40 p-4 rounded-lg">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by material or requisition ID..."
            className="pl-8"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <div className="w-full sm:w-40">
            <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="dispatched">Dispatched</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="procurement">Procurement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-40">
            <Select value={filters.site} onValueChange={(value) => handleFilterChange("site", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Site" />
              </SelectTrigger>
              <SelectContent>
                {sites.map((site) => (
                  <SelectItem key={site} value={site}>
                    {site === "all" ? "All Sites" : site}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-end justify-between gap-4">
        <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
          <div className="space-y-1">
            <Label htmlFor="dateFrom" className="text-xs">
              From Date
            </Label>
            <Input
              id="dateFrom"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
              className="h-9"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="dateTo" className="text-xs">
              To Date
            </Label>
            <Input
              id="dateTo"
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange("dateTo", e.target.value)}
              className="h-9"
            />
          </div>
        </div>

        {hasActiveFilters() && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 px-2 flex items-center gap-1">
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  )
}

