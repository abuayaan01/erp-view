// hooks/useRequisitionActions.js
import { useState } from 'react';
import api from '@/services/api/api-service';

export const useRequisitionActions = (requisition, setRequisition, toast) => {
  const [approving, setApproving] = useState(false);
  const [approvingIssue, setApprovingIssue] = useState(false);
  const [close, setClose] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleApprovalByHO = async () => {
    try {
      setApproving(true);
      const response = await api.post(`/requisitions/${requisition.id}/ho-approve`);
      
      if (response.status) {
        toast({
          title: "Success",
          description: "Requisition has been approved successfully.",
        });
        
        setRequisition({
          ...requisition,
          status: "Approved",
          approvedAt: new Date().toISOString(),
        });
      } else {
        toast({
          title: "Error",
          description: response.data?.message || "Failed to approve requisition",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to approve requisition",
        variant: "destructive",
      });
    } finally {
      setApproving(false);
    }
  };

  const handleRejectRequisition = async (rejectionRemarks) => {
    if (!rejectionRemarks.trim()) {
      toast({
        title: "Error",
        description: "Please provide rejection remarks",
        variant: "destructive",
      });
      return false;
    }

    try {
      setIsRejecting(true);
      const response = await api.post(
        `/requisitions/${requisition.id}/site-reject`,
        { rejectionReason: rejectionRemarks }
      );

      if (response.status) {
        toast({
          title: "Success",
          description: "Requisition rejected successfully.",
        });

        // Refresh requisition data
        const updatedResponse = await api.get(`/requisitions/${requisition.id}`);
        if (updatedResponse.status && updatedResponse.data) {
          setRequisition(updatedResponse.data);
        }
        return true;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to reject requisition",
        variant: "destructive",
      });
    } finally {
      setIsRejecting(false);
    }
    return false;
  };

  // ... other action handlers

  return {
    approving,
    approvingIssue,
    close,
    isRejecting,
    handleApprovalByHO,
    handleRejectRequisition,
    // ... other handlers
  };
};
