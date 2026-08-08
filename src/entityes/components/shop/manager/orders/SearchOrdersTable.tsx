"use client";

import { TDashBoardProps, TOrder } from "@/shared/types/main_types";
import { Button, cn } from "@heroui/react";
import { ChevronDown, ChevronUp, SearchCode } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useMemo, useState } from "react";
import TblOrderRow from "./table/TableRow";

const urlCancel = "/dashboard?state=inwork&page=1";

const TableHeader = ({
  paramOrders,
  className = "",
  sortHandler,
}: {
  paramOrders: TOrder[];
  className: string;
  sortHandler: (sortField: keyof TOrder, sortKey: "asc" | "desc") => void;
}) => {
  //-------------Сортировка данные----------------------
  //Поле сортировки
  const [sortField, setSortField] = useState<keyof TOrder | null>(null);
  const [sortKey, setSortKey] = useState<"asc" | "desc">("asc");

  const sortDataSetup = (paramField: keyof TOrder) => {
    setSortKey((prev) => (prev === "asc" ? "desc" : "asc"));
    setSortField(paramField);
    sortHandler(paramField, sortKey);
    //console.log(sortKey);
  };

  const handlerSort = (param: keyof TOrder) => {
    sortDataSetup(param);
  };

  //-------------Сортировка-----------------------

  return (
    <div className="w-full md:max-w-full">
      <div
        className={cn(
          "w-full p-3 rounded-t-2xl [&>div]:text-center border-b border-b-slate-500 dark:border-b-slate-600 text-xs font-bold bg-slate-200 dark:bg-slate-900",
          className,
        )}
      >
        <div className="hidden md:block -rotate-24 whitespace-nowrap text-center">
          №/№
        </div>
        <div>Заказ</div>
        <div>
          <Button
            variant="outline"
            size="sm"
            className={
              "font-bold scale-90 active:scale-80 bg-stone-300 dark:bg-stone-700"
            }
            onPress={() => {
              handlerSort("price");
            }}
          >
            Цена
            {sortField === "price" ? (
              sortKey === "asc" ? (
                <ChevronUp size={14} />
              ) : (
                <ChevronDown size={14} />
              )
            ) : null}
          </Button>
        </div>
        <div>
          <Button
            variant="outline"
            size="sm"
            className={
              "font-bold scale-90 active:scale-80 bg-stone-300 dark:bg-stone-700"
            }
            onPress={() => {
              handlerSort("status");
            }}
          >
            Статус
            {sortField === "status" ? (
              sortKey === "asc" ? (
                <ChevronUp size={14} />
              ) : (
                <ChevronDown size={14} />
              )
            ) : null}
          </Button>
        </div>
        <div className="hidden md:block">
          <Button
            variant="outline"
            size="sm"
            className={
              "font-bold scale-90 active:scale-80 bg-stone-300 dark:bg-stone-700"
            }
            onPress={() => handlerSort("updatedAt")}
          >
            Дата
            {sortField === "updatedAt" ? (
              sortKey === "asc" ? (
                <ChevronUp size={14} />
              ) : (
                <ChevronDown size={14} />
              )
            ) : null}
          </Button>
        </div>
      </div>
    </div>
  );
};

const SearchOrdersTable = ({
  searchItems,
  pageNumber = 1,
}: {
  searchItems: TDashBoardProps;
  pageNumber?: number;
}) => {
  const { orders } = searchItems;
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const router = useRouter();
  const [sortedOrders, setSortedOrders] = useState<TOrder[]>(orders);

  useLayoutEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handlerCancel = () => {
    router.push(urlCancel);
  };

  const sortOrders = (param: keyof TOrder | null, sortKey: "asc" | "desc") => {
    if (param === null) {
      return;
    }
    const tmp = [...sortedOrders].sort((a, b) => {
      if (
        typeof a[param as keyof TOrder] === "string" &&
        typeof b[param as keyof TOrder] === "string"
      ) {
        const dt1 = a[param as keyof TOrder] as unknown as string;
        const dt2 = b[param as keyof TOrder] as unknown as string;
        //console.log("from Status ----", sortKey);

        if (sortKey === "asc") {
          return dt1.toLowerCase().localeCompare(dt2.toLowerCase());
        } else {
          return dt2.toLowerCase().localeCompare(dt1.toLowerCase());
        }
      }
      const num1 = a[param as keyof TOrder] as unknown as number;
      const num2 = b[param as keyof TOrder] as unknown as number;
      // console.log("---From number----");

      if (num1 < num2) {
        return sortKey === "asc" ? 1 : -1;
      } else {
        return sortKey === "asc" ? -1 : 1;
      }
    });

    setSortedOrders(tmp);
  };

  return (
    <section className="h-full min-h-80 flex flex-col">
      <header className="text-right p-2 text-xs">
        <Button
          size="sm"
          variant="outline"
          className={"active:scale-80"}
          onPress={handlerCancel}
        >
          <SearchCode size={12} />
          Отменить
        </Button>
      </header>

      <main className="flex-1">
        <TableHeader
          paramOrders={orders}
          sortHandler={sortOrders}
          className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] md:grid-cols-[35px_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-2 xl:gap-4 items-center"
        />
        <div className="w-full max-h-160 overflow-y-auto">
          {sortedOrders.map((item, index) => {
            return (
              <TblOrderRow
                key={item.id}
                paramOrder={item}
                index={index}
                className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] md:grid-cols-[35px_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-2 xl:gap-4 items-center"
              />
            );
          })}
        </div>
      </main>
      <footer className="p-2">Пагинация</footer>
    </section>
  );
};

export default SearchOrdersTable;
