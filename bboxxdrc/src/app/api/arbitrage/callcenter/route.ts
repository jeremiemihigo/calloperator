// import { lien_dt } from "@/app/static/lien";
import { IFeedback } from "@/app/interface/IFeedbacks";
import { IVisite } from "@/app/interface/IVisites";
import { IArbitration } from "@/app/interface/TClient";
import { lien_dt } from "@/app/static/lien";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("access")?.value;
  const link = `${lien_dt}/arbitrage`;
  const res = await fetch(link, {
    method: "GET",
    headers: {
      "Content-Type": "Application/json",
      Authorization: "Bearer " + token,
    },
  });
  if (res.status === 200) {
    const data = await res.json();
    const { result, feedbacks } = data;
    const returnFeedback = (id: string) => {
      if (feedbacks.filter((x: IFeedback) => x.idFeedback === id).length > 0) {
        return feedbacks.filter((x: IFeedback) => x.idFeedback === id)[0].title;
      } else {
        return id;
      }
    };
    const returnvisite = (visites: IVisite[], type: string[]) => {
      //console.log(visites, type);
      if (
        visites.filter((x) => type.includes(x.demandeur.fonction)).length > 0
      ) {
        let v = visites.filter((x) => type.includes(x.demandeur.fonction));
        const { demande } = v[v.length - 1];
        return returnFeedback(demande.raison);
      } else {
        return "No_visits";
      }
    };
    let donner = result.map((x: IArbitration) => {
      return {
        ...x,
        appel: returnFeedback(
          x.last_call?.sioui_texte ? x.last_call?.sioui_texte : ""
        ),
        currentFeedbacks: returnFeedback(x.currentFeedback),
        last_vm_agent:
          x?.visites.length > 0
            ? returnvisite(x.visites, ["agent", "tech"])
            : "No_visits",
        last_vm_rs:
          x?.visites.length > 0
            ? returnvisite(x.visites, ["RS", "TL"])
            : "No_visits",
        last_vm_po:
          x?.visites.length > 0 ? returnvisite(x.visites, ["PO"]) : "No_visits",
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
  const link = `${lien_dt}/arbitrage`;
  const res = await fetch(link, {
    method: "POST",
    headers: {
      "Content-Type": "Application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ data }),
  });
  const result = await res.json();
  if (res.status === 200) {
    const response = NextResponse.json({
      status: res.status,
    });
    return response;
  } else {
    const response = NextResponse.json({
      data: result.data,
      status: res.status,
    });
    return response;
  }
}
