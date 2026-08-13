"use client";

import { useReportsURLParamsContext } from "@/shared/hooks/custom/UseReportsParamsContext";
import { ChangeEvent, useState } from "react";

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

export const SelectPeriod = () => {
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

export const SelCheck = () => {
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
