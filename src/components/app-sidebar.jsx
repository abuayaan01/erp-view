import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Cog,
  Hammer,
  BookUser,
  PersonStanding,
  LayoutDashboard,
  Locate,
  Drill,
  Users,
  Truck,
  Book,
  ClipboardList
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSelector } from "react-redux";

// This is sample data.
const data = {
  user: {
    name: "abu.ayaan",
    email: "abu.ayaan@bpcipl.com",
    avatar: "https://creatorindia.netlify.app/media/ayaan_closeimg_4574.webp",
  },
  teams: [
    {
      name: "BPC Infraproject Pvt Ltd",
      logo: Cog,
      plan: "Enterprise",
    },
    {
      name: "Civil",
      logo: Hammer,
      plan: "Startup",
    },
    {
      name: "HR",
      logo: PersonStanding,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
      collapsible: false,
    },
    {
      title: "Sites",
      url: "/manage-sites",
      icon: Locate,
      isActive: false,
      collapsible: false,
      items: [
        {
          title: "Manage Sites",
          url: "/manage-sites",
        },
      ],
    },
    {
      title: "Machine Category",
      url: "#",
      icon: SquareTerminal,
      isActive: false,
      collapsible: true,
      items: [
        {
          title: "Add",
          url: "/add-machine-category",
        },
        {
          title: "List",
          url: "/list-machine-category",
        },
      ],
    },
    {
      title: "Machine",
      url: "#",
      icon: Drill,
      collapsible: true,
      items: [
        {
          title: "Add",
          url: "/add-machine",
        },
        {
          title: "List",
          url: "/list-machine",
        },
      ],
    },
    {
      title: "Machine Transfer",
      url: "/machine-transfer",
      icon: Truck,
      collapsible: true,
      items: [
        {
          title: "Home",
          url: "/machine-transfer/home",
        },
        {
          title: "New Transfer",
          url: "/machine-transfer/new",
        },
        {
          title: "Approve",
          url: "/machine-transfer/approve",
        },
        {
          title: "History",
          url: "/machine-transfer/history",
        },
        {
          title: "Dispatch",
          url: "/machine-transfer/dispatch",
        },
        {
          title: "Receive",
          url: "/machine-transfer/receive",
        },
      ],
    },
    {
      title: "Log Book",
      url: "/logbook",
      icon: Book,
      collapsible: false,
      // items: [
      //   {
      //     title: "Add",
      //     url: "/add-logbook",
      //   },
      //   {
      //     title: "List",
      //     url: "/list-logbook",
      //   },
      // ],
    },
    {
      title: "Spare Parts",
      url: "/spare-parts",
      icon: Settings2,
      collapsible: false,
      // items: [
      //   {
      //     title: "Add",
      //     url: "/add-spare-parts",
      //   },
      //   {
      //     title: "List",
      //     url: "/list-spare-parts",
      //   },
      // ],
    },
    {
      title: "Users",
      url: "/manage-users",
      icon: Users,
      collapsible: false,
    },
    {
      title: "Material Requisition",
      url: "/material-requisition",
      icon: ClipboardList,
      collapsible: true,
      items: [
          {
            title: "Home",
            url: "/material-requisition/home",
          },
          {
            title: "New",
            url: "/material-requisition/new",
          },
          {
            title: "Dispatch",
            url: "/material-requisition/dispatch",
          },
          {
            title: "Receive",
            url: "/material-requisition/receive",
          },
          {
            title: "Procurement",
            url: "/material-requisition/procurement",
          },
        ]
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
