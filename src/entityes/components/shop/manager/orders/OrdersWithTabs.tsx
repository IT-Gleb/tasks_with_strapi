"use client";

import { useIsMobile } from "@/shared/hooks/custom/UseIsMobile";
import useOrdersListModify from "@/shared/store/ordersToModifyStore";
import type {
  TDashBoardProps,
  TOrder,
  TPageMeta,
} from "@/shared/types/main_types";

import { UpdateOrdersStatus } from "@/shared/utils/fetchers";
import { Wait } from "@/shared/utils/functions";
import { Button, cn, Key, Tabs, toast } from "@heroui/react";
import {
  Check,
  X,
  Plus,
  Activity,
  CheckCheck,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";
import PaginationOrdersTable from "./PaginationOrdersTable";
import { usePaginationContext } from "@/shared/hooks/custom/UsePaginationContext";
import { useRouter } from "next/navigation";
import TblOrderRow from "./table/TableRow";

const tabsList = [
  {
    id: 0,
    docId: "inwork",
    label: "Новые / в работе",
    mobileLabel: "В работе",
    icon: <Plus size={14} />,
  },

  {
    id: 1,
    docId: "successed",
    label: "Завершенные",
    mobileLabel: "Заверш...",
    icon: <Check size={14} />,
  },

  {
    id: 2,
    docId: "cancelled",
    label: "Отмененные",
    mobileLabel: "Отмене...",
    icon: <X size={14} />,
  },
];

const TabContent = ({
  paramId,
  paramOrders,
}: {
  paramId: string;
  paramOrders: TDashBoardProps;
}) => {
  //console.log(orders);
  if (typeof paramOrders === "undefined") {
    return null;
  }

  const { size, list, clearList } = useOrdersListModify(
    useShallow((state) => state),
  );
  const [razmer, setRazmer] = useState<number>(size);
  //const [orders, setOrders] = useState<TOrder[]>(paramOrders.orders);
  //-------------Сортировка данные----------------------
  //Поле сортировки
  const [sortField, setSoretField] = useState<keyof TOrder | null>(null);
  const [sortKey, setSortKey] = useState<"asc" | "desc">("asc");

  const sortDataSetup = (paramField: keyof TOrder) => {
    setSortKey((prev) => (prev === "asc" ? "desc" : "asc"));
    setSoretField(paramField);
    //console.log(sortKey);
  };

  const handlerSort = (param: keyof TOrder) => {
    sortDataSetup(param);
  };

  const sortedOrders = useMemo(() => {
    if (sortField === null) {
      return [...paramOrders.orders];
    }
    return [...paramOrders.orders].sort((a, b) => {
      if (
        typeof a[sortField as keyof TOrder] === "string" &&
        typeof b[sortField as keyof TOrder] === "string"
      ) {
        const dt1 = a[sortField as keyof TOrder] as unknown as string;
        const dt2 = b[sortField as keyof TOrder] as unknown as string;
        //console.log("from Date ----");

        if (sortKey === "asc") {
          return dt1.toLowerCase().localeCompare(dt2.toLowerCase());
        } else {
          return dt2.toLowerCase().localeCompare(dt1.toLowerCase());
        }
      }
      const num1 = a[sortField as keyof TOrder] as unknown as number;
      const num2 = b[sortField as keyof TOrder] as unknown as number;
      // console.log("---From number----");

      if (num1 < num2) {
        return sortKey === "asc" ? 1 : -1;
      } else {
        return sortKey === "asc" ? -1 : 1;
      }
    });
  }, [sortField, sortKey, paramOrders.orders]);

  //-------------Сортировка-----------------------

  const handlerUpdate = async () => {
    try {
      toast.promise(UpdateOrdersStatus(list), {
        loading: "Отправляю...",
        success: "Данные отправлены...",
        error: "Ошибка передачи данных",
      });

      clearList();
      //console.log("before timeout");
      await Wait(1000);
      // console.log("after timeout");
    } finally {
      window.location.reload();
    }
  };

  useMemo(() => {
    setRazmer(size);
  }, [size]);

  return (
    <Tabs.Panel id={paramId}>
      <div className="w-full md:max-w-full">
        <div className="w-full p-3 rounded-t-2xl [&>div]:text-center border-b border-b-slate-500 dark:border-b-slate-600 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] md:grid-cols-[35px_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-2 xl:gap-4 items-center text-xs font-bold bg-slate-200 dark:bg-slate-900">
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
          <div>Статус</div>
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
        <div className="w-full max-h-170 overflow-y-auto">
          {sortedOrders.map((order, index) => (
            <TblOrderRow
              key={order.id}
              paramOrder={order}
              index={index}
              className="w-full grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] md:grid-cols-[35px_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-2 xl:gap-4 items-center"
            />
          ))}
        </div>
      </div>
      {/* <p>text- {paramId}</p> */}

      <footer className={cn("inline-block w-[90%] text-right ")}>
        <div className="mt-3 flex gap-3 items-center justify-between p-1">
          <PaginationOrdersTable paramMeta={paramOrders.meta as TPageMeta} />
          <Button
            size="sm"
            variant="outline"
            isDisabled={razmer < 1}
            className={"text-xs active:scale-80"}
            onPress={handlerUpdate}
          >
            {razmer > 0 ? <CheckCheck size={12} /> : <Activity size={12} />}
            Изменить
          </Button>
        </div>
      </footer>
    </Tabs.Panel>
  );
};

const OrdersWithTabs = ({
  orders,
  pageNumber,
}: {
  orders: TDashBoardProps;
  pageNumber: number;
}) => {
  const [Mounted, setMounted] = useState<boolean>(false);
  const isMobile = useIsMobile();
  const [sectionKey, setSectionKey] = useState<Key>(tabsList[0].docId);
  const [ordersData, setOrdersData] = useState<TDashBoardProps>(orders);
  const { currentPage, handlerPage } = usePaginationContext();

  const router = useRouter();

  //------Рендер на клиенте------
  useLayoutEffect(() => {
    setMounted(true);
  }, []);
  //----------------------------

  useEffect(() => {
    let isWork: boolean = true;
    let url: string = "/dashboard?state=%1&page=%2";

    switch (sectionKey) {
      case tabsList[0].docId:
        url = url.replace("%1", "inwork").replace("%2", String(currentPage));
        break;
      case tabsList[1].docId:
        url = url.replace("%1", "successed").replace("%2", String(currentPage));
        break;
      case tabsList[2].docId:
        url = url.replace("%1", "cancelled").replace("%2", String(currentPage));
        break;
      default:
        url = url.replace("%1", "inwork").replace("%2", String(currentPage));
        break;
    }

    if (isWork) {
      router.push(url);
    }

    return () => {
      isWork = false;
    };
  }, [sectionKey, currentPage]);

  useEffect(() => {
    let isWork: boolean = true;
    if (isWork) {
      setOrdersData(orders);
    }
    return () => {
      isWork = false;
    };
  }, [orders]);

  if (!Mounted) {
    return null;
  }

  return (
    <div className="w-full lg:-ml-2 py-2 px-1">
      <div className="p-2 text-right">
        <Button
          size="sm"
          variant="outline"
          className={"scale-90 active:scale-80"}
          onPress={() => window.location.reload()}
        >
          Обновить
        </Button>
      </div>
      <Tabs
        orientation={"horizontal"}
        selectedKey={sectionKey}
        onSelectionChange={(key: Key) => {
          handlerPage(1);
          setSectionKey(key);
        }}
      >
        <Tabs.ListContainer>
          <Tabs.List aria-label="Overflow options">
            {tabsList.map((tb) => {
              return (
                <Tabs.Tab key={tb.id} id={tb.docId}>
                  <span className="pr-1">
                    {tb.icon !== null ? tb.icon : ""}
                  </span>
                  {isMobile ? tb.mobileLabel : tb.label}
                  <Tabs.Indicator />
                </Tabs.Tab>
              );
            })}
          </Tabs.List>
        </Tabs.ListContainer>

        {tabsList.map((tb) => (
          <TabContent
            key={tb.id}
            paramId={tb.docId}
            paramOrders={ordersData as TDashBoardProps}
          />
        ))}
      </Tabs>
    </div>
  );
};

export default OrdersWithTabs;
