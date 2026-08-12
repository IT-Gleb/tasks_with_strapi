"use client";

import { useReportsParamsContext } from "@/shared/hooks/custom/UseReportsParamsContext";
import { Button } from "@heroui/react";
import { ChartBar } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";

const selItems = [
  { label: "Один день", value: "1 day" },
  { label: "2 дня", value: "2 day" },
  { label: "3 дня", value: "3 day" },
  { label: "5 дней", value: "5 day" },
  { label: "1 неделя", value: "1 week" },
  { label: "2 недели", value: "2 week" },
  { label: "3 недели", value: "3 week" },
  { label: "1 месяц", value: "1 month" },
  { label: "2 месяца", value: "2 month" },
  { label: "3 месяца", value: "3 month" },
  { label: "6 месяцев", value: "6 month" },
  { label: "9 месяцев", value: "9 month" },
  { label: "1 год", value: "1 year" },
  { label: "2 года", value: "2 year" },
];

const SelectPeriod = () => {
  const [value, setValue] = useState<string>(selItems[2].value);
  const { setPeriod } = useReportsParamsContext();

  const handlerSelect = (evt: ChangeEvent<HTMLSelectElement>) => {
    const { value } = evt.currentTarget;
    setPeriod(value);
    setValue(value);
  };

  return (
    <label className="text-xs flex gap-x-3 items-center">
      <span className="text-xs font-semibold">Данные за период:</span>
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
  const [checked, setChecked] = useState<boolean>(false);
  const { setAll } = useReportsParamsContext();

  const handlerChecked = (evt: ChangeEvent<HTMLInputElement>) => {
    const { checked } = evt.currentTarget;
    setChecked(checked);
    setAll(checked ? "true" : "false");
  };

  return (
    <label className="flex gap-x-3 items-center text-xs">
      <span className="font-semibold">Использовать отмененные</span>
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

const Top10Goods = () => {
  const { state, all, period, setState, hasURLParams, handlerUrl } =
    useReportsParamsContext();

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
        >
          <ChartBar size={16} />
          Получить
        </Button>
      </header>
      <main className="flex-1">{hasURLParams}</main>
      <footer className="p-2 border dark:border-slate-600 rounded-md"></footer>
    </section>
  );
};

export default Top10Goods;
