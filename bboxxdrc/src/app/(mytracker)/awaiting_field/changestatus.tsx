"use client";

import { ICombo } from "@/app/interface/IOther";
import { IVerificationField_Front } from "@/app/interface/TClient";
import { Combobox } from "@/app/Tools/combobox";
import Loading from "@/app/Tools/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
  data: IVerificationField_Front;
};
function Changestatus({ data }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [feedbacks, setFeedbacks] = useState<ICombo[]>([]);
  const [opencombo, setOpencombo] = useState<boolean>(false);
  const [feedbackselect, setFeedbacksSelect] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [commentaire, setCommentaire] = useState<string>("");
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
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const initialize = async () => {
      await Loadfeedback();
    };
    initialize();
  }, []);

  const submitedStatus = async () => {
    setIsSending(true);
    const donner = {
      id: data._id,
      nextFeedback: feedbackselect,
      commentaire,
    };
    const response = await fetch("/api/verification/field", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([donner]),
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
      {isLoading ? (
        <Loading type="Loading" />
      ) : (
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Combobox
              open={opencombo}
              setOpen={setOpencombo}
              value={feedbackselect}
              data={feedbacks}
              setValue={setFeedbacksSelect}
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
      )}
    </div>
  );
}

export default Changestatus;
