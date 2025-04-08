import { Route, Routes, useNavigate } from "react-router";
import ProtectedRoute from "@/router/protected-route";
import { ROLES } from "@/utils/roles";
import AppLayout from "@/app/layout/page";
import { MainDashboard } from "@/app/dashboard/page";
import ManageSite from "@/app/sites/manage-site/page";
import AddMachine from "@/app/machine/add-machine/page";
import MachineTable from "@/app/machine/machine-table/page";
import ManageUsers from "@/app/users/manage-users/manage-users";
import AddMachineCategory from "@/app/machine-category/add-machine-category/add-machine-category";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchSites } from "@/features/sites/sites-slice";
// import { fetchCategories } from "@/features/categories/categories-slice";
import { fetchMachineCategories } from "@/features/machine-category/machine-category-slice";
import { fetchPrimaryCategories } from "@/features/primary-category/primary-category-slice";
import { fetchMachines } from "@/features/machine/machine-slice";
import MachineCategoryPage from "@/app/machine-category/machine-category-table/page";
import SiteDetailPage from "@/app/sites/site-detail-page/site-detail-page";
import MachineryDetailPage from "@/app/machine/machine-details-page/machine-details-page";
import MachineTransfer from "@/app/machine/machine-transfer/page";
import ApprovePage from "@/app/machine-transfer/approve/page";
import NewTransferPage from "@/app/machine-transfer/new/page";
import DispatchTransferPage from "@/app/machine-transfer/dispatch/page";
import TransferHistoryPage from "@/app/machine-transfer/history/page";
import ReceiveTransferPage from "@/app/machine-transfer/receive/page";
import MachineTransferPage from "@/app/machine-transfer/page";
import { LogbookPage } from "@/app/logbook/page";
import { LogbookForm } from "@/components/logbook/logbook-form";
import { SparePartsPage } from "@/app/spare-parts/page";
import { AddSparePartModal } from "@/components/spare-parts/AddSparePartModal";
import { RequisitionsPage } from "@/app/material-requisition/page";
import { MaterialRequestForm } from "@/components/material-requisition/MaterialRequestForm";
import { RequisitionDetail } from "@/components/material-requisition/RequisitionDetail";
import { ProcurementPage } from "@/components/material-requisition/ProcurementPage";
import { DispatchPage } from "@/components/material-requisition/DispatchPage";
import { ReceivePage } from "@/components/material-requisition/ReceivePage";
import { LogbookDetails } from "@/components/logbook/logbook-details";
import { RequestSparePartPage } from "@/components/spare-parts/RequestSparePartPage";
import ForbiddenPage from "@/app/error/403/page";
import NotFoundPage from "@/app/error/404/page";

function AppRouter() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchSites());
    // dispatch(fetchCategories());
    dispatch(fetchMachineCategories());
    dispatch(fetchMachines());
    dispatch(fetchPrimaryCategories());
  }, [dispatch]);

  const mockRequisition = {
    id: 1,
    date: "2023-06-15",
    materialName: "Cement",
    materialId: 1,
    quantity: 50,
    unit: "Bags",
    urgency: "normal",
    site: "Project Alpha",
    requiredBy: "2023-06-30",
    status: "pending",
    requestedBy: "John Smith",
    justification: "Required for foundation work in Block A",
  };
  const mockEntry = {
    id: 1,
    date: "2025-03-20",
    registrationNo: "MH-123456",
    dieselOpeningBalance: 50,
    dieselIssue: 20,
    dieselClosingBalance: 30,
    openingKMReading: 12500,
    closingKMReading: 12600,
    totalRunKM: 100,
    dieselAvgKM: 5,
    openingHrsMeter: 1200,
    closingHrsMeter: 1208,
    totalRunHrsMeter: 8,
    dieselAvgHrsMeter: 5,
    workingDetail: "Site excavation and material transport",
    assetCode: "AST-001",
    siteName: "Project Alpha",
    location: "North Sector",
  };

  return (
    <Routes>
      {/* Routes WITH AppLayout */}
      <Route
        element={<AppLayout />} // Wrap these routes in layout
      >
        <Route path="/" element={<MainDashboard />} />
        <Route path="/manage-sites" element={<ManageSite />} />
        <Route path="/sites/:id" element={<SiteDetailPage />} />
        <Route path="/add-machine-category" element={<AddMachineCategory />} />
        <Route
          path="/update-machine-category"
          element={<AddMachineCategory />}
        />
        <Route
          path="/list-machine-category"
          element={<MachineCategoryPage />}
        />
        <Route path="/add-machine" element={<AddMachine />} />
        <Route path="/list-machine" element={<MachineTable />} />
        <Route path="/add-logbook" element={<LogbookForm />} />
        <Route path="/logbook" element={<LogbookPage />} />
        <Route
          path="/logbook/:id"
          element={
            <LogbookDetails
              entry={mockEntry}
              onBack={() => navigate("/logbook")}
            />
          }
        />
        <Route path="/machines/:id" element={<MachineryDetailPage />} />
        <Route
          path="/machine-transfer/home"
          element={<MachineTransferPage />}
        />
        <Route path="/machine-transfer/new" element={<NewTransferPage />} />
        <Route path="/machine-transfer/approve" element={<ApprovePage />} />
        <Route
          path="/machine-transfer/dispatch"
          element={<DispatchTransferPage />}
        />
        <Route
          path="/machine-transfer/receive"
          element={<ReceiveTransferPage />}
        />
        <Route
          path="/machine-transfer/history"
          element={<TransferHistoryPage />}
        />
        <Route path="/spare-parts" element={<SparePartsPage />} />
        <Route path="/spare-parts/request" element={<RequestSparePartPage />} />
        <Route path="/spare-parts/add" element={<AddSparePartModal />} />
        <Route
          path="/material-requisition/home"
          element={<RequisitionsPage />}
        />
        <Route
          path="/material-requisition/new"
          element={<MaterialRequestForm />}
        />
        <Route
          path="/material-requisition/:id"
          element={<RequisitionDetail requisition={mockRequisition} />}
        />
        <Route
          path="/material-requisition/dispatch"
          element={<DispatchPage />}
        />
        <Route path="/material-requisition/receive" element={<ReceivePage />} />
        <Route
          path="/material-requisition/procurement"
          element={<ProcurementPage />}
        />
        <Route
          path="/manage-users"
          element={
            <ProtectedRoute
              element={<ManageUsers />}
              allowedRoleIds={[ROLES.ADMIN.id]}
            />
          }
        />
      </Route>

      {/* Routes WITHOUT Layout */}
      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRouter;
