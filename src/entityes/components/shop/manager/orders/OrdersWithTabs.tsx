"use client";

import { useIsMobile } from "@/shared/hooks/custom/UseIsMobile";
import type {
  TBasketItem,
  TOrder,
  TOrderStatus,
} from "@/shared/types/main_types";
import { Button, cn, Key, Tabs } from "@heroui/react";
import {
  Check,
  X,
  Plus,
  Activity,
  CheckCheck,
  ListOrdered,
} from "lucide-react";
import { useState } from "react";

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

  return (
    <select
      name={`status-${paramId}`}
      id={`status-${paramId}`}
      className="p-1 border border-slate-600"
      value={option}
      onChange={handlerChange}
    >
      {orderStatus.map((opt) => (
        <option key={opt} value={opt}>
          {orderStatusRus[opt]}
        </option>
      ))}
    </select>
  );
};

const ItemsTable = ({ items }: { items: TBasketItem[] }) => {
  return (
    <div className="ml-10 w-[90%] text-xs flex gap-0.5 py-1 shadow-xl rounded-s-lg">
      <div className="w-fit max-w-50 flex flex-col gap-1 [&>div]:p-1 uppercase bg-indigo-400/75 dark:bg-indigo-800/50 text-yellow-50 rounded-s-xl">
        <div>Наименование</div>
        <div>Количество</div>
        <div>Цена</div>
      </div>
      <div className="w-[75%] overflow-x-auto flex gap-0.5 items-center">
        {items.map((itm) => (
          <div
            key={itm.documentId}
            className="flex flex-col items-start gap-1 [&>div]:border [&>div]:w-50 [&>div]:p-1 [&>div]:border-slate-300 dark:[&>div]:border-slate-600"
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
};

const TblOrderRow = ({
  paramOrder,
  index,
  className,
}: {
  paramOrder: TOrder;
  index: number;
  className: string;
}) => {
  const { title, price, items, status, updatedAt } = paramOrder;
  const [isModify, setIsModify] = useState<boolean>(false);
  const [currentStatus, setCurrentStatus] = useState<TOrderStatus>(status);
  const [showItems, setShowItems] = useState<boolean>(false);

  const handlerModify = (param: boolean, paramStatus: TOrderStatus) => {
    setIsModify(param);
    setCurrentStatus(paramStatus);
  };

  const handlerButton = () => {
    setIsModify(false);
  };

  return (
    <>
      <div
        className={cn(
          " text-xs p-1 odd:bg-slate-100/25 dark:odd:bg-stone-700/25 transition-discrete duration-200",
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
        <div className="text-center">
          <Button
            size="sm"
            variant="outline"
            isDisabled={!isModify}
            className={"text-xs active:scale-80"}
            onPress={handlerButton}
          >
            {isModify ? <CheckCheck size={12} /> : <Activity size={12} />}
            Применить
          </Button>
        </div>
      </div>
      {showItems && (
        <div
          className={cn(
            " w-[90%] col-span-5 transition-discrete duration-300 ",
            currentStatus === "delivered" &&
              " border-b-slate-800 dark:border-b-slate-400",
            currentStatus === "in-work" &&
              "border-b border-b-sky-400 dark:border-b-sky-500",
            currentStatus === "cancelled" && "border-b border-b-red-400",
            currentStatus === "success" && "border-b border-b-green-400",
          )}
        >
          <ItemsTable items={items} />
        </div>
      )}
    </>
  );
};

const TabContent = ({
  paramId,
  orders,
}: {
  paramId: string;
  orders: TOrder[];
}) => {
  //console.log(orders);

  return (
    <Tabs.Panel id={paramId}>
      <div className="max-w-125 sm:w-full sm:max-w-full overflow-auto">
        <div className="w-210 p-3 rounded-t-2xl [&>div]:text-center grid grid-cols-[35px_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-2 xl:gap-4 items-center text-xs font-bold bg-slate-200 dark:bg-slate-900">
          <div className=" -rotate-24 whitespace-nowrap text-center">№/№</div>
          <div>Заказ</div>
          <div>Цена</div>
          <div>Статус</div>
          <div>Дата</div>
          <div>Действия</div>
        </div>
        {paramId === "inWork" &&
          orders.map((order, index) => (
            <TblOrderRow
              key={order.id}
              paramOrder={order}
              index={index}
              className="w-210 grid grid-cols-[35px_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-2 xl:gap-4 items-center"
            />
          ))}
      </div>
      <p>text- {paramId}</p>
    </Tabs.Panel>
  );
};

const OrdersWithTabs = ({ ordersInWork }: { ordersInWork: TOrder[] }) => {
  const isMobile = useIsMobile();
  const [sectionKey, setSectionKey] = useState<Key>(tabsList[0].docId);

  //console.log(sectionKey);

  return (
    <div className="w-full max-w-240 py-2 px-1">
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
        {tabsList.map((tb) => (
          <TabContent key={tb.id} paramId={tb.docId} orders={ordersInWork} />
        ))}
      </Tabs>
    </div>
  );
};

export default OrdersWithTabs;
