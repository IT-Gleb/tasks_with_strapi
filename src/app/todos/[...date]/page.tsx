"use server";

import AddNewTodo from "@/entityes/components/newTodo/AddNewTodo";
import NoTodo from "@/entityes/components/noTodo/NoTodo";
import TodosTable from "@/entityes/components/Todos/todosTable";
import type { TDateISOString, TTodosData } from "@/shared/types/main_types";
import { API_URL, DatePage_Prefix, DatePagePath } from "@/shared/utils/consts";
import { fetchGet } from "@/shared/utils/fetchers";

import { QueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import { Suspense } from "react";

type Props = {
  params: Promise<{ date: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { date } = await params;
  //console.log(date);

  let dt = date !== undefined ? new Date(date[0]) : Date.now();
  //console.log(date, dt);

  return {
    title:
      "Задачи на: " +
      Intl.DateTimeFormat("ru-RU", { dateStyle: "medium" }).format(dt),
  };
}

export default async function TodoOnDate({
  params,
}: {
  params: Promise<{ date: string[] }>;
}) {
  const { date } = await params;
  //console.log(date);
  //Новая задача
  const isNewTodo = date.includes("newTodo");

  if (isNewTodo) {
    return (
      <Suspense
        fallback={
          <Loader2 size={38} strokeWidth={2} className=" animate-spin" />
        }
      >
        <AddNewTodo paramDate={date[0] as TDateISOString} />
      </Suspense>
    );
  }
  //-------------------------------------------
  const queryClient = new QueryClient();
  const url = `${API_URL}/${DatePagePath.replace("%1", date[0])}`;
  //console.log(url);

  const result = await queryClient.fetchQuery({
    queryKey: [DatePage_Prefix.replace("%1", date[0])],
    queryFn: async () => {
      return await fetchGet<TTodosData>(url);
    },
  });
  //console.log(result);

  return (
    <div className=" fromstart mt-5 flex flex-col gap-2 items-center">
      <Suspense
        fallback={
          <Loader2 size={38} strokeWidth={2} className=" animate-spin" />
        }
      >
        {!!result && result.data.length < 1 && (
          <NoTodo paramDate={date[0] as TDateISOString} />
        )}
      </Suspense>
      <Suspense
        fallback={
          <Loader2 size={38} strokeWidth={2} className=" animate-spin" />
        }
      >
        {!!result && result.data.length > 0 && (
          <TodosTable
            paramDate={date[0] as TDateISOString}
            paramTodos={result.data}
          />
        )}
      </Suspense>
    </div>
  );
}
