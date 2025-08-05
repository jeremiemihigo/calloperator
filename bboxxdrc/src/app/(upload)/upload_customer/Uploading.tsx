import { IUploadClient } from "@/app/interface/IOther";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { toast } from "sonner";
import * as xlsx from "xlsx";
import TableauCustomerTrack from "./Tableau";

function UploadingCustomer() {
  const [data, setData] = React.useState<IUploadClient[]>([]);
  const [sending, setSending] = React.useState<boolean>(false);
  const column = [
    "customer_id",
    "customer_name",
    "shop",
    "par",
    "region",
    "sat",
    "cashattendu",
  ];
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
          const json: IUploadClient[] = xlsx.utils.sheet_to_json(worksheet);
          const colonnes = Object.keys(json[0]);
          let notexist = column.filter((x) => !colonnes.includes(x));
          if (notexist.length > 0 || column.length !== colonnes.length) {
            toast("Certaines colonnes ne sont pas dans le fichier uploader");
            return;
          } else {
            setData(json);
          }
        } catch (innerErr) {
          alert(JSON.stringify(innerErr));
          return;
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

  const template = () => {
    let donner = [
      {
        customer_id: "",
        customer_name: "",
        shop: "",
        region: "",
        sat: "",
        par: "",
        cashattendu: "",
      },
    ];
    const fileName = "Template_customer_to_track";
    const worksheet = xlsx.utils.json_to_sheet(donner);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Template");
    xlsx.writeFile(workbook, `${fileName}.xlsx`);
  };
  const sendData = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setSending(true);
    try {
      const response = await fetch("/api/allclient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const res = await response.json();
      if (res.status === 200) {
        window.location.replace("/upload_customer");
      } else {
        toast(res.data);
        setSending(false);
      }
    } catch (error: any) {
      toast(error.message);
    }
  };
  return (
    <>
      <div className="flex w-full items-center gap-3">
        <Input
          accept=".xlsx"
          onChange={(e) => readUploadFile(e)}
          id="picture"
          className="w-lg"
          type="file"
        />
        {data.length > 0 && (
          <Button disabled={sending} onClick={(event) => sendData(event)}>
            Submit
          </Button>
        )}
        <Button onClick={() => template()}>Download template</Button>
      </div>
      {data.length > 0 && (
        <div>
          <TableauCustomerTrack data={data} />
        </div>
      )}
    </>
  );
}

export default UploadingCustomer;
