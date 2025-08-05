import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toogle";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { IUser } from "../interface/IUser";

type Props = {
  children: React.ReactNode;
  title: string;
};

function HeaderComponent({ children, title }: Props) {
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
      loadingUser();
    };
    initialize();
  }, []);
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
              {user && (
                <nav className="flex nav-app w-screen">
                  <div className="first_div">
                    <SidebarTrigger />
                    <ModeToggle />
                    <p>{title}</p>
                  </div>
                  <div className="identity">
                    <p className="name">{user && user.nom}</p>
                    <p className="fonction">
                      {user.poste.length > 0 && user.poste[0].title}{" "}
                      {user.valueFilter?.length > 0 &&
                        user?.valueFilter.join("; ")}
                    </p>
                  </div>
                </nav>
              )}
              <div style={{ padding: "10px" }}>{children}</div>
            </div>
          </main>
        </ThemeProvider>
      </SidebarProvider>
    </>
  );
}

export default HeaderComponent;
