"use client";
import { useMediaQuery } from "@heroui/react";
import { stagger } from "motion";
import * as motion from "motion/react-client";
import { useMemo, useState } from "react";
import { THeroImage } from "@/shared/types/main_types";
import { SERVER_URL } from "@/shared/utils/consts";

const ImageAnimo = {
  active: {
    x: [-1200, 120, 0],
    transition: { delay: stagger(0.35, { startDelay: 0.2 }) },
  },
};

const RoundImage = ({
  url,
  borderColor,
  index = 0,
  direction_animate,
}: {
  url: string;
  borderColor: string;
  index: number;
  direction_animate: "right" | "top";
}) => {
  return direction_animate === "right" ? (
    <motion.div
      className={`w-28 h-28 rounded-full overflow-hidden object-cover object-center p-0 border-6 ${borderColor}`}
      initial={{ x: -1200 }}
      animate={{ x: [-1200, 120, 0] }}
      transition={{ delay: 0.15 * (index + 1) }}
    >
      <img
        src={url}
        loading="lazy"
        fetchPriority="high"
        decoding="async"
        className="w-full h-full"
      />
    </motion.div>
  ) : (
    <motion.div
      className={`w-36 h-28 rounded-2xl overflow-hidden object-cover object-center shadow-lg border-6 ${borderColor}`}
      initial={{ y: -1000 }}
      animate={{ y: [1000, -120, 0] }}
      transition={{ delay: 0.08 * (index + 1) }}
    >
      <img
        src={url}
        loading="lazy"
        fetchPriority="high"
        decoding="async"
        className="w-full h-full"
      />
    </motion.div>
  );
};

const HeroComp = ({
  text,
  paramTopImages,
  paramBottomImages,
}: {
  text: string;
  paramTopImages: THeroImage[];
  paramBottomImages: THeroImage[];
}) => {
  const isMobile = useMediaQuery(" screen and (200px < width <= 768px)");

  const img1 = useMemo<THeroImage[]>(() => {
    if (isMobile) {
      return paramTopImages.slice(0, 3);
    }
    return paramTopImages;
  }, [isMobile]);

  const img2 = useMemo<THeroImage[]>(() => {
    if (isMobile) {
      return paramBottomImages.slice(0, 2);
    }
    return paramBottomImages;
  }, [isMobile]);

  return (
    <div className="mt-5 w-full min-h-100 bg-green-100 dark:bg-blue-950 transition-discrete duration-300 rounded-t-3xl overflow-hidden">
      <div className="w-full h-auto backlines relative z-1">
        <div className="absolute z-2 left-1 sm:left-10 top-10 flex gap-x-4 flex-nowrap items-center justify-evenly">
          {img1
            .map((item, index) => (
              <RoundImage
                key={item.documentId}
                url={SERVER_URL + item.url}
                borderColor="border-green-400/50 dark:border-blue-400/50"
                index={index}
                direction_animate="right"
              />
            ))
            .reverse()}
        </div>
        <div className="ml-auto w-55 h-55 bg-radial-[at_100%_0%] from-green-500/30 dark:from-blue-300/25 to-transparent to-72%"></div>
        <motion.h4
          className="w-fit mx-auto p-1 uppercase text-2xl lg:text-4xl font-semibold text-amber-900 dark:text-amber-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, ease: "easeInOut", duration: 0.5 }}
        >
          {text}
        </motion.h4>
        <div className="absolute z-2 right-2 lg:right-10 bottom-10 flex gap-x-4 flex-nowrap items-center justify-evenly">
          {img2.map((item, index) => (
            <RoundImage
              key={item.documentId}
              url={SERVER_URL + item.url}
              borderColor="border-green-400/50 dark:border-blue-400/50"
              index={index}
              direction_animate="top"
            />
          ))}
        </div>
        <div className="mr-auto w-55 h-55 bg-radial-[at_0%_100%] from-green-600/30 dark:from-blue-300/25 to-transparent to-72%"></div>
      </div>
    </div>
  );
};

export default HeroComp;
