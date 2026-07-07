"use client";

import { create } from "zustand";
import { TGoodItem } from "../types/main_types";
import { createStore } from "idb-keyval";

const basketStore = createStore("basketDB", "basketStore");

export type TBasketItem = Pick<TGoodItem, "documentId" | "title" | "price"> & {
  count: number;
};

type TBasketState = {
  goods: Map<string, TBasketItem>;
  length: number;
};

interface IBasketActions {
  mapToArray: () => TBasketItem[];
  setItem: (param: TBasketItem) => void;
  deleteItem: (param: TBasketItem) => void;
  inBasket: (paramId: string) => boolean;
}

type TBasketStore = TBasketState & IBasketActions;

export const useBasket = create<TBasketStore>()((set, get) => ({
  goods: new Map<string, TBasketItem>(),
  length: 0,

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
}));
