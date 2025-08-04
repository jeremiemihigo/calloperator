import { ModeToggle } from "@/components/mode-toogle";
import { SidebarTrigger } from "@/components/ui/sidebar";
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
    <div className="w-full">
      <nav className="flex nav-app w-screen">
        <div className="first_div">
          <SidebarTrigger />
          <ModeToggle />
          <p>{title}</p>
        </div>
        <div className="identity">
          <p className="name">{user && user.nom}</p>
          <p className="fonction">CUSTOMER SUPPORT APP DEV</p>
        </div>
      </nav>
      <div style={{ padding: "10px" }}>{children}</div>
    </div>
  );
}

export default HeaderComponent;
