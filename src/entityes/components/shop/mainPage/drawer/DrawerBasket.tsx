"use client";

import { Loader } from "lucide-react";
import dynamic from "next/dynamic";

const DrawerBasket = dynamic(async () => await import("./BasketDrawer"), {
  ssr: false,
  loading: () => <Loader size={20} className="animate-spin" />,
});

export default DrawerBasket;
