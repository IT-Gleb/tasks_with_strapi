"use client";

import { useReportsURLParamsContext } from "@/shared/hooks/custom/UseReportsParamsContext";
import { Button } from "@heroui/react";
import { ChartBar } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import Top10Chart from "./charts/Top10chart";
import { TTop10Data } from "@/shared/types/main_types";
import Top10ChartInfoTable from "./charts/Top10ChartInfoTable";
import { useIsMobile } from "@/shared/hooks/custom/UseIsMobile";

const selItems = [
  { label: "Один день", value: "1 day" },
  { label: "2 дня", value: "2 days" },
  { label: "3 дня", value: "3 days" },
  { label: "5 дней", value: "5 days" },
  { label: "1 неделя", value: "1 week" },
  { label: "2 недели", value: "2 weeks" },
  { label: "3 недели", value: "3 weeks" },
  { label: "1 месяц", value: "1 month" },
  { label: "2 месяца", value: "2 months" },
  { label: "3 месяца", value: "3 months" },
  { label: "6 месяцев", value: "6 months" },
  { label: "9 месяцев", value: "9 months" },
  { label: "1 год", value: "1 year" },
  { label: "2 года", value: "2 years" },
];

const SelectPeriod = () => {
  const { period, setPeriod } = useReportsURLParamsContext();

  const [value, setValue] = useState<string>(period);

  const handlerSelect = (evt: ChangeEvent<HTMLSelectElement>) => {
    const { value } = evt.currentTarget;
    setPeriod(value);
    setValue(value);
  };

  return (
    <label className="text-xs flex gap-x-3 items-center">
      <span className="text-xs font-semibold">Данные за :</span>
      <select
        name="sPeriod"
        id="sPeriod"
        value={value}
        onChange={handlerSelect}
        className="p-1 border dark:border-slate-300"
      >
        {selItems.map((item) => {
          return (
            <option
              key={item.value}
              value={item.value}
              className=" odd:bg-slate-100 dark:odd:bg-slate-800"
            >
              {item.label}
            </option>
          );
        })}
      </select>
    </label>
  );
};

const SelCheck = () => {
  const { all, setAll } = useReportsURLParamsContext();
  const [checked, setChecked] = useState<boolean>(
    all === "true" ? true : false,
  );

  const handlerChecked = (evt: ChangeEvent<HTMLInputElement>) => {
    const { checked } = evt.currentTarget;
    setChecked(checked);
    setAll(checked ? "true" : "false");
  };

  return (
    <label className="flex gap-x-3 items-center text-xs">
      <span className="font-semibold">Включить отмененные</span>
      <input
        type="checkbox"
        name="selCheck"
        id="selCheck"
        checked={checked}
        onChange={handlerChecked}
        className="scale-120"
      ></input>
    </label>
  );
};

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
