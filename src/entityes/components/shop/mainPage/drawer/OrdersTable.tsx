"use client";

import { useOrdersStorage } from "@/shared/store/orderStore";
import type { TBasketItem, TOrder } from "@/shared/types/main_types";
import { orderDate, StatusMapper } from "@/shared/utils/functions";
import { Accordion, Button, Popover, useMediaQuery } from "@heroui/react";

import { useQuery } from "@tanstack/react-query";
import { ArrowUpDown, ChevronDown, Loader2 } from "lucide-react";

const TableItemsOrder = ({ items }: { items: TBasketItem[] }) => {
  return (
    <article className=" flex">
      <div className="w-fit flex flex-col items-center font-bold [&>div]:w-full [&>div]:p-2 [&>div]:border dark:[&>div]:border-yellow-200/35 bg-sky-500 dark:bg-sky-800 text-yellow-100 text-xs">
        <div>№/№</div>
        <div className="h-11">Наименование</div>
        <div>Количество</div>
        <div>Цена</div>
      </div>
      <div className=" flex items-start overflow-y-hidden overflow-x-auto ">
        {items.map((itm, idx) => {
          return (
            <div
              key={itm.documentId}
              className="min-w-40 text-xs [&>div]:p-2 [&>div]:place-content-center [&>div]:border dark:[&>div]:border-yellow-200/35"
            >
              <div>{idx + 1}.</div>
              <div className="h-11">{itm.title}</div>
              <div>{itm.count}</div>
              <div>
                {Intl.NumberFormat("ru-RU", {
                  style: "currency",
                  currency: "RUB",
                }).format(itm.price * itm.count)}
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
};

const ItemsAsPopover = ({ paramOrder }: { paramOrder: TOrder }) => {
  const { title, items } = paramOrder;
  return (
    <Popover>
      <Button variant="secondary">{title}</Button>
      <Popover.Content className="min-w-75 max-w-86" placement="bottom">
        <Popover.Dialog>
          <Popover.Arrow />
          <Popover.Heading className="p-2">Составляющие заказа</Popover.Heading>
          <TableItemsOrder items={items} />
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
};

const ItemsAsAccordion = ({ paramOrder }: { paramOrder: TOrder }) => {
  const { title, items } = paramOrder;

  return (
    <Accordion className={"w-full"}>
      <Accordion.Item>
        <Accordion.Heading>
          <Accordion.Trigger>
            {title}
            <Accordion.Indicator>
              <ChevronDown />
            </Accordion.Indicator>
          </Accordion.Trigger>
        </Accordion.Heading>
        <Accordion.Panel>
          <Accordion.Body>
            <TableItemsOrder items={items} />
          </Accordion.Body>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

const OrdersTable = () => {
  const ordersSt = useOrdersStorage();
  const isMobile = useMediaQuery(" screen and (100px < width <= 1024px)");

  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ["orders", 1],
    queryFn: async () => {
      return await ordersSt.getOrders();
    },
    refetchOnMount: "always",
  });

  if (isFetching) {
    return <Loader2 size={36} className=" w-fit mx-auto animate-spin" />;
  }

  if (error) {
    return <div className="p-2 w-fit mx-auto">Ошибка загрузки данных!</div>;
  }

  const handlerUpdate = async () => {
    await refetch();
  };

  return (
    <section>
      <div className="p-1 place-content-center text-right text-xs">
        <Button
          size="sm"
          variant="primary"
          className={"active:scale-75 scale-80"}
          onPress={handlerUpdate}
        >
          <ArrowUpDown size={14} />
          Обновить
        </Button>
      </div>

      <div className="w-full p-4 rounded-t-2xl grid grid-cols-[40px_minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-x-2 items-center bg-slate-200 text-xs lg:text-sm font-bold">
        <div className="text-xs">№/№</div>
        <div>Наименование</div>
        <div>Статус</div>
        <div>Дата/Время</div>
        <div>Цена</div>
      </div>
      <div className="max-h-190 overflow-y-auto">
        {data !== null &&
          data?.map((order, index) => (
            <div
              key={order.id}
              className="w-full grid grid-cols-[40px_minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-x-2 p-1"
            >
              <div>{index + 1}</div>
              {isMobile ? (
                <ItemsAsPopover paramOrder={order} />
              ) : (
                <ItemsAsAccordion paramOrder={order} />
              )}
              <div>{StatusMapper(order)}</div>
              <div className="text-xs text-center">
                {orderDate(order.updatedAt)}
              </div>
              <div>
                {Intl.NumberFormat("ru-RU", {
                  style: "currency",
                  currency: "RUB",
                }).format(order.price)}
              </div>
            </div>
          ))}
      </div>
    </section>
  );
};

export default OrdersTable;
