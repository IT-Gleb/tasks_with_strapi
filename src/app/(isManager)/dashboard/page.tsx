import OrdersWithTabs from "@/entityes/components/shop/manager/orders/OrdersWithTabs";
import { PaginationProvider } from "@/shared/hooks/custom/UsePaginationContext";
import {
  API_URL,
  itemsOnPage,
  ordersInWorkRequest,
} from "@/shared/utils/consts";
import { getOrdersData } from "@/shared/utils/fetchers";

import { LoaderIcon } from "lucide-react";
import { Suspense } from "react";

const urlOrdersInWork = `${API_URL}/${ordersInWorkRequest}`
  .replace("%1", "1")
  .replace("%2", `${itemsOnPage}`);

export default async function DashBoard() {
  const ordersInWork = await getOrdersData(urlOrdersInWork, "ordersInWork");
  return (
    <Suspense
      fallback={
        <div className="w-fit mx-auto">
          <LoaderIcon size={32} className=" animate-spin" />
        </div>
      }
    >
      <PaginationProvider>
        <section className="w-full xl:w-340 mx-auto p-1">
          <OrdersWithTabs ordersInWork={ordersInWork} />
        </section>
      </PaginationProvider>
    </Suspense>
  );
}
