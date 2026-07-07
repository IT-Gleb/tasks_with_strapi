"use client";

import { TBasketItem, useBasket } from "@/shared/store/basketStore";
import { TGoodItem } from "@/shared/types/main_types";
import { NumberField } from "@heroui/react";
import { memo, useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

const InBasket = memo(({ goodItem }: { goodItem: TGoodItem }) => {
  const [value, setValue] = useState<number>(0);
  const { setItem, deleteItem, inBasket } = useBasket(
    useShallow((state) => state),
  );

  useEffect(() => {
    let isWork: boolean = true;
    if (isWork) {
      const goodInBasket: TBasketItem = {
        documentId: goodItem.documentId,
        title: goodItem.title,
        price: goodItem.price,
        count: value,
      };
      //если есть в корзине
      if (inBasket(goodInBasket.documentId) && value === 0) {
        deleteItem(goodInBasket);
      }
      //Установить количество в корзине
      if (value > 0) {
        setItem(goodInBasket);
      }
    }
    return () => {
      isWork = false;
    };
  }, [value]);

  return (
    <NumberField
      aria-label="Item in basket"
      value={value}
      onChange={setValue}
      step={1}
      minValue={0}
      maxValue={50}
      defaultValue={value}
      className={"scale-80"}
    >
      <NumberField.Group>
        <NumberField.DecrementButton />
        <NumberField.Input />
        <NumberField.IncrementButton />
      </NumberField.Group>
    </NumberField>
  );
});

export default InBasket;
