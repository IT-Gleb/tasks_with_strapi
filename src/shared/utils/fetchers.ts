import { TListToModifyStatus } from "../store/ordersToModifyStore";
import {
  TOrder,
  TPageMeta,
  TServerOrder,
  TUserRole,
} from "../types/main_types";
import { API_URL, TodosMax_prefix } from "./consts";
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

//Получить роль пользователя

export async function getUserRole(
  paramToken: string,
): Promise<TUserRole | null> {
  const url = `${API_URL}/users/me?fields[0]=username`;
  // const url = `${API_URL}/users/me?populate=*`;
  const query = getCacheQueryClient();
  //console.log(url);

  try {
    const res = await query.fetchQuery<TUserRole | null>({
      queryKey: ["user_role"],
      queryFn: async () => {
        const role = await fetch(url, {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: `Bearer ${paramToken}`,
          },
          method: "GET",
          signal: AbortSignal.timeout(5000),
        });
        if (role.ok) {
          const result = await role.json();
          //  console.log("-----STRAPI ME-----", result);

          return result.username as TUserRole;
        }
        return null;
      },
      retry: true,
    });
    //console.log("----role-----", res);

    if (res !== null) {
      return res;
    }
    return null;
  } catch (err: unknown) {
    console.log((err as Error).message);

    return null;
  }
}

export async function getOrdersData(paramUrl: string, paramKey: string) {
  // console.log(urlOrdersInWork);

  let orders: TOrder[] = [];
  let meta: Partial<TPageMeta> = {};
  const query = getCacheQueryClient();
  const data = await query.fetchQuery({
    queryKey: [paramKey, 1],
    queryFn: async () => {
      const res = await fetch(paramUrl, {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: "GET",
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        return await res.json();
      }
      return null;
    },
  });

  if (data) {
    orders = data.data.map((item: TServerOrder) => {
      return { ...item, id: item.documentId, status: item.s_status };
    });

    meta = data.meta;
  }
  return {
    orders,
    meta,
  };
}
