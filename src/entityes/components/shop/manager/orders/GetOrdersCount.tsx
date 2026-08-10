"use client";

import { fetchGet } from "@/shared/utils/fetchers";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";

const GetOrdersCount = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders_stat", 1],
    queryFn: async () => {
      return await fetchGet<{
        total: number;
        inWork: number;
        successed: number;
        cancelled: number;
      }>("/api/OrdersStat");
    },
    retry: 2,
    retryDelay: 500,
  });

  if (isLoading) {
    return (
      <div className="w-fit mx-auto p-2 ">
        <Loader size={38} className=" animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-fit mx-auto p-2">
        <p>Ошибка при получении статистики</p>
      </div>
    );
  }

  return (
    <div className="flex gap-x-2 items-center justify-between p-2 text-xs bg-sky-100 dark:bg-slate-700">
      <span>
        Всего: <span className="text-sm font-semibold">{data?.total}</span>{" "}
      </span>
      <span>
        В работе:{" "}
        <span className="text-sm text-sky-600 dark:text-sky-400 font-semibold">
          {data?.inWork}
        </span>
      </span>

      <span>
        Завершено:{" "}
        <span className="text-sm text-green-600 dark:text-green-400 font-semibold">
          {data?.successed}
        </span>{" "}
      </span>
      <span>
        Отменено:{" "}
        <span className="text-sm text-red-600 dark:text-red-400 font-semibold">
          {data?.cancelled}
        </span>{" "}
      </span>
    </div>
  );
};

export default GetOrdersCount;
