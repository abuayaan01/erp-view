import { Route, Routes } from "react-router";
import AppLayout from "@/app/layout/page";
import Dashboard from "@/app/dashboard/page";
import AddSite from '@/app/sites/add-site/page';
import ListSites from '@/app/sites/list-sites/page';
import AddMachine from '@/app/machine/add-machine/page'

function AppRouter() {
  return (
    <>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-site" element={<AddSite />} />
          <Route path="/list-sites" element={<ListSites />} />
          <Route path="/add-machine" element={<AddMachine />} />
        </Routes>
      </AppLayout>
    </>
  );
}

export default AppRouter;
