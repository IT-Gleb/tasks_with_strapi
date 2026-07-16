import { type TBasketItem } from "../types/main_types";
import { get, set, del, createStore } from "idb-keyval";

const ordersStore = "ordersStore";
const ordersField = "ordersIds";
const ordersDB = createStore("ordersDB", ordersStore);

export type TOrderStatus =
  | "created"
  | "delivered"
  | "in-work"
  | "cancelled"
  | "success";

export type TOrder = {
  id: string;
  title: string | null;
  createdAt: Date | number;
  updatedAt: Date | number;
  price: number;
  status: TOrderStatus;
  items: TBasketItem[];
};

export const useOrdersStorage = () => {
  const self = {
    addOrder: async (param: TOrder): Promise<void> => {
      try {
        await set(param.id, param, ordersDB);
        await self.setOrdersIds(param.id);
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
        return Ids;
      } catch (err: unknown) {
        console.log((err as Error).message);
        return null;
      }
    },

    setOrdersIds: async (paramId: string) => {
      try {
        const ids = await self.getOrdersIds();
        if (ids === null) {
          await set(ordersField, [paramId], ordersDB);
          return;
        }
        if (!ids.includes(paramId)) {
          ids.push(paramId);
        }
        await set(ordersField, ids, ordersDB);
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
        return result;
      } catch (err: unknown) {
        console.log((err as Error).message);

        return null;
      }
    },
    getMessage: function () {
      console.log("Заказы и сохранение в базе...");
    },
  };
  return self;
};
