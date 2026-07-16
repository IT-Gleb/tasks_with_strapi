"use client";

import { create } from "zustand";
import type { TBasketItem } from "../types/main_types";
import { createStore, get, set, del } from "idb-keyval";
import { createJSONStorage, persist } from "zustand/middleware";

const nameInBase = "goods";

const basketStore = createStore("basketDB", "basketStore");
const MyStorage = {
  getItem: async (paramKey: string) => {
    const res = await get(paramKey, basketStore);
    if (res !== null && res !== undefined) {
      return res;
    }
    return null;
  },
  setItem: async (paramKey: string, data: unknown) => {
    await set(paramKey, data, basketStore);
  },
  removeItem: async (nameKey: string) => {
    await del(nameKey, basketStore);
  },
};

export function isTBasketItem(param: unknown): param is TBasketItem {
  return typeof param === "object" && param !== null && "count" in param;
}

type TBasketState = {
  goods: Map<string, TBasketItem>;
  length: number;
  _hasHydrated: boolean;
};

type TBasketValues = Pick<TBasketState, "goods" | "length">;

interface IBasketActions {
  mapToArray: () => TBasketItem[];
  setItem: (param: TBasketItem) => void;
  deleteItem: (param: TBasketItem) => void;
  inBasket: (paramId: string) => boolean;
  getItem: (paramId: string) => TBasketItem | null;
  saveToBase: () => void;
  loadFromBase: () => Promise<{
    goods: Map<string, TBasketItem>;
    length: number;
  } | null>;
  setHasHydrated: (state: boolean) => void;
  setData: (param: TBasketValues) => void;
  totalOrderPrice: () => number;
  inOrder: () => boolean;
}

type TBasketStore = TBasketState & IBasketActions;

// function initDataFromBase(): TBasketState {
//   const data: TBasketItem[] = [];
//   MyStorage.getItem(nameInBase)
//     .then((result) =>
//       (result as TBasketItem[]).forEach((item) => data.push(item)),
//     )
//     .catch(() => (data.length = 0));

//   const goods = new Map<string, TBasketItem>();
//   let length: number = 0;
//   if (data !== null) {
//     data?.forEach((item) => {
//       goods.set(item.documentId, item);
//     });
//     length = goods.size;
//   }
//   return { goods, length } as TBasketState;
// }

//const InitialData: TBasketState = initDataFromBase();

export const useBasket = create<TBasketStore>()(
  persist(
    (set, get) => ({
      goods: new Map<string, TBasketItem>(),
      length: 0,
      _hasHydrated: false,

      setHasHydrated: (state: boolean) => {
        set({
          _hasHydrated: state,
        });
      },

      setData: (param: unknown) => {
        if (
          typeof param !== "object" &&
          param === null &&
          !("goods" in param) &&
          !("length" in param)
        ) {
          return;
        }
        try {
          const t_goods = new Map((param as TBasketValues).goods);
          const lt = t_goods.size;
          set({ goods: t_goods, length: lt });
        } catch (err: unknown) {
          console.log((err as Error).message);
        }
      },

      mapToArray: () => {
        if (get().length < 1) return [];

        const tmp: TBasketItem[] = Array.from(get().goods).map(
          (item) => item[1],
        );
        return tmp;
      },
      setItem: (param: TBasketItem) => {
        //console.log(get().length);
        let temp_goods = new Map<string, TBasketItem>();
        if (get().length > 0) {
          temp_goods = new Map(get().goods);
        }

        temp_goods.set(param.documentId, param);
        set({ goods: temp_goods, length: temp_goods.size });
      },
      deleteItem: (param: TBasketItem) => {
        if (get().length < 1) {
          return;
        }
        const temp_goods = new Map(get().goods);
        if (temp_goods.has(param.documentId)) {
          temp_goods.delete(param.documentId);
          //console.log(temp_goods.size);

          set({ goods: temp_goods, length: temp_goods.size });
        }
      },
      inBasket: (param: string) => {
        let res: boolean = false;
        if (get().length < 1) {
          return res;
        }

        try {
          const tmp = new Map<string, TBasketItem>(get().goods);
          if (tmp.has(param)) {
            res = true;
          }
        } catch (err) {
          return res;
        }

        return res;
      },
      getItem: (paramId: string) => {
        let res: TBasketItem | null = null;
        if (get().length < 1) {
          return res;
        }
        if (get().goods.has(paramId)) {
          res = get().goods.get(paramId) as TBasketItem;
        }
        return res;
      },
      saveToBase: async () => {
        const dataToSave = get().mapToArray();

        await MyStorage.setItem(nameInBase, dataToSave);
      },
      loadFromBase: async () => {
        const data = await MyStorage.getItem(nameInBase);

        if (data !== null) {
          const t_data = new Map<string, TBasketItem>();
          (data as TBasketItem[]).forEach((item) => {
            t_data.set(item.documentId, item);
          });
          if (t_data.size > 0) {
            //console.log(t_data);
            set({ goods: t_data, length: t_data.size });
            return { goods: t_data, length: t_data.size };
            // console.log("Данные прочитаны из базы... " + get().length);
          }
        }
        return null;
      },
      totalOrderPrice: () => {
        const t_array = get().mapToArray();
        let res: number = 0;
        if (t_array === null || t_array.length < 1) {
          return res;
        }

        res = t_array.reduce((acc, value) => {
          return (acc += value.inOrder ? value.count * value.price : 0);
        }, 0);
        return res;
      },
      inOrder: () => {
        let res: boolean = false;
        if (get().length < 1) {
          return res;
        }
        const tmp_data = get().mapToArray();
        res = tmp_data.filter((item) => item.inOrder === true).length > 0;
        return res;
      },
    }),
    {
      name: "ordersStore",
      version: 1,
      storage: createJSONStorage(() => sessionStorage),
      skipHydration: true,
      onRehydrateStorage: (state) => {
        return () => state.setHasHydrated(true);
      },
    },
  ),
);
