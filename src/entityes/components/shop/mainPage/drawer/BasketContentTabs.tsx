"use client";

import { Tabs } from "@heroui/react";
import BasketTable from "./BasketTable";
import { memo } from "react";

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
        <BasketTable />
      </Tabs.Panel>
      <Tabs.Panel className="pt-4" id="orders">
        <p>This tab is also available for selection.</p>
      </Tabs.Panel>
    </Tabs>
  );
});

export default BasketContentTabs;
