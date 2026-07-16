"use client";

import { TOrder, useOrdersStorage } from "@/shared/store/orderStore";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

function StatusMapper(param: TOrder): string {
  let res: string = "";

  switch (param.status) {
    case "created":
      res = "Новый";
      break;
    case "cancelled":
      res = "Отменен";
      break;
    case "delivered":
      res = "В магазине";
      break;
    case "in-work":
      res = "В обработке";
      break;
    case "success":
      res = "Успешно выполнен";
      break;
    default:
      res = "Новый";
      break;
  }
  return res;
}

const OrdersTable = () => {
  const ordersSt = useOrdersStorage();

  const { data, isLoading, error } = useQuery({
    queryKey: ["orders", 1],
    queryFn: async () => {
      return await ordersSt.getOrders();
    },
  });

  if (isLoading) {
    return <Loader2 size={36} className=" animate-spin" />;
  }

  if (error) {
    return <div className="p-2 w-fit mx-auto">Ошибка загрузки данных!</div>;
  }

  return (
    <section>
      <div className="w-full p-4 rounded-t-2xl grid grid-cols-[40px_minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] gap-x-2 items-center bg-slate-200 text-xs lg:text-sm font-bold">
        <div className="text-xs">№/№</div>
        <div>Наименование</div>
        <div>Статус</div>
        <div>Цена</div>
      </div>
      {data !== null &&
        data?.map((order, index) => (
          <div
            key={order.id}
            className="w-full grid grid-cols-[40px_minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] gap-x-2 p-1"
          >
            <div>{index + 1}</div>
            <div>{order.title}</div>
            <div>{StatusMapper(order)}</div>
            <div>
              {Intl.NumberFormat("ru-RU", {
                style: "currency",
                currency: "RUB",
              }).format(order.price)}
            </div>
          </div>
        ))}
    </section>
  );
};

export default OrdersTable;
