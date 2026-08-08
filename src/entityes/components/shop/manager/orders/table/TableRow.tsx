"use client";

import { memo, useState } from "react";
import ItemsTable from "./OrderItemsTable";
import StatusOptions from "./StatusOptions";
import type { TOrder, TOrderStatus } from "@/shared/types/main_types";
import useOrdersListModify from "@/shared/store/ordersToModifyStore";
import { usePaginationContext } from "@/shared/hooks/custom/UsePaginationContext";
import { cn } from "@heroui/styles";
import { Button } from "@heroui/react";
import { ListOrdered } from "lucide-react";

//Строка в таблице со статусом и кнопкой для показа продуктов

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
    const { currentPage, pageSize } = usePaginationContext();

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
          <div className="hidden md:block text-right">
            {currentPage === 1
              ? index + 1
              : index + pageSize * (currentPage - 1) + 1}
            .
          </div>
          <div className=" whitespace-nowrap">
            <Button
              variant="outline"
              size="sm"
              onPress={() => {
                setShowItems((prev) => !prev);
              }}
              className={cn(
                " border-sky-500 ",
                showItems === true && "bg-stone-200 dark:bg-stone-700",
                paramOrder.status === "success" && "border-green-500",
                paramOrder.status === "cancelled" && "border-rose-500",
              )}
            >
              <ListOrdered size={10} />
              {title}
            </Button>
          </div>
          <div className=" text-right">
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
          <div className="hidden md:block text-right whitespace-nowrap line-clamp-1">
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

export default TblOrderRow;
