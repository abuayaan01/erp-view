import { Route, Routes } from "react-router";
import AppLayout from "@/app/layout/page";
import Dashboard from "@/app/dashboard/page";
import ManageSite from '@/app/sites/manage-site/page';
import AddMachine from '@/app/machine/add-machine/page'

function AppRouter() {
  return (
    <>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/manage-sites" element={<ManageSite />} />
          <Route path="/add-machine" element={<AddMachine />} />
          <Route path="/list-machine" element={<AddMachine />} />
        </Routes>
      </AppLayout>
    </>
  );
}

export default AppRouter;
