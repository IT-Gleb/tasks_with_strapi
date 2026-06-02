"use client";

import useGetData from "@/shared/hooks/tanstack/useGetData";
import useDateStore from "@/shared/store/dateStore";
import { TDateISOString, TTodo, TTodosData } from "@/shared/types/main_types";
import {
  API_URL,
  DatePage_Prefix,
  DatePagePath_Max200,
} from "@/shared/utils/consts";
import {
  extractMonthName,
  makeDateISOStringFromDate,
} from "@/shared/utils/functions";
import { Surface } from "@heroui/react";
import type { ChartConfiguration, ChartItem } from "chart.js";
import { Chart as ChartJS, registerables } from "chart.js";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useMemo, useRef } from "react";

ChartJS.register(...registerables);

type TChartData = {
  todoDate: string | TDateISOString;
  completed: number;
  nocompleted: number;
}[];

function TodosCharts({ paramData }: { paramData: TChartData }) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const todoChart = useRef<ChartJS | null>(null);

  const router = useRouter();

  const options = {
    type: "bar",
    data: {
      labels: paramData.map((item) => {
        return Intl.DateTimeFormat("ru-RU", { dateStyle: "medium" }).format(
          new Date(item.todoDate),
        );
      }),
      datasets: [
        {
          label: `Задачи за ${extractMonthName(paramData[0].todoDate as TDateISOString)}`,
          data: paramData.map((item) => item.completed + item.nocompleted),
          backgroundColor: "rgba(120,200,245,0.8)",
        },

        {
          label: `Выполнено `,
          data: paramData.map((item) => item.completed),
          backgroundColor: "rgba(100,245,180,0.8)",
        },
        {
          label: `Не выполнено`,
          data: paramData.map((item) => item.nocompleted),
          backgroundColor: "rgba(238,145,180,0.8)",
        },
      ],
    },
    options: {
      onClick: (e) => clickHandler(e),
      //   events: ["click"],
      plugins: {
        legend: {
          display: true,
          align: "center",
          title: {
            display: true,
            font: {
              size: 12,
              weight: "bold",
            },
            text: `Всего задач: (${paramData.reduce((acc, value) => {
              acc += value.completed + value.nocompleted;
              return acc;
            }, 0)}) Завершено: (${paramData.reduce((acc, value) => {
              acc += value.completed;
              return acc;
            }, 0)}) Не завершено: (${paramData.reduce((acc, value) => {
              acc += value.nocompleted;
              return acc;
            }, 0)})`,
          },
        },
      },
    },
  } satisfies ChartConfiguration;

  useLayoutEffect(() => {
    let isWork: boolean = true;
    if (isWork) {
      if (todoChart.current !== null) {
        todoChart.current.destroy();
        todoChart.current = null;
      }
      todoChart.current = new ChartJS(chartRef.current as ChartItem, options);
      //      todoChart.current.update("resize");
    }
    return () => {
      isWork = false;
      (todoChart.current as ChartJS).destroy();
    };
  }, [paramData]);

  function clickHandler(evt: any) {
    const points = (todoChart.current as ChartJS).getElementsAtEventForMode(
      evt,
      "nearest",
      { intersect: true },
      true,
    );

    if (points.length) {
      const firstPoint = points[0];
      //   const label = (todoChart.current as ChartJS).data.labels[
      //     firstPoint.index
      //   ];
      //   const value = (todoChart.current as ChartJS).data.datasets[
      //     firstPoint.datasetIndex
      //   ].data[firstPoint.index];

      //const value2 = paramData[firstPoint.index];
      router.push(`/todos/${paramData[firstPoint.index].todoDate}`);

      //console.log(value2);
    }
  }

  return (
    <Surface
      variant="default"
      className="min-h-50 md:min-h-100 w-full h-full object-cover rounded-xl p-1 border border-slate-200/25 dark:border-slate-600/25"
    >
      <canvas ref={chartRef} id="chartData" className="w-full h-full"></canvas>
    </Surface>
  );
}

export default function ChartMonthProvider() {
  const currentDate = useDateStore((state) => state.currentDate);
  //console.log(currentDate);

  const [year, month] = currentDate.split("-");
  const nowDt = `${year}-${month}`;
  // console.log(paramDate, nowDt);

  //const [chartValue, setChartValue] = useState<TChartData | null>(null);

  const url = `${API_URL}/${DatePagePath_Max200.replace("%1", nowDt)}`;
  const queryKey = DatePage_Prefix.replace("%1", nowDt);
  const { data: todos } = useGetData<TTodosData>({
    dataKey: queryKey,
    paramUrl: url,
  });

  const chartData = useMemo(() => {
    const result: TChartData = [];
    if (todos === undefined || todos?.data === null) {
      //        setChartValue(result);
      return result;
    }
    const tmp = Object.groupBy(todos?.data as TTodo[], (item) =>
      makeDateISOStringFromDate(item.updated as Date),
    );
    // console.log(tmp);

    for (const [key, value] of Object.entries(tmp)) {
      const todo = {
        todoDate: key as TDateISOString,
        completed: (value as TTodo[]).reduce((acc, todo) => {
          todo.isCompleted ? (acc = acc + 1) : (acc = acc + 0);
          return acc;
        }, 0),
        nocompleted: (value as TTodo[]).reduce((acc, todo) => {
          todo.isCompleted ? (acc += 0) : (acc += 1);
          return acc;
        }, 0),
      };
      result.push(todo);
    }
    return result.sort((a, b) => {
      const one = new Date(a.todoDate);
      const two = new Date(b.todoDate);
      if (one > two) {
        return 1;
      } else {
        return -1;
      }
    });
    // console.log(result);
  }, [todos]);

  //console.log(chartTodos);
  // if (isLoading) {
  //   return <Loading />;
  // }

  if (chartData === null || chartData.length < 1) {
    return (
      <Surface className="p-2 mt-5 w-fit mx-auto text-sm">
        Нет данных...
      </Surface>
    );
  }
  return <TodosCharts paramData={chartData} />;
}
