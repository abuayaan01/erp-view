import { Route, Routes } from "react-router";
import AppLayout from "@/app/layout/page";
import Dashboard from "@/app/dashboard/page";
import ManageSite from '@/app/sites/manage-site/page';
import AddMachine from '@/app/machine/add-machine/page'
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


function AppRouter() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchSites());
    // dispatch(fetchCategories());
    dispatch(fetchMachineCategories());
    dispatch(fetchMachines());
    dispatch(fetchPrimaryCategories());
  }, [dispatch]);

  return (
    <>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/manage-sites" element={<ManageSite />} />
          <Route path="/sites/:id" element={<SiteDetailPage />} />
          <Route path="/add-machine-category" element={<AddMachineCategory />} />
          <Route path="/update-machine-category" element={<AddMachineCategory update={true} />} />
          <Route path="/list-machine-category" element={<MachineCategoryPage />} />
          <Route path="/add-machine" element={<AddMachine />} />
          <Route path="/list-machine" element={<MachineTable />} />
          <Route path="/machines" element={<MachineryDetailPage />} />
          <Route path="/manage-users" element={<ManageUsers />} />
        </Routes>
      </AppLayout>
    </>
  );
}

export default AppRouter;
