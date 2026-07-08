"use client";

import { useBasket } from "@/shared/store/basketStore";
import { Badge, Button, Drawer, Typography } from "@heroui/react";
import { Cross, LucideListOrdered, ShoppingBasket } from "lucide-react";
import { memo, MouseEvent, useState } from "react";
import { useShallow } from "zustand/shallow";
import BasketContentTabs from "./BasketContentTabs";

const BasketDrawer = memo(() => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [animation, setAnimation] = useState<string>("animate-From-left");

  const basketCount = useBasket(useShallow((state) => state.length));

  const handlerClose = (evt: MouseEvent<Element>) => {
    evt.preventDefault();
    setAnimation("animate-From-right");
    const tm = setTimeout(() => {
      setAnimation("animate-From-left");
      setIsOpen(false);

      clearTimeout(tm);
    }, 700);
  };

  return (
    <Drawer isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button
        isIconOnly
        size="md"
        variant="outline"
        onPress={() => setIsOpen(!isOpen)}
        aria-label="Ваша корзина"
      >
        <Badge variant="primary" size="sm" placement="top-right">
          {basketCount === 0 ? "" : basketCount}
        </Badge>
        <ShoppingBasket size={24} strokeWidth={2} />
      </Button>
      <Drawer.Backdrop variant="blur">
        <Drawer.Dialog>
          <Drawer.Content
            placement="left"
            className={`w-[90%] lg:w-[50%] bg-white dark:bg-slate-900 z-100 flex flex-col pointer-events-auto ${animation}`}
          >
            <Drawer.Header>
              <div className="w-full p-2 flex gap-x-2 items-center justify-between">
                <Typography type="h4">Ваша корзина</Typography>
                <Button
                  isIconOnly
                  size="sm"
                  variant="ghost"
                  onClick={handlerClose}
                >
                  <Cross size={14} className="rotate-45" />
                </Button>
              </div>
            </Drawer.Header>
            <Drawer.Body
              className="p-2"
              onClick={(e) => {
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
              }}
            >
              <BasketContentTabs />
            </Drawer.Body>
            <Drawer.Footer className="p-2 text-center place-content-center">
              <Button size="sm" variant="primary" className={"w-fit mx-auto"}>
                <LucideListOrdered size={20} strokeWidth={2} />
                Заказать
              </Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Dialog>
      </Drawer.Backdrop>
    </Drawer>
  );
});

export default BasketDrawer;
