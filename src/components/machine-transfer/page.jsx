"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MachineTransferDetail from "./transfer-details";

// Example API response
const exampleResponse = {
  status: true,
  message: "Success",
  data: {
    id: 11,
    name: "MT-TR-0011",
    machineId: 57,
    currentSiteId: 34,
    destinationSiteId: 33,
    requestType: "Site Transfer",
    status: "Approved",
    selfCarryingVehicle: false,
    reason: "testing",
    requestedBy: 21,
    approvedBy: 1,
    rejectedBy: null,
    dispatchedBy: null,
    receivedBy: null,
    requestedAt: null,
    approvedAt: "2025-05-20T23:29:37.938Z",
    dispatchedAt: null,
    receivedAt: null,
    rejectedAt: null,
    transportDetails: {
      vehicleNumber: "JH01FFGKF",
      driverName: "Jax",
      mobileNumber: "0097785546",
    },
    scrapDetails: null,
    buyerDetails: null,
    remarks: null,
    rejectionRemarks: null,
    finalRemarks: null,
    files: null,
    createdAt: "2025-05-20T23:28:17.986Z",
    updatedAt: "2025-05-20T23:29:37.938Z",
    deletedAt: null,
    machine: {
      machineName: "Marshall Valencia",
      registrationNumber: null,
      erpCode: "ERP-0057",
      machineNumber: null,
    },
    currentSite: {
      id: 34,
      name: "NTPC Patratu, Ramgarh, Jharkhand Project Site",
    },
    destinationSite: {
      id: 33,
      name: "Logistic Park, Nirsha, Dhanbad, Jharkhand Project Site",
    },
    requester: {
      id: 21,
      name: "Kaif",
    },
    approver: {
      id: 1,
      name: "Manish",
    },
    dispatcher: null,
    receiver: null,
  },
  timestamp: "2025-05-21T20:15:59.330Z",
};

export default function TransferDetailPage() {
  const params = useParams();
  const [transferData, setTransferData] = useState(exampleResponse);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransferData = async () => {
      try {
        // In a real app, you would fetch the data from your API
        // const response = await fetch(`/api/machine-transfers/${params.id}`)
        // const data = await response.json()
        // setTransferData(data)

        // For demo purposes, we'll use the example response
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        setTransferData(exampleResponse);
        setLoading(false);
      } catch (err) {
        setError("Failed to load transfer details");
        setLoading(false);
      }
    };

    fetchTransferData();
  }, [params.id]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // In a real app, you would fetch the data from your API
      // const response = await fetch(`/api/machine-transfers/${params.id}`)
      // const data = await response.json()
      // setTransferData(data)

      // For demo purposes, we'll use the example response with a simulated status change
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Simulate a status change based on current status
      const newStatus =
        transferData.data.status === "Approved"
          ? "Dispatched"
          : transferData.data.status === "Dispatched"
          ? "Received"
          : transferData.data.status === "Pending"
          ? "Approved"
          : transferData.data.status;

      setTransferData({
        ...transferData,
        data: {
          ...transferData.data,
          status: newStatus,
          dispatchedAt:
            newStatus === "Dispatched"
              ? new Date().toISOString()
              : transferData.data.dispatchedAt,
          receivedAt:
            newStatus === "Received"
              ? new Date().toISOString()
              : transferData.data.receivedAt,
          dispatchedBy:
            newStatus === "Dispatched" ? 1 : transferData.data.dispatchedBy,
          receivedBy:
            newStatus === "Received" ? 1 : transferData.data.receivedBy,
          dispatcher:
            newStatus === "Dispatched"
              ? { id: 1, name: "Manish" }
              : transferData.data.dispatcher,
          receiver:
            newStatus === "Received"
              ? { id: 1, name: "Manish" }
              : transferData.data.receiver,
        },
      });

      setLoading(false);
    } catch (err) {
      setError("Failed to refresh transfer details");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        Loading transfer details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <MachineTransferDetail
        transferData={transferData}
        onRefresh={handleRefresh}
        userRole="admin"
        userId={1}
      />
    </div>
  );
}
