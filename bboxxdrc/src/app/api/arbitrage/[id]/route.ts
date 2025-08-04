// import { lien_dt } from "@/app/static/lien";
import { lien_dt } from "@/app/static/lien";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = request.cookies.get("access")?.value;
  const link = `${lien_dt}/readDecisionArbitrage/${params.id}`;
  const res = await fetch(link, {
    method: "GET",
    headers: {
      "Content-Type": "Application/json",
      Authorization: "Bearer " + token,
    },
  });
  if (res.status === 200) {
    const data = await res.json();
    const response = NextResponse.json({
      data,
      status: res.status,
    });
    return response;
  }
}
