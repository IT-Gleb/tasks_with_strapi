"use client";

import { useIsMobile } from "@/shared/hooks/custom/UseIsMobile";
import useOrdersListModify from "@/shared/store/ordersToModifyStore";
import type {
  TBasketItem,
  TDashBoardProps,
  TOrder,
  TOrderStatus,
} from "@/shared/types/main_types";
import {
  API_URL,
  ordersCancelledRequest,
  orderSuccessedRequest,
} from "@/shared/utils/consts";
import { getOrdersData, UpdateOrdersStatus } from "@/shared/utils/fetchers";
import { Wait } from "@/shared/utils/functions";
import { Button, cn, Key, Tabs, toast } from "@heroui/react";
import {
  Check,
  X,
  Plus,
  Activity,
  CheckCheck,
  ListOrdered,
  Loader2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

import { memo, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";

const tabsList = [
  {
    id: 0,
    docId: "inWork",
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

const orderStatusRus: Record<TOrderStatus, string> = {
  created: "Новый",
  delivered: "В магазине",
  "in-work": "В обработке",
  cancelled: "Отменен",
  success: "Готов",
};

const orderStatus: TOrderStatus[] = Object.keys(
  orderStatusRus,
) as TOrderStatus[];

const StatusOptions = ({
  paramId,
  selected,
  handler,
}: {
  paramId: string;
  selected: TOrderStatus;
  handler: (param: boolean, paramStatus: TOrderStatus) => void;
}) => {
  const [option, setOption] = useState<string>(
    orderStatus.includes(selected) ? selected : "",
  );

  const handlerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setOption(value); // Capture the chosen option value

    handler(value !== selected, value as TOrderStatus);
  };

  const ordStatus = useMemo(() => {
    const indx = orderStatus.indexOf(selected);
    return orderStatus.slice(indx, orderStatus.length);
  }, []);

  return (
    <select
      name={`status-${paramId}`}
      id={`status-${paramId}`}
      className="p-1 border rounded-md border-slate-600"
      value={option}
      onChange={handlerChange}
    >
      {ordStatus.map((opt) => (
        <option key={opt} value={opt}>
          {orderStatusRus[opt]}
        </option>
      ))}
    </select>
  );
};

const ItemsTable = memo(({ items }: { items: TBasketItem[] }) => {
  return (
    <div className="ml-10 w-[85%] text-xs flex gap-0.5 py-1 shadow-lg dark:shadow-slate-400 dark:bg-chocolate/25 rounded-s-lg">
      <div className="w-fit max-w-50 flex flex-col gap-1 [&>div]:p-1 uppercase bg-indigo-400/75 dark:bg-indigo-800/50 text-yellow-50 rounded-s-xl">
        <div>Наименование</div>
        <div>Количество</div>
        <div>Цена</div>
      </div>
      <div className="w-[75%] overflow-x-auto flex gap-0.5 items-center">
        {items.map((itm) => (
          <div
            key={itm.documentId}
            className="flex flex-col items-start gap-0.5 [&>div]:rounded-lg [&>div]:border [&>div]:w-60 [&>div]:p-1.5 [&>div]:border-slate-300 dark:[&>div]:border-slate-600"
          >
            <div className=" line-clamp-1">{itm.title}</div>
            <div>{itm.count}</div>
            <div>
              {Intl.NumberFormat("ru-RU", {
                style: "currency",
                currency: "RUB",
              }).format(itm.price)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

const TblOrderRow = memo(
  ({
    paramOrder,
    index,
    className,
  }: {
    paramOrder: TOrder;
    index: number;
    className: string;
  }) => {
    const { title, price, items, status, updatedAt } = paramOrder;

    const [currentStatus, setCurrentStatus] = useState<TOrderStatus>(status);
    const [showItems, setShowItems] = useState<boolean>(false);
    const { addToList, removeFromList } = useOrdersListModify();

    const handlerModify = (param: boolean, paramStatus: TOrderStatus) => {
      //console.log(param);
      param
        ? addToList({ id: paramOrder.id, s_status: paramStatus })
        : removeFromList(paramOrder.id);

      setCurrentStatus(paramStatus);
    };

    return (
      <div className="relative z-1 ">
        <div
          className={cn(
            " text-xs p-1 odd:bg-stone-100/25 dark:odd:bg-stone-700/25 transition-discrete duration-200 z-3",
            className,
            currentStatus === "delivered" &&
              " border-b-slate-800 dark:border-b-slate-400",
            currentStatus === "in-work" &&
              "border-b border-b-sky-400 dark:border-b-sky-500",
            currentStatus === "cancelled" && "border-b border-b-red-400",
            currentStatus === "success" && "border-b border-b-green-400",
          )}
        >
          <div className="text-right">{index + 1}.</div>
          <div className=" whitespace-nowrap">
            <Button
              variant="outline"
              size="sm"
              onPress={() => {
                setShowItems((prev) => !prev);
              }}
              className={cn(
                "dark:border-green-700",
                showItems === true && "bg-stone-200 dark:bg-stone-700",
              )}
            >
              <ListOrdered size={10} />
              {title}
            </Button>
          </div>
          <div className="text-right">
            {Intl.NumberFormat("ru-RU", {
              style: "currency",
              currency: "RUB",
            }).format(price)}
          </div>
          <div className="text-center">
            <StatusOptions
              paramId={paramOrder.id}
              selected={status}
              handler={handlerModify}
            />
          </div>
          <div className="text-right whitespace-nowrap line-clamp-1">
            {Intl.DateTimeFormat("ru-RU", {
              timeZone: "Europe/Moscow",
              dateStyle: "short",
              timeStyle: "medium",
            }).format(new Date(updatedAt))}
          </div>
        </div>

        <div
          className={
            (cn(" w-[90%] col-span-5 z-2 transition-discrete "),
            showItems === true
              ? "h-auto opacity-100 duration-500 pb-3"
              : "h-0 opacity-0 duration-300")
          }
        >
          <ItemsTable items={items} />
        </div>
      </div>
    );
  },
);

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

        if (dt1.toLowerCase().localeCompare(dt2.toLowerCase())) {
          return sortKey === "asc" ? 1 : -1;
        } else {
          return sortKey === "asc" ? -1 : 1;
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
      <div className="max-w-125 sm:w-full sm:max-w-full ">
        <div className="w-210 p-3 rounded-t-2xl [&>div]:text-center border-b border-b-slate-500 dark:border-b-slate-600 grid grid-cols-[35px_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-2 xl:gap-4 items-center text-xs font-bold bg-slate-200 dark:bg-slate-900">
          <div className=" -rotate-24 whitespace-nowrap text-center">№/№</div>
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
          <div>
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
        <div className="w-full max-h-170 overflow-auto">
          {sortedOrders.map((order, index) => (
            <TblOrderRow
              key={order.id}
              paramOrder={order}
              index={index}
              className="w-210 grid grid-cols-[35px_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-2 xl:gap-4 items-center"
            />
          ))}
        </div>
      </div>
      {/* <p>text- {paramId}</p> */}

      <footer className={cn("inline-block w-[90%] p-1 text-right ")}>
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
      </footer>
    </Tabs.Panel>
  );
};

const OrdersWithTabs = ({
  ordersInWork,
}: {
  ordersInWork: TDashBoardProps;
}) => {
  const isMobile = useIsMobile();
  const [sectionKey, setSectionKey] = useState<Key>(tabsList[0].docId);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ordersData, setOrdersData] = useState<TDashBoardProps>();

  //console.log(sectionKey);
  useEffect(() => {
    let isWork: boolean = true;

    if (sectionKey === tabsList[1].docId || sectionKey === tabsList[2].docId) {
      (async function () {
        setIsLoading(true);
        const queryKey =
          sectionKey === tabsList[1].docId
            ? "successedOrders"
            : "cancelledOrders";
        const url =
          sectionKey === tabsList[1].docId
            ? `${API_URL}/${orderSuccessedRequest}`
            : `${API_URL}/${ordersCancelledRequest}`;
        try {
          const tmpData = await getOrdersData(url, queryKey);
          //console.log(tmpData);

          if (isWork) {
            setOrdersData(tmpData);
          }
        } finally {
          setIsLoading(false);
        }
      })();
      // console.log(sectionKey);
    }

    return () => {
      isWork = false;
    };
  }, [sectionKey]);

  return (
    <div className="w-full max-w-220 lg:-ml-2 py-2 px-1">
      <Tabs
        orientation={"horizontal"}
        selectedKey={sectionKey}
        onSelectionChange={setSectionKey}
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
        {isLoading && (
          <div className="w-fit mx-auto p-2">
            <Loader2 size={32} className=" animate-spin" />
          </div>
        )}
        {!isLoading &&
          tabsList.map((tb) => (
            <TabContent
              key={tb.id}
              paramId={tb.docId}
              paramOrders={
                tb.id === 0 ? ordersInWork : (ordersData as TDashBoardProps)
              }
            />
          ))}
      </Tabs>
    </div>
  );
};

export default OrdersWithTabs;
