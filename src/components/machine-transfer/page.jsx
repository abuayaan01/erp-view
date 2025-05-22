"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MachineTransferDetail from "./transfer-details";
import api from "@/services/api/api-service";

// Example API response

export default function TransferDetailPage() {
  const params = useParams();
  const [transferData, setTransferData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransferData = async () => {
    try {
      const response = await api.get(`/transfer/${params.id}`)
      setTransferData(response)
      setLoading(false);
    } catch (err) {
      setError("Failed to load transfer details",err);
      console.log(err)
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransferData();
  }, [params.id]);


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
        fetchTransferData={fetchTransferData}
      />
    </div>
  );
}
