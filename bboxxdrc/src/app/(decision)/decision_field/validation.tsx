import { IDecision } from "@/app/interface/TClient";
import { Combobox } from "@/app/Tools/combobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { toast } from "sonner";

type Props = {
  client: IDecision;
  type: "field_fraude" | "call_center";
};

const labels = [
  { value: "VERIFICATION", label: "APPROVED" },
  { value: "REJECTED", label: "REJECTED" },
];
const label_portofolio = [
  { value: "APPROVED", label: "APPROVED" },
  { value: "REJECTED", label: "REJECTED" },
];
function Validation({ client, type }: Props) {
  const [isSending, setIsLoading] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string>("");
  const [commentaire, setCommentaire] = React.useState<string>("");
  const submitedStatus = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const donner = {
      id: client._id,
      statut: value,
      commentaire,
    };
    try {
      const res = await fetch("/api/arbitrage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donner),
      });

      const response = await res.json();
      if (response.status === 200) {
        toast("Opération effectuée avec succès");
      } else {
        toast(response.data);
        setIsLoading(false);
      }
    } catch (error: any) {
      toast(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Combobox
        value={value}
        data={type === "field_fraude" ? labels : label_portofolio}
        setValue={setValue}
      />
      <div className="grid gap-3 mt-4 mb-4">
        <Input
          onChange={(e) => setCommentaire(e.target.value)}
          id="comment"
          name="comment"
          value={commentaire}
          placeholder="commentaire"
        />
      </div>
      <div>
        <Button
          disabled={isSending}
          onClick={(event) => submitedStatus(event)}
          className="w-full"
        >
          Valider
        </Button>
      </div>
    </div>
  );
}

export default Validation;
