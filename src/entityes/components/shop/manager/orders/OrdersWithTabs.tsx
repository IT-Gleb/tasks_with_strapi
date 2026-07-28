"use client";

import { useIsMobile } from "@/shared/hooks/custom/UseIsMobile";
import type { TOrder } from "@/shared/types/main_types";
import { Key, Tabs } from "@heroui/react";
import { Check, X, Plus } from "lucide-react";
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
    mobileLabel: "Отм...",
    icon: <X size={14} />,
  },
];

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
      {paramId === "inWork" &&
        orders.map((order, index) => (
          <div
            key={order.id}
            className="w-full max-w-210 text-xs p-1 grid grid-cols-[35px_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.5fr)] gap-2 xl:gap-4 items-center odd:bg-slate-100 dark:odd:bg-stone-700"
          >
            <div className="text-right">{index + 1}.</div>
            <div>{order.title}</div>
            <div className="text-right">
              {Intl.NumberFormat("ru-RU", {
                style: "currency",
                currency: "RUB",
              }).format(order.price)}
            </div>
            <div className="text-center">{order.status}</div>
            <div className="text-right whitespace-nowrap line-clamp-1">
              {Intl.DateTimeFormat("ru-RU", {
                timeZone: "Europe/Moscow",
                dateStyle: "short",
                timeStyle: "medium",
              }).format(new Date(order.updatedAt))}
            </div>
          </div>
        ))}
      <p>text- {paramId}</p>
    </Tabs.Panel>
  );
};

const OrdersWithTabs = ({ ordersInWork }: { ordersInWork: TOrder[] }) => {
  const isMobile = useIsMobile();
  const [sectionKey, setSectionKey] = useState<Key>(tabsList[0].docId);

  //console.log(sectionKey);

  return (
    <div className="w-full max-w-240 md:p-1">
      <Tabs
        orientation={isMobile ? "vertical" : "horizontal"}
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
