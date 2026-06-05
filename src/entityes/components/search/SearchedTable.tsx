"use client";

import Loading from "@/app/loading";
import { TPageMeta, TTodo } from "@/shared/types/main_types";
import { API_URL } from "@/shared/utils/consts";
import { fetchGet } from "@/shared/utils/fetchers";
import { Description, Link, Surface } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

type TErrorSearchData = {
  error: boolean;
  name: string;
  message: string;
};

type TTblData = Pick<
  TTodo,
  "id" | "documentId" | "title" | "isCompleted" | "updated"
>[];

function SearchedTable({ paramData }: { paramData: TTblData }) {
  return (
    <div className=" w-fit mx-auto mt-5">
      {paramData.map((item, index) => (
        <div key={item.documentId} className="grid grid-cols-6 gap-x-4 text-sm">
          <div>{index + 1}.</div>
          <div>{item.id}</div>
          <div className=" col-span-2">
            <Link
              className={item.isCompleted ? " line-through text-stone-400" : ""}
              href={`/todos/${item.updated.toString()}`}
            >
              {item.title}
            </Link>
          </div>
          <div>{item.updated.toString()}</div>
          <div
            className={`p-1 mx-auto ${item.isCompleted ? "text-stone-400" : ""}`}
          >
            {item.isCompleted ? <CheckCircle2 /> : "в работе"}
          </div>
        </div>
      ))}
    </div>
  );
}

function WhatSearch({ paramWhatSearch }: { paramWhatSearch: string }) {
  return (
    <Surface
      title="Поисковый запрос"
      className="p-2 min-w-70 mx-auto mt-2 rounded-lg border relative before:content-[attr(title)] before:absolute before:left-3 before:-top-2.5 before:text-chocolate-dark dark:before:text-accent before:border before:border-chocolate-dark before:rounded-sm before:px-1 before:text-xs before:bg-background dark:before:bg-accent-soft-hover"
    >
      <Description>{paramWhatSearch}</Description>
    </Surface>
  );
}

export default function SearchedTableProvider() {
  const srch_params = useSearchParams();
  //console.log(srch_params);

  const url = `${API_URL}/todo-search?${srch_params.toString()}`;
  //console.log(url);

  const [whatSearch, setWhatSearch] = useState<string>(
    srch_params.get("word0") ?? "",
  );

  useMemo(() => {
    setWhatSearch(srch_params.get("word0") ?? "");
  }, [srch_params.get("word0")]);

  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: ["search", srch_params.toString()],
    queryFn: async () => {
      return await fetchGet<{
        data: TTblData | TErrorSearchData;
        meta: TPageMeta;
      }>(url);
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  //  console.log(data);

  if (isError || (!!data && "error" in data)) {
    const msg = (data as unknown as TErrorSearchData).message;
    return (
      <div>
        <WhatSearch paramWhatSearch={whatSearch} />
        <div className="p-2 w-fit mx-auto mt-5">Ошибка получения данных.</div>
        <div>{msg}</div>
      </div>
    );
  }

  if (
    isSuccess &&
    data !== null &&
    Array.isArray(data?.data) &&
    data?.data.length < 1
  ) {
    return (
      <div className="mt-1 p-2 w-fit mx-auto">
        <WhatSearch paramWhatSearch={whatSearch} />
        <h3 className=" mt-5 font-bold text-sky-700 dark:text-sky-400">
          Данные не найдены
        </h3>
      </div>
    );
  }
  return (
    <>
      <WhatSearch paramWhatSearch={whatSearch} />
      <SearchedTable paramData={data?.data as TTblData} />
    </>
  );
}
