import { create } from "zustand";

interface TSearchPage {
  page: number;
  setPage: (param: number) => void;
}

export const useSearchPage = create<TSearchPage>((set) => ({
  page: 1,
  setPage: (param: number) => set({ page: Math.max(param, 1) }),
}));
