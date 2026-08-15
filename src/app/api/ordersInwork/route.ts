import {
  API_URL,
  itemsOnPage,
  ordersInWorkRequest,
} from "@/shared/utils/consts";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const paramData = await request.json();
  const page = (paramData.page as string) ?? "1";
  const url = `${API_URL}/${ordersInWorkRequest.replace("%1", page).replace("%2", String(itemsOnPage))}`;

  const cookieStore = await cookies();
  let token = "";
  const cookieData = cookieStore.get("auth_token")?.value ?? null;

  if (cookieData) {
    token = JSON.parse(cookieData).token;
  }

  if (token === "") {
    NextResponse.json({ status: "error", message: "Authorization required" });
  }

  const res = await fetch(url, {
    headers: {
      "content-type": "application/json; charset=utf-8",
      Authorization: `Bearer ${token}`,
    },
    method: "GET",
    signal: AbortSignal.timeout(5000),
  }).then((data) => data.json());

  return NextResponse.json({ orders: res.data, meta: res.meta });
}
