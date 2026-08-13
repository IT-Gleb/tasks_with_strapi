"use client";

import { cn } from "@heroui/styles";
import { useEffect, useMemo, useRef } from "react";
import type { ChartConfiguration, ChartItem } from "chart.js";
import { Chart as ChartJS, registerables, LineController } from "chart.js";
import { useIsMobile } from "@/shared/hooks/custom/UseIsMobile";

ChartJS.register(LineController, ...registerables);

const AovOrdersChart = ({
  chartData,
  className,
}: {
  chartData: any[];
  className: string;
}) => {
  //console.log(chartData);
  const isMobile = useIsMobile();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const aovOrdersChart = useRef<ChartJS | null>(null);

  const chartOptions = useMemo(() => {
    return {
      type: "bar",
      data: {
        //labels: data.map((item) => item.title),
        labels: chartData.map((item) =>
          Intl.DateTimeFormat("ru-RU", { dateStyle: "medium" }).format(
            new Date(item.order_date),
          ),
        ),
        // yLabels: chartData.map((item) => item.order_count),
        datasets: [
          {
            type: "line",
            label: "Количество",
            data: chartData.map((item) => item.order_count),
            fill: true,
            backgroundColor: "#7dd3fc",
            // backgroundColor: "#000000",
            tension: 0.18,
            pointRadius: isMobile ? 4 : 10,
            pointHoverRadius: isMobile ? 8 : 15,
            order: 2,
          },
          {
            //type: "line",
            label: "Общая выручка",
            data: chartData.map((item) => item.total_day_price),
            //fill: false,
            backgroundColor: "#22c55e90",
            order: 1,

            //tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        //onClick: (e) => clickHandler(e),
        indexAxis: "x",
        //   events: ["click"],
        scales: {
          y: {
            beginAtZero: true,
            // ticks: {
            //   stepSize: 1,
            // },
            ticks: {
              callback: function (value, index, ticks) {
                return Intl.NumberFormat("ru-RU", {
                  style: "currency",
                  currency: "RUB",
                }).format(Number(value)); // Возвращает отформатированную строку
              },
            },
          },
          x: {
            beginAtZero: true,
            // ticks: {
            //   stepSize: 1,
            // },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                let value = context.parsed.y; // Получаем числовое значение по оси Y
                if (context.datasetIndex === 1) {
                  return (
                    "Выручка: " +
                    Intl.NumberFormat("ru-RU", {
                      style: "currency",
                      currency: "RUB",
                    }).format(Number(value))
                  ); // Возвращаем отформатированную строку
                }
              },
            },
          },
        },
      },
    } satisfies ChartConfiguration;
  }, [chartData, isMobile]);

  useEffect(() => {
    let isWork: boolean = true;

    if (aovOrdersChart.current !== null) {
      aovOrdersChart.current.destroy();
      aovOrdersChart.current = null;
    }

    if (isWork) {
      aovOrdersChart.current = new ChartJS(
        canvasRef.current as ChartItem,
        chartOptions,
      );
      //(aovOrdersChart.current as ChartJS).defaults.elements.line;
      //      todoChart.current.update("resize");
    }
    return () => {
      isWork = false;
      (aovOrdersChart.current as ChartJS).destroy();
      aovOrdersChart.current = null;
    };
  }, [chartOptions]);

  if (chartData.length < 1) {
    return <div className="p-2 w-fit mx-auto">Нет данных</div>;
  }

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

export default AovOrdersChart;
