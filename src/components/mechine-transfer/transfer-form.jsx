"use client";

import React from "react";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/services/api/api-service";

const transferTypes = [
  { id: "site_transfer", name: "Site Transfer" },
  { id: "sell", name: "Sell Machine" },
  { id: "scrap", name: "Scrap Machine" },
];

export function TransferForm({ baseUrl = "/machine-transfer/history" }) {
  const navigate = useNavigate();
  const { toast } = useToast();

  // State for API data
  const [machines, setMachines] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState({
    machines: true,
    sites: true,
  });

  // Form state
  const [selectedMachine, setSelectedMachine] = useState("");
  const [currentSiteId, setCurrentSiteId] = useState(null);
  const [currentSiteName, setCurrentSiteName] = useState("");
  const [currentCompany, setCurrentCompany] = useState("");
  const [transferType, setTransferType] = useState("site_transfer");
  const [selfCarrying, setSelfCarrying] = useState(false);
  const [destinationSiteId, setDestinationSiteId] = useState(null);
  const [destinationSiteName, setDestinationSiteName] = useState("");

  // For the dropdowns
  const [machineOpen, setMachineOpen] = useState(false);
  const [siteOpen, setSiteOpen] = useState(false);

  // Fetch machines and sites from API
  useEffect(() => {
    const fetchMachines = async () => {
      try {
        setLoading((prev) => ({ ...prev, machines: true }));
        const response = await api.get("/machinery");
        setMachines(response.data);
      } catch (error) {
        console.error("Error fetching machines:", error);
        toast({
          title: "Error",
          description: "Failed to load machines. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading((prev) => ({ ...prev, machines: false }));
      }
    };

    const fetchSites = async () => {
      try {
        setLoading((prev) => ({ ...prev, sites: true }));
        const response = await api.get("/sites");
        setSites(response.data);
      } catch (error) {
        console.error("Error fetching sites:", error);
        toast({
          title: "Error",
          description: "Failed to load sites. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading((prev) => ({ ...prev, sites: false }));
      }
    };

    fetchMachines();
    fetchSites();
  }, [toast]);

  // Handle machine selection
  const handleMachineChange = (value) => {
    setSelectedMachine(value);
    const machine = machines.find((m) => m.id.toString() === value);
    if (machine) {
      setCurrentSiteId(machine.site.id);
      setCurrentSiteName(machine.site.name);
      setCurrentCompany(machine.site.address);
    }
    setMachineOpen(false);
  };

  // Handle destination site selection
  const handleSiteChange = (siteId) => {
    setDestinationSiteId(siteId);
    const site = sites.find((s) => s.id === siteId);
    if (site) {
      setDestinationSiteName(site.name);
    }
    setSiteOpen(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get form data from the form elements
    const formData = new FormData(e.currentTarget);
    const transferReason = formData.get("transferReason");
    const vehicleNo = formData.get("vehicleNo");
    const driverName = formData.get("driverName");
    const mobileNo = formData.get("mobileNo");
    const buyerName = formData.get("buyerName");
    const buyerContact = formData.get("buyerContact");
    const saleAmount = formData.get("saleAmount");
    const scrapVendor = formData.get("scrapVendor");
    const scrapValue = formData.get("scrapValue");

    // Validate form based on transfer type
    if (!selectedMachine || !transferReason) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    if (transferType === "site_transfer" && !destinationSiteId) {
      toast({
        title: "Validation Error",
        description: "Please select a destination site",
        variant: "destructive",
      });
      return;
    }

    if (transferType === "sell" && (!buyerName || !buyerContact)) {
      toast({
        title: "Validation Error",
        description: "Please fill all buyer details",
        variant: "destructive",
      });
      return;
    }

    if (transferType === "scrap" && !scrapVendor) {
      toast({
        title: "Validation Error",
        description: "Please enter scrap vendor details",
        variant: "destructive",
      });
      return;
    }

    if (
      transferType === "site_transfer" &&
      selfCarrying &&
      (!vehicleNo || !driverName || !mobileNo)
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill all transport details",
        variant: "destructive",
      });
      return;
    }

    // Prepare request payload based on transfer type
    const requestPayload = {
      machineId: Number.parseInt(selectedMachine),
      currentSiteId: currentSiteId,
      reason: transferReason,
      requestType:
        transferType === "site_transfer"
          ? "Site Transfer"
          : transferType === "sell"
          ? "Sell Machine"
          : "Scrap Machine",
    };

    // Add type-specific fields
    if (transferType === "site_transfer") {
      requestPayload.destinationSiteId = destinationSiteId;

      if (selfCarrying) {
        requestPayload.selfCarryingVehicle = true;
        requestPayload.transportDetails = {
          vehicleNumber: vehicleNo,
          driverName: driverName,
          mobileNumber: mobileNo,
        };
      }
    } else if (transferType === "sell") {
      requestPayload.buyerDetails = {
        name: buyerName,
        contactNumber: buyerContact,
        sellAmount: Number.parseFloat(saleAmount) || 0,
      };
    } else if (transferType === "scrap") {
      requestPayload.vendorDetails = {
        name: scrapVendor,
        value: scrapValue ? Number.parseFloat(scrapValue) : undefined,
      };
    }

    try {
      // Submit form data to API
      const response = await api.post("/transfer", requestPayload);

      // Show success message
      toast({
        title: "Request Submitted",
        description:
          transferType === "site_transfer"
            ? "Your machine transfer request has been submitted successfully"
            : transferType === "sell"
            ? "Your machine sale request has been submitted successfully"
            : "Your machine scrap request has been submitted successfully",
      });

      // Redirect to dashboard
      navigate(baseUrl);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get available destination sites (excluding current site)
  const availableDestinationSites = sites.filter(
    (site) => site.id !== currentSiteId
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Machine Request Form</CardTitle>
        <CardDescription>
          Request a machine transfer, sale, or scrapping
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="machine">Select Machine</Label>
              <Popover open={machineOpen} onOpenChange={setMachineOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={machineOpen}
                    className="w-full justify-between"
                    disabled={loading.machines}
                  >
                    {loading.machines
                      ? "Loading machines..."
                      : selectedMachine
                      ? machines.find(
                          (machine) => machine.id.toString() === selectedMachine
                        )?.machineName
                      : "Select a machine..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search machines..." />
                    <CommandEmpty>No machine found.</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {machines.map((machine) => (
                          <CommandItem
                            key={machine.id}
                            value={machine.id.toString()}
                            onSelect={() =>
                              handleMachineChange(machine.id.toString())
                            }
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedMachine === machine.id.toString()
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {machine.machineName} - {machine.erpCode}
                          </CommandItem>
                        ))}
                      </CommandList>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentSite">Current Site</Label>
                <Input id="currentSite" value={currentSiteName} readOnly />
                <input
                  type="hidden"
                  name="currentSiteId"
                  value={currentSiteId || ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentCompany">Current Company</Label>
                <Input id="currentCompany" value={currentCompany} readOnly />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transferType">Request Type</Label>
              <Select value={transferType} onValueChange={setTransferType}>
                <SelectTrigger id="transferType">
                  <SelectValue placeholder="Select request type" />
                </SelectTrigger>
                <SelectContent>
                  {transferTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {transferType === "site_transfer" && (
              <div className="space-y-2">
                <Label htmlFor="destinationSite">Destination Site</Label>
                <Popover open={siteOpen} onOpenChange={setSiteOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={siteOpen}
                      className="w-full justify-between"
                      disabled={!currentSiteId || loading.sites}
                    >
                      {loading.sites
                        ? "Loading sites..."
                        : destinationSiteName || "Select destination site..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search sites..." />
                      <CommandEmpty>No site found.</CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {availableDestinationSites.map((site) => (
                            <CommandItem
                              key={site.id}
                              value={site.name}
                              onSelect={() => handleSiteChange(site.id)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  destinationSiteId === site.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {site.name}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <input
                  type="hidden"
                  name="destinationSiteId"
                  value={destinationSiteId || ""}
                />
              </div>
            )}

            {transferType === "sell" && (
              <div className="space-y-4 border rounded-md p-4">
                <h3 className="text-sm font-medium">Buyer Details</h3>

                <div className="space-y-2">
                  <Label htmlFor="buyerName">Buyer Name/Company</Label>
                  <Input
                    id="buyerName"
                    name="buyerName"
                    placeholder="Enter buyer name or company"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buyerContact">Buyer Contact</Label>
                  <Input
                    id="buyerContact"
                    name="buyerContact"
                    placeholder="Enter buyer contact number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="saleAmount">Sale Amount</Label>
                  <Input
                    id="saleAmount"
                    name="saleAmount"
                    type="number"
                    step="0.01"
                    placeholder="Enter sale amount"
                  />
                </div>
              </div>
            )}

            {transferType === "scrap" && (
              <div className="space-y-4 border rounded-md p-4">
                <h3 className="text-sm font-medium">Scrap Details</h3>

                <div className="space-y-2">
                  <Label htmlFor="scrapVendor">Scrap Vendor</Label>
                  <Input
                    id="scrapVendor"
                    name="scrapVendor"
                    placeholder="Enter scrap vendor name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scrapValue">Scrap Value (if any)</Label>
                  <Input
                    id="scrapValue"
                    name="scrapValue"
                    type="number"
                    step="0.01"
                    placeholder="Enter scrap value"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="transferReason">Reason</Label>
              <Textarea
                id="transferReason"
                name="transferReason"
                placeholder={
                  transferType === "site_transfer"
                    ? "Enter reason for transfer"
                    : transferType === "sell"
                    ? "Enter reason for selling the machine"
                    : "Enter reason for scrapping the machine"
                }
              />
            </div>

            {transferType === "site_transfer" && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="self-carrying"
                  checked={selfCarrying}
                  onCheckedChange={setSelfCarrying}
                />
                <label
                  htmlFor="self-carrying"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Self-Carrying Vehicle
                </label>
              </div>
            )}

            {transferType === "site_transfer" && selfCarrying && (
              <div className="space-y-4 border rounded-md p-4">
                <h3 className="text-sm font-medium">Transport Details</h3>

                <div className="space-y-2">
                  <Label htmlFor="vehicleNo">Vehicle Number</Label>
                  <Input
                    id="vehicleNo"
                    name="vehicleNo"
                    placeholder="Enter vehicle number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="driverName">Driver Name</Label>
                  <Input
                    id="driverName"
                    name="driverName"
                    placeholder="Enter driver name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobileNo">Mobile Number</Label>
                  <Input
                    id="mobileNo"
                    name="mobileNo"
                    placeholder="Enter mobile number"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            type="button"
            onClick={() => navigate(baseUrl)}
          >
            Cancel
          </Button>
          <Button type="submit">Submit Request</Button>
        </CardFooter>
      </form>
    </Card>
  );
}