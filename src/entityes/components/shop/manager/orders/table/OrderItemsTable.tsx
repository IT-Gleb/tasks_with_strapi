"use client";

import type { TBasketItem } from "@/shared/types/main_types";
import { memo } from "react";

//Таблица с продуктоами в заказе

const ItemsTable = memo(({ items }: { items: TBasketItem[] }) => {
  return (
    <div className="ml-10 w-[85%] text-xs flex gap-0.5 py-1 shadow-lg dark:shadow-slate-400 dark:bg-chocolate/25 rounded-s-lg">
      <div className="w-fit max-w-50 flex flex-col gap-1 [&>div]:p-1 uppercase bg-indigo-400/75 dark:bg-indigo-800/50 text-yellow-50 rounded-s-xl">
        <div>Наименование</div>
        <div>Количество</div>
        <div>Цена</div>
      </div>
      <div className="w-[75%] overflow-x-auto flex gap-0.5 items-center">
        {items.map((itm) => (
          <div
            key={itm.documentId}
            className="flex flex-col items-start gap-0.5 [&>div]:rounded-lg [&>div]:border [&>div]:w-60 [&>div]:p-1.5 [&>div]:border-slate-300 dark:[&>div]:border-slate-600"
          >
            <div className=" line-clamp-1">{itm.title}</div>
            <div>{itm.count}</div>
            <div>
              {Intl.NumberFormat("ru-RU", {
                style: "currency",
                currency: "RUB",
              }).format(itm.price)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default ItemsTable;
