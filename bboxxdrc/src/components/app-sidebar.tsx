"use client";

import { Database, LayoutDashboard, Target, Upload, User } from "lucide-react";
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
  user: {
    name: "Bboxx-DRC",
    email: "By system and data department",
    avatar: "/bboxx.png",
  },

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
      ],
    },
    {
      title: "ALL CUSTOMERS",
      url: "#",
      icon: User,
      items: [
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
      title: "MY TRACKER",
      url: "#",
      icon: Target,
      items: [
        {
          title: "Verification field",
          url: "/awaiting_field",
        },
        {
          title: "Confirmed by field",
          url: "/confirmed_field",
        },
        {
          title: "Verification fraud",
          url: "/fraude_verification",
        },
        {
          title: "Confirmed by fraud",
          url: "/confirmed_fraude",
        },
        {
          title: "All staff visits",
          url: "/all_visits",
        },
      ],
    },
    {
      title: "ARBITRATION",
      url: "#",
      icon: Database,
      items: [
        {
          title: "Fraud Managment",
          url: "/arbitration_fraud",
        },
        {
          title: "Field Managment",
          url: "/arbitration_field",
        },
        {
          title: "Call center",
          url: "/arbitration_call_center",
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
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
