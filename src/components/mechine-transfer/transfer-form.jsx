"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data for demonstration - replace with your API calls
const machines = [
  {
    id: "M001",
    name: "Excavator XL2000",
    currentSite: "Site A",
    currentCompany: "Company X",
  },
  {
    id: "M002",
    name: "Bulldozer B500",
    currentSite: "Site C",
    currentCompany: "Company Y",
  },
  {
    id: "M003",
    name: "Crane CR300",
    currentSite: "Site B",
    currentCompany: "Company X",
  },
  {
    id: "M004",
    name: "Loader L100",
    currentSite: "Site A",
    currentCompany: "Company Z",
  },
  {
    id: "M005",
    name: "Excavator XL1000",
    currentSite: "Site D",
    currentCompany: "Company Y",
  },
]

const sites = ["Site A", "Site B", "Site C", "Site D", "Site E", "Site F", "Site G", "Site H"]

// Update the TransferForm component to include transfer type selection
// Add this after the imports section
const transferTypes = [
  { id: "site_transfer", name: "Site Transfer" },
  { id: "sell", name: "Sell Machine" },
  { id: "scrap", name: "Scrap Machine" },
]

// Replace the entire TransferForm function with this updated version
export function TransferForm({ baseUrl = "/machine-transfer" }) {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [selectedMachine, setSelectedMachine] = useState("")
  const [currentSite, setCurrentSite] = useState("")
  const [currentCompany, setCurrentCompany] = useState("")
  const [transferType, setTransferType] = useState("site_transfer")
  const [selfCarrying, setSelfCarrying] = useState(false)
  const [destinationSite, setDestinationSite] = useState("")

  // For the dropdowns
  const [machineOpen, setMachineOpen] = useState(false)
  const [siteOpen, setSiteOpen] = useState(false)

  // Handle machine selection
  const handleMachineChange = (value) => {
    setSelectedMachine(value)
    const machine = machines.find((m) => m.id === value)
    if (machine) {
      setCurrentSite(machine.currentSite)
      setCurrentCompany(machine.currentCompany)
    }
    setMachineOpen(false)
  }

  // Handle destination site selection
  const handleSiteChange = (value) => {
    setDestinationSite(value)
    setSiteOpen(false)
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    // Get form data from the form elements
    const formData = new FormData(e.target)
    const transferReason = formData.get("transferReason")
    const vehicleNo = formData.get("vehicleNo")
    const driverName = formData.get("driverName")
    const mobileNo = formData.get("mobileNo")
    const buyerName = formData.get("buyerName")
    const buyerContact = formData.get("buyerContact")
    const saleAmount = formData.get("saleAmount")
    const scrapVendor = formData.get("scrapVendor")
    const scrapValue = formData.get("scrapValue")

    // Validate form based on transfer type
    if (!selectedMachine || !transferReason) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      })
      return
    }

    if (transferType === "site_transfer" && !destinationSite) {
      toast({
        title: "Validation Error",
        description: "Please select a destination site",
        variant: "destructive",
      })
      return
    }

    if (transferType === "sell" && (!buyerName || !buyerContact)) {
      toast({
        title: "Validation Error",
        description: "Please fill all buyer details",
        variant: "destructive",
      })
      return
    }

    if (transferType === "scrap" && !scrapVendor) {
      toast({
        title: "Validation Error",
        description: "Please enter scrap vendor details",
        variant: "destructive",
      })
      return
    }

    if (transferType === "site_transfer" && selfCarrying && (!vehicleNo || !driverName || !mobileNo)) {
      toast({
        title: "Validation Error",
        description: "Please fill all transport details",
        variant: "destructive",
      })
      return
    }

    // Submit form data
    // In a real application, you would send this data to your API
    console.log({
      machineId: selectedMachine,
      currentSite,
      currentCompany,
      transferType,
      destinationSite: transferType === "site_transfer" ? destinationSite : null,
      transferReason,
      selfCarrying: transferType === "site_transfer" ? selfCarrying : false,
      vehicleNo: transferType === "site_transfer" && selfCarrying ? vehicleNo : null,
      driverName: transferType === "site_transfer" && selfCarrying ? driverName : null,
      mobileNo: transferType === "site_transfer" && selfCarrying ? mobileNo : null,
      buyerName: transferType === "sell" ? buyerName : null,
      buyerContact: transferType === "sell" ? buyerContact : null,
      saleAmount: transferType === "sell" ? saleAmount : null,
      scrapVendor: transferType === "scrap" ? scrapVendor : null,
      scrapValue: transferType === "scrap" ? scrapValue : null,
    })

    // Show success message
    toast({
      title: "Request Submitted",
      description:
        transferType === "site_transfer"
          ? "Your machine transfer request has been submitted successfully"
          : transferType === "sell"
            ? "Your machine sale request has been submitted successfully"
            : "Your machine scrap request has been submitted successfully",
    })

    // Redirect to dashboard
    navigate(baseUrl)
  }

  // Get available destination sites (excluding current site)
  const availableDestinationSites = sites.filter((site) => site !== currentSite)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Machine Request Form</CardTitle>
        <CardDescription>Request a machine transfer, sale, or scrapping</CardDescription>
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
                  >
                    {selectedMachine
                      ? machines.find((machine) => machine.id === selectedMachine)?.name
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
                            value={machine.id}
                            onSelect={() => handleMachineChange(machine.id)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedMachine === machine.id ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {machine.name} - {machine.currentSite}
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
                <Input id="currentSite" value={currentSite} readOnly />
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
                      disabled={!currentSite}
                    >
                      {destinationSite || "Select destination site..."}
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
                            <CommandItem key={site} value={site} onSelect={() => handleSiteChange(site)}>
                              <Check
                                className={cn("mr-2 h-4 w-4", destinationSite === site ? "opacity-100" : "opacity-0")}
                              />
                              {site}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <input type="hidden" name="destinationSite" value={destinationSite} />
              </div>
            )}

            {transferType === "sell" && (
              <div className="space-y-4 border rounded-md p-4">
                <h3 className="text-sm font-medium">Buyer Details</h3>

                <div className="space-y-2">
                  <Label htmlFor="buyerName">Buyer Name/Company</Label>
                  <Input id="buyerName" name="buyerName" placeholder="Enter buyer name or company" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buyerContact">Buyer Contact</Label>
                  <Input id="buyerContact" name="buyerContact" placeholder="Enter buyer contact number" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="saleAmount">Sale Amount</Label>
                  <Input id="saleAmount" name="saleAmount" type="number" placeholder="Enter sale amount" />
                </div>
              </div>
            )}

            {transferType === "scrap" && (
              <div className="space-y-4 border rounded-md p-4">
                <h3 className="text-sm font-medium">Scrap Details</h3>

                <div className="space-y-2">
                  <Label htmlFor="scrapVendor">Scrap Vendor</Label>
                  <Input id="scrapVendor" name="scrapVendor" placeholder="Enter scrap vendor name" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scrapValue">Scrap Value (if any)</Label>
                  <Input id="scrapValue" name="scrapValue" type="number" placeholder="Enter scrap value" />
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
                <Checkbox id="self-carrying" checked={selfCarrying} onCheckedChange={setSelfCarrying} />
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
                  <Input id="vehicleNo" name="vehicleNo" placeholder="Enter vehicle number" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="driverName">Driver Name</Label>
                  <Input id="driverName" name="driverName" placeholder="Enter driver name" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobileNo">Mobile Number</Label>
                  <Input id="mobileNo" name="mobileNo" placeholder="Enter mobile number" />
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => navigate(baseUrl)}>
            Cancel
          </Button>
          <Button type="submit">Submit Request</Button>
        </CardFooter>
      </form>
    </Card>
  )
}


