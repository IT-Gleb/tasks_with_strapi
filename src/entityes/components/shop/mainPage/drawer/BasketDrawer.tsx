"use client";

import { useBasket } from "@/shared/store/basketStore";
import { Badge, Button, Drawer, Typography } from "@heroui/react";
import {
  Cross,
  Loader2,
  LucideListOrdered,
  ShoppingBasket,
} from "lucide-react";
import { memo, MouseEvent, ReactNode, useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import BasketContentTabs from "./BasketContentTabs";

import useBasketHydration from "@/shared/store/HydrationStore";
import GradientLine from "@/entityes/components/ui/gradients/GradientLine";
import ToOrderButton from "./ToOrderButton";

export const BasketHydrated = ({ children }: { children: ReactNode }) => {
  const hydrate = useBasketHydration();

  if (!hydrate) {
    return <Loader2 size={18} className=" animate-spin" />;
  }
  return <>{children}</>;
};

const HydrateBasket = memo(({ children }: { children: ReactNode }) => {
  const { _hasHydrated, setData } = useBasket((state) => state);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    useBasket.persist.rehydrate();
  }, []);

  useEffect(() => {
    let isWork: boolean = true;
    setIsLoading(true);
    //console.log(isHydrated);

    if (_hasHydrated) {
      useBasket
        .getState()
        .loadFromBase()
        .then((data) => {
          if (data !== null) {
            if (isWork) {
              setData(data);
              setIsLoading(false);
            }
          }
        });

      setIsLoading(false);
      return () => {
        isWork = false;
      };
    }
  }, [_hasHydrated]);

  if (isLoading) {
    return <Loader2 size={14} className=" animate-spin" />;
  }

  return <>{children}</>;
});

const BasketDrawer = () => {
  const { length, saveToBase } = useBasket(useShallow((state) => state));
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [animation, setAnimation] = useState<string>("animate-From-left");
  const [basketCount, setBasketCount] = useState<number>(length);
  //const hydrate = useBasketHydration();

  const handlerClose = (evt: MouseEvent<Element>) => {
    evt.preventDefault();
    setAnimation("animate-From-right");
    const tm = setTimeout(() => {
      setAnimation("animate-From-left");
      setIsOpen(false);

      clearTimeout(tm);
    }, 550);
  };

  const handlerOpen = (evt: MouseEvent<Element>) => {
    evt.preventDefault();
    saveToBase();
    setIsOpen(true);
  };

  useEffect(() => {
    let isWork: boolean = true;

    if (isWork && length >= 0) {
      setBasketCount(length);
    }

    return () => {
      isWork = false;
    };
  }, [length]);

  return (
    <HydrateBasket>
      <Drawer isOpen={isOpen} onOpenChange={setIsOpen}>
        <Button
          isIconOnly
          size="md"
          variant="outline"
          onClick={handlerOpen}
          aria-label="Ваша корзина"
        >
          {basketCount > 0 && (
            <Badge variant="primary" size="sm" placement="top-right">
              {basketCount}
            </Badge>
          )}

          <ShoppingBasket size={24} strokeWidth={2} />
        </Button>
        <Drawer.Backdrop variant="blur">
          <Drawer.Dialog>
            <Drawer.Content
              placement="left"
              className={`w-[90%] xl:w-[70%] bg-white dark:bg-slate-900 z-100 flex flex-col pointer-events-auto ${animation}`}
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
                <GradientLine />
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
              <Drawer.Footer className="p-2 flex flex-col gap-y-1 text-center place-content-center">
                <GradientLine />
                <div className="w-full p-1 flex-1">
                  <ToOrderButton />
                </div>
              </Drawer.Footer>
            </Drawer.Content>
          </Drawer.Dialog>
        </Drawer.Backdrop>
      </Drawer>
    </HydrateBasket>
  );
};

export default BasketDrawer;
