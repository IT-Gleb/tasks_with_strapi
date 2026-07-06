"use client";

import { TGoodItem } from "@/shared/types/main_types";
import GoodItemCard from "./goodItemCard";
import { memo, useMemo, useState } from "react";
import { Button } from "@heroui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useElementResize } from "@/shared/hooks/custom/UseElementResize";
import { randomArrayValue } from "@/shared/utils/functions";
import { bgColors } from "@/shared/utils/consts";
import { useTheme } from "next-themes";

const startPosition = 9; //Начальная позиция
const moveValue = 120; //На какую ширину сдвинуть галлерею

const GalleryGoods = memo(({ goods }: { goods: TGoodItem[] }) => {
  // const containerRef = useRef<HTMLDivElement | null>(null);
  //const lentaRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState<number>(0);
  const [divLeft, setDivLeft] = useState<number>(startPosition);
  const [showButtons, setShowButtons] = useState<boolean>(false);
  const [containerRef, size] = useElementResize<HTMLDivElement>();
  const [lentaRef, lentaSize] = useElementResize<HTMLDivElement>();

  const [bgColor, setBgColor] = useState<string>("#000000");
  const theme = useTheme();

  const isContainerLarge = () => {
    let res: boolean = false;
    const containerWidth = size.width as number;
    const lentaWidth = lentaSize.width as number;

    res = containerWidth > lentaWidth;
    return res;
  };

  const handlerGalleryStep = (step: 1 | -1 = 1) => {
    if (isContainerLarge()) {
      return;
    }
    if (goods.length < 1) {
      return;
    }
    const valueWidth = lentaSize.width as number; //Длина ленты
    const maxCount = Math.round(valueWidth / moveValue); //Количество карточек в ленте
    const viewCount = Math.floor((size.width as number) / moveValue); //Количество карточек во вьюпорте
    let current = index;
    const maximum = Math.round(maxCount - viewCount);

    if (current >= 0 && current <= maximum) {
      current += step;
      if (current > maximum) {
        current = maximum;
      }
      if (current < 0) {
        current = 0;
      }

      setIndex(current);
      setDivLeft(
        (prev) => (prev = current === 0 ? startPosition : -current * moveValue),
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

  useMemo(() => {
    const backdiv = randomArrayValue(bgColors);
    const lt = backdiv.light;

    const dk = backdiv.dark;
    setBgColor(theme.resolvedTheme === "light" ? lt : dk);
  }, [theme]);

  //console.log(myclassName);

  return (
    <div
      ref={containerRef}
      className={
        "mt-5 w-full h-86 rounded-3xl py-2 px-3 overflow-hidden relative z-1"
      }
      style={{ backgroundColor: bgColor }}
    >
      {showButtons && (
        <div className="absolute left-1 top-[45%] z-3 ">
          <Button
            isIconOnly
            size="sm"
            variant="outline"
            className="bg-white/50 active:scale-90 dark:text-blue-950/90"
            onPress={() => handlerGalleryStep(-1)}
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
            onPress={() => handlerGalleryStep()}
          >
            <ChevronRight size={24} strokeWidth={2} />
          </Button>
        </div>
      )}
    </div>
  );
});

export default GalleryGoods;
