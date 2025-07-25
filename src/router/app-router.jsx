import { MainDashboard } from "@/app/dashboard/page";
import AppLayout from "@/app/layout/page";
import AddMachineCategory from "@/app/machine-category/add-machine-category/add-machine-category";
import AddMachine from "@/app/machine/add-machine/page";
import MachineTable from "@/app/machine/machine-table/page";
import ManageSite from "@/app/sites/manage-site/page";
import ManageUsers from "@/app/users/manage-users/manage-users";
import { fetchSites } from "@/features/sites/sites-slice";
import ProtectedRoute from "@/router/protected-route";
import { ROLES } from "@/utils/roles";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes, useNavigate } from "react-router";
// import { fetchCategories } from "@/features/categories/categories-slice";
import ForbiddenPage from "@/app/error/403/page";
import NotFoundPage from "@/app/error/404/page";
import MaterialDetails from "@/app/inventory/material-details/page";
import InventoryList from "@/app/inventory/page";
import { LogbookPage } from "@/app/logbook/page";
import MachineCategoryPage from "@/app/machine-category/machine-category-table/page";
import TransferHistoryPage from "@/app/machine-transfer/history/page";
import NewTransferPage from "@/app/machine-transfer/new/page";
import MachineryDetailPage from "@/app/machine/machine-details-page/machine-details-page";
import MaterialIssueDetails from "@/app/material-issue/MaterialIssueDetails";
import MaterialIssueList from "@/app/material-issue/MaterialIssueList.";
import MaterialIssueForm from "@/app/material-issue/MatrialIssueForm";
import ItemForm from "@/app/material-requisition/pages/ItemForm";
import ItemGroupForm from "@/app/material-requisition/pages/ItemGroupForm";
import ItemGroupList from "@/app/material-requisition/pages/ItemGroupList";
import ItemList from "@/app/material-requisition/pages/ItemList";
import MaterialRequisitionForm from "@/app/material-requisition/pages/MaterialRequisitionForm";
import MaterialRequisitionList from "@/app/material-requisition/pages/MaterialRequisitionList";
import MaterialRequisitionView from "@/app/material-requisition/pages/MaterialRequisitionView";
import UnitForm from "@/app/material-requisition/pages/UnitForm";
import UnitList from "@/app/material-requisition/pages/UnitList";
import MaterialIssue from "@/app/material/MaterialIssue";
import SiteDetailPage from "@/app/sites/site-detail-page/site-detail-page";
import { LogbookDetails } from "@/components/logbook/logbook-details";
import { LogbookForm } from "@/components/logbook/logbook-form";
import { fetchItemGroups } from "@/features/item-groups/item-groups-slice";
import { fetchItems } from "@/features/items/items-slice";
import { fetchMachineCategories } from "@/features/machine-category/machine-category-slice";
import { fetchMachines } from "@/features/machine/machine-slice";
import { fetchPrimaryCategories } from "@/features/primary-category/primary-category-slice";
import { fetchUnits } from "@/features/units/units-slice";
import MachineEditPage from "@/app/machine/machine-edit/page";
import ProcurementList from "@/app/procurement/ProcurmentList";
import ProcurementForm from "@/app/procurement/ProcurementForm";
import InvoiceForm from "@/app/procurement/InvoiceForm";
import PaymentList from "@/app/procurement/PaymentList";
import PaymentSlipForm from "@/app/procurement/PaymentSlipForm";
import TransferDetailPage from "@/components/machine-transfer/page";
import MaintenanceLogPage from "@/app/maintanance-log/MaintenanceLogModal";
import AddInventoryItems from "@/app/inventory/add-items/page";
import ProcurementDetails from "@/app/procurement/ProcurementDetails";

