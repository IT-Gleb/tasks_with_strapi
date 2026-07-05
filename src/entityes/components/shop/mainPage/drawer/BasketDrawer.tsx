"use client";

import { Button, Drawer, Typography } from "@heroui/react";
import { Cross, ShoppingBasket } from "lucide-react";
import { MouseEvent, useState } from "react";

const BasketDrawer = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [animation, setAnimation] = useState<string>("animate-From-left");

  const handlerClose = (evt: MouseEvent<Element>) => {
    evt.preventDefault();
    setAnimation("animate-From-right");
    const tm = setTimeout(() => {
      setIsOpen(false);
      setAnimation("animate-From-left");
      clearTimeout(tm);
    }, 700);
  };

  return (
    <Drawer isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button
        isIconOnly
        size="sm"
        variant="outline"
        onPress={() => setIsOpen(!isOpen)}
        aria-label="Ваша корзина"
      >
        <ShoppingBasket size={18} strokeWidth={2} />
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
              jhj fhgjfhjh jf hgjfhgj
            </Drawer.Body>
            <Drawer.Footer></Drawer.Footer>
          </Drawer.Content>
        </Drawer.Dialog>
      </Drawer.Backdrop>
    </Drawer>
  );
};

export default BasketDrawer;
