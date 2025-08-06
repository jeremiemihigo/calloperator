// import { lien_dt } from "@/app/static/lien";
import { IFeedback } from "@/app/interface/IFeedbacks";
import { IVisite } from "@/app/interface/IVisites";
import { ITclient } from "@/app/interface/TClient";
import { lien_dt } from "@/app/static/lien";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("access")?.value;
  const link = `${lien_dt}/allclient`;
  const res = await fetch(link, {
    method: "GET",
    headers: {
      "Content-Type": "Application/json",
      Authorization: "Bearer " + token,
    },
  });

  if (res.status === 200) {
    const data = await res.json();
    const { feedbacks, resultat } = data;
    const clients: ITclient[] = resultat;
    const returnFeedback = (id: string | undefined, sinon: string) => {
      if (feedbacks && feedbacks.length > 0) {
        if (
          feedbacks.filter((x: IFeedback) => x.idFeedback === id).length > 0
        ) {
          return feedbacks.filter((x: IFeedback) => x.idFeedback === id)[0]
            ?.title;
        } else {
          return sinon;
        }
      }
      // return 'No_visits';
    };
    const returnvisite = (visites: IVisite[], type: string[]) => {
      if (
        visites.filter((x) => type.includes(x.demandeur.fonction)).length > 0
      ) {
        const v = visites.filter((x) => type.includes(x.demandeur.fonction));
        const { demande } = v[v.length - 1];
        return returnFeedback(demande.raison, "No_visits");
      } else {
        return "No_visits";
      }
    };
    const returnIncharge = (x: ITclient) => {
      if (x.incharge && x.incharge?.length > 0) {
        return x.incharge.map(function (x) {
          return x.title;
        });
      }
      if (x.postes && x.postes?.length > 0) {
        return x.postes.map(function (x) {
          return x.title;
        });
      }
    };

    const donner = clients.map((x) => {
      return {
        actif: x.actif,
        idFeedback: x.currentFeedback,
        customer_id: x.codeclient,
        customer_name: x.nomclient,
        nom: x.nomclient,
        par: x.par,
        region: x.region,
        shop: x.shop,
        action: x.action,
        submitedBy: x.submitedBy,
        inprocess: x.actif ? "In_Process" : "Done",
        currentFeedback: x.tfeedback?.title,
        cashattendu: x.cashattendu ? "$" + x.cashattendu : "undefined",
        cashPayer: x.cashPayer ? "$" + x.cashPayer : "undefined",
        feedback_call:
          returnFeedback(x.derniereappel?.sioui_texte, "No_calls") ||
          "No_calls",
        last_vm_agent:
          x.visites?.length > 0
            ? returnvisite(x.visites, ["agent", "tech"])
            : "No_visits",
        zbm_rs_sm_tl:
          x?.visites.length > 0
            ? returnvisite(x.visites, ["RS", "TL", "SM", "ZBM"])
            : "No_visits",
        po:
          x?.visites.length > 0 ? returnvisite(x.visites, ["PO"]) : "No_visits",
        fullDate: x.fullDate,
        statut_decision: x.statut_decision,
        incharge: returnIncharge(x),
      };
    });
    const response = NextResponse.json({
      data: donner,
      status: res.status,
    });
    return response;
  }
}
export async function POST(request: NextRequest) {
  const token = request.cookies.get("access")?.value;
  const data = await request.json();
  const link = `${lien_dt}/upload_customer`;
  const res = await fetch(link, {
    method: "POST",
    headers: {
      "Content-Type": "Application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ data }),
  });
  const result = await res.json();
  const response = NextResponse.json({
    data: result,
    status: res.status,
  });
  return response;
}
