"use client";

import type { TValues } from "@/shared/types/main_types";
import { formatCurrency, formatDate } from "@/shared/utils/functions";
import { cn } from "@heroui/styles";
import { useLayoutEffect, useState } from "react";

const RowLine = ({ row }: { row: TValues[] }) => {
  return row.map((item, index) => (
    <div
      key={index}
      className="w-full grid grid-cols-[100px_minmax(0,0.5fr)_minmax(0,1fr)] gap-2 items-center-safe first:border-b dark:first:border-b-stone-400"
    >
      <span
        className={cn(
          "block w-5 h-3 rounded-sm mx-auto",
          item.status === "success" ? "bg-green-400" : "bg-rose-300",
        )}
      ></span>
      <span className="text-right">{item.order_count}</span>
      <span className="text-right pr-2">
        {formatCurrency(item.total_day_price)}
      </span>
    </div>
  ));
};

const RowList = ({
  row,
  values,
  className = "",
}: {
  row: string;
  values: TValues[];
  className: string;
}) => {
  //console.log("---Values---", values);
  const successed = values.filter((item) => item.status === "success");
  const cancelled = values.filter((item) => item.status === "cancelled");

  return (
    <li
      className={cn(
        " border-b border-b-stone-500 dark:border-b-stone-500 text-xs",
        className,
      )}
    >
      <span className="p-1 border-r dark:border-stone-400 place-content-center">
        {formatDate(new Date(row))}
      </span>
      <div className=" col-span-3 w-full flex flex-col items-center-safe ">
        <RowLine row={successed} />
        <RowLine row={cancelled} />
      </div>
    </li>
  );
};

const CancelledOrdersTable = ({ data }: { data: TValues[] }) => {
  const [sameData, setSameData] = useState<Record<string, TValues>[]>([]);

  useLayoutEffect(() => {
    if (data.length > 0) {
      const notNullable = data.filter((i) => i.status !== null);
      const tmp = Object.groupBy(notNullable, (item) => item.order_date);
      const tmp_data: any[] = [];

      for (const [key, value] of Object.entries(tmp)) {
        tmp_data.push({ [key]: value });
      }
      setSameData(tmp_data);
    }
  }, [data]);

  // useEffect(() => {
  //   if (sameData.length > 0) {
  //     console.log(sameData);

  //     const t = Object.values(sameData).map((item) => {
  //       for (const key of Object.keys(item)) {
  //         return item[key];
  //       }
  //     });

  //     //console.log(t);
  //   }
  // }, [sameData]);

  return (
    <article className="w-full p-1">
      <div>
        <div className="w-full md:max-w-[75%] mx-auto [&>span]:text-center bg-amber-100/50 dark:bg-amber-700/50 p-2 grid grid-cols-[minmax(0,1fr)_100px_minmax(0,1fr)_minmax(0,1fr)] items-center gap-2 text-xs font-semibold ">
          <span>Дата</span>
          <span>Статус</span>

          <span>Количество</span>
          <span>Сумма</span>
        </div>
        <div className="w-full md:max-w-[75%] mx-auto max-h-100 overflow-y-auto">
          <ul className="w-full ">
            {Object.values(sameData).map((item, index) => {
              for (const key of Object.keys(item)) {
                const value = item[key];
                return (
                  <RowList
                    key={index}
                    row={key}
                    values={value as unknown as TValues[]}
                    className={
                      "w-full grid grid-cols-[minmax(0,1fr)_100px_minmax(0,1fr)_minmax(0,1fr)] items-center gap-2"
                    }
                  />
                );
              }
            })}
          </ul>
        </div>
      </div>
    </article>
  );
};

export default CancelledOrdersTable;
