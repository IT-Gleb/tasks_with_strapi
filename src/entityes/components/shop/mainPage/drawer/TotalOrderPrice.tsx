"use client";

import { useBasket } from "@/shared/store/basketStore";
import { useShallow } from "zustand/shallow";

const TotalOrderPrice = () => {
  const { totalOrderPrice } = useBasket(useShallow((state) => state));

  return (
    <div className="w-full mt-10 p-2 text-right text-3xl">
      <span className="font-bold text-sm pr-5">Сумма заказа: </span>
      {Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
      }).format(totalOrderPrice())}
    </div>
  );
};

export default TotalOrderPrice;
