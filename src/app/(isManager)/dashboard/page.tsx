import OrdersWithTabs from "@/entityes/components/shop/manager/orders/OrdersWithTabs";
import InfoArea from "@/entityes/manager/InfoArea";
import getCacheQueryClient from "@/entityes/providers/getQueryCache";
import { PaginationProvider } from "@/shared/hooks/custom/UsePaginationContext";
import { TOrdersState } from "@/shared/types/main_types";
import {
  API_URL,
  itemsOnPage,
  ordersCancelledRequest,
  ordersInWorkRequest,
  orderSuccessedRequest,
  SERVER_LOCAL_API,
  SERVER_URL,
} from "@/shared/utils/consts";
import { getOrdersData } from "@/shared/utils/fetchers";

import { LoaderIcon } from "lucide-react";
import { SearchParams } from "next/dist/server/request/search-params";
import { headers } from "next/headers";

import { Suspense } from "react";

async function getLocalIp() {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  let localIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "0.0.0.0";
  localIp = localIp.replace("::ffff:", "");

  const query = getCacheQueryClient();
  const data = await query.fetchQuery({
    queryKey: ["geoFromIp"],
    queryFn: async () => {
      const res = await fetch(SERVER_LOCAL_API + "/geobyip", {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: "POST",
        signal: AbortSignal.timeout(5000),
        body: JSON.stringify({ localIp }),
      });
      if (res.ok) {
        return await res.json();
      }
      return {
        state: "unknown",
        city: "unknown",
        country: "unknown",
        region: "unknown",
      };
    },
  });

  return data;
}

export default async function DashBoard({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const data = await searchParams;
  const page = data.page ?? "1";
  const ordersState: TOrdersState = data.state as TOrdersState;

  let url: string = "";
  let queryKey: string = "";
  switch (ordersState) {
    case "inwork":
      url = `${API_URL}/${ordersInWorkRequest}`
        .replace("%1", page as string)
        .replace("%2", `${itemsOnPage}`);
      queryKey = "ordersInWork";
      break;
    case "cancelled":
      url = `${API_URL}/${ordersCancelledRequest}`
        .replace("%1", page as string)
        .replace("%2", `${itemsOnPage}`);
      queryKey = "ordersCancelled";
      break;
    case "successed":
      url = `${API_URL}/${orderSuccessedRequest}`
        .replace("%1", page as string)
        .replace("%2", `${itemsOnPage}`);
      queryKey = "ordersSuccessed";
      break;
    default:
      url = `${API_URL}/${ordersInWorkRequest}`
        .replace("%1", page as string)
        .replace("%2", `${itemsOnPage}`);
      queryKey = "ordersInWork";
      break;
  }

  const orders = await getOrdersData(url, queryKey, Number(page));

  const ipData = await getLocalIp();
  //console.log("ipData -- ", ipData);

  return (
    <Suspense
      fallback={
        <div className="w-fit mx-auto">
          <LoaderIcon size={32} className=" animate-spin" />
        </div>
      }
    >
      <PaginationProvider>
        <section className="w-full p-1">
          <InfoArea paramIpData={ipData} />
          <OrdersWithTabs orders={orders} pageNumber={Number(page)} />
        </section>
      </PaginationProvider>
    </Suspense>
  );
}
