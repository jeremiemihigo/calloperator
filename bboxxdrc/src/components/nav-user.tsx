"use client";

import {
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  LucideTableColumnsSplit,
  MessageCircle,
  PercentDiamond,
  RollerCoasterIcon,
  Settings,
  User2Icon,
  UserCheckIcon,
} from "lucide-react";

import { IUser } from "@/app/interface/IUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import React from "react";
import { toast } from "sonner";

export function NavUser() {
  const { isMobile } = useSidebar();
  const Deconnexion = async () => {
    const res = await fetch("/api/deconnexion", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await res.json();
    toast(response.message);
    if (response.status === 200) {
      window.location.replace("/login");
    }
  };

  const [user, setUser] = React.useState<IUser | null>(null);
  const loadingUser = async () => {
    try {
      const reponse = await fetch("/api/login", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await reponse.json();
      if (response.status === 200) {
        setUser(response.data);
      }
      if (response.status === 201) {
        window.location.replace("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    const initialize = async () => {
      await loadingUser();
    };
    initialize();
  }, []);

  return (
    <>
      {user && (
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="/bboxx.png" alt="Bboxx" />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Bboxx-DRC</span>
                    <span className="truncate text-xs">
                      {user?.poste[0].title}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src="/bboxx.png" alt="Bboxx" />
                      <AvatarFallback className="rounded-lg">B</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">Bboxx-DRC</span>
                      <span className="truncate text-xs">
                        {user?.poste[0].title}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User2Icon />
                    Agents
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <UserCheckIcon />
                    Agents admin
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard />
                    Regions and shops
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <Bell />
                    Manage feedbacks
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <RollerCoasterIcon />
                    Role and department
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <PercentDiamond />
                    Permissions
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LucideTableColumnsSplit />
                    Complaints
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MessageCircle />
                    Communications
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings />
                    Parameter portfolio
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => Deconnexion()}>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      )}
    </>
  );
}
