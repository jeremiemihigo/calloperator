"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

import { ISidebar } from "@/app/interface/IOther";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import React from "react";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      valeur?: string;
    }[];
  }[];
}) {
  const [data, setData] = React.useState<ISidebar>();
  const [load, setLoad] = React.useState<boolean>(true);
  const loadingData = async () => {
    try {
      setLoad(true);
      const response = await fetch("/api/sidebar", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (result.status === 200) {
        setData(result.data);
        setLoad(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    const initialize = async () => {
      await loadingData();
    };
    initialize();
  }, []);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Default tracker</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <a
                          href={subItem.url}
                          style={{ justifyContent: "space-between" }}
                        >
                          <span>{subItem.title}</span>
                          {subItem.valeur && data && !load && (
                            <span
                              style={{
                                background: "black",
                                borderRadius: "4px",
                                color: "white",
                                padding: "4px 10px",
                                fontSize: "11px",
                              }}
                            >
                              {data[subItem.valeur as keyof ISidebar]}
                            </span>
                          )}
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
