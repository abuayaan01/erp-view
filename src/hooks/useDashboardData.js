import { useQueries } from "@tanstack/react-query";
import api from "@/services/api/api-service";

const fetchDashboardData = async (endpoint, params) => {
  const response = await api.get(`/dashboard/${endpoint}?${params}`);
  return response.data;
};

const useDashboardData = (filters) => {
  const params = new URLSearchParams();
  params.append("siteId", filters.siteId);
  params.append("dateRange[startDate]", filters.startDate);
  params.append("dateRange[endDate]", filters.endDate);
  const paramsString = params.toString();

  const queries = useQueries({
    queries: [
      {
        queryKey: ["dashboard", "overview", filters],
        queryFn: () => fetchDashboardData("overview", paramsString),
        staleTime: 5 * 60 * 1000, // 5 minutes cache
      },
      {
        queryKey: ["dashboard", "alerts", filters],
        queryFn: () => fetchDashboardData("alerts", paramsString),
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ["dashboard", "activities", filters],
        queryFn: () => fetchDashboardData("recent-activities", paramsString),
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ["dashboard", "machine-status", filters],
        queryFn: () => fetchDashboardData("machines/status", paramsString),
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ["dashboard", "sites-summary", filters],
        queryFn: () => fetchDashboardData("sites/summary", paramsString),
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ["dashboard", "inventory-alerts", filters],
        queryFn: () => fetchDashboardData("inventory/alerts", paramsString),
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ["dashboard", "maintenance-due", filters],
        queryFn: () => fetchDashboardData("maintenance/due", paramsString),
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ["dashboard", "procurements-pending", filters],
        queryFn: () => fetchDashboardData("procurement/pending", paramsString),
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ["dashboard", "payments-outstanding", filters],
        queryFn: () => fetchDashboardData("payments/outstanding", paramsString),
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ["dashboard", "expenses-monthly", filters],
        queryFn: () => fetchDashboardData("expenses/monthly", paramsString),
        staleTime: 5 * 60 * 1000,
      },
    ],
  });
  // Check loading and error states
  const isLoading = queries.some((query) => query.isLoading);
  const isError = queries.some((query) => query.isError);
  const errors = queries
    .filter((query) => query.isError)
    .map((query) => query.error);

  // Extract data
  const [
    overview,
    alerts,
    recentActivities,
    machineStatus,
    sitesSummary,
    inventoryAlerts,
    maintenanceDue,
    procurementsPending,
    paymentsOutstanding,
    expensesMonthly,
  ] = queries.map((query) => query.data);

  return {
    data: {
      overview,
      alerts,
      recentActivities,
      machineStatus,
      sitesSummary,
      inventoryAlerts,
      maintenanceDue,
      procurementsPending,
      paymentsOutstanding,
      expensesMonthly,
    },
    isLoading,
    isError,
    errors,
    refetchAll: () => queries.forEach((query) => query.refetch()),
  };
};

export { useDashboardData };
