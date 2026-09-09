"use client";

import { useBasket } from "@/shared/store/basketStore";
import { Badge, Button, Drawer, Typography } from "@heroui/react";
import { Cross, Loader2, ShoppingBasket } from "lucide-react";
import {
  MouseEvent,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { useShallow } from "zustand/shallow";
import BasketContentTabs from "./BasketContentTabs";

import GradientLine from "@/entityes/components/ui/gradients/GradientLine";
import ToOrderButton from "./ToOrderButton";
import UpdateStatusInDB from "@/shared/store/UpdateStatusOrder";

const HydrateBasket = ({ children }: { children: ReactNode }) => {
  const { _hasHydrated, setHasHydrated } = useBasket((state) => state);

  useEffect(() => {
    const hydrate = async () => {
      // Принудительно поднимаем данные из IndexedDB в память
      await useBasket.persist.rehydrate();
      setHasHydrated(true);
    };
    hydrate();
  }, []);

  if (!_hasHydrated) {
    return <Loader2 size={14} className=" animate-spin" />;
  }

  return <>{children}</>;
};

const BasketDrawer = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { length, goods } = useBasket(useShallow((state) => state));

  const [animation, setAnimation] = useState<string>("animate-From-left");
  const [basketCount, setBasketCount] = useState<number>(length);
  const [showButton, setShowButton] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  //const hydrate = useBasketHydration();

  const handlerTabs = (param: boolean) => {
    setShowButton(param);
  };

  const handlerClose = (evt: MouseEvent<Element>) => {
    evt.preventDefault();
    setAnimation("animate-From-right");
    const tm = setTimeout(() => {
      setAnimation("animate-From-left");
      setShowButton(true);
      setIsOpen(false);

      clearTimeout(tm);
    }, 550);
  };

  const handlerOpen = (evt: MouseEvent<Element>) => {
    evt.preventDefault();

    setIsOpen(true);
  };

  useLayoutEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    const c_tmp = length();
    // console.log(c_tmp);

    setBasketCount(c_tmp);
  }, [goods, length]);

  if (!isMounted) {
    return null;
  }

  return (
    <HydrateBasket>
      <Drawer isOpen={isOpen} onOpenChange={setIsOpen}>
        <Button
          isIconOnly
          size="md"
          variant="outline"
          onClick={handlerOpen}
          aria-label="Ваша корзина"
          className={"w-13 h-7 rounded-full"}
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
              className={` xl:w-[70%] bg-white dark:bg-slate-900 z-100 flex flex-col pointer-events-auto ${animation}`}
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
                <BasketContentTabs handler={handlerTabs} />
              </Drawer.Body>
              <Drawer.Footer className="p-2 flex flex-col gap-y-1 text-center place-content-center">
                <GradientLine />
                <div className="w-full p-1 flex-1">
                  {showButton && <ToOrderButton />}
                </div>
              </Drawer.Footer>
            </Drawer.Content>
          </Drawer.Dialog>
        </Drawer.Backdrop>
      </Drawer>
      <UpdateStatusInDB />
    </HydrateBasket>
  );
};

export default BasketDrawer;
