// import { lien_dt } from "@/app/static/lien";
import { IDonner } from "@/app/interface/IOther";
import { lien_dt } from "@/app/static/lien";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("access")?.value;
  const link = `${lien_dt}/dashboardTracker`;
  const res = await fetch(link, {
    method: "GET",
    headers: {
      "Content-Type": "Application/json",
      Authorization: "Bearer " + token,
    },
  });
  if (res.status === 200) {
    const data: IDonner = await res.json();

    const response = NextResponse.json({
      data,
      status: res.status,
    });
    return response;
  }
}
