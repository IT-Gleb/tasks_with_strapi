"use client";

import { itemsOnPage } from "@/shared/utils/consts";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";

interface IPaginationContext {
  currentPage: number;
  pageSize: number;
  handlerPage: (param: number) => void;
}

const PaginationContext = createContext<IPaginationContext | undefined>(
  undefined,
);

// Описываем пропсы для Провайдера (обязательно типизируем children)
interface IPaginationProviderProps {
  children: ReactNode;
}

// 3. Создаем Провайдер
export function PaginationProvider({ children }: IPaginationProviderProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(itemsOnPage);

  const handlerPage = (param: number) => {
    setCurrentPage(Math.abs(param));
  };

  // Мемоизируем объект. TS автоматически выведет тип ThemeContextType
  const contextValue = useMemo(
    () => ({ currentPage, pageSize, handlerPage }),
    [currentPage],
  );

  return (
    <PaginationContext.Provider value={contextValue}>
      {children}
    </PaginationContext.Provider>
  );
}

// 4. Создаем кастомный хук
export function usePaginationContext(): IPaginationContext {
  const context = useContext(PaginationContext);

  // Благодаря этой проверке TS понимает, что context не может быть undefined ниже по коду
  if (context === undefined) {
    throw new Error(
      "usePaginationContext должен использоваться внутри PaginationProvider",
    );
  }

  return context;
}
