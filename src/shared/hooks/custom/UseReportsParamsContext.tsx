"use client";

import { createContext, ReactNode, useContext, useMemo, useState } from "react";

interface IParamsState {
  period: string;
  all: "true" | "false";
  state: "top10" | string;
  urlParams: string;
  hasURLParams: string;
  handlerUrl: () => void;
  setAll: (param: "true" | "false") => void;
  setPeriod: (param: string) => void;
  setState: (param: "top10" | string) => void;
}

const ReportsContext = createContext<IParamsState | undefined>(undefined);

// Описываем пропсы для Провайдера (обязательно типизируем children)
interface IReportsContextProps {
  children: ReactNode;
}

// 3. Создаем Провайдер
export function ReportsURLStateProvider({ children }: IReportsContextProps) {
  const [state, setState] = useState<"top10" | string>("top10");
  const [all, setAll] = useState<"true" | "false">("false");
  const [period, setPeriod] = useState<string>("3 day");
  const [urlParams, setUrlParams] = useState<string>(`state=${state}`);
  const [hasURLParams, setHasURLParams] = useState<string>("");

  const handlerUrl = () => {
    const temp_url = `state=${state}&period=${period}&all=${all}`;
    setUrlParams(temp_url);
    const url = new URLSearchParams(temp_url).toString();
    setHasURLParams(url);
  };

  const contextValue = useMemo(
    () => ({
      state,
      all,
      period,
      urlParams,
      hasURLParams,
      handlerUrl,
      setState,
      setAll,
      setPeriod,
    }),
    [state, all, period, urlParams],
  );

  return (
    <ReportsContext.Provider value={contextValue}>
      {children}
    </ReportsContext.Provider>
  );
}

// 4. Создаем кастомный хук
export function useReportsParamsContext(): IParamsState {
  const context = useContext(ReportsContext);

  // Благодаря этой проверке TS понимает, что context не может быть undefined ниже по коду
  if (context === undefined) {
    throw new Error(
      "useReportsParamsContext должен использоваться внутри ReportsStateProvider",
    );
  }

  return context;
}
