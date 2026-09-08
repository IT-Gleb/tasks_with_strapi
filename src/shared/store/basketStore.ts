"use client";

import { create } from "zustand";
import type { TBasketItem } from "../types/main_types";
import { createStore, get, set, del } from "idb-keyval";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";

const syncName = "sync_Basket_store";

const syncBrowserTabs =
  typeof window !== "undefined" ? new BroadcastChannel(syncName) : null;

const handlerMessage = () => {
  if (syncBrowserTabs) {
    syncBrowserTabs.onmessage = (event: MessageEvent<TBasketGoods>) => {
      //console.log(event.data);
      useBasket.getState().checkTabUpdate(event.data);
    };
  }
};

if (syncBrowserTabs) {
  syncBrowserTabs.addEventListener("message", handlerMessage);
}

const basketStore = createStore("basketDB", "basketStore");

const MyStorage: StateStorage = {
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

type TBasketGoods = Record<string, TBasketItem>;

type TBasketState = {
  goods: TBasketGoods;
  _hasHydrated: boolean;
};

//type TBasketValues = Pick<TBasketState, "goods" | "length">;

interface IBasketActions {
  setHasHydrated: (state: boolean) => void;
  setItem: (param: TBasketItem) => void;
  deleteItem: (paramId: string) => void;
  inBasket: (paramId: string) => boolean;
  getItem: (paramId: string) => TBasketItem | null;
  length: () => number;
  getItems: () => TBasketItem[];
  totalOrderPrice: () => number;
  inOrder: () => boolean;
  clearItems: () => void;
  checkTabUpdate: (param: TBasketGoods) => void;
  // saveToBase: () => void;
}

export type TBasketStore = TBasketState & IBasketActions;

export const useBasket = create<TBasketStore>()(
  persist(
    (set, get) => ({
      goods: {},
      _hasHydrated: false,

      setHasHydrated: (state: boolean) => {
        set({
          _hasHydrated: state,
        });
      },

      setItem: (param: TBasketItem) => {
        set((state) => {
          const tmp = state.goods[param.documentId];

          return {
            goods: {
              ...state.goods,
              [param.documentId]: {
                ...param,
                count: tmp ? param.count : 1,
              },
            },
          };
        });
        syncBrowserTabs?.postMessage(get().goods);
      },

      deleteItem: async (paramId: string) => {
        //console.log("---Удаляю---", paramId);
        const delId = async () => {
          //console.log("---Удаляю---", paramId);
          const { [paramId]: deledtI, ...other } = get().goods;
          return await set({ goods: { ...other } });
        };
        await delId();
        syncBrowserTabs?.postMessage(get().goods);
      },

      inBasket: (paramId: string) => {
        return paramId in get().goods;
      },

      getItem: (paramId: string) => {
        try {
          return get().goods[paramId];
        } catch (err) {
          return null;
        }
      },

      length: () => {
        let res = 0;
        const count = Object.keys(get().goods).length;
        count > 0 ? (res = count) : (res = 0);
        return res;
      },

      getItems: () => {
        try {
          return Object.values(get().goods);
        } catch (err: unknown) {
          return [];
        }
      },

      totalOrderPrice: () => {
        try {
          return Object.values(get().goods).reduce((acc, value) => {
            if (value.inOrder) {
              acc += value.price * value.count;
            }
            return acc;
          }, 0);
        } catch (err: unknown) {
          return 0;
        }
      },

      inOrder: () => {
        try {
          return Object.values(get().goods).some(
            (item) => item.inOrder === true,
          );
        } catch (err: unknown) {
          return false;
        }
      },
      clearItems: () => set({ goods: {} }),
      checkTabUpdate: (param: TBasketGoods) => {
        set({ goods: param });
      },
      // saveToBase: () => {
      //   return 0;
      // },
    }),
    {
      name: "basketStore",
      version: 1,
      storage: createJSONStorage(() => MyStorage),
      partialize: (state) => ({ goods: state.goods }),
      skipHydration: true,

      // onRehydrateStorage: (state) => {
      //   state.setHasHydrated(false);
      //   return (hydrateState, error) => {
      //     if (error || !hydrateState) {
      //       console.log("Hydration inBasket store - error");
      //     }
      //     if (hydrateState) {
      //       state.setHasHydrated(true);
      //     }
      //   };
      // },
    },
  ),
);
