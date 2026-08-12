"use client";

import { getRandomId } from "@/shared/utils/functions";
import { Key, Tabs } from "@heroui/react";
import AllOrdersPie from "./charts/AllOrdersPie";
import { useQuery } from "@tanstack/react-query";
import { fetchGet } from "@/shared/utils/fetchers";
import { Loader } from "lucide-react";
import { useState } from "react";
import type { TPieData } from "@/shared/types/main_types";
import Top10Goods from "./Top10Goods";

const items = [
  { id: getRandomId(), label: "Всего заказов", itemId: "allOrders" },
  { id: getRandomId(), label: "Средний чек", itemId: "aovOrders" },
  { id: getRandomId(), label: "Top-10", itemId: "top10" },
];

const ReportsProvider = () => {
  const [selKey, setSelKey] = useState<Key>(items[0].itemId);

  const { data: allOrdersdata, isLoading } = useQuery({
    queryKey: ["allOrders", 1],
    queryFn: async () => {
      return await fetchGet<TPieData>("/api/OrdersStat");
    },
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
    enabled: selKey === items[0].itemId,
  });

  if (isLoading) {
    return <Loader size={36} className="mx-auto animate-spin" />;
  }
  //console.log(allOrdersdata);

  return (
    <div className="mt-5 w-full max-w-200 mx-auto">
      <Tabs selectedKey={selKey} onSelectionChange={setSelKey}>
        <Tabs.ListContainer>
          <Tabs.List aria-label="Overflow options">
            {items.map((item) => (
              <Tabs.Tab key={item.id} id={item.itemId}>
                {item.label}
                <Tabs.Indicator />
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs.ListContainer>
        {items.map((item) => (
          <Tabs.Panel key={item.id} className="pt-4" id={item.itemId}>
            {item.itemId === "allOrders" && (
              <AllOrdersPie param={allOrdersdata} />
            )}
            {item.itemId === "top10" && <Top10Goods />}
            <p>{item.label} panel content.</p>
          </Tabs.Panel>
        ))}
      </Tabs>
    </div>
  );
};

export default ReportsProvider;
