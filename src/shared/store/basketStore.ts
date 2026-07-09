"use client";

import { create } from "zustand";
import { TGoodItem } from "../types/main_types";
import { createStore, get, set, del } from "idb-keyval";

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
  deleteEntity: async (paramKey: string) => {
    await del(paramKey, basketStore);
  },
};

export type TBasketItem = Pick<TGoodItem, "documentId" | "title" | "price"> & {
  count: number;
};

export function isTBasketItem(param: unknown): param is TBasketItem {
  return typeof param === "object" && param !== null && "count" in param;
}

type TBasketState = {
  goods: Map<string, TBasketItem>;
  length: number;
};

interface IBasketActions {
  mapToArray: () => TBasketItem[];
  setItem: (param: TBasketItem) => void;
  deleteItem: (param: TBasketItem) => void;
  inBasket: (paramId: string) => boolean;
  getItem: (paramId: string) => TBasketItem | null;
  saveToBase: () => void;
  getFromBase: () => Promise<void>;
}

type TBasketStore = TBasketState & IBasketActions;

function initDataFromBase(): TBasketState {
  const data: TBasketItem[] = [];
  MyStorage.getItem(nameInBase)
    .then((result) =>
      (result as TBasketItem[]).forEach((item) => data.push(item)),
    )
    .catch(() => (data.length = 0));

  const goods = new Map<string, TBasketItem>();
  let length: number = 0;
  if (data !== null) {
    data?.forEach((item) => {
      goods.set(item.documentId, item);
    });
    length = goods.size;
  }
  return { goods, length } as TBasketState;
}

const InitialData: TBasketState = initDataFromBase();

export const useBasket = create<TBasketStore>()((set, get) => ({
  ...InitialData,

  mapToArray: () => {
    const tmp: TBasketItem[] = Array.from(get().goods).map((item) => item[1]);
    return tmp;
  },
  setItem: (param: TBasketItem) => {
    const temp_goods = new Map(get().goods);
    temp_goods.set(param.documentId, param);
    set({ goods: temp_goods, length: temp_goods.size });
  },
  deleteItem: (param: TBasketItem) => {
    const temp_goods = new Map(get().goods);
    if (temp_goods.has(param.documentId)) {
      temp_goods.delete(param.documentId);
      set({ goods: temp_goods, length: temp_goods.size });
    }
  },
  inBasket: (param: string) => {
    let res: boolean = false;
    if (get().goods.has(param)) {
      res = true;
    }
    return res;
  },
  getItem: (paramId: string) => {
    let res: TBasketItem | null = null;
    if (get().goods.has(paramId)) {
      res = get().goods.get(paramId) as TBasketItem;
    }
    return res;
  },
  saveToBase: async () => {
    const dataToSave = get().mapToArray();
    if (dataToSave.length > 0) {
      await MyStorage.setItem(nameInBase, dataToSave);
    }
  },
  getFromBase: async () => {
    const data = await MyStorage.getItem(nameInBase);

    if (data !== null) {
      const t_data = new Map<string, TBasketItem>();
      (data as TBasketItem[]).forEach((item) => {
        t_data.set(item.documentId, item);
      });
      if (t_data.size > 0) {
        //console.log(t_data);
        set({ goods: t_data, length: t_data.size });
        //console.log("Данные прочитаны из базы... " + get().length);
      }
    }
  },
}));
