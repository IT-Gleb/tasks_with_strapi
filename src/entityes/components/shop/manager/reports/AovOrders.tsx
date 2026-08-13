"use client";

import { useReportsURLParamsContext } from "@/shared/hooks/custom/UseReportsParamsContext";
import { useEffect } from "react";
import { SelCheck, SelectPeriod } from "./components/SelAndCheck";
import CalculatePeriod from "./components/CalculatePeriod";
import AovOrdersChart from "./charts/AovOrdersChart";
import { useIsMobile } from "@/shared/hooks/custom/UseIsMobile";
import { cn } from "@heroui/styles";

const AovOrders = ({
  data,
}: {
  data: {
    average?: number;
    total?: number;
    count?: string;
    massiv?: any[];
  };
}) => {
  const isMobile = useIsMobile();
  const { state, period, all, setState, handlerUrl } =
    useReportsURLParamsContext();

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

  // console.log("---AOV---", data);

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
      <footer className="w-full p-2 border rounded-sm"></footer>
    </article>
  );
};

export default AovOrders;
