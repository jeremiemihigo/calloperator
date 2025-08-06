"use client";
import HeaderComponent from "@/app/header/Header";
import { ICombo } from "@/app/interface/IOther";
import { IUser } from "@/app/interface/IUser";
import { IVerificationField_Front } from "@/app/interface/TClient";
import { postes } from "@/app/static/lien";
import { Combobox } from "@/app/Tools/combobox";
import Loading from "@/app/Tools/loading";
import Tableau_set_Header from "@/app/Tools/Tab_set_Header";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import React from "react";

function Individually() {
  const [users, setUsers] = React.useState<ICombo[]>([]);

  const [data, setData] = React.useState<IVerificationField_Front[]>([]);
  const [codeAgent, setCodeAgent] = React.useState<string>("");
  const [value, setValue] = React.useState<string>("PO");
  const [load, setLoad] = React.useState<boolean>(true);
  const [loadData, setLoadData] = React.useState<boolean>(false);

  const loadingAgent = async () => {
    setLoad(true);
    const result = await fetch("/api/agentadmin", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await result.json();
    if (response.status === 200) {
      const utilisateurs: IUser[] = response.data;
      const donner = utilisateurs.map((x) => {
        return {
          label: x.nom,
          value: x.codeAgent,
        };
      });
      setUsers(donner);
      setLoad(false);
    }
  };
  React.useEffect(() => {
    const initialize = async () => {
      await loadingAgent();
    };
    initialize();
  }, []);

  const fetchData = async () => {
    try {
      setLoadData(true);
      const result = await fetch(`/api/individually/${value}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ codeAgent }),
      });
      const response = await result.json();
      if (response.status === 200) {
        setData(response.data);
        setLoadData(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const keyColonnes = [
    { title: "Customer ID", accessorKey: "customer_id" },
    { title: "Customer name", accessorKey: "customer_name" },
    { title: "Par", accessorKey: "par" },
    { title: "Feedback_last_vm", accessorKey: "feedback_last_vm" },
    { title: "Date_last_vm", accessorKey: "date_last_vm" },
    { title: "Agent_last_vm", accessorKey: "agent_last_vm" },
    {
      title: "Last_vm_for_categorie_id",
      accessorKey: "last_vm_for_categorie_id",
    },
    {
      title: "Feedback_call",
      accessorKey: "feedback_call",
    },
    { title: "Current status", accessorKey: "currentFeedback" },
    // { title: "Action", accessorKey: "action" },
    // { title: "Decision", accessorKey: "statut_decision" },
    { title: "Submitedby", accessorKey: "submitedby" },
  ];

  const columns1: ColumnDef<IVerificationField_Front>[] = keyColonnes.map(
    (cle) => {
      return {
        accessorKey: cle.accessorKey,
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {cle.title}
              <ArrowUpDown />
            </Button>
          );
        },
        cell: ({ row }) => <div>{row.getValue(cle.accessorKey)}</div>,
      };
    }
  );

  return (
    <HeaderComponent title="Dashboard Individually">
      {load && <Loading type="Loading" />}
      <Combobox value={codeAgent} data={users} setValue={setCodeAgent} />
      <div style={{ margin: "10px 0px" }}>
        <Combobox value={value} data={postes} setValue={setValue} />
      </div>
      <Button onClick={() => fetchData()} variant="default">
        Valider
      </Button>
      {loadData && <Loading type="Loading" />}
      {!loadData && (
        <Tableau_set_Header
          data={data}
          columns={columns1}
          customer_id="customer_id"
          search_placeholder="Filter by customer ID"
        />
      )}
    </HeaderComponent>
  );
}

export default Individually;
