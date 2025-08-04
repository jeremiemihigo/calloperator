"use client";
import HeaderComponent from "@/app/header/Header";
import { IDecision } from "@/app/interface/TClient";
import Loading from "@/app/Tools/loading";
import Popup from "@/app/Tools/Popup";
import Tableau_set_Header from "@/app/Tools/Tab_set_Header";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import Validation from "../arbitration_field/validation";

function page() {
  const [data, setData] = useState<IDecision[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const submitLogin = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/arbitrage/D7UNY`, {
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
    { title: "Shop name", accessorKey: "shop" },
    { title: "Region name", accessorKey: "region" },
    { title: "Decision", accessorKey: "decision" },
    { title: "Statut", accessorKey: "statut" },
    { title: "Submitedby", accessorKey: "createdBy" },
    { title: "Comment", accessorKey: "comment" },
  ];
  const columns1: ColumnDef<IDecision>[] = keyColonnes.map((cle) => {
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
  const columns: ColumnDef<IDecision>[] = [
    {
      id: "Option",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Edit
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <Popup
          btnname={<SquarePen />}
          title="Change status for"
          component={<Validation client={row.original} />}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];
  return (
    <HeaderComponent title="Arbitrage fraude">
      {isLoading ? (
        <Loading type="Loading" />
      ) : (
        <>
          <Tableau_set_Header
            data={data}
            columns={[...columns, ...columns1]}
            customer_id="customer_id"
            search_placeholder="Filter by customer ID"
          />
        </>
      )}
    </HeaderComponent>
  );
}

export default page;