// "use client";

// import { useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";
// import { Label } from "@/components/ui/label";
// import { useNavigate } from "react-router";
// import { useSelector } from "react-redux";
// import { useForm } from "react-hook-form";

// const sites = ["Site A", "Site B", "Site C", "Site D"];

// const transferTypes = [
//   { id: "site_transfer", name: "Site Transfer" },
//   { id: "sell", name: "Sell Machine" },
//   { id: "scrap", name: "Scrap Machine" },
// ];

// export function TransferForm({ baseUrl = "/machine-transfer" }) {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const { data: machines = [], loading } = useSelector(
//     (state) => state.machines || {}
//   );
//   const { data: sites = [] } = useSelector((state) => state.sites || {});

//   const [currentSiteName, setCurrentSiteName] = useState("");
//   const [currentSiteId, setCurrentSiteId] = useState("");
//   const [currentCompany, setCurrentCompany] = useState("");
//   const [selfCarrying, setSelfCarrying] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     formState: { errors },
//   } = useForm();

//   const selectedMachine = watch("machineId");
//   const transferType = watch("transferType", "site_transfer");

//   useEffect(() => {
//     const machine = machines.find((m) => m.id == selectedMachine);
//     if (machine) {
//       setCurrentSiteName(machine.site.name);
//       setCurrentSiteId(machine.site.id);
//       setCurrentCompany(machine.ownerName);
//     }
//   }, [selectedMachine, machines]);

