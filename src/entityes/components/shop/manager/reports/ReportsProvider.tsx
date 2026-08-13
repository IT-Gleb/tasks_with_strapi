"use client";

import { getRandomId } from "@/shared/utils/functions";
import { Key, Tabs } from "@heroui/react";
import AllOrdersPie from "./charts/AllOrdersPie";
import { useQuery } from "@tanstack/react-query";
import { fetchGet } from "@/shared/utils/fetchers";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import type { TPieData, TTop10Data } from "@/shared/types/main_types";
import Top10Goods from "./Top10Goods";
import { useReportsURLParamsContext } from "@/shared/hooks/custom/UseReportsParamsContext";
import AovOrders from "./AovOrders";

const items = [
  { id: getRandomId(), label: "Всего заказов", itemId: "allOrders" },
  { id: getRandomId(), label: "Средний чек", itemId: "aovOrders" },
  { id: getRandomId(), label: "Top-10", itemId: "top10" },
];

const ReportsProvider = () => {
  const [selKey, setSelKey] = useState<Key>(items[0].itemId);
  const [top10data, setTop10Data] = useState<TTop10Data>([]);
  const [aovOrdersData, setAovOrdersData] = useState<any>(null);
  const { hasURLParams } = useReportsURLParamsContext();

  const { data: allOrdersdata, isLoading } = useQuery({
    queryKey: ["allOrders", 1],
    queryFn: async () => {
      return await fetchGet<TPieData>("/api/OrdersStat");
    },
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
    enabled: selKey === items[0].itemId,
  });

  //-----AOV--------------
  const { data: aovData, isLoading: isLoading3 } = useQuery({
    queryKey: ["aovOrders", hasURLParams],
    queryFn: async () => {
      return await fetch("/api/top10", {
        headers: { "content-type": "application/json; charset=utf-8" },
        method: "POST",
        signal: AbortSignal.timeout(5000),
        body: JSON.stringify({ query: hasURLParams }),
      }).then((data) => data.json());
    },
    //refetchOnMount: "always",
    //refetchOnWindowFocus: "always",
    enabled: selKey === items[1].itemId,
  });

  //---top10----
  const {
    data: top10,
    isLoading: isLoading2,
    refetch,
  } = useQuery({
    queryKey: ["top10", hasURLParams],
    queryFn: async () => {
      return await fetch("/api/top10", {
        headers: { "content-type": "application/json; charset=utf-8" },
        method: "POST",
        signal: AbortSignal.timeout(5000),
        body: JSON.stringify({ query: hasURLParams }),
      }).then((data) => data.json());
    },
    //refetchOnMount: "always",
    //refetchOnWindowFocus: "always",
    enabled: selKey === items[2].itemId,
  });

  const handlerTop10 = async () => {
    await refetch();
  };

  useEffect(() => {
    let isWork: boolean = true;
    //console.log(top10);

    if (typeof top10 === "object") {
      if ("status" in top10) {
        if (top10.status === "ok") {
          if (isWork) {
            setTop10Data(top10.data);
          }
        }
      }
    }

    return () => {
      isWork = false;
    };
  }, [top10]);

  //----Aov data-----
  useEffect(() => {
    let isWork: boolean = true;
    //console.log(aovData);

    if (typeof aovData === "object") {
      if ("status" in aovData) {
        if (aovData.status === "ok" && "average" in aovData.data) {
          if (isWork) {
            setAovOrdersData(aovData.data);
          }
        }
      }
    }

    return () => {
      isWork = false;
    };
  }, [aovData]);

  if (isLoading || isLoading2 || isLoading3) {
    return <Loader size={36} className="mx-auto animate-spin" />;
  }
  //console.log(allOrdersdata);
  //console.log(top10);

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
            {item.itemId === "aovOrders" && <AovOrders data={aovOrdersData} />}
            {item.itemId === "top10" && (
              <Top10Goods data={top10data} handler={handlerTop10} />
            )}
          </Tabs.Panel>
        ))}
      </Tabs>
    </div>
  );
};

export default ReportsProvider;
