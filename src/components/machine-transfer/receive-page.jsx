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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";
import api from "@/services/api/api-service";
import Loader from "../ui/loader";

// Update the mock data to include the new transfer types
// Replace the dispatchedTransfers array with this updated one

export function ReceivePage() {
  const { toast } = useToast();
  const [transfers, setTransfers] = useState([]);
  const [remarks, setRemarks] = useState({});
  const [receiveloading, setReceiveloading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await api.get("/transfers/dispatched");
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

  const handleRemarksChange = (transferId, value) => {
    setRemarks((prev) => ({
      ...prev,
      [transferId]: value,
    }));
  };

  // Update the handleReceive function to handle different transfer types
  // Replace the handleReceive function with this updated one
  const handleReceive = (transfer) => {
    // In a real application, you would send this data to your API
    console.log(
      `Receiving transfer ${transfer.id} with remarks:`,
      remarks[transfer.id] || "No remarks"
    );
    setReceiveloading(true);
    api
      .put(`/transfer/${transfer.id}/receive`, {
        remarks: remarks[transfer.id] || "No remarks",
      })
      .then((response) => {
        console.log("Dispatch response:", response.data);
        setTransfers(transfers.filter((t) => t.id !== transfer.id));
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setReceiveloading(false);
      });

    // Show success message based on transfer type
    let message = "";
    if (transfer.requestType === "Site Transfer") {
      message = `${transfer.machine.machineName} has been received at ${transfer.destinationSite.name}`;
    } else if (transfer.requestType === "Sell") {
      message = `${transfer.machine.machineName} has been delivered to buyer: ${transfer.buyerName}`;
    } else if (transfer.requestType === "scrap") {
      message = `${transfer.machine.machineName} has been delivered to scrap vendor: ${transfer.scrapVendor}`;
    }

    toast({
      title:
        transfer.requestType === "Site Transfer"
          ? "Machine Received"
          : "Delivery Confirmed",
      description: message,
      variant: "default",
    });
  };

  const s = {
    id: "TR-005",
    machineName: "Excavator XL1000",
    machineId: "M005",
    // currentSite.name: "Site D",
    // destinationSite.name: "Site B",
    // requester.name: "Jane Smith",
    requestDate: "2023-10-01",
    reason: "Machine maintenance completed, returning to original site",
    type: "Site Transfer",
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
            {/* Update the CardHeader to show different titles based on transfer type */}
            {/* Replace the CardHeader section in the map function with this updated one */}
            <CardHeader>
              <CardTitle className="text-xl">
                {transfer.requestType === "Site Transfer"
                  ? "Receive: "
                  : transfer.requestType === "Sell"
                  ? "Confirm Buyer Delivery: "
                  : "Confirm Scrap Delivery: "}
                {transfer.id}
              </CardTitle>
              <CardDescription>
                Dispatched on {transfer.dispatchedAt} by{" "}
                {transfer.dispatcher?.name}
              </CardDescription>
            </CardHeader>

            {/* Update the CardContent to show different information based on transfer type */}
            {/* Replace the CardContent section in the map function with this updated one */}
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Machine Details</h3>
                  <p className="text-sm text-muted-foreground">
                    {transfer.machine.machineName} ({transfer.machineId})
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">From Site</h3>
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
                        {transfer.buyerDetails?.buyerName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Buyer Contact
                      </p>
                      <p className="text-sm">
                        {transfer.buyerDetails?.buyerContact}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {transfer.requestType === "Scrap Machine" && (
                <div className="border rounded-md p-3 space-y-2">
                  <h3 className="text-sm font-medium">Scrap Details</h3>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Scrap Vendor
                    </p>
                    <p className="text-sm">
                      {transfer.scrapDetails?.scrapVendor}
                    </p>
                  </div>
                </div>
              )}

              <div className="border rounded-md p-4 space-y-2">
                <h3 className="text-sm font-medium">Transport Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Vehicle Number
                    </p>
                    <p className="text-sm">
                      {transfer.transportDetails?.vehicleNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Driver Name</p>
                    <p className="text-sm">
                      {transfer.transportDetails.driverName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Driver Contact
                    </p>
                    <p className="text-sm">
                      {transfer.transportDetails.mobileNumber}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">
                  Remarks (Machine Condition, Issues, etc.)
                </h3>
                <Textarea
                  placeholder="Enter remarks about the machine condition"
                  value={remarks[transfer.id] || ""}
                  onChange={(e) =>
                    handleRemarksChange(transfer.id, e.target.value)
                  }
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>

            {/* Update the Button text based on transfer type */}
            {/* Replace the Button in the CardFooter with this updated one */}
            <CardFooter className="flex justify-end">
              <Button
                loading={receiveloading}
                onClick={() => handleReceive(transfer)}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                <Download className="mr-2 h-4 w-4" />
                {transfer.requestType === "Site Transfer"
                  ? "Receive Machine"
                  : "Confirm Delivery"}
              </Button>
            </CardFooter>
          </Card>
        ))
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Dispatched Transfers</CardTitle>
            <CardDescription>
              There are no dispatched machine transfers waiting to be received
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
