"use client";

import { TGoodItem } from "@/shared/types/main_types";
import { forwardRef, MouseEvent, Ref } from "react";
import { cn } from "@heroui/styles";
import { SERVER_URL } from "@/shared/utils/consts";
import InBasket from "./InBasket";

const NewGoodItemCard = forwardRef(
  (
    {
      good,
      index,
      activeIndex,
      onClick,
    }: {
      good: TGoodItem;
      index: number;
      activeIndex: number;
      onClick: (evt: MouseEvent<HTMLDivElement>, index: number) => void;
    },
    ref: Ref<HTMLDivElement>,
  ) => {
    const { picture, title, description, initialprice, price, discount } = good;
    return (
      <div
        ref={ref}
        className={cn(
          "group w-50 h-110 overflow-hidden relative bg-green-400 dark:bg-blue-500 rounded-t-3xl text-xs transition-discrete duration-200 p-2 hover:bg-green-700 hover:text-green-200 dark:hover:bg-blue-800 ",
          index === activeIndex
            ? "bg-green-700 text-green-200 dark:bg-blue-800 "
            : "",
        )}
        onClick={(e) => onClick(e, index)}
      >
        {discount > 0 && (
          <div className="w-full absolute z-10 p-3 text-center rotate-45 left-[30%] transition-discrete duration-200 bg-rose-500 dark:bg-green-700 text-yellow-200 group-hover:bg-amber-700 group-active:bg-amber-700">
            Скидка
          </div>
        )}

        <div className="w-44 h-48 mx-auto rounded-t-3xl object-cover object-center overflow-hidden ">
          <picture>
            <source
              srcSet={`${SERVER_URL}${picture[0].url}`}
              className=" w-full h-full transition-discrete duration-200 group-hover:scale-120 group-active:scale-120"
            />
            <img
              src="/globe.svg"
              loading="lazy"
              fetchPriority="low"
              decoding="async"
              className="w-full h-full transition-discrete duration-200 group-hover:scale-120 group-active:scale-120"
            />
          </picture>
        </div>
        <article className="p-1 h-[56%] flex flex-col group-hover:bg-green-700 group-active:bg-green-700 dark:group-hover:bg-blue-800 dark:group-active:bg-blue-800 ">
          <span className="text-2xl text-center font-semibold">
            {Intl.NumberFormat("ru-RU", {
              style: "currency",
              currency: "RUB",
            }).format(price)}
          </span>
          <span
            className={cn(
              " text-sm text-center line-through text-gray-600/75 dark:text-gray-300/75",
              index === activeIndex ? "text-white/80 dark:text-white/80" : "",
            )}
          >
            {discount === 0
              ? " "
              : Intl.NumberFormat("ru-RU", {
                  style: "currency",
                  currency: "RUB",
                }).format(initialprice)}
          </span>
          <span className="p-2  text-sm font-semibold">{title}</span>
          <p className="h-16 indent-2 line-clamp-4 first-letter:uppercase ">
            {description}
          </p>
          <span className="inline-block flex-1 place-content-end ">
            <InBasket goodItem={good} />
          </span>
        </article>
      </div>
    );
  },
);

export default NewGoodItemCard;
