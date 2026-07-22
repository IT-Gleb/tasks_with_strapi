import { TOrder, type TBasketItem } from "../types/main_types";
import { get, set, del, createStore } from "idb-keyval";
import { API_URL, SERVER_LOCAL_API, SERVER_URL } from "../utils/consts";

const ordersStore = "ordersStore";
const ordersField = "ordersIds";
const ordersDB = createStore("ordersDB", ordersStore);

export const useOrdersStorage = () => {
  const self = {
    addOrder: async (param: TOrder): Promise<void> => {
      try {
        await set(param.id, param, ordersDB);
        await self.setOrdersId(param.id);
      } catch (err: unknown) {
        console.log((err as Error).message);
      }
    },

    getOrder: async (paramId: string): Promise<TOrder | null> => {
      try {
        const order = await get<TOrder>(paramId, ordersDB);
        return order === undefined ? null : order;
      } catch (err: unknown) {
        console.log((err as Error).message);
        return null;
      }
    },

    getOrdersIds: async (): Promise<string[] | null> => {
      try {
        const Ids = await get<string[]>(ordersField, ordersDB);
        if (typeof Ids === "undefined") {
          return null;
        }
        return Ids.sort();
      } catch (err: unknown) {
        console.log((err as Error).message);
        return null;
      }
    },

    setOrdersId: async (paramId: string) => {
      try {
        const ids = await self.getOrdersIds();
        if (ids === null) {
          await set(ordersField, [paramId], ordersDB);
          return;
        }
        if (!ids.includes(paramId)) {
          ids.push(paramId);
        }
        await set(ordersField, ids.sort(), ordersDB);
      } catch (err: unknown) {
        console.log((err as Error).message);
      }
    },

    setAllOrdersIds: async (param: string[]) => {
      try {
        await set(ordersField, param.sort(), ordersDB);
      } catch (err: unknown) {
        console.log((err as Error).message);
      }
    },

    getOrders: async (): Promise<TOrder[] | null> => {
      try {
        const ordersId = await self.getOrdersIds();
        if (ordersId === null) {
          return null;
        }
        let result: TOrder[] = [];
        await Promise.all(ordersId.map((item) => self.getOrder(item))).then(
          (data) => {
            if (data !== null) {
              data
                .filter((ord) => ord !== null)
                .forEach((_ord) => result.push(_ord));
            }
          },
        );
        //Сортировка
        if (result.length > 1) {
          return result.sort((a, b) => {
            const oneDate = new Date(a.createdAt);
            const twoDate = new Date(b.createdAt);
            if (oneDate > twoDate) {
              return -1;
            } else {
              return 1;
            }
          });
        }
        //--------------
        return result;
      } catch (err: unknown) {
        console.log((err as Error).message);

        return null;
      }
    },
    deleteOrder: async (paramId: string): Promise<void> => {
      try {
        const ids = await self.getOrdersIds();
        if (ids && ids.length > 0) {
          if (ids.includes(paramId)) {
            const idx = ids.indexOf(paramId);
            console.log(idx);

            ids.splice(idx, 1);
            await self.setAllOrdersIds(ids);
          }
        }
        const delItem = await self.getOrder(paramId);
        if (delItem) {
          await del(paramId, ordersDB);
        }
      } catch (err: unknown) {
        console.log((err as Error).message);
      }
    },
    getMessage: function () {
      console.log("Заказы и сохранение в базе...");
    },
  };
  return self;
};

export async function orderToServer(paramNewOrder: TOrder) {
  const url: string = `${SERVER_LOCAL_API}/addOrder`;
  try {
    //Получение данных
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json; charset=utf-8" },
      method: "POST",
      signal: AbortSignal.timeout(5000),
      body: JSON.stringify(paramNewOrder),
    });
    if (res.status !== 200) {
      throw new Error("Не могу передать данные для сервера (новый заказ)");
    }
    //Обработка данных
    const _order = await res.json();
    //console.log(_order.Order.data);
    const old_Id = _order.oldId;

    const order: TOrder = {
      id: _order.Order.data.documentId,
      title: _order.Order.data.title,
      price: _order.Order.data.price,
      status: _order.Order.data.s_status,
      items: _order.Order.data.items,
      createdAt: _order.Order.data.createdAt,
      updatedAt: _order.Order.data.updatedAt,
    };

    //console.log(order);
    //--Запись в indexeddb
    const db = useOrdersStorage();

    //Удалить запись со старым идентификатором
    //console.log(old_Id);

    await db.deleteOrder(old_Id);

    //Добавить запись с новым идентификатором полученным с сервера
    await db.addOrder(order);

    //-------------------
  } catch (err: unknown) {
    console.log((err as Error).message);
  }
}
