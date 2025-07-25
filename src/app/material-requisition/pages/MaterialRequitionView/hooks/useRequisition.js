// hooks/useRequisition.js
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '@/services/api/api-service';

export const useRequisition = (id, toast, navigate) => {
  const [requisition, setRequisition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [itemGroups, setItemGroups] = useState([]);
  const [units, setUnits] = useState([]);

  const storedItemGroups = useSelector((state) => state.itemGroups) || [];
  const storedUnits = useSelector((state) => state.units) || [];

  useEffect(() => {
    const fetchRequisition = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/requisitions/${id}`);
        if (response.status && response.data) {
          setRequisition(response.data);
          setItemGroups(storedItemGroups.data || []);
          setUnits(storedUnits.data || []);
        } else {
          toast({
            title: "Error",
            description: response.data.message || "Failed to fetch requisition",
            variant: "destructive",
          });
          navigate("/requisitions");
        }
      } catch (error) {
        toast({
          title: "Requisition Not Found",
          description: "The requisition you're looking for doesn't exist.",
          variant: "destructive",
        });
        navigate("/requisitions");
      } finally {
        setLoading(false);
      }
    };

    fetchRequisition();
  }, [id, navigate, toast, storedItemGroups, storedUnits]);

  return {
    requisition,
    setRequisition,
    loading,
    itemGroups,
    units
  };
};
