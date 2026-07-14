"use client";

import { useMediaQuery } from "@heroui/react";

export const useIsMobile = () => {
  const isMobile = useMediaQuery(" screen and (200px < width <= 768px)");

  return isMobile;
};
