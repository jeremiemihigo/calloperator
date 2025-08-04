"use client";
import HeaderComponent from "@/app/header/Header";
import { ITclient } from "@/app/interface/TClient";
import Loading from "@/app/Tools/loading";
import Tableau from "@/app/Tools/Tableau";
import { useEffect, useState } from "react";

function page() {
  const [data, setData] = useState<ITclient[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const submitLogin = async () => {
    try {
      const res = await fetch("/api/allclient", {
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
    { title: "In process", accessorKey: "inprocess" },
    { title: "feedback_call", accessorKey: "feedback_call" },
    { title: "Feedback PA", accessorKey: "last_vm_agent" },
    { title: "ZBM,RS,SM & TL", accessorKey: "zbm_rs_sm_tl" },
    { title: "PO", accessorKey: "po" },
    { title: "Current status", accessorKey: "currentFeedback" },
    { title: "Action", accessorKey: "action" },
    { title: "Decision", accessorKey: "statut_decision" },
    { title: "cash attendu", accessorKey: "cashattendu" },
    { title: "cash Payer", accessorKey: "cashPayer" },
    { title: "incharge", accessorKey: "incharge" },
  ];
  return (
    <HeaderComponent title="All Customers to track for this month">
      {isLoading ? (
        <Loading type="Loading" />
      ) : (
        <Tableau
          data={data}
          keyColonnes={keyColonnes}
          customer_id="customer_id"
          search_placeholder="Filter by customer ID"
        />
      )}
    </HeaderComponent>
  );
}

export default page;
