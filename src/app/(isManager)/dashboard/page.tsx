import OrdersWithTabs from "@/entityes/components/shop/manager/orders/OrdersWithTabs";
import getCacheQueryClient from "@/entityes/providers/getQueryCache";
import { TOrder, TOrderStatus, TPageMeta } from "@/shared/types/main_types";
import { API_URL, ordersInWorkRequest } from "@/shared/utils/consts";

import { LoaderIcon } from "lucide-react";
import { Suspense } from "react";

type TDashBoardProps = {
  orders: TOrder[];
  meta: TPageMeta;
};

type TServerOrder = Pick<
  TOrder,
  "id" | "title" | "price" | "items" | "createdAt" | "updatedAt"
> & { documentId: string; s_status: TOrderStatus };

const urlOrdersInWork = `${API_URL}/${ordersInWorkRequest}`;

async function getOrdersData(paramUrl: string, paramKey: string) {
  // console.log(urlOrdersInWork);

  let orders: TOrder[] = [];
  let meta: Partial<TPageMeta> = {};
  const query = getCacheQueryClient();
  const data = await query.fetchQuery({
    queryKey: [paramKey, 1],
    queryFn: async () => {
      const res = await fetch(paramUrl, {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: "GET",
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        return await res.json();
      }
      return null;
    },
  });

  if (data) {
    orders = data.data.map((item: TServerOrder) => {
      // return {
      //   id: item.documentId,
      //   title: item.title,
      //   price: item.price,
      //   status: item.s_status,
      //   createdAt: item.createdAt,
      //   updatedAt: item.updatedAt,
      //   items: item.items,
      // };
      return { ...item, id: item.documentId, status: item.s_status };
    });

    meta = data.meta;
  }
  return {
    orders,
    meta,
  };
}

export default async function DashBoard() {
  const { orders } = await getOrdersData(urlOrdersInWork, "ordersInWork");
  return (
    <Suspense
      fallback={
        <div className="w-fit mx-auto">
          <LoaderIcon size={32} className=" animate-spin" />
        </div>
      }
    >
      <section className="w-full xl:w-340 mx-auto p-1">
        <OrdersWithTabs ordersInWork={orders} />
      </section>
    </Suspense>
  );
}
