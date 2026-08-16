"use client";

import { useReportsURLParamsContext } from "@/shared/hooks/custom/UseReportsParamsContext";
import CalculatePeriod from "./components/CalculatePeriod";
import { SelCheck, SelectPeriod } from "./components/SelAndCheck";
import { useEffect, useLayoutEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import CancelledOrdersTable from "./components/CancelledOrdersTable";
import type { TValues } from "@/shared/types/main_types";
import CancelledSuccessChart from "./charts/CancelledSuccessChart";
import CancelledOrdersValue from "./components/CancelledOrdersValue";

const UpAndCancel = "UpandCancel";

const CancelledOrdersReport = () => {
  const { state, all, period, hasURLParams, setState, handlerUrl } =
    useReportsURLParamsContext();
  const [error, SetError] = useState<boolean>(false);
  const [values, setValues] = useState<TValues[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["UpAndCancel", hasURLParams],
    queryFn: async () => {
      return await fetch("/api/top10", {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: "POST",
        signal: AbortSignal.timeout(10000),
        body: JSON.stringify({ query: hasURLParams }),
      }).then((data) => data.json());
    },
    enabled: state === UpAndCancel,
  });

  useLayoutEffect(() => {
    setState(UpAndCancel);
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
    SetError(true);
    if (data && "status" in data && data.status === "ok") {
      if (
        isWork &&
        data.data.length > 0 &&
        "order_date" in data.data[0] &&
        "status" in data.data[0]
      ) {
        SetError(false);
        setValues(data.data);
        //console.log(data.data);
      }
    }

    return () => {
      isWork = false;
    };
  }, [data]);

  if (isLoading) {
    return <Loader size={36} className="w-fit mx-auto animate-spin" />;
  }
  if (error) {
    return (
      <div className="w-fit mx-auto p-2">
        Не данных. Или ошибка при взаимодействии с сервером.
      </div>
    );
  }

  return (
    <article className="w-full flex flex-col min-h-100">
      <header className="p-2 border flex items-center justify-between">
        <SelectPeriod />
        <CalculatePeriod className="text-xs" />
        {/* <SelCheck /> */}
      </header>
      <main className="flex-1">
        <CancelledOrdersValue data={values} />
        <CancelledSuccessChart data={values} />
      </main>
      <footer>
        <CancelledOrdersTable data={values} />
      </footer>
    </article>
  );
};

export default CancelledOrdersReport;
