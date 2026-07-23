import type { TOrder, TOrderStatus } from "@/shared/types/main_types";
import { API_URL } from "@/shared/utils/consts";
import { isOrderType } from "@/shared/utils/functions";

export async function POST(request: Request) {
  const url = `${API_URL}/orders`;
  const body = await request.json();
  //console.log(body);
  const oldId = body.id;
  //Проверить на соответствуюший тип
  if (!isOrderType(body)) {
    return Response.json({
      status: "error",
      message: "Передан объект не типа TOrder",
    });
  }
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
  let Order: unknown | { data: Object } = {};

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
    Order = Object.assign({}, (Order as { data: Object }).data);
  } catch (err: unknown) {
    console.log((err as Error).message);
    return Response.json({ status: "error", message: (err as Error).message });
  }

  return Response.json({
    status: (Order as { data: Object }).data === null ? "error" : "ok",
    oldId,
    Order,
  });
}
