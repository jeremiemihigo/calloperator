// import { lien_dt } from "@/app/static/lien";
import { ICasValider } from "@/app/interface/TClient";
import { lien_dt } from "@/app/static/lien";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { departement: string; poste: string } }
) {
  const token = request.cookies.get("access")?.value;
  const link = `${lien_dt}/cas_valider/${params.departement}`;
  const res = await fetch(link, {
    method: "GET",
    headers: {
      "Content-Type": "Application/json",
      Authorization: "Bearer " + token,
    },
  });
  if (res.status === 200) {
    const data: ICasValider[] = await res.json();
    let donner = data.map((x) => {
      return {
        ...x,
        typeDecision:
          x.decision?.length > 0 ? x.decision[0].decision : "Nothing",
        statutDecision:
          x.decision?.length > 0 ? x.decision[0].statut : "Nothing",
      };
    });
    const response = NextResponse.json({
      data: donner,
      status: res.status,
    });
    return response;
  }
}
