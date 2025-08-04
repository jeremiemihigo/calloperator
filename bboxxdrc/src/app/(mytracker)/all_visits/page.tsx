"use client";
import HeaderComponent from "@/app/header/Header";
import { IVisitsField } from "@/app/interface/IVisites";
import Loading from "@/app/Tools/loading";
import Tableau_set_Header from "@/app/Tools/Tab_set_Header";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useEffect, useState } from "react";

function page() {
  const [data, setData] = useState<IVisitsField[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const submitLogin = async () => {
    try {
      const res = await fetch("/api/allvisits", {
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
    { title: "agent_name", accessorKey: "agent_name" },
    { title: "agent_fonction", accessorKey: "agent_fonction" },
    { title: "PayementStatut", accessorKey: "PayementStatut" },
    { title: "clientStatut", accessorKey: "clientStatut" },
    { title: "consExpDays", accessorKey: "consExpDays" },
    { title: "dateSave", accessorKey: "dateSave" },
    { title: "raison", accessorKey: "raison" },
    // { title: "indt", accessorKey: "indt", },
  ];
  const columns: ColumnDef<IVisitsField>[] = keyColonnes.map((cle) => {
    return {
      accessorKey: cle.accessorKey,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {cle.title}
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue(cle.accessorKey)}</div>,
    };
  });
  return (
    <HeaderComponent title="All visits staff">
      {isLoading ? (
        <Loading type="Loading" />
      ) : (
        <Tableau_set_Header
          data={data}
          columns={columns}
          customer_id="customer_id"
          search_placeholder="Filter by customer ID"
        />
      )}
    </HeaderComponent>
  );
}

export default page;
