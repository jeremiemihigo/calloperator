"use client";
import HeaderComponent from "@/app/header/Header";
import { IArbitration } from "@/app/interface/TClient";
import Loading from "@/app/Tools/loading";
import Tableau from "@/app/Tools/Tableau";
import { useEffect, useState } from "react";
import Uploadcallcenter from "../uploadcallcenter";

function page() {
  const [data, setData] = useState<IArbitration[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const submitLogin = async () => {
    try {
      const res = await fetch("/api/arbitrage/callcenter", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.status === 200) {
        setData(data.data);
        setIsLoading(false);
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  useEffect(() => {
    const initialize = async () => {
      submitLogin();
    };
    initialize();
  }, []);
  const keyColonnes = [
    { title: "Customer ID", accessorKey: "customer_id" },
    { title: "Customer name", accessorKey: "customer_name" },
    { title: "Shop name", accessorKey: "shop" },
    { title: "Region name", accessorKey: "region" },
    { title: "Par", accessorKey: "par" },
    { title: "VM agent", accessorKey: "last_vm_agent" },
    { title: "VM po", accessorKey: "last_vm_po" },
    { title: "VM_rs_TL", accessorKey: "last_vm_rs" },
    { title: "Appel", accessorKey: "appel" },
    { title: "current Feedback", accessorKey: "currentFeedbacks" },
    { title: "Next Feedback", accessorKey: "nextFeedback" },
    { title: "Submitedby", accessorKey: "submitedBy" },
  ];
  return (
    <HeaderComponent title="Call center categorization">
      {isLoading ? (
        <Loading type="Loading" />
      ) : (
        <>
          <Uploadcallcenter clients={data} />

          <Tableau
            data={data}
            keyColonnes={keyColonnes}
            customer_id="customer_id"
            search_placeholder="Filter by customer ID"
          />
        </>
      )}
    </HeaderComponent>
  );
}

export default page;
