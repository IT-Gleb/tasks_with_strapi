"use client";

import { useReportsURLParamsContext } from "@/shared/hooks/custom/UseReportsParamsContext";
import { Button } from "@heroui/react";
import { ChartBar } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import Top10Chart from "./charts/Top10chart";
import { TTop10Data } from "@/shared/types/main_types";
import Top10ChartInfoTable from "./charts/Top10ChartInfoTable";
import { useIsMobile } from "@/shared/hooks/custom/UseIsMobile";
import { SelCheck, SelectPeriod } from "./components/SelAndCheck";
import CalculatePeriod from "./components/CalculatePeriod";

const Top10Goods = ({
  data,
  handler,
}: {
  data: TTop10Data;
  handler: () => Promise<void>;
}) => {
  const isMobile = useIsMobile();
  const { state, all, period, setState, handlerUrl } =
    useReportsURLParamsContext();

  useEffect(() => {
    setState("top10");
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

  return (
    <section className="min-h-100 flex flex-col">
      <header className="p-2 border dark:border-slate-600 rounded-md flex items-center gap-x-4 justify-between">
        <SelectPeriod />
        <CalculatePeriod className="text-xs" />
        <SelCheck />
        <Button
          size="sm"
          variant="outline"
          className={"scale-90 active:scale-80 dark:border-slate-300/50"}
          isIconOnly={isMobile ? true : false}
          onPress={handler}
        >
          <ChartBar size={16} />
          {isMobile ? "" : "Получить"}
        </Button>
      </header>
      <main className="flex-1">
        {data.length < 1 && <div className="w-fit mx-auto p-2">Нет данных</div>}
        {data.length > 0 && (
          <div className="flex flex-wrap gap-x-2 items-start justify-between">
            <Top10Chart data={data} className="flex-1" />
            <Top10ChartInfoTable data={data} />
          </div>
        )}
      </main>
      <footer className="p-2 border dark:border-slate-600 rounded-md"></footer>
    </section>
  );
};

export default Top10Goods;
