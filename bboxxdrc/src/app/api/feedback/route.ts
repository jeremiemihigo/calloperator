// import { lien_dt } from "@/app/static/lien";
import { IFeedback } from "@/app/interface/IFeedbacks";
import { lien } from "@/app/static/lien";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("access")?.value;
  const link = `${lien}/readfeedback/all`;
  const res = await fetch(link, {
    method: "GET",
    headers: {
      "Content-Type": "Application/json",
      Authorization: "Bearer " + token,
    },
  });
  if (res.status === 200) {
    const data: IFeedback[] = await res.json();
    const formatage = data.map((x) => {
      return {
        value: x.idFeedback,
        label: x.title,
      };
    });
    const response = NextResponse.json({
      data: formatage,
      status: res.status,
    });
    return response;
  }
}
