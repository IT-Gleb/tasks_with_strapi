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
    signal: AbortSignal.timeout(10000),
  }).then((data) => data.json());

  if (res.data === null) {
    return NextResponse.json({
      orders: [],
      meta: { pagination: { page: 1, pageSize: itemsOnPage, pageCount: 1 } },
    });
  }
  //конвертируем данные
  //Конверт s_status в status & id присваеваем documentId
  const t_data = res.data.map((item: any) => {
    const { s_status: status, documentId, ...other } = item;
    const t_item = { ...other, status };
    t_item["id"] = documentId;

    return t_item;
  });

  return NextResponse.json({ orders: t_data, meta: res.meta });
}
