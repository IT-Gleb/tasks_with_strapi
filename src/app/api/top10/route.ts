import { API_URL } from "@/shared/utils/consts";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const params = await request.json();
  const url = `${API_URL}/orders-statistic?${params.query}`;

  const cookieStore = await cookies();
  const t_data = cookieStore.get("auth_token")?.value ?? null;
  let token = "";
  if (t_data !== null) {
    token = JSON.parse(t_data).token;
  }

  if (token === "") {
    return NextResponse.json({
      status: "error",
      message: "Authorization required!",
    });
  }

  const res = await fetch(url, {
    headers: {
      "content-type": "application/json; charset=utf-8",
      Authorization: `Bearer ${token}`,
    },
    method: "GET",
    signal: AbortSignal.timeout(10000),
  }).then((data) => data.json());

  //console.log(res);

  return NextResponse.json(res);
}
