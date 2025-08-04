"use client";

import { ICasValider } from "@/app/interface/TClient";
import { Combobox } from "@/app/Tools/combobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  data: ICasValider;
};
const dataDecision = [
  { label: "WRITE_OFF", value: "WRITE_OFF" },
  { label: "OPT_OUT", value: "OPT_OUT" },
  { label: "TRACKING_ONGOING", value: "TRACKING_ONGOING" },
];

function ChangeDecision({ data }: Props) {
  const [opencombo, setOpencombo] = useState<boolean>(false);
  const [decision, setDecisionSelect] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [commentaire, setCommentaire] = useState<string>("");

  const submitedStatus = async () => {
    setIsSending(true);
    const donner = {
      codeclient: data.customer_id,
      comment: commentaire,
      shop: data.shop,
      idHistorique: data.idHistorique,
      region: data.region,
      decision,
    };
    const response = await fetch("/api/decision", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(donner),
    });
    const payload = await response.json().catch(() => null);
    if (payload.status === 200) {
      toast("Opération effectuée");
      setIsSending(false);
    } else {
      setIsSending(false);
      toast(payload.data, {
        description: "Y a eu un souci avec lors de la validation",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
    }
  };

  return (
    <div>
      <div className="grid gap-4">
        <div className="grid gap-3">
          <Combobox
            open={opencombo}
            setOpen={setOpencombo}
            value={decision}
            data={dataDecision}
            setValue={setDecisionSelect}
          />
        </div>
        <div className="grid gap-3">
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
            onClick={() => submitedStatus()}
            className="w-full"
          >
            Valider
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChangeDecision;
