import type { TOrder, TOrderStatus } from "@/shared/types/main_types";
import { API_URL } from "@/shared/utils/consts";

export async function POST(request: Request) {
  const url = `${API_URL}/orders`;
  const body = await request.json();
  //console.log(body);
  const oldId = body.id;
  //Подготовить данные для заказа на сервер
  // delete body.id;
  // delete body.createAt;
  // delete body.updatedAt;
  // delete body.title;
  // delete body.status;
  // body.s_status = "delivered";

  const newOrder: Partial<TOrder & { s_status: TOrderStatus }> = {
    s_status: "delivered",
    price: body.price,
    items: body.items,
  };
  let Order: unknown = {};

  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json; charset=utf-8" },
      method: "POST",
      signal: AbortSignal.timeout(5000),
      body: JSON.stringify({
        data: newOrder,
      }),
    });
    if (res.status > 299) {
      throw new Error("ошибка при добавлении нового заказа!");
    }
    Order = Object.assign({}, await res.json());
  } catch (err: unknown) {
    console.log((err as Error).message);
    return Response.json({ status: "error", message: (err as Error).message });
  }

  return Response.json({
    status: "ok",
    oldId,
    Order,
  });
}
