import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toogle";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

type Props = {
  children: React.ReactNode;
  title: string;
};

function HeaderComponent({ children, title }: Props) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main style={{ width: "100%" }}>
            <div className="w-full">
              <nav className="flex nav-app w-screen">
                <div className="first_div">
                  <SidebarTrigger />
                  <ModeToggle />
                  <p>{title}</p>
                </div>
              </nav>

              <div style={{ padding: "10px" }}>{children}</div>
            </div>
          </main>
        </ThemeProvider>
      </SidebarProvider>
    </>
  );
}

export default HeaderComponent;
