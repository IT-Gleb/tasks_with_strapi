import { QueryClient } from "@tanstack/react-query";
import type { TDateISOString } from "../types/main_types";
import { TodosMax_prefix } from "./consts";

export async function fetchGet<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json;charset=utf-8" },
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });
    if (response.ok) {
      return (await response.json()) as T;
    }
    throw new Error("Ошибка получения данных!");
  } catch (err) {
    return null;
  }
}
export async function ModifyDataQuery(
  paramKey: string,
  paramUrl: string,
  paramData: object,
) {
  const query = new QueryClient();
  try {
    await query.fetchQuery({
      queryKey: [paramKey],
      queryFn: async () => {
        return await fetch(paramUrl, {
          headers: { "Content-Type": "application/json;charset=utf-8" },
          method: "PUT",
          signal: AbortSignal.timeout(5000),
          body: JSON.stringify({ data: paramData }),
        });
      },
    });
    //console.log(data);
  } catch (err) {
    console.log((err as Error).message);
  }

  //query.invalidateQueries({ queryKey: [paramKey] });
}

export async function DeleteTodoQuery(paramKey: string, paramUrl: string) {
  const query = new QueryClient();
  try {
    await query.fetchQuery({
      queryKey: [paramKey],
      queryFn: async () => {
        return await fetch(paramUrl, {
          headers: { "Content-Type": "application/json;charset=utf-8" },
          method: "DELETE",
          signal: AbortSignal.timeout(5000),
        });
      },
    });
    //console.log(data);
    await Promise.all([
      query.invalidateQueries({ queryKey: [TodosMax_prefix] }),
      query.invalidateQueries({ queryKey: [paramKey] }),
    ]);
  } catch (err) {
    console.log((err as Error).message);
  }
}
