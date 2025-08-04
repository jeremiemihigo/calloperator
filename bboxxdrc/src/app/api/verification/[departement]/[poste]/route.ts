// import { lien_dt } from "@/app/static/lien";
import { IVerificationField } from "@/app/interface/TClient";
import { lien_dt } from "@/app/static/lien";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { departement: string; poste: string } }
) {
  const token = request.cookies.get("access")?.value;
  const link = `${lien_dt}/verification/${params.poste}/${params.departement}`;
  const res = await fetch(link, {
    method: "GET",
    headers: {
      "Content-Type": "Application/json",
      Authorization: "Bearer " + token,
    },
  });
  if (res.status === 200) {
    const data: IVerificationField[] = await res.json();
    const returnIncharge = (x: IVerificationField) => {
      if (x.departement.length > 0) {
        return x.departement.map(function (x) {
          return x.title + "; ";
        });
      }
      if (x.postes.length > 0) {
        return x.postes.map(function (x) {
          return x.title + "; ";
        });
      }
    };

    const donner = data.map((x) => {
      return {
        _id: x._id,
        customer_id: x.codeclient,
        customer_name: x.nomclient,
        shop: x.shop,
        region: x.region,
        par: x.par,
        submitedBy: x.submitedBy,
        //Ancienne visite par fonction
        feedback_last_vm: x.vm_fonction ? x.vm_fonction.demande.raison : "",
        date_last_vm: x.vm_fonction ? x.vm_fonction.demande.updatedAt : "",
        agent_last_vm: x.vm_fonction ? x.vm_fonction.demandeur.nom : "",
        //visite categorisation
        last_vm_categorie_date: x.visite_categori
          ? x.visite_categori.demande.updatedAt
          : "",
        last_vm_categorie_agent: x.visite_categori
          ? x.visite_categori.demandeur.nom
          : "",
        last_vm_for_categorie_id: x.visite_categori
          ? x.visite_categori.demandeur.codeAgent
          : "",
        feedback_call: x.last_call ? x.last_call.sioui_texte : "",
        currentFeedback: x.currentFeedback,
        submitedby: x.submitedBy,
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
