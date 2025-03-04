import React from "react";
import DataCard from "@/components/card";
import { ChartPie, Construction, Drill, Users } from "lucide-react";
import { useSelector } from "react-redux";

function Page() {
  const { data: machines } = useSelector((state) => state.machines) || [];
  const { data: sites } = useSelector((state) => state.sites) || [];

  return (
    <div className="gap-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <DataCard
          icon={<Construction />}
          data={sites.length}
          title={"Sites"}
          chart={<ChartPie />}
        />
        <DataCard
          icon={<Drill />}
          data={machines.length}
          title={"Machines"}
          chart={<ChartPie />}
        />

        <DataCard
          icon={<Users />}
          data={1}
          title={"Employees"}
          chart={<ChartPie />}
        />
        {/* <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" /> */}
      </div>
      <div className="flex-1 rounded-xl bg-muted/50 mt-4">
        <AlertsSection />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 mt-4 md:min-h-[50vh]" />
    </div>
  );
}

export default Page;

const AlertsSection = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-lg w-full">
      <p className="text-md font-semibold">No Alerts</p>
      <p className="text-sm py-4">You're all caught up! 🎉</p>
    </div>
  );
};
