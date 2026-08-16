"use client";

import type { TValues } from "@/shared/types/main_types";
import { useEffect, useMemo, useRef } from "react";
import type { ChartConfiguration, ChartItem } from "chart.js";
import { Chart as ChartJS, registerables } from "chart.js";
import { CompareArraysAddValue, formatDate } from "@/shared/utils/functions";

ChartJS.register(...registerables);

const sortByDate = (a: TValues, b: TValues) => {
  const dt1 = new Date(a.order_date);
  const dt2 = new Date(b.order_date);
  if (dt1 < dt2) {
    return -1;
  } else if (dt1 === dt2) {
    return 0;
  } else {
    return 1;
  }
};

const CancelledSuccessChart = ({ data }: { data: TValues[] }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const Chart = useRef<ChartJS | null>(null);

  const success = data.filter((i) => i.status === "success").sort(sortByDate);
  let cancelled = data.filter((i) => i.status === "cancelled");

  cancelled = CompareArraysAddValue<TValues>(success, cancelled, "order_date", {
    order_date: "",
    order_count: "0",
    total_day_price: 0,
    status: "cancelled",
  }).sort(sortByDate);
  //console.log("---Successed---", success);

  //console.log("---Cancelled---", cancelled);

  const chartOptions = useMemo(() => {
    return {
      type: "bar",
      data: {
        labels: success.map((item) => formatDate(item.order_date)),
        datasets: [
          {
            type: "bar",
            label: "Готовые",
            data: success.map((item) => item.order_count as unknown as number),
            backgroundColor: "#34d39990",
          },
          {
            type: "bar",
            label: "Отмененные",
            data: cancelled.map(
              (item) => item.order_count as unknown as number,
            ),
            backgroundColor: "#fb718590",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
          x: { beginAtZero: true },
        },
      },
    } satisfies ChartConfiguration;
  }, [success, cancelled, data]);

  useEffect(() => {
    let isWork: boolean = true;

    if (Chart.current !== null) {
      Chart.current.destroy();
      Chart.current = null;
    }

    if (isWork) {
      Chart.current = new ChartJS(canvasRef.current as ChartItem, chartOptions);
      //(aovOrdersChart.current as ChartJS).defaults.elements.line;
      //      todoChart.current.update("resize");
    }
    return () => {
      isWork = false;
      (Chart.current as ChartJS).destroy();
      Chart.current = null;
    };
  }, [chartOptions]);

  return (
    <div
      className={
        "min-h-100 w-full h-full object-cover rounded-xl p-1 border border-slate-200/25 dark:border-slate-600/25 bg-transparent"
      }
    >
      <canvas ref={canvasRef} id="chartData" className="w-full h-full"></canvas>
    </div>
  );
};

export default CancelledSuccessChart;
