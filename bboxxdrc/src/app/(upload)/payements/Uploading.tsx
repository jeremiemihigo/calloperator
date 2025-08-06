import { IPayement } from "@/app/interface/IOther";
import { excelSerialToJSDate } from "@/app/static/functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { toast } from "sonner";
import * as xlsx from "xlsx";

function UploadingPayment() {
  const [data, setData] = React.useState<IPayement[]>([]);
  const [sending, setSending] = React.useState<boolean>(false);
  const column = [
    "account_id",
    "shop_name",
    "amount",
    "transaction_time",
    "processed_date",
    "payment_status",
    "provider_transact_reference",
    "provider",
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
          const json: IPayement[] = xlsx.utils.sheet_to_json(worksheet);
          const colonnes = Object.keys(json[0]);
          const notexist = column.filter((x) => !colonnes.includes(x));
          if (notexist.length > 0) {
            toast("Certaines colonnes ne sont pas dans le fichier uploader");
            return;
          } else {
            let donner = json.map((x) => {
              return {
                account_id: x.account_id,
                amount: x.amount,
                payment_status: x.payment_status,
                processed_date: excelSerialToJSDate(
                  parseInt(x.processed_date)
                ).toString(),
                provider: x.provider,
                provider_transact_reference: x.provider_transact_reference,
                shop_name: x.shop_name,
                transaction_time: excelSerialToJSDate(
                  parseInt(x.transaction_time)
                ).toString(),
              };
            });
            setData(donner);
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
        account_id: "",
        shop_name: "",
        transaction_time: "",
        amount: "",
        processed_date: "",
        payment_status: "",
        provider_transact_reference: "",
        provider: "",
      },
    ];
    const fileName = "Template_Payment";
    const worksheet = xlsx.utils.json_to_sheet(donner);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Template");
    xlsx.writeFile(workbook, `${fileName}.xlsx`);
  };
  const sendData = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setSending(true);
    try {
      const response = await fetch("/api/payement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const res = await response.json();
      if (res.status === 200) {
        window.location.replace("/payements");
      } else {
        toast(res.data);
        setSending(false);
      }
    } catch (error: any) {
      toast(error.message);
    }
  };
  console.log(data);
  return (
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
  );
}

export default UploadingPayment;
