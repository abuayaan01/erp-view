import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, ChevronLeft, ChevronRight, PlusCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/services/api/api-service";
import { toast } from "@/hooks/use-toast";
import TableSkeleton from "@/components/ui/table-skeleton";

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterSite, setFilterSite] = useState("all");
  const [categories, setCategories] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const response = await api.get("/inventory");
        const data = response.data; // Extract real inventory array
        setInventory(data);

        // Extract categories and sites for filters
        const uniqueCategories = [
          ...new Set(
            data?.map((item) => item.Item?.ItemGroup?.name || "Unknown")
          ),
        ];
        const uniqueSites = [
          ...new Set(data?.map((item) => item.Site?.name || "Unknown")),
        ];

        setCategories(uniqueCategories);
        setSites(uniqueSites);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching inventory:", error);
        toast({
          title: "Error loading inventory",
          description: error.message,
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const getStockStatus = (item) => {
    if (item.quantity <= 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (item.quantity <= item.minLevel) {
      return <Badge variant="warning">Low Stock</Badge>;
    } else {
      return <Badge variant="success">In Stock</Badge>;
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };

  // Filter inventory based on search and filters
  const filteredInventory = inventory?.filter((item) => {
    const itemName = item.Item?.name?.toLowerCase() || "";
    const partNumber = item.Item?.partNumber?.toLowerCase() || "";
    const category = item.Item?.ItemGroup?.name?.toLowerCase() || "";
    const siteName = item.Site?.name || "Unknown Site";

    const matchesSearch =
      itemName.includes(searchTerm.toLowerCase()) ||
      partNumber.includes(searchTerm.toLowerCase()) ||
      category.includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || category === filterCategory;
    const matchesSite = filterSite === "all" || siteName === filterSite;

    return matchesSearch && matchesCategory && matchesSite;
  });

  // Update total pages whenever filtered inventory changes
  useEffect(() => {
    if (filteredInventory) {
      setTotalPages(Math.ceil(filteredInventory.length / itemsPerPage));
      // Reset to first page when filters change
      if (currentPage > Math.ceil(filteredInventory.length / itemsPerPage)) {
        setCurrentPage(1);
      }
    }
  }, [filteredInventory, itemsPerPage]);

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInventory?.slice(indexOfFirstItem, indexOfLastItem);

  // Page navigation
  const goToPage = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Spare Parts Inventory
        </h1>
        <div>
          <Link to="/inventory/add">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Spare Parts Inventory</CardTitle>
          <CardDescription>
            Manage your spare parts inventory across all sites
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, part number, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex flex-1 flex-col sm:flex-row gap-4">
              {/* <div className="flex-1">
                <Select
                  value={filterCategory}
                  onValueChange={setFilterCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories?.map((category, index) => {
                      return (
                        <SelectItem key={index} value={category}>
                          {category}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div> */}
              {/* <div className="flex-1">
                <Select value={filterSite} onValueChange={setFilterSite}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by site" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sites</SelectItem>
                    {sites?.map((site, index) => (
                      <SelectItem key={index} value={site}>
                        {site}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}
            </div>
          </div>

          {loading ? (
            <div className="flex-1 flex flex-col justify-center">
              <TableSkeleton cols={9} rows={6} />
            </div>
          ) :
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Part No.</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Current Stock</TableHead>
                    {/* <TableHead>Min. Level</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>Last Updated</TableHead> */}
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems?.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-6 text-muted-foreground"
                      >
                        {searchTerm ||
                          filterCategory !== "all" ||
                          filterSite !== "all"
                          ? "No items found matching your search criteria."
                          : "No inventory items found."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentItems?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.Item?.name}
                        </TableCell>
                        <TableCell>{item.Item?.partNumber}</TableCell>
                        <TableCell>{item.Item?.ItemGroup?.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {item.quantity} {getStockStatus(item)}
                          </div>
                        </TableCell>
                        {/* <TableCell>—</TableCell> 
                      <TableCell>{item.Site?.name || "Unknown Site"}</TableCell>
                      <TableCell>{formatDate(item.updatedAt)}</TableCell> */}
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Link to={`/inventory/${item.id || item.itemId}`}>
                              View
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>}

          {/* Pagination Controls */}
          {filteredInventory?.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredInventory.length)} of {filteredInventory.length} entries
              </div>
              <div className="flex items-center space-x-2">
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={handleItemsPerPageChange}
                >
                  <SelectTrigger className="h-8 w-24">
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;

                    // Logic to show pages around current page
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="icon"
                        onClick={() => goToPage(pageNum)}
                        className="h-8 w-8"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryList;