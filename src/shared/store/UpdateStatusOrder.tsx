"use client";

import { TOrder } from "../types/main_types";
import { useOrdersStorage } from "./orderStore";
import { API_URL } from "../utils/consts";
import { isOrderType, Wait } from "../utils/functions";
import { useEffect, useState } from "react";
import getCacheQueryClient from "@/entityes/providers/getQueryCache";
import { Loader2 } from "lucide-react";

function isOrderValid(
  paramOrder: TOrder,
  paramDayValid: number = 1,
): "valid" | "novalid" {
  let res: "valid" | "novalid" = "novalid";

  const currentDate = new Date();

  const checkDate = new Date(paramOrder.createdAt);
  checkDate.setDate(checkDate.getDate() + paramDayValid);

  res = checkDate >= currentDate ? "valid" : "novalid";

  return res;
}

async function getOrderFromDB(paramId: string) {
  const db = useOrdersStorage();
  let db_order: Partial<TOrder> | null = await db.getOrder(paramId);

  if (!isOrderType(db_order)) {
    console.log("Это не TOrder - ", db_order);
    return null;
  }
  //Проверить на валидность заказа
  if (
    isOrderValid(db_order, 2) === "novalid" &&
    db_order.status !== "success"
  ) {
    db.deleteOrder(db_order.id);
    return null;
  }

  if (db_order.status === "cancelled" || db_order.status === "success") {
    return null;
  }
  return db_order as TOrder;
}

async function UpdateStatusOrder(paramId: string) {
  const db = useOrdersStorage();
  const _order = await getOrderFromDB(paramId);

  if (!_order) {
    return;
  }

  const url = `${API_URL}/orders/${paramId}`;

  //console.log(url);

  const query = getCacheQueryClient();
  const server_order = await query.fetchQuery({
    queryKey: ["order", paramId],
    queryFn: async () => {
      const res = await fetch(url, {
        headers: { "content-type": "application/json; charset=utf-8" },
        method: "GET",
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        return await res.json();
      }
      return null;
    },

    staleTime: 6000,
  });

  //Заменить статус
  if (server_order && server_order.data && _order) {
    //console.log(server_order);
    if (server_order.data.s_status !== _order.status) {
      _order.status = server_order.data.s_status;
      await db.deleteOrder(_order.id);
      await db.addOrder(_order);
    }
    //console.log(_order.status);
  }
  //Задержка для повтора в цикле
  await Wait(500);
}

const UpdateStatusInDB = () => {
  const db = useOrdersStorage();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let isWork: boolean = true;
    try {
      setIsLoading(true);

      (async function () {
        const ids = await db.getOrdersIds();

        if (ids && ids.length > 0) {
          if (isWork) {
            ids.forEach((order_id) => UpdateStatusOrder(order_id));
          }
        }
      })();
    } finally {
      setIsLoading(false);
    }

    return () => {
      isWork = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="w-fit mx-auto">
        <Loader2 size={16} className=" animate-spin" />
      </div>
    );
  }

  return null;
};

export default UpdateStatusInDB;
