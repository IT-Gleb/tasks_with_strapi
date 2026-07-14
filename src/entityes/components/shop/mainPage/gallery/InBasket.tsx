"use client";

import {
  isTBasketItem,
  TBasketItem,
  useBasket,
} from "@/shared/store/basketStore";
import { TGoodItem } from "@/shared/types/main_types";
import { Label, NumberField } from "@heroui/react";
import { memo, useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

const InBasket = memo(({ goodItem }: { goodItem: TGoodItem | TBasketItem }) => {
  const [value, setValue] = useState<number>(
    isTBasketItem(goodItem) ? (goodItem as TBasketItem).count : 0,
  );
  const { setItem, deleteItem, inBasket } = useBasket(
    useShallow((state) => state),
  );

  useEffect(() => {
    const unsubscribe = useBasket.subscribe((state) => {
      const hasItem = state.getItem(goodItem.documentId);
      hasItem !== null ? setValue(hasItem.count) : setValue(0);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    let isWork: boolean = true;
    if (isWork) {
      const goodInBasket: TBasketItem = {
        documentId: goodItem.documentId,
        title: goodItem.title,
        price: goodItem.price,
        count: value,
        inOrder: false,
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
    <Label>
      <span className="text-xs group-hover:text-green-100 group-active:text-green-100">
        В корзину
      </span>
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
    </Label>
  );
});

export default InBasket;
