"use client";

import { type TBasketItem, useBasket } from "@/shared/store/basketStore";
import { Checkbox } from "@heroui/react";
import { memo, useState } from "react";
import { useShallow } from "zustand/shallow";
//import InBasket from "../gallery/InBasket";
import { useIsMobile } from "@/shared/hooks/custom/UseIsMobile";
import TotalOrderPrice from "./TotalOrderPrice";

const CheckItem = ({
  name,
  index,
  handler,
}: {
  name: string;
  index: number;
  handler: (param: boolean, index: number) => void;
}) => {
  const [isSelected, setIsSelected] = useState<boolean>(false);

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

const BasketTable = memo(() => {
  const mapToArray = useBasket(useShallow((state) => state.mapToArray));
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const isMobile = useIsMobile();

  const handlerSelect = (param: boolean, index: number) => {
    //console.log(param, index);

    const t_array = mapToArray();
    //Сначала посчитать общую стоимость
    let total = 0;
    //Вычесть неактивные данные
    t_array.forEach((item, indx) => {
      if (indx === index && param === false) {
        total -= item.price * item.count;
      }
      if (indx === index && param) {
        total += item.price * item.count;
      }
    });
    if (totalPrice === 0 && total < 0) {
      total = 0;
    }
    setTotalPrice(totalPrice + total);
  };

  return (
    <div className="px-4 mt-1">
      <div className="w-full grid grid-cols-[60px_2fr_1fr_1fr_1fr] gap-x-2 items-center rounded-t-2xl font-bold p-3 bg-slate-200 dark:bg-slate-700">
        <div>В заказ</div>
        <div>{isMobile ? "На-ие" : "Наименование"}</div>
        <div className="text-center">Цена</div>
        <div className="text-center">{isMobile ? "Кол-во" : "Количество"}</div>
        <div className="text-center">Итог</div>
      </div>
      {mapToArray().map((item, index) => {
        return (
          <div
            key={item.documentId}
            className="w-full grid grid-cols-[60px_2fr_1fr_1fr_1fr] gap-2 items-center p-2 odd:bg-slate-200/50 dark:odd:bg-slate-700"
          >
            <div className="w-fit mx-auto">
              <CheckItem
                name={`selected-${index + 1}`}
                index={index}
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
          </div>
        );
      })}
    </div>
  );
});

export default BasketTable;
