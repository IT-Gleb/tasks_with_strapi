import { TListToModifyStatus } from "@/shared/store/ordersToModifyStore";
import { API_URL } from "@/shared/utils/consts";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token") ?? "";
  let isError = false;

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
      signal: AbortSignal.timeout(10000),
      method: "PUT",
      body: JSON.stringify({
        data: { s_status: item.s_status },
      }),
    }),
  );

  //Разбить массив на чанки по 5 штук
  const chunckSize = 5;
  const errorItems: string[] = [];

  for (let i: number = 0; i < fetchArray.length; i += chunckSize) {
    //скопировать часть массива для передачи
    let fetchedItems = fetchArray.slice(i, i + chunckSize);
    //console.log(fetchedItems);

    await Promise.allSettled(fetchedItems).then((data) =>
      data.forEach((item) => {
        if (item.status === "rejected") {
          // console.log(item.value.ok);
          errorItems.push(item.status);
        }
      }),
    );
  }

  isError = errorItems.length > 0;
  if (isError) {
    console.log("Error send status --- ", errorItems);

    return NextResponse.json({ ok: false });
  }

  return NextResponse.json({ ok: true });
}
