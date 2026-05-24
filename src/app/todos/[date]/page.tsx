import NoTodo from "@/entityes/components/noTodo/NoTodo";
import type { TDateISOString, TTodosData } from "@/shared/types/main_types";
import { API_URL, DatePage_Prefix, DatePagePath } from "@/shared/utils/consts";
import { fetchGet } from "@/shared/utils/fetchers";
import { QueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default async function TodoOnDate({
  params,
}: {
  params: Promise<{ date: TDateISOString }>;
}) {
  const { date } = await params;
  const queryClient = new QueryClient();
  const url = `${API_URL}/${DatePagePath.replace("%1", date)}`;
  //console.log(url);

  const result = await queryClient.fetchQuery({
    queryKey: [DatePage_Prefix.replace("%1", date)],
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
        {!!result && result.data.length < 1 && <NoTodo />}
      </Suspense>
      {!!result &&
        result.data.length > 0 &&
        result.data.map((todo, index) => (
          <div
            key={todo.documentId}
            className="w-full grid grid-cols-[100px_1fr_0.6fr_0.5fr] gap-2 items-start"
          >
            <div>{index + 1}</div>
            <div>{todo.title}</div>
            <div>{todo.updated.toLocaleString()}</div>
            <div>{todo.isCompleted ? "завершена" : "В работе"}</div>
          </div>
        ))}
    </div>
  );
}
