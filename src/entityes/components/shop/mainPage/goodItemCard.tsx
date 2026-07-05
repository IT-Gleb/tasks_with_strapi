"use client";

import type { TGoodItem } from "@/shared/types/main_types";
import { SERVER_URL } from "@/shared/utils/consts";
import { memo, useEffect, useMemo, useState } from "react";
import * as motion from "motion/react-client";
import { useTheme } from "next-themes";

const childVariants = {
  init: {
    scale: 1,
  },
  active: {
    scale: 1.5,
    origin: 0,
    transition: { delay: 0.15 },
  },
};

const GoodItemCard = memo(({ item }: { item: TGoodItem }) => {
  const { picture, title, initialprice, price, description, discount } = item;
  const picUrl = `${SERVER_URL}${picture[0].url}`;
  const theme = useTheme();
  const [activeBgColor, setActiveBgColor] = useState<string>("#0f766e");
  const [priceWithDiscount] = useState<number>(
    discount > 0 ? initialprice - (discount * 100) / initialprice : price,
  );
  let bgColor = theme.resolvedTheme === "light" ? "#4ade80" : "#1e40af";
  let mainColor = theme.resolvedTheme === "light" ? "#000004" : "#d9f99d";

  const MainVariants = {
    init: {
      backgroundColor: bgColor,
      color: mainColor,
    },
    active: {
      backgroundColor: activeBgColor,
      color: "#065f46",
      transition: {
        //when: "beforeChildren", // Анимация родителя перед детьми
        staggerChildren: 0.1, // Задержка 0.2с перед каждым следующим ребенком
      },
    },
  };
  const childVariants2 = {
    init: {
      scale: 1,
      color: mainColor,
      //backgroundColor: bgColor,
    },
    active: {
      color: "#fefce8",
      //backgroundColor: "#1d4ed8",

      // scale: 1,
      // origin: 0,
    },
  };

  useMemo(() => {
    bgColor = theme.resolvedTheme === "light" ? "#4ade80" : "#1e40af";
    mainColor = theme.resolvedTheme === "light" ? "#000004" : "#d9f99d";
    let aBgColor = theme.resolvedTheme === "light" ? "#0f766e" : "#854d0e";
    setActiveBgColor(aBgColor);
    MainVariants.init.backgroundColor = bgColor;
    MainVariants.init.color = mainColor;
    MainVariants.active.backgroundColor = aBgColor;
    childVariants2.init.color = mainColor;
    //return mColor;
  }, [theme]);

  return (
    <motion.article
      className="w-40 h-75 p-1.5 text-xs rounded-2xl overflow-hidden relative z-1"
      variants={MainVariants}
      initial={"init"}
      whileHover={"active"}
      whileTap={"active"}
      style={{
        backgroundColor: bgColor,
        color: mainColor,
      }}
    >
      {discount > 0 && (
        <div className="absolute z-20 rotate-45 top-2 -right-8 bg-red-600 text-yellow-200 w-30 h-8 p-1 text-center ">
          Скидка
        </div>
      )}
      <motion.ul
        className="overflow-hidden rounded-2xl flex flex-col"
        variants={MainVariants}
        initial={"init"}
        whileHover={"active"}
        whileTap={"active"}
        style={{
          backgroundColor: bgColor,
          color: mainColor,
        }}
      >
        <motion.li className="rounded-2xl overflow-hidden">
          <motion.div
            className="w-full h-38 object-cover object-center"
            variants={childVariants}
          >
            <picture>
              <source srcSet={picUrl}></source>
              <img
                src="/window.swg"
                className="w-full h-full"
                decoding="async"
                fetchPriority="low"
                loading="lazy"
              />
            </picture>
          </motion.div>
        </motion.li>
        <motion.li className="relative z-5" variants={childVariants2}>
          <div className="absolute z-10 left-2 -top-6 rotate-6 ">
            <span className="w-fit text-3xl text-green-50 dark:text-blue-100 drop-shadow-[0_3px_2px_rgba(0,0,0,1)] dark:drop-shadow-[0_2px_1px_rgba(0,0,0,1)] font-semibold">
              {Intl.NumberFormat("ru-RU", {
                style: "currency",
                currency: "RUB",
              }).format(priceWithDiscount)}
            </span>
          </div>
        </motion.li>
        {discount > 0 && (
          <motion.li
            className="w-full pt-3 text-xs line-through text-center"
            variants={childVariants2}
            style={{
              //backgroundColor: bgColor,
              color: mainColor,
            }}
          >
            {Intl.NumberFormat("ru-RU", {
              style: "currency",
              currency: "RUB",
            }).format(initialprice)}
          </motion.li>
        )}

        <motion.li
          className="h-full pt-2 text-sm font-semibold"
          variants={childVariants2}
          style={{
            //backgroundColor: bgColor,
            color: mainColor,
          }}
        >
          {title}
        </motion.li>
        <motion.li
          className="h-20 pt-2 line-clamp-3"
          variants={childVariants2}
          style={{
            //backgroundColor: bgColor,
            color: mainColor,
          }}
        >
          {description}
        </motion.li>
      </motion.ul>
    </motion.article>
  );
});

export default GoodItemCard;
