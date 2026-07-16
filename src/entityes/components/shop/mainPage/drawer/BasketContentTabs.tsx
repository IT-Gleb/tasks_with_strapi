"use client";

import { Tabs } from "@heroui/react";
import BasketTable from "./BasketTable";
import { memo } from "react";
import TotalOrderPrice from "./TotalOrderPrice";
//import OrdersTable from "./OrdersTable";
import dynamic from "next/dynamic";

const OrdersTblDyn = dynamic(() => import("./OrdersTable"), { ssr: false });

const BasketContentTabs = memo(() => {
  return (
    <Tabs className="p-1 w-full">
      <Tabs.ListContainer>
        <Tabs.List aria-label="Значения в корзине">
          <Tabs.Tab id="items">
            Продукты
            <Tabs.Indicator />
          </Tabs.Tab>
          <Tabs.Tab id="orders">
            Заказы
            <Tabs.Indicator />
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.ListContainer>
      <Tabs.Panel className="pt-4" id="items">
        <div className="max-h-130 lg:max-h-180 overflow-y-auto">
          <BasketTable />
        </div>
        <TotalOrderPrice />
      </Tabs.Panel>
      <Tabs.Panel className="pt-4" id="orders">
        <OrdersTblDyn />
      </Tabs.Panel>
    </Tabs>
  );
});

export default BasketContentTabs;
