import OrdersWithTabs from "@/entityes/components/shop/manager/orders/OrdersWithTabs";
import SearchOrdersTable from "@/entityes/components/shop/manager/orders/SearchOrdersTable";

import SearchOrderInput from "@/entityes/manager/SearchOrderComponent";
import { PaginationProvider } from "@/shared/hooks/custom/UsePaginationContext";
import { TOrdersState } from "@/shared/types/main_types";
import {
  API_URL,
  itemsOnPage,
  managerSearchRequest,
  ordersCancelledRequest,
  ordersInWorkRequest,
  orderSuccessedRequest,
} from "@/shared/utils/consts";
import { getOrdersData } from "@/shared/utils/fetchers";

import { Loader } from "lucide-react";
import { SearchParams } from "next/dist/server/request/search-params";

import { Suspense } from "react";

//export const dynamic = "force-dynamic";

export default async function DashBoard({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const data = await searchParams;
  const page = data.page ?? "1";
  const searchQuery = data.q ?? false;
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
    case "search":
      let search =
        typeof searchQuery === "boolean" ? "" : (searchQuery as string);
      search === "" ? "*" : search;

      url = `${API_URL}${managerSearchRequest}`
        .replace("%1", search)
        .replace("%2", page as string)
        .replace("%3", `${itemsOnPage}`);
      queryKey = "ordersSearch-" + search;
      break;
    default:
      url = `${API_URL}/${ordersInWorkRequest}`
        .replace("%1", page as string)
        .replace("%2", `${itemsOnPage}`);
      queryKey = "ordersInWork";
      break;
  }

  const orders = await getOrdersData(url, queryKey, Number(page));

  //console.log("ipData -- ", ipData);
  //console.log(searchQuery, url);
  //console.log("--orders--", orders);

  return (
    // <Suspense
    //   fallback={
    //     <div className="w-fit mx-auto">
    //       <LoaderIcon size={32} className=" animate-spin" />
    //     </div>
    //   }
    // >
    <PaginationProvider>
      <section className="w-full">
        <Suspense fallback={<Loader size={36} className=" animate-spin" />}>
          <SearchOrderInput />
        </Suspense>
        <Suspense fallback={<Loader size={36} className=" animate-spin" />}>
          {ordersState !== "search" && typeof searchQuery === "boolean" && (
            <OrdersWithTabs orders={orders} pageNumber={Number(page)} />
          )}

          {typeof searchQuery === "string" && ordersState === "search" && (
            <SearchOrdersTable
              searchItems={orders}
              pageNumber={Number(page)}
              paramQuery={`q=${data.q as string}`}
            />
          )}
        </Suspense>
      </section>
    </PaginationProvider>
    // </Suspense>
  );
}
