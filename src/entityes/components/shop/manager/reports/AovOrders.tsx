"use client";

import { useReportsURLParamsContext } from "@/shared/hooks/custom/UseReportsParamsContext";
import { useEffect, useState } from "react";
import { SelCheck, SelectPeriod } from "./components/SelAndCheck";
import CalculatePeriod from "./components/CalculatePeriod";
import AovOrdersChart from "./charts/AovOrdersChart";
import { useIsMobile } from "@/shared/hooks/custom/UseIsMobile";
import { cn } from "@heroui/styles";
import { TAovArray } from "@/shared/types/main_types";

const minValue = 3000;
const averageValue = 9000;

const AovOrders = ({
  data,
}: {
  data: {
    average?: number;
    total?: number;
    count?: string;
    massiv?: TAovArray;
  };
}) => {
  const isMobile = useIsMobile();
  const { state, period, all, setState, handlerUrl } =
    useReportsURLParamsContext();
  const [aData, setAData] = useState<TAovArray>([]);

  useEffect(() => {
    setState("aov");
    handlerUrl();
  }, []);

  useEffect(() => {
    let isWork: boolean = true;
    if (isWork) {
      handlerUrl();
    }
    return () => {
      isWork = false;
    };
  }, [state, all, period]);

  useEffect(() => {
    let isWork: boolean = true;

    if (data !== null && data !== undefined) {
      if (data.massiv !== undefined && data.massiv.length > 0) {
        if (isWork) {
          setAData(data.massiv);
        }
      }
    }

    return () => {
      isWork = false;
    };
  }, [data]);

  //console.log("---AOV---", data);

  return (
    <article className="w-full min-h-100 flex flex-col items-start text-xs">
      <header className="w-full p-2 border rounded-sm flex gap-x-2 items-center justify-between">
        <SelectPeriod />
        <CalculatePeriod className="text-xs" />
        <SelCheck />
      </header>
      <main className="w-full pt-4 place-content-center flex-1 flex flex-col justify-evenly">
        <div className="flex items-start justify-between gap-x-2">
          <span>
            <span>Средний чек:</span>{" "}
            <span
              className={cn(
                " font-semibold ",
                isMobile ? "text-xl" : "text-3xl",
              )}
            >
              {Intl.NumberFormat("ru-RU", {
                style: "currency",
                currency: "RUB",
              }).format(data?.average as number)}
            </span>
          </span>
          <span>
            Общая сумма:{" "}
            <span
              className={cn(
                "font-semibold ",
                isMobile ? "text-lg" : "text-2xl",
              )}
            >
              {Intl.NumberFormat("ru-RU", {
                style: "currency",
                currency: "RUB",
              }).format(data?.total as number)}
            </span>
          </span>
          <span>
            Заказов:{" "}
            <span
              className={cn(" font-semibold", isMobile ? "text-sm" : "text-xl")}
            >
              {data?.count}
            </span>
          </span>
        </div>
        {data !== undefined && data !== null && (
          <AovOrdersChart chartData={data.massiv as any[]} className="flex-1" />
        )}
      </main>
      <footer className="w-full p-2 border rounded-sm">
        {aData && (
          <ul className="w-full max-w-lg mx-auto p-1 bg-amber-50/50 dark:bg-amber-600/50 overflow-hidden rounded-lg">
            <li className="p-2 bg-amber-300 dark:bg-amber-600/50 rounded-t-lg grid grid-cols-[40px_30px_minmax(0,1.2fr)_minmax(0,0.5fr)_minmax(0,1fr)] items-center gap-2 text-[0.65rem]/[0.75rem] font-semibold ">
              <span>№/№</span>
              <span>Инд.</span>
              <span className="text-center">Дата</span>
              <span className="text-center">Кол-во</span>
              <span className="text-center">Сумма</span>
            </li>
            <li className="max-h-70 overflow-x-hidden overflow-y-auto">
              <ul className="p-2 ">
                {aData.map((item, index) => (
                  <li
                    key={item.order_date}
                    className=" grid grid-cols-[40px_30px_minmax(0,1.2fr)_minmax(0,0.5fr)_minmax(0,1fr)] items-center gap-2 p-0.5 even:bg-emerald-200/50 dark:even:bg-emerald-100/50"
                  >
                    <span className="text-xs text-center">
                      {index + 1 < 10 ? "0" + (index + 1) : index + 1}.
                    </span>
                    <div
                      className={cn(
                        "w-5 h-3",
                        item.total_day_price < minValue ? "bg-red-400" : "",
                        item.total_day_price >= minValue &&
                          item.total_day_price < averageValue
                          ? "bg-sky-400"
                          : "",
                        item.total_day_price > averageValue
                          ? "bg-green-400"
                          : "",
                      )}
                    ></div>
                    <span className="text-center">
                      {Intl.DateTimeFormat("ru-RU", {
                        dateStyle: "medium",
                      }).format(new Date(item.order_date))}
                    </span>
                    <span className="text-right">
                      <span className="text-md font-semibold">
                        {item.order_count}
                      </span>
                    </span>
                    <span className="text-right">
                      <span className="text-md font-semibold">
                        {Intl.NumberFormat("ru-RU", {
                          style: "currency",
                          currency: "RUB",
                        }).format(item.total_day_price)}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        )}
      </footer>
    </article>
  );
};

export default AovOrders;
