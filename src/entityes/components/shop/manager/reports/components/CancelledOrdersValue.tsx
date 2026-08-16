"use client";

import { TValues } from "@/shared/types/main_types";
import { formatCurrency } from "@/shared/utils/functions";
import { useMemo, useState } from "react";

const CancelledOrdersValue = ({ data }: { data: TValues[] }) => {
  const [countOrders, setCountOrders] = useState<number>(0);
  const [sumOrders, setSumOrders] = useState<number>(0);

  useMemo(() => {
    const count = data
      .filter((i) => i.status === "cancelled")
      .reduce((acc, val) => {
        return (acc += Number(val.order_count));
      }, 0);
    setCountOrders(count);

    const totalSum = data
      .filter((i) => i.status === "cancelled")
      .reduce((acc, val) => {
        return (acc += val.total_day_price);
      }, 0);

    setSumOrders(totalSum);
  }, [data]);

  return (
    <div className="w-full flex gap-2 items-end justify-between p-2 text-xs">
      <span className="text-muted">
        Всего за период:{" "}
        <span className="text-xl font-semibold">{countOrders}</span>
      </span>
      <span className="text-muted">
        Сумма за период:{" "}
        <span className="text-2xl text-danger font-semibold">
          {formatCurrency(sumOrders)}
        </span>
      </span>
    </div>
  );
};

export default CancelledOrdersValue;
