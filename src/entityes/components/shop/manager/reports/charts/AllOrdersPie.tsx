"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  ChartConfiguration,
  ChartItem,
  PieController,
  Chart as ChartJS,
  registerables,
} from "chart.js";
import { useIsMobile } from "@/shared/hooks/custom/UseIsMobile";
import type { TPieData } from "@/shared/types/main_types";

ChartJS.register(PieController, ...registerables);

const PieChart = ({ data }: { data: TPieData }) => {
  const pieRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<ChartJS | null>(null);
  const isMobile = useIsMobile();

  const dataPie = useMemo(() => {
    return {
      total: {
        label: "Всего: " + data.total,
        value: data.total,
        bgColor: "#fed7aa90",
      },
      success: {
        label: "Готово: " + data.successed,
        value: data.successed,
        bgColor: "#bbf7d090",
      },
      cancelled: {
        label: "Отменено: " + data.cancelled,
        value: data.cancelled,
        bgColor: "#fecaca90",
      },
      inWork: {
        label: "В работе: " + data.inWork,
        value: data.inWork,
        bgColor: "#bfdbfe90",
      },
    };
  }, [data]);

  const chartOptions = useMemo(() => {
    return {
      type: "pie",
      data: {
        labels: Object.entries(dataPie).map((item) => item[1].label),
        datasets: [
          {
            label: "Заказов",
            data: Object.entries(dataPie).map((item) => item[1].value),
            backgroundColor: Object.entries(dataPie).map(
              (item) => item[1].bgColor,
            ),
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    } satisfies ChartConfiguration;
  }, [dataPie]);

  useEffect(() => {
    let isWork: boolean = true;

    if (chartRef.current !== null) {
      chartRef.current.destroy();
      chartRef.current = null;
    }
    if (isWork) {
      chartRef.current = new ChartJS(pieRef.current as ChartItem, chartOptions);

      chartRef.current.toggleDataVisibility(0);
      // Либо напрямую через метаданные (если нужно гарантированно скрыть):
      // chartRef.current.getDatasetMeta(0).data[indexToHide].hidden = true;

      // Обязательно обновить график
      chartRef.current.update("resize");
    }
    return () => {
      isWork = false;
      (chartRef.current as ChartJS).destroy();
      chartRef.current = null;
    };
  }, [dataPie, isMobile]);

  return (
    <div className="min-h-100 w-full h-full object-cover rounded-xl p-1 border border-slate-200/25 dark:border-slate-600/25 bg-transparent">
      <canvas
        ref={pieRef}
        id="pieChart"
        className="block w-full h-full"
      ></canvas>
    </div>
  );
};

const AllOrdersPie = ({ param }: { param: TPieData | null | undefined }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useLayoutEffect(() => {
    setIsMounted(true);

    return () => {
      setIsMounted(false);
    };
  }, []);

  if (!isMounted) {
    return null;
  }

  if (param === null || param === undefined) {
    return <div className="w-fit p-2 mx-auto">Нет данных</div>;
  }

  return <PieChart data={param} />;
};

export default AllOrdersPie;
