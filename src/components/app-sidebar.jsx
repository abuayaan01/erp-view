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
  ClipboardList,
  Puzzle,
  Send,
  Warehouse,
  ShoppingCart,
  Receipt,
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
import { ROLES } from "@/utils/roles";

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
      allowedRoles: [
        ROLES.ADMIN.id,
        ROLES.MECHANICAL_HEAD.id,
        ROLES.MECHANICAL_MANAGER.id,
      ],
      items: [
        {
          title: "Manage Sites",
          url: "/manage-sites",
        },
      ],
    },
    {
      title: "Machine Category",
      url: "/machine-category",
      icon: SquareTerminal,
      isActive: false,
      collapsible: false,
      items: [
        {
          title: "Add",
          url: "/add-machine-category",
          allowedRoles: [
            ROLES.ADMIN.id,
            ROLES.MECHANICAL_HEAD.id,
            ROLES.MECHANICAL_MANAGER.id,
          ],
        },
        {
          title: "List",
          url: "/list-machine-category",
        },
      ],
    },
    {
      title: "Machine",
      url: "/machine",
      icon: Drill,
      collapsible: false,
      items: [
        {
          title: "Add",
          url: "/add-machine",
          allowedRoles: [
            ROLES.ADMIN.id,
            ROLES.MECHANICAL_HEAD.id,
            ROLES.MECHANICAL_MANAGER.id,
          ],
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
      collapsible: false,
    },
    {
      title: "Log Book",
      url: "/logbook",
      icon: Book,
      collapsible: false,
    },
    // {
    //   title: "Spare Parts",
    //   url: "/spare-parts",
    //   icon: Settings2,
    //   collapsible: false,
    // },
    {
      title: "Inventory",
      url: "/inventory",
      icon: Warehouse,
      collapsible: false,
    },

    {
      title: "Material Requisition",
      url: "/requisitions",
      icon: ClipboardList,
      collapsible: false,
    },
    {
      title: "Material Issue",
      url: "/issues",
      icon: Send,
      collapsible: false,
    },
    {
      title: "Material Prourement",
      url: "/procurements",
      icon: ShoppingCart,
      collapsible: false,
    },
    // {
    //   title: "Payment Slip",
    //   url: "/payments",
    //   icon: Receipt,
    //   collapsible: false,
    // },
    {
      title: "Parts & Units Setup",
      url: "#",
      icon: Puzzle,
      collapsible: true,
      items: [
        {
          title: "Item Groups",
          url: "/item-groups",
        },
        {
          title: "Items",
          url: "/items",
        },
        {
          title: "Units",
          url: "/units",
        },
      ],
    },
    {
      title: "Users",
      url: "/manage-users",
      icon: Users,
      collapsible: false,
      allowedRoles: [ROLES.ADMIN.id],
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
