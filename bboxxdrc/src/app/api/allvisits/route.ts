// import { lien_dt } from "@/app/static/lien";
import { IVisitsField } from "@/app/interface/IVisites";
import { lien_dt } from "@/app/static/lien";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("access")?.value;
  const link = `${lien_dt}/allstaffvisits`;
  const res = await fetch(link, {
    method: "GET",
    headers: {
      "Content-Type": "Application/json",
      Authorization: "Bearer " + token,
    },
  });
  if (res.status === 200) {
    const data: IVisitsField[] = await res.json();
    const response = NextResponse.json({
      data,
      status: res.status,
    });
    return response;
  }
}
