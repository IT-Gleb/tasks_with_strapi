"use client";

import { TGoodItem } from "@/shared/types/main_types";
import GoodItemCard from "./goodItemCard";
import { memo, useMemo, useRef, useState } from "react";
import { Button } from "@heroui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useElementResize } from "@/shared/hooks/custom/UseElementResize";

const moveValue = 95; //На какую ширину сдвинуть галлерею
const startPosition = 9; //Начальная позиция

const GalleryGoods = memo(
  ({
    goods,
    myclassName = "",
  }: {
    goods: TGoodItem[];
    myclassName?: string;
  }) => {
    // const containerRef = useRef<HTMLDivElement | null>(null);
    const lentaRef = useRef<HTMLDivElement | null>(null);
    const [index, setIndex] = useState<number>(0);
    const [divLeft, setDivLeft] = useState<number>(startPosition);
    const [showButtons, setShowButtons] = useState<boolean>(false);
    const [containerRef, size] = useElementResize<HTMLDivElement>();

    const isContainerLarge = () => {
      let res: boolean = false;
      const containerWidth = size.width as number;
      const lentaWidth = lentaRef.current?.clientWidth as number;

      res = containerWidth > lentaWidth;
      return res;
    };

    const handlerRight = () => {
      if (isContainerLarge()) {
        return;
      }
      const maxCount = goods.length;
      if (maxCount < 1) {
        return;
      }
      let current = index;

      if (current >= 0 && current < maxCount) {
        current++;
        if (current >= maxCount) {
          current = maxCount - 1;
        }

        setIndex(current);
        setDivLeft(
          (prev) =>
            (prev = current === 0 ? startPosition : -current * moveValue),
        );
      }
    };

    const handlerLeft = () => {
      if (isContainerLarge()) {
        return;
      }
      const maxCount = goods.length;
      if (maxCount < 1) {
        return;
      }
      let current = index;

      if (current >= 0 && current < maxCount) {
        current--;
        if (current <= 0) {
          current = 0;
        }

        setIndex(current);
        setDivLeft(
          (prev) =>
            (prev = current === 0 ? startPosition : -current * moveValue),
        );
      }
    };

    useMemo(() => {
      //console.log(index, divLeft);
      lentaRef.current?.setAttribute("style", `left:${divLeft}px`);
    }, [index, divLeft]);

    useMemo(() => {
      setShowButtons(!isContainerLarge());
    }, [size]);

    return (
      <div
        ref={containerRef}
        className={
          myclassName !== ""
            ? `mt-5 w-full h-80 rounded-3xl py-2 px-3 overflow-hidden relative z-1 ${myclassName}`
            : "mt-5 w-full h-80 rounded-3xl py-2 px-3 overflow-hidden relative z-1 bg-yellow-200/50 dark:bg-green-900/20"
        }
      >
        {showButtons && (
          <div className="absolute left-1 top-[45%] z-3 ">
            <Button
              isIconOnly
              size="sm"
              variant="outline"
              className="bg-white/50 active:scale-90 dark:text-blue-950/90"
              onPress={handlerLeft}
            >
              <ChevronLeft size={24} strokeWidth={2} />
            </Button>
          </div>
        )}

        <div
          ref={lentaRef}
          className="w-fit flex items-center gap-x-3 absolute left-2 top-2 z-2 transition-discrete duration-200"
        >
          {goods.map((good) => {
            return <GoodItemCard key={good.documentId} item={good} />;
          })}
        </div>
        {showButtons && (
          <div className="absolute right-1 top-[45%] z-3 text-default">
            <Button
              isIconOnly
              size="sm"
              variant="outline"
              className="bg-white/50 active:scale-90 dark:text-blue-950/90"
              onPress={handlerRight}
            >
              <ChevronRight size={24} strokeWidth={2} />
            </Button>
          </div>
        )}
      </div>
    );
  },
);

export default GalleryGoods;
