// import { lien_dt } from "@/app/static/lien";
import { lien_dt } from "@/app/static/lien";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const token = request.cookies.get("access")?.value;
  const data = await request.json();
  const link = `${lien_dt}/changefeedback`;
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
