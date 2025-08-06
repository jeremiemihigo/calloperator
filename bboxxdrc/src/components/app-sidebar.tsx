"use client";

import {
  Database,
  DecimalsArrowLeftIcon,
  LayoutDashboard,
  Target,
  Upload,
} from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  navMain: [
    {
      title: "DASHBOARD",
      url: "/",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Default tracker",
          url: "/",
        },
        {
          title: "Customers",
          url: "/customers",
        },
        {
          title: "Historical status",
          url: "/historical_status",
        },
      ],
    },

    {
      title: "Decisions",
      url: "#",
      icon: DecimalsArrowLeftIcon,
      items: [
        {
          title: "Fraud",
          url: "/decision_fraude",
          valeur: "decision_fraude",
        },
        {
          title: "Field",
          url: "/decision_field",
          valeur: "decision_field",
        },
        {
          title: "Portfolio",
          url: "/decision_portfolio",
          valeur: "decision_portfolio",
        },
      ],
    },

    {
      title: "MY TRACKER",
      url: "#",
      icon: Target,
      items: [
        {
          title: "Individually",
          url: "/individually",
        },
        {
          title: "Verif. field",
          url: "/awaiting_field",
        },
        {
          title: "Verif. fraud",
          url: "/fraude_verification",
        },
        {
          title: "Conf. field",
          url: "/confirmed_field",
        },
        {
          title: "Conf fraud",
          url: "/confirmed_fraude",
        },
        {
          title: "visits",
          url: "/all_visits",
          valeur: "visite",
        },
      ],
    },

    {
      title: "ARBITRATION",
      url: "#",
      icon: Database,
      items: [
        {
          title: "Categorization",
          url: "/arbitration_call_center",
        },
        {
          title: "Actions",
          url: "/actions",
        },
      ],
    },
    {
      title: "Upload",
      url: "#",
      icon: Upload,
      items: [
        {
          title: "Payements",
          url: "/payements",
        },
        {
          title: "Customer to track",
          url: "/upload_customer",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
