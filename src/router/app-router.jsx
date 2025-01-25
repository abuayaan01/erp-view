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

function AppRouter() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchSites());
  }, [dispatch]);

  return (
    <>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/manage-sites" element={<ManageSite />} />
          <Route path="/add-machine-category" element={<AddMachineCategory />} />
          <Route path="/add-machine" element={<AddMachine />} />
          <Route path="/list-machine" element={<MachineTable />} />
          <Route path="/manage-users" element={<ManageUsers />} />
        </Routes>
      </AppLayout>
    </>
  );
}

export default AppRouter;
