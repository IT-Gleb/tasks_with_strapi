"use client";

import {
  isTBasketItem,
  TBasketStore,
  useBasket,
} from "@/shared/store/basketStore";
import type { TBasketItem, TGoodItem } from "@/shared/types/main_types";
import { Label, NumberField } from "@heroui/react";
import { memo, useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

// const hasItem = state.getItem(goodItem.documentId);
//       //console.log("hasItem - ", hasItem);

//       if (hasItem !== null && hasItem !== undefined) {
//         value !== hasItem.count
//           ? setValue(hasItem.count)
//           : value !== 0
//             ? setValue(value)
//             : deleteItem(goodItem.documentId);
//       }

const Step = 1;

const InBasket = memo(({ goodItem }: { goodItem: TGoodItem | TBasketItem }) => {
  const [value, setValue] = useState<number>(
    isTBasketItem(goodItem) ? (goodItem as TBasketItem).count : 0,
  );
  const { setItem, deleteItem } = useBasket(useShallow((state) => state));

  useEffect(() => {
    const unsubscribe = useBasket.subscribe((state: TBasketStore) => {
      const goodId = goodItem.documentId;
      const inBasket = state.inBasket(goodId);
      const hasItem = state.getItem(goodId);

      if (hasItem && inBasket) {
        //console.log(hasItem?.documentId);

        setValue(hasItem.count);
      } else {
        setValue(0);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handlerValue = () => {
    // setValue((prev) => (prev = prev + Step));
    const goodInBasket: TBasketItem = {
      documentId: goodItem.documentId,
      title: goodItem.title,
      price: goodItem.price,
      count: value,
      inOrder: false,
    };

    //Установить количество в корзине
    if (value > 0) {
      setItem(goodInBasket);
    }
  };

  const handlerValueChange = (newValue: number) => {
    setValue(newValue);

    const goodInBasket: TBasketItem = {
      documentId: goodItem.documentId,
      title: goodItem.title,
      price: goodItem.price,
      count: newValue,
      inOrder: false,
    };

    // Проверяем, равен ли новый результат нулю
    if (newValue === 0) {
      //console.log("Значение опустилось до 0!");

      //console.log("---From del---");
      // Здесь ваш код (например, триггер события, алерт или удаление товара из корзины)
      deleteItem(goodInBasket.documentId);
    }
  };

  return (
    <Label>
      <span className="text-xs group-hover:text-green-100 group-active:text-green-100">
        В корзину
      </span>
      <NumberField
        aria-label="Item in basket"
        value={value}
        onChange={handlerValueChange}
        step={Step}
        minValue={0}
        maxValue={50}
        defaultValue={value}
        className={"scale-80"}
      >
        <NumberField.Group>
          <NumberField.DecrementButton onPress={handlerValue} />
          <NumberField.Input />
          <NumberField.IncrementButton onPress={handlerValue} />
        </NumberField.Group>
      </NumberField>
    </Label>
  );
});

export default InBasket;