function AppRouter() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchSites());
    // dispatch(fetchCategories());
    dispatch(fetchMachineCategories());
    dispatch(fetchMachines());
    dispatch(fetchPrimaryCategories());
    dispatch(fetchItems());
    dispatch(fetchItemGroups());
    dispatch(fetchUnits());
  }, [dispatch]);

  return (
    <Routes>
      {/* Routes WITH AppLayout */}
      <Route
        element={<AppLayout />} // Wrap these routes in layout
      >
        <Route path="/" element={<MainDashboard />} />

        {/* Site Management */}
        <Route
          path="/manage-sites"
          element={
            <ProtectedRoute
              element={<ManageSite />}
              allowedRoleIds={[
                ROLES.ADMIN.id,
                ROLES.MECHANICAL_HEAD.id,
                ROLES.MECHANICAL_MANAGER.id,
              ]}
            />
          }
        />
        <Route
          path="/sites/:id"
          element={
            <ProtectedRoute
              element={<SiteDetailPage />}
              allowedRoleIds={[
                ROLES.ADMIN.id,
                ROLES.MECHANICAL_HEAD.id,
                ROLES.MECHANICAL_MANAGER.id,
              ]}
            />
          }
        />
        {/* Site Management End*/}

        {/* Category Management*/}
        
        <Route
          path="/machine-category/add"
          element={
            <ProtectedRoute
              element={<AddMachineCategory />}
              allowedRoleIds={[
                ROLES.ADMIN.id,
                ROLES.MECHANICAL_HEAD.id,
                ROLES.MECHANICAL_MANAGER.id,
              ]}
            />
          }
        />
        <Route
          path="/machine-category/update"
          element={
            <ProtectedRoute
              element={<AddMachineCategory />}
              allowedRoleIds={[
                ROLES.ADMIN.id,
                ROLES.MECHANICAL_HEAD.id,
                ROLES.MECHANICAL_MANAGER.id,
              ]}
            />
          }
        />
        <Route
          path="/machine-category"
          element={<MachineCategoryPage />}
        />
        {/* Category Management End*/}

        {/* Machines Management */}
        <Route
          path="/machine/add"
          element={
            <ProtectedRoute
              element={<AddMachine />}
              allowedRoleIds={[
                ROLES.ADMIN.id,
                ROLES.MECHANICAL_HEAD.id,
                ROLES.MECHANICAL_MANAGER.id,
              ]}
            />
          }
        />
        <Route path="/machine" element={<MachineTable />} />
        <Route path="/machine/:id" element={<MachineryDetailPage />} />
        <Route path="/machine/edit/:id" element={<MachineEditPage />} />
        <Route path="/machine/:id/logs" element={<MaintenanceLogPage />} />
        {/* Machines Management End*/}

        {/* Logbook */}
        <Route path="/logbook" element={<LogbookPage />} />
        <Route path="/logbook/:id" element={<LogbookDetails />} />
        <Route
          path="/add-logbook"
          element={
            <ProtectedRoute
              element={<LogbookForm />}
              allowedRoleIds={[
                ROLES.MECHANICAL_STORE_MANAGER.id,
                ROLES.MECHANICAL_INCHARGE.id,
                ROLES.PROJECT_MANAGER.id,
              ]}
            />
          }
        />
        {/* Logbook End*/}

        {/* Machine Transfer */}
        <Route
          path="/machine-transfer/new"
          element={
            <ProtectedRoute
              element={<NewTransferPage />}
              allowedRoleIds={[
                ROLES.MECHANICAL_STORE_MANAGER.id,
                ROLES.MECHANICAL_INCHARGE.id,
                ROLES.PROJECT_MANAGER.id,
              ]}
            />
          }
        />
        <Route path="/machine-transfer/:id" element={<TransferDetailPage />} />

        <Route path="/machine-transfer" element={<TransferHistoryPage />} />
        {/* Machine Transfer End */}
        <Route path="/item-groups" element={<ItemGroupList />} />
        <Route path="/item-groups/new" element={<ItemGroupForm />} />
        <Route path="/item-groups/edit/:id" element={<ItemGroupForm />} />
        <Route path="/items" element={<ItemList />} />
        <Route path="/items/new" element={<ItemForm />} />
        <Route path="/items/edit/:id" element={<ItemForm />} />
        <Route path="/units" element={<UnitList />} />
        <Route path="/units/new" element={<UnitForm />} />
        <Route path="/units/edit/:id" element={<UnitForm />} />
        {/* Spare Parts ans Items End*/}

        {/* Material Requisition */}
        <Route path="/requisitions" element={<MaterialRequisitionList />} />
        <Route path="/requisitions/new" element={<MaterialRequisitionForm />} />
        <Route path="/requisitions/:id" element={<MaterialRequisitionView />} />
        <Route path="/requisitions/issue/:id" element={<MaterialIssue />} />
        {/* Material Requisition End*/}

        {/* Inventory */}
        <Route path="/inventory" element={<InventoryList />} />
        <Route path="/inventory/add" element={<AddInventoryItems />} />
        <Route path="/inventory/:id" element={<MaterialDetails />} />
        {/* Inventory End*/}

        {/* Material Issue */}
        <Route path="/issues" element={<MaterialIssueList />} />
        <Route path="/issues/:id" element={<MaterialIssueDetails />} />
        <Route path="/issues/new" element={<MaterialIssueForm />} />
        {/* Material Issue End*/}

        {/* Procurements */}
        <Route path="/procurements" element={<ProcurementList />} />
        <Route path="/procurements/:id" element={<ProcurementDetails />} />
        <Route path="/procure/:requisitionId" element={<ProcurementForm />} />

        {/* Invoices */}
        {/* <Route path="/invoice/:procurementId" element={<InvoiceForm />} />
        <Route path="/payments" element={<PaymentList />} />
        <Route path="/payment/:id" element={<PaymentSlipForm />} />
        <Route path="/payment/invoice/:id" element={<PaymentSlipForm />} /> */}

        {/* Users Management */}
        <Route
          path="/manage-users"
          element={
            <ProtectedRoute
              element={<ManageUsers />}
              allowedRoleIds={[
                ROLES.ADMIN.id,
                ROLES.MECHANICAL_HEAD.id,
                ROLES.MECHANICAL_MANAGER.id,
              ]}
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