//   const onSubmit = (data) => {
//     if (
//       (transferType === "site_transfer" && !data.destinationSite) ||
//       (transferType === "sell" && (!data.buyerName || !data.buyerContact)) ||
//       (transferType === "scrap" && !data.scrapVendor) ||
//       !selectedMachine ||
//       !data.transferReason ||
//       (transferType === "site_transfer" &&
//         selfCarrying &&
//         (!data.vehicleNo || !data.driverName || !data.mobileNo))
//     ) {
//       toast({
//         title: "Validation Error",
//         description: "Please fill all required fields",
//         variant: "destructive",
//       });
//       return;
//     }

//     console.log({
//       ...data,
//       currentSite,
//       currentCompany,
//       selfCarrying,
//     });

//     toast({
//       title: "Request Submitted",
//       description:
//         transferType === "site_transfer"
//           ? "Your machine transfer request has been submitted successfully"
//           : transferType === "sell"
//           ? "Your machine sale request has been submitted successfully"
//           : "Your machine scrap request has been submitted successfully",
//     });

//     navigate(baseUrl);
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Machine Request Form</CardTitle>
//         <CardDescription>
//           Request a machine transfer, sale, or scrapping
//         </CardDescription>
//       </CardHeader>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <CardContent className="space-y-4">
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="machine">Select Machine</Label>
//               <Select onValueChange={(value) => setValue("machineId", value)}>
//                 <SelectTrigger id="machine">
//                   <SelectValue
//                     placeholder="Select a machine"
//                     children={
//                       machines.find((m) => m.id == watch("machineId"))
//                         ?.machineName
//                     }
//                   />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {machines.map((machine) => (
//                     <SelectItem key={machine.id} value={machine.id}>
//                       {machine.machineName}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="currentSite">Current Site</Label>
//                 <Input id="currentSite" value={currentSiteName} readOnly />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="currentCompany">Current Company</Label>
//                 <Input id="currentCompany" value={currentCompany} readOnly />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="transferType">Request Type</Label>
//               <Select
//                 onValueChange={(value) => setValue("transferType", value)}
//               >
//                 <SelectTrigger id="transferType">
//                   <SelectValue placeholder="Select request type" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {transferTypes.map((type) => (
//                     <SelectItem key={type.id} value={type.id}>
//                       {type.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {transferType === "site_transfer" && (
//               <div className="space-y-2">
//                 <Label htmlFor="destinationSiteId">Destination Site</Label>
//                 <Select
//                   onValueChange={(value) => setValue("destinationSiteId", value)}
//                 >
//                   <SelectTrigger id="destinationSite">
//                     <SelectValue
//                       placeholder="Select destination site"
//                       children={
//                         sites.find((s) => s.id == watch("destinationSiteId"))
//                           ?.name
//                       }
//                     />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {sites
//                       // .filter((site) => site.id !== currentSiteId)
//                       .map((site) => (
//                         <SelectItem key={site.id} value={site.id}>
//                           {site.name}
//                         </SelectItem>
//                       ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             )}

