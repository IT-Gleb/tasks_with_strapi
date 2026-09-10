"use client";

import { useBasket } from "@/shared/store/basketStore";
import { Button, Checkbox, cn } from "@heroui/react";
import { useState } from "react";
import { shallow, useShallow } from "zustand/shallow";
//import InBasket from "../gallery/InBasket";
import { useIsMobile } from "@/shared/hooks/custom/UseIsMobile";
import type { TBasketItem } from "@/shared/types/main_types";
import TotalOrderPrice from "./TotalOrderPrice";
import { Check, Cross, CrossIcon, SearchX } from "lucide-react";

const CheckItem = ({
  name,
  index,
  initialValue,
  handler,
}: {
  name: string;
  index: number;
  initialValue: boolean;
  handler: (param: boolean, index: number) => void;
}) => {
  const [isSelected, setIsSelected] = useState<boolean>(initialValue);

  const handlerSelected = (param: boolean) => {
    setIsSelected(param);
    handler(param, index);

    //console.log(param, name);
  };

  return (
    <Checkbox name={name} isSelected={isSelected} onChange={handlerSelected}>
      <Checkbox.Content>
        <Checkbox.Control className={"bg-slate-300 dark:bg-slate-600"}>
          <Checkbox.Indicator />
        </Checkbox.Control>
        {/* Accept terms and conditions */}
      </Checkbox.Content>
    </Checkbox>
  );
};

const BasketTable = () => {
  const { getItems, setItem, deleteItem } = useBasket(
    useShallow((state) => state),
  );
  //const [totalPrice, setTotalPrice] = useState<number>(0);
  const isMobile = useIsMobile();

  const handlerSelect = (param: boolean, index: number) => {
    //console.log(param, index);

    const t_array = getItems();
    const selectedItem: TBasketItem = t_array[index];
    selectedItem.inOrder = param;
    setItem(selectedItem);
    t_array[index] = selectedItem;
  };

  const handlerErase = (paramId: string) => {
    deleteItem(paramId);
  };

  //console.log(basketItems);

  return (
    <div className="px-4 mt-1">
      <div
        className={cn(
          "w-full grid md:grid-cols-[minmax(0,40px)_minmax(0,50px)_minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-x-2 items-center rounded-t-2xl font-bold p-1 lg:p-3 bg-slate-200 dark:bg-slate-700",
          "grid-cols-[minmax(0,20px)_minmax(0,25px)_minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]",
        )}
      >
        <div className="whitespace-nowrap p-1 scale-x-80 -rotate-45">
          {isMobile ? <SearchX size={12} className="mx-auto" /> : "№/№"}
        </div>
        <div className=" whitespace-nowrap p-1 scale-x-80 -rotate-45">
          {isMobile ? <Check size={12} className="mx-auto" /> : "В заказ"}
        </div>
        <div>{isMobile ? "На-ие" : "Наименование"}</div>
        <div className="text-center">Цена</div>
        <div className="text-center">{isMobile ? "Кол-во" : "Количество"}</div>
        <div className="text-center">Итог</div>
        <div className="text-center">
          {isMobile ? (
            <CrossIcon size={12} className="-rotate-45 mx-auto" />
          ) : (
            "Удалить"
          )}
        </div>
      </div>
      {getItems().map((item, index) => {
        return (
          <div
            key={item.documentId}
            className={cn(
              "w-full grid md:grid-cols-[minmax(0,40px)_minmax(0,50px)_minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-2 items-center p-1 lg:p-2 odd:bg-slate-100/50 dark:odd:bg-slate-700/50",
              "grid-cols-[minmax(0,20px)_minmax(0,25px)_minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]",
            )}
          >
            <div className="text-center">{index + 1}.</div>
            <div className="w-fit mx-auto">
              <CheckItem
                name={`selected-${index + 1}`}
                index={index}
                initialValue={item.inOrder as boolean}
                handler={handlerSelect}
              />
            </div>
            <div>{item.title}</div>
            <div className="text-right">
              {Intl.NumberFormat("ru-RU", {
                style: "currency",
                currency: "RUB",
              }).format(item.price)}
            </div>
            <div className="text-center">{item.count}</div>
            <div className="text-right">
              {Intl.NumberFormat("ru-RU", {
                style: "currency",
                currency: "RUB",
              }).format(item.price * item.count)}
            </div>
            <div className="text-center text-xs">
              <Button
                size="sm"
                variant="danger"
                isIconOnly={isMobile}
                className={"text-xs scale-90 active:scale-80"}
                onPress={() => handlerErase(item.documentId)}
              >
                <Cross size={10} className="rotate-45" />
                {isMobile ? "" : "Удалить"}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BasketTable;
