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
import ItemGroupList from "@/app/material-requisition/pages/ItemGroupList";
import ItemGroupForm from "@/app/material-requisition/pages/ItemGroupForm";
import ItemList from "@/app/material-requisition/pages/ItemList";
import ItemForm from "@/app/material-requisition/pages/ItemForm";
import UnitList from "@/app/material-requisition/pages/UnitList";
import UnitForm from "@/app/material-requisition/pages/UnitForm";
import MaterialRequisitionList from "@/app/material-requisition/pages/MaterialRequisitionList";
import MaterialRequisitionForm from "@/app/material-requisition/pages/MaterialRequisitionForm";
import MaterialRequisitionView from "@/app/material-requisition/pages/MaterialRequisitionView";
import MaterialIssueForm from "@/app/material-issue/MatrialIssueForm";
import MaterialIssueList from "@/app/material-issue/MaterialIssueList.";
import MaterialIssueDetails from "@/app/material-issue/MaterialIssueDetails";
import { SparePartsTable } from "@/components/spare-parts/SparePartsTable";
import MaterialRequisitionApproval from "@/app/material-requisition/pages/MaterialRequisitionApproval";
import InventoryList from "@/app/spare-parts/Pages/InventoryList";
import MaterialIssue from "@/app/material/MaterialIssue";
import MaterialReceive from "@/app/material/MaterialReceive";
import MaterialRequisitionForward from "@/app/material-requisition/pages/MaterialRequisitionForward";
import MaterialRequisitionRespond from "@/app/material-requisition/pages/MaterialRequisitionRespond";
import MaterialRequisitionReview from "@/app/material-requisition/pages/MaterialRequisitionReview";
import MaterialDetails from "@/app/material/MaterialDetails";
import { fetchItems } from "@/features/items/items-slice";
import { fetchItemGroups } from "@/features/item-groups/item-groups-slice";
import { fetchUnits } from "@/features/units/units-slice";

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
          path="/add-machine-category"
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
          path="/update-machine-category"
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
          path="/list-machine-category"
          element={<MachineCategoryPage />}
        />
        {/* Category Management End*/}



        {/* Machines Management */}
        <Route
          path="/add-machine"
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
        <Route path="/list-machine" element={<MachineTable />} />
        <Route path="/machines/:id" element={<MachineryDetailPage />} />
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
          path="/machine-transfer/home"
          element={<MachineTransferPage />}
        />
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
        <Route
          path="/machine-transfer/approve"
          element={
            <ProtectedRoute
              element={<ApprovePage />}
              allowedRoleIds={[
                ROLES.ADMIN.id,
                ROLES.MECHANICAL_HEAD.id,
                ROLES.MECHANICAL_MANAGER.id,
              ]}
            />
          }
        />
        <Route
          path="/machine-transfer/dispatch"
          element={
            <ProtectedRoute
              element={<DispatchTransferPage />}
              allowedRoleIds={[
                ROLES.MECHANICAL_STORE_MANAGER.id,
                ROLES.MECHANICAL_INCHARGE.id,
                ROLES.PROJECT_MANAGER.id,
              ]}
            />
          }
        />
        <Route
          path="/machine-transfer/receive"
          element={
            <ProtectedRoute
              element={<ReceiveTransferPage />}
              allowedRoleIds={[
                ROLES.MECHANICAL_STORE_MANAGER.id,
                ROLES.MECHANICAL_INCHARGE.id,
                ROLES.PROJECT_MANAGER.id,
              ]}
            />
          }
        />
        <Route
          path="/machine-transfer/history"
          element={<TransferHistoryPage />}
        />
        {/* Machine Transfer End */}



        {/* Spare Parts ans Items */}
        <Route path="/spare-parts" element={<SparePartsPage />} />
        <Route path="/spare-parts/request" element={<RequestSparePartPage />} />
        <Route path="/spare-parts/add" element={<AddSparePartModal />} />
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
        <Route
          path="/requisitions/view/:id"
          element={<MaterialRequisitionView />}
        />
        <Route
          path="/requisitions/approve/:id"
          element={<MaterialRequisitionApproval />}
        />
        <Route
          path="/requisitions/forward/:id"
          element={<MaterialRequisitionForward />}
        />
        <Route path="/requisitions/issue/:id" element={<MaterialIssue />} />
        <Route path="/requisitions/receive/:id" element={<MaterialReceive />} />
        <Route
          path="/requisitions/review/:id"
          element={<MaterialRequisitionReview />}
        />
        <Route
          path="/requisitions/respond/:id"
          element={<MaterialRequisitionRespond />}
        />
        {/* Material Requisition End*/}



        {/* Inventory */}
        <Route path="/inventory" element={<InventoryList />} />
        <Route path="/inventory/:id" element={<MaterialDetails />} />
        {/* Inventory End*/}



        {/* Material Issue */}
        <Route path="/issues" element={<MaterialIssueList />} />
        <Route path="/issues/:id" element={<MaterialIssueDetails />} />
        <Route path="/issues/new" element={<MaterialIssueForm />} />
        {/* Material Issue End*/}



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
