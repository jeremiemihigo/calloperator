import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { toast } from "sonner";
import * as xlsx from "xlsx";
import { ICombo } from "../interface/IOther";
import { IArbitration } from "../interface/TClient";
import Loading from "../Tools/loading";
import Popup from "../Tools/Popup";
import DataError from "./dataError";

interface IDataArbitration {
  customer_id: string;
  changeto: string;
}
type Props = {
  clients: IArbitration[];
};
interface DataPush {
  id: string;
  customer_id: string;
  data: {
    feedback: string;
    currentFeedback: string | boolean;
  };
}

function Uploadcallcenter({ clients }: Props) {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [feedbacks, setFeedbacks] = React.useState<ICombo[]>([]);
  const [data, setData] = React.useState<DataPush[]>([]);

  const returnFeedback = (id: string) => {
    if (feedbacks.length > 0) {
      let customer = feedbacks.filter((x) => x.label === id);
      if (customer.length > 0) {
        return customer[0].value;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const [sending, setSending] = React.useState<boolean>(false);
  const readUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSending(true);
    try {
      const files = e.target.files;
      if (!files || files.length === 0) {
        toast("No file selected.");
        setSending(false);
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev: ProgressEvent<FileReader>) => {
        try {
          const data = ev.target?.result;
          if (!data) {
            throw new Error("Empty file data");
          }
          const workbook = xlsx.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json: IDataArbitration[] = xlsx.utils.sheet_to_json(worksheet);
          const returnID = (id: string) => {
            if (clients.filter((x) => x.customer_id === id).length > 0) {
              return {
                id: clients.filter((x) => x.customer_id === id)[0].id,
                customer_status: clients.filter((x) => x.customer_id === id)[0]
                  .idFeedback,
                customer_code: clients.filter((x) => x.customer_id === id)[0]
                  .customer_id,
              };
            } else {
              return {
                id: "",
                customer_status: "",
                customer_code: "",
              };
            }
          };
          let tableau = [];
          for (let x = 0; x < json.length; x++) {
            tableau.push({
              id: returnID(clients[x].customer_id).id?.toString(),
              customer_id: clients[x].customer_id,
              data: {
                currentFeedback: returnFeedback(json[x].changeto),
                feedback: "APPROVED",
              },
            });
          }
          setData(tableau);
        } catch (innerErr) {
          alert(JSON.stringify(innerErr));
        } finally {
          setSending(false);
        }
      };

      reader.onerror = () => {
        toast("Failed to read file.");
        setSending(false);
      };

      reader.readAsArrayBuffer(files[0]);
    } catch (error) {
      alert("Error " + (error as Error).message);
      setSending(false);
    }
  };

  const Loadfeedback = async () => {
    try {
      const res = await fetch("/api/feedback", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.status === 200) {
        setFeedbacks(data.data);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    const initialize = async () => {
      await Loadfeedback();
    };
    initialize();
  }, []);

  const template = () => {
    let donner = clients.map((x) => {
      return {
        customer_id: x.customer_id,
        changeto: "",
      };
    });
    const fileName = "Template_arbitrage";
    const worksheet = xlsx.utils.json_to_sheet(donner);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Template");
    xlsx.writeFile(workbook, `${fileName}.xlsx`);
  };
  const sendData = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/arbitrage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const res = await response.json();
      if (res.status === 200) {
        window.location.replace("/arbitration_call_center");
      } else {
        toast("Error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {isLoading ? (
        <Loading type="Loading" />
      ) : (
        <div className="flex w-full items-center gap-3">
          <Input
            accept=".xlsx"
            onChange={(e) => readUploadFile(e)}
            id="picture"
            className="w-lg"
            type="file"
          />
          {data.length > 0 &&
            data.filter((x) => !x.data.currentFeedback).length === 0 && (
              <Button onClick={(event) => sendData(event)}>Submit</Button>
            )}
          <Button onClick={() => template()}>Download template</Button>
          {data.length > 0 &&
            data.filter((x) => !x.data.currentFeedback).length > 0 && (
              <Popup
                btnname="View data error"
                title="Change status for"
                component={
                  <DataError
                    data={data.filter((x) => !x.data.currentFeedback)}
                  />
                }
              />
            )}
        </div>
      )}
    </div>
  );
}

export default Uploadcallcenter;
