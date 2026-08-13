"use client";

import type { TTop10Data } from "@/shared/types/main_types";
import { useEffect, useMemo, useRef } from "react";
import type { ChartConfiguration, ChartItem } from "chart.js";
import { Chart as ChartJS, registerables } from "chart.js";
import { cn } from "@heroui/styles";
import { bgTop10ChartColors } from "@/shared/utils/consts";

ChartJS.register(...registerables);

const Top10Chart = ({
  data,
  className = "",
}: {
  data: TTop10Data;
  className?: string;
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const top10Chart = useRef<ChartJS | null>(null);

  const chartOptions = useMemo(() => {
    return {
      type: "bar",
      data: {
        //labels: data.map((item) => item.title),
        labels: [""],
        datasets: data.map((item, index) => ({
          label: item.title,
          data: [item.total],
          backgroundColor: bgTop10ChartColors[index],
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        //onClick: (e) => clickHandler(e),
        indexAxis: "y",
        //   events: ["click"],
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
          x: {
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    } satisfies ChartConfiguration;
  }, [data]);

  useEffect(() => {
    let isWork: boolean = true;

    if (top10Chart.current !== null) {
      top10Chart.current.destroy();
      top10Chart.current = null;
    }

    if (isWork) {
      top10Chart.current = new ChartJS(
        canvasRef.current as ChartItem,
        chartOptions,
      );
      //      todoChart.current.update("resize");
    }
    return () => {
      isWork = false;
      (top10Chart.current as ChartJS).destroy();
      top10Chart.current = null;
    };
  }, [chartOptions]);

  return (
    <div
      className={cn(
        "min-h-100 w-full h-full object-cover rounded-xl p-1 border border-slate-200/25 dark:border-slate-600/25 bg-transparent",
        className,
      )}
    >
      <canvas ref={canvasRef} id="chartData" className="w-full h-full"></canvas>
    </div>
  );
};

export default Top10Chart;
