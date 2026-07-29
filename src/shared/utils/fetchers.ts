import { TListToModifyStatus } from "../store/ordersToModifyStore";
import { TodosMax_prefix } from "./consts";
import getCacheQueryClient from "@/entityes/providers/getQueryCache";

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
  const query = getCacheQueryClient();
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
    await query.invalidateQueries({ queryKey: [paramKey] });
  } catch (err) {
    console.log((err as Error).message);
  }
}

export async function DeleteTodoQuery(paramKey: string, paramUrl: string) {
  const query = getCacheQueryClient();
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

export async function UpdateOrdersStatus(paramData: TListToModifyStatus[]) {
  const url = "/api/updateOrderStatus";
  if (paramData.length < 1) {
    return false;
  }

  const query = getCacheQueryClient();
  try {
    const result = await query.fetchQuery({
      queryKey: ["updateOrders", paramData],
      queryFn: async () => {
        const res = await fetch(url, {
          headers: { "Content-Type": "application/json; charset=utf-8" },
          method: "POST",
          signal: AbortSignal.timeout(5000),
          body: JSON.stringify(paramData),
        });
        if (!res.ok) {
          throw new Error("Ошибка передачи массива статусов заказов");
        }
        return await res.json();
      },
      retry: true,
      retryDelay: 300,
    });
    //console.log(result);
    if ("ok" in result && result.ok) {
      await query.invalidateQueries({ queryKey: ["ordersInWork", 1] });
      //console.log("invalidate");
      return true;
    }
    if ("ok" in result && !result.ok) {
      return false;
    }
  } catch (err: unknown) {
    console.log((err as Error).message);
    return false;
  }
}
