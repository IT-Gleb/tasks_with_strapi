"use client";

import { TGoodItem } from "@/shared/types/main_types";
import { cn } from "@heroui/styles";
import NewGoodItemCard from "./newGoodItemCard";
import { useCallback, useRef, useState } from "react";
import { Button } from "@heroui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }

const NewGalleryGoods = ({
  goods,
  className = [],
}: {
  goods: TGoodItem[];
  className?: string[];
}) => {
  const goodsRef = useRef<HTMLDivElement[]>([]);
  // Функция сохранения рефа
  const registerRef = useCallback((element: HTMLDivElement, index: number) => {
    if (element) {
      goodsRef.current[index] = element;
    }
  }, []);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const handlerActiveIndex = (param: -1 | 1) => {
    let current: number = activeIndex;
    current += param;
    if (current < 0) {
      current = goods.length - 1;
    }
    if (current > goods.length - 1) {
      current = 0;
    }

    goodsRef.current[current].scrollIntoView({
      block: "nearest",
      behavior: "smooth",
      inline: "nearest",
    });
    setActiveIndex(current);
  };

  return (
    <div className="w-full px-2 relative z-1">
      <Button
        isIconOnly
        variant="outline"
        size="sm"
        onPress={() => handlerActiveIndex(-1)}
        className={
          "absolute z-20 top-[45%] left-2 scale-90 bg-slate-500/60 dark:bg-green-800 active:bg-red-400 active:scale-80 "
        }
      >
        <ChevronLeft size={18} />
      </Button>
      <div
        className={cn("mt-2.5 w-full min-h-100 rounded-3xl p-2", ...className)}
      >
        <div className="w-[96%] h-[96%] mx-auto overflow-x-auto scrollbar-none overflow-y-hidden">
          <div className="w-fit flex gap-x-2 items-start">
            {goods.map((item, index) => (
              <NewGoodItemCard
                ref={(el: HTMLDivElement) => registerRef(el, index)}
                key={item.documentId}
                index={index}
                good={item}
                activeIndex={activeIndex}
              />
            ))}
          </div>
        </div>
      </div>
      <Button
        isIconOnly
        variant="outline"
        size="sm"
        onPress={() => handlerActiveIndex(1)}
        className={
          "absolute z-20 top-[45%] right-2 scale-90 bg-slate-500/60 dark:bg-green-800 active:bg-red-400 active:scale-80 "
        }
      >
        <ChevronRight size={18} />
      </Button>
    </div>
  );
};

export default NewGalleryGoods;
