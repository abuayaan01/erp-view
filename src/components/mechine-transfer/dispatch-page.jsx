"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Send, FileDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TransferChallan } from "./transfer-challan";
import api from "@/services/api/api-service";
import Loader from "../ui/loader";

// Update the mock data to include the new transfer types
// Replace the approvedTransfers array with this updated one

export function DispatchPage() {
  const { toast } = useToast();
  const [transfers, setTransfers] = useState([]);
  const [transportDetails, setTransportDetails] = useState({});
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [challanOpen, setChallanOpen] = useState(false);
  const [dispatchLoader, setDispatchLoader] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await api.get("/transfers/approved");
        if (res) {
          setTransfers(res.data);
        }
      } catch (error) {
        console.log(error);
        toast({
          title: "Something went wrong!",
          description: "Could not fetch list.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleInputChange = (transferId, field, value) => {
    setTransportDetails((prev) => ({
      ...prev,
      [transferId]: {
        ...prev[transferId],
        [field]: value,
      },
    }));
  };

  // Update the handleDispatch function to handle different transfer types
  // Replace the handleDispatch function with this updated one
  const handleDispatch = (transfer) => {
    setDispatchLoader(true);

    const details = transfer.transportDetails || {};

    // Validate form
    if (
      !details.vehicleNumber ||
      !details.driverName ||
      !details.mobileNumber
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill all transport details",
        variant: "destructive",
      });
      return;
    }

    // In a real application, you would send this data to your API
    console.log(`Dispatching transfer ${transfer.id} with transport details:`, {
      transportDetails: {
        vehicleNumber: details.vehicleNumber,
        driverName: details.driverName,
        mobileNumber: details.mobileNumber,
      },
    });

    api
      .put(`/transfer/${transfer.id}/dispatch`, {
        transportDetails: {
          vehicleNumber: details.vehicleNumber,
          driverName: details.driverName,
          mobileNumber: details.mobileNumber,
        },
      })
      .then((response) => {
        setTransfers(transfers.filter((t) => t.id !== transfer.id));
      })
      .catch((error) => {
        console.log(error);
        setDispatchLoader(false);
      })
      .finally(() => {
        setDispatchLoader(false);
      });
    // Remove the transfer from the list

    // Show success message based on transfer type
    let message = "";
    if (transfer.requestType === "Site Transfer") {
      message = `${transfer.machine.machineName} has been dispatched to ${transfer.destinationSite.name}`;
    } else if (transfer.requestType === "Sell Machine") {
      message = `${transfer.machine.machineName} has been dispatched to buyer: ${transfer.buyerName}`;
    } else if (transfer.requestType === "Scrap Machine") {
      message = `${transfer.machine.machineName} has been dispatched to Scrap Machine vendor: ${transfer.scrapVendor}`;
    }

    toast({
      title: "Machine Dispatched",
      description: message,
      variant: "default",
    });
  };

  const handleViewChallan = (transfer) => {
    // Update the transfer with the current transport details
    const details = transportDetails[transfer.id] || {};
    const updatedTransfer = {
      ...transfer,
      transportDetails: {
        vehicleNumber: details.vehicleNumber || "",
        driverName: details.driverName || "",
        mobileNumber: details.mobileNumber || "",
      },
    };

    setSelectedTransfer(updatedTransfer);
    setChallanOpen(true);
  };

  return loading ? (
    <div className="mx-auto min-h-[70vh] flex flex-col">
      <div className="flex-1 flex justify-center items-center">
        <Loader />
      </div>
    </div>
  ) : (
    <div className="space-y-6">
      {transfers.length > 0 ? (
        transfers.map((transfer) => (
          <Card key={transfer.id}>
            {/* Update the CardHeader to show different titles based on transfer type
            Replace the CardHeader section in the map function with this updated one */}
            <CardHeader>
              <CardTitle className="text-xl">
                {transfer.requestType === "Site Transfer"
                  ? "Dispatch: "
                  : transfer.requestType === "Sell Machine"
                  ? "Deliver to Buyer: "
                  : "Deliver to Scrap Vendor: "}
                {transfer.id}
              </CardTitle>
              <CardDescription>
                Approved on {transfer.approvedAt} by {transfer.approver.name}
              </CardDescription>
            </CardHeader>
            {/* Update the CardContent to show different information based on transfer type
            Replace the CardContent section in the map function with this updated one */}
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Machine Details</h3>
                  <p className="text-sm text-muted-foreground">
                    {transfer.machine.machineName} ({transfer.machineId})
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Current Site</h3>
                  <p className="text-sm text-muted-foreground">
                    {transfer.currentSite.name}
                  </p>
                </div>
              </div>

              {transfer.requestType === "Site Transfer" && (
                <div>
                  <h3 className="text-sm font-medium">Destination Site</h3>
                  <p className="text-sm text-muted-foreground">
                    {transfer.destinationSite.name}
                  </p>
                </div>
              )}

              {transfer.requestType === "Sell Machine" && (
                <div className="border rounded-md p-3 space-y-2">
                  <h3 className="text-sm font-medium">Buyer Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Buyer Name
                      </p>
                      <p className="text-sm">
                        {transfer.buyerDetails.buyerName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Buyer Contact
                      </p>
                      <p className="text-sm">
                        {transfer.buyerDetails.buyerContact}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Sale Amount
                      </p>
                      <p className="text-sm">
                        {transfer.buyerDetails.saleAmount || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {transfer.requestType === "Scrap Machine" && (
                <div className="border rounded-md p-3 space-y-2">
                  <h3 className="text-sm font-medium">Scrap Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Scrap Vendor
                      </p>
                      <p className="text-sm">
                        {transfer.scrapDetails.scrapVendor}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Scrap Value
                      </p>
                      <p className="text-sm">
                        {transfer.scrapDetails.scrapValue || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="border rounded-md p-4 space-y-4">
                <h3 className="text-sm font-medium">Transport Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`vehicleNumber-${transfer.id}`}>
                      Vehicle Number
                    </Label>
                    <Input
                      id={`vehicleNumber-${transfer.id}`}
                      placeholder="Enter vehicle number"
                      value={transfer.transportDetails?.vehicleNumber || ""}
                      onChange={(e) =>
                        handleInputChange(
                          transfer.id,
                          "vehicleNumber",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`driverName-${transfer.id}`}>
                      Driver Name
                    </Label>
                    <Input
                      id={`driverName-${transfer.id}`}
                      placeholder="Enter driver name"
                      value={transfer.transportDetails?.driverName || ""}
                      onChange={(e) =>
                        handleInputChange(
                          transfer.id,
                          "driverName",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`mobileNumber-${transfer.id}`}>
                      Driver Contact
                    </Label>
                    <Input
                      id={`mobileNumber-${transfer.id}`}
                      placeholder="Enter driver contact"
                      value={transfer.transportDetails?.mobileNumber || ""}
                      onChange={(e) =>
                        handleInputChange(
                          transfer.id,
                          "mobileNumber",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => handleViewChallan(transfer)}
              >
                <FileDown className="mr-2 h-4 w-4" />
                View Challan
              </Button>
              {/* Update the Button text based on transfer type
              Replace the Button in the CardFooter with this updated one */}
              <Button
                loading={dispatchLoader}
                onClick={() => handleDispatch(transfer)}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                <Send className="mr-2 h-4 w-4" />
                {transfer.requestType === "Site Transfer"
                  ? "Dispatch Machine"
                  : transfer.requestType === "Sell Machine"
                  ? "Deliver to Buyer"
                  : "Deliver to Scrap Vendor"}
              </Button>
            </CardFooter>
          </Card>
        ))
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Approved Transfers</CardTitle>
            <CardDescription>
              There are no approved machine transfers waiting for dispatch
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <Dialog open={challanOpen} onOpenChange={setChallanOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedTransfer && <TransferChallan transfer={selectedTransfer} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
