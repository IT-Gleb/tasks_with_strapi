import { create } from "zustand";
import type { TOrder, TOrderStatus } from "../types/main_types";

export type TListToModifyStatus = Pick<TOrder, "id"> & {
  s_status: TOrderStatus;
};

type TListState = {
  list: TListToModifyStatus[];
  size: number;
};

interface IStatusActions {
  addToList: (param: TListToModifyStatus) => void;
  removeFromList: (paramId: string) => void;
  getLength: () => number;
  clearList: () => void;
}

const useOrdersListModify = create<TListState & IStatusActions>()(
  (set, get) => ({
    list: [],
    size: 0,

    addToList: (param: TListToModifyStatus) => {
      const all = get().list;
      let tmp = get().list.find(
        (fd) => fd.id === param.id && fd.s_status === param.s_status,
      );
      if (!tmp) {
        all.push(param);
        set({ list: all, size: all.length });
        return;
      }
      tmp = get().list.find(
        (fd) => fd.id === param.id && fd.s_status !== param.s_status,
      );
      if (tmp) {
        const idx = all.indexOf(tmp);
        if (idx !== -1) {
          tmp.s_status = param.s_status;
          all[idx] = tmp;
          set({ list: all, size: all.length });
        }
      }
    },
    removeFromList: (paramId: string) => {
      const tmp = get().list.filter((find) => find.id !== paramId);
      set({ list: tmp, size: tmp.length });
    },
    getLength: () => get().list.length,
    clearList: () => {
      set({ list: [], size: 0 });
    },
  }),
);

export default useOrdersListModify;
