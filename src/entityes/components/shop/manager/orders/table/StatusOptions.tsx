"use client";

//Select со статусами заказа

import type { TOrderStatus } from "@/shared/types/main_types";
import { useMemo, useState } from "react";

const orderStatusRus: Record<TOrderStatus, string> = {
  created: "Новый",
  delivered: "В магазине",
  "in-work": "В обработке",
  cancelled: "Отменен",
  success: "Готов",
};

const orderStatus: TOrderStatus[] = Object.keys(
  orderStatusRus,
) as TOrderStatus[];

const StatusOptions = ({
  paramId,
  selected,
  handler,
}: {
  paramId: string;
  selected: TOrderStatus;
  handler: (param: boolean, paramStatus: TOrderStatus) => void;
}) => {
  const [option, setOption] = useState<string>(
    orderStatus.includes(selected) ? selected : "",
  );

  const handlerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setOption(value); // Capture the chosen option value

    handler(value !== selected, value as TOrderStatus);
  };

  const ordStatus = useMemo(() => {
    const tmp = [...orderStatus];
    let indx = tmp.indexOf(selected);
    selected === "success"
      ? (indx -= 2)
      : selected === "cancelled"
        ? (indx -= 1)
        : indx;

    return tmp.slice(indx, orderStatus.length);
  }, []);

  return (
    <select
      name={`status-${paramId}`}
      id={`status-${paramId}`}
      className="p-1 border rounded-md border-slate-600"
      value={option}
      onChange={handlerChange}
    >
      {ordStatus.map((opt) => (
        <option key={opt} value={opt}>
          {orderStatusRus[opt]}
        </option>
      ))}
    </select>
  );
};

export default StatusOptions;