//             {transferType === "sell" && (
//               <div className="space-y-4 border rounded-md p-4">
//                 <h3 className="text-sm font-medium">Buyer Details</h3>
//                 <div className="space-y-2">
//                   <Label htmlFor="buyerName">Buyer Name/Company</Label>
//                   <Input
//                     {...register("buyerName")}
//                     placeholder="Enter buyer name or company"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="buyerContact">Buyer Contact</Label>
//                   <Input
//                     {...register("buyerContact")}
//                     placeholder="Enter buyer contact number"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="saleAmount">Sale Amount</Label>
//                   <Input
//                     {...register("saleAmount")}
//                     type="number"
//                     placeholder="Enter sale amount"
//                   />
//                 </div>
//               </div>
//             )}

//             {transferType === "scrap" && (
//               <div className="space-y-4 border rounded-md p-4">
//                 <h3 className="text-sm font-medium">Scrap Details</h3>
//                 <div className="space-y-2">
//                   <Label htmlFor="scrapVendor">Scrap Vendor</Label>
//                   <Input
//                     {...register("scrapVendor")}
//                     placeholder="Enter scrap vendor name"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="scrapValue">Scrap Value (if any)</Label>
//                   <Input
//                     {...register("scrapValue")}
//                     type="number"
//                     placeholder="Enter scrap value"
//                   />
//                 </div>
//               </div>
//             )}

//             <div className="space-y-2">
//               <Label htmlFor="transferReason">Reason</Label>
//               <Textarea
//                 {...register("transferReason")}
//                 placeholder={
//                   transferType === "site_transfer"
//                     ? "Enter reason for transfer"
//                     : transferType === "sell"
//                     ? "Enter reason for selling the machine"
//                     : "Enter reason for scrapping the machine"
//                 }
//               />
//             </div>

//             {transferType === "site_transfer" && (
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="self-carrying"
//                   checked={selfCarrying}
//                   onCheckedChange={setSelfCarrying}
//                 />
//                 <label
//                   htmlFor="self-carrying"
//                   className="text-sm font-medium leading-none"
//                 >
//                   Self-Carrying Vehicle
//                 </label>
//               </div>
//             )}

//             {transferType === "site_transfer" && selfCarrying && (
//               <div className="space-y-4 border rounded-md p-4">
//                 <h3 className="text-sm font-medium">Transport Details</h3>
//                 <div className="space-y-2">
//                   <Label htmlFor="vehicleNo">Vehicle Number</Label>
//                   <Input
//                     {...register("vehicleNo")}
//                     placeholder="Enter vehicle number"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="driverName">Driver Name</Label>
//                   <Input
//                     {...register("driverName")}
//                     placeholder="Enter driver name"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="mobileNo">Mobile Number</Label>
//                   <Input
//                     {...register("mobileNo")}
//                     placeholder="Enter mobile number"
//                   />
//                 </div>
//               </div>
//             )}
//           </div>
//         </CardContent>
//         <CardFooter className="flex justify-between">
//           <Button
//             variant="outline"
//             type="button"
//             onClick={() => navigate(baseUrl)}
//           >
//             Cancel
//           </Button>
//           <Button type="submit">Submit Request</Button>
//         </CardFooter>
//       </form>
//     </Card>
//   );
// }
