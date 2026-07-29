import { TListToModifyStatus } from "@/shared/store/ordersToModifyStore";
import { API_URL } from "@/shared/utils/consts";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token") ?? "";

  if (token === "") {
    return NextResponse.json({ ok: false, message: "Authorizition filed!" });
  }

  const body = (await request.json()) as TListToModifyStatus[];

  const url = `${API_URL}/orders/`;
  const fetchArray = body.map((item) =>
    fetch(url + item.id, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Autorization: `Bearer ${token}`,
      },
      signal: AbortSignal.timeout(20000),
      method: "PUT",
      body: JSON.stringify({
        data: { s_status: item.s_status },
      }),
    }),
  );

  await Promise.allSettled(fetchArray).then((data) =>
    data.forEach((item) => {
      if (item.status === "fulfilled") {
        // console.log(item.value.ok);
      }
    }),
  );

  return NextResponse.json({ ok: true });
}
