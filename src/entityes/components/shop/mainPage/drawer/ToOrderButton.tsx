import { useBasket } from "@/shared/store/basketStore";
import { TOrder, useOrdersStorage } from "@/shared/store/orderStore";
import { TBasketItem } from "@/shared/types/main_types";
import { Button } from "@heroui/react";
import { LucideListOrdered } from "lucide-react";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

const ToOrderButton = () => {
  const { inOrder, mapToArray, totalOrderPrice, deleteItem } = useBasket(
    useShallow((state) => state),
  );
  const [disabled, setDisabled] = useState<boolean>(!inOrder());
  const ordersSt = useOrdersStorage();

  const handlerButton = () => {
    setDisabled(true);
    try {
      const baskets: TBasketItem[] = mapToArray().filter(
        (filtered) => filtered.inOrder === true,
      );
      const newOrder: TOrder = {
        id: crypto.randomUUID(),
        title: " new Order",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        price: totalOrderPrice(),
        status: "created",
        items: baskets,
      };
      //Записать в заказ данные из корзины. Обновить данные в корзине.
      ordersSt.addOrder(newOrder);
      //Удалить из корзины товары, добавленные в заказ
      baskets.forEach((item) => deleteItem(item));
    } catch (err: unknown) {
      console.log((err as Error).message);
    } finally {
      setDisabled(!inOrder());
    }
  };

  useEffect(() => {
    setDisabled(!inOrder());
  }, [inOrder()]);

  return (
    <Button
      size="sm"
      variant="primary"
      className={"w-fit mx-auto"}
      isDisabled={disabled}
      onPress={handlerButton}
    >
      <LucideListOrdered size={20} strokeWidth={2} />
      Заказать
    </Button>
  );
};

export default ToOrderButton;
