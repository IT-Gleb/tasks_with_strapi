import { fetchGet } from "@/shared/utils/fetchers";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { type TPageSeo } from "@/shared/types/main_types";
import { MainPageSEOPath, MainPageSeo_Prefix } from "@/shared/utils/consts";

import CalendarBasic from "@/entityes/components/calendar/CalendarBasic";
import { Suspense } from "react";

import getCacheQueryClient from "@/entityes/providers/getQueryCache";
import LastTodos from "@/entityes/components/Todos/last10todos/LastTodos";
import ChartMonthProvider from "@/entityes/components/charts/TodosCharts";
import Loading from "./loading";
import SearchTasks from "@/entityes/components/search/SearchTasks";

export default async function Home() {
  const queryClient = getCacheQueryClient();
  const api_url = process.env.API_URL ?? "no_api";
  //console.log(api_url);

  const result = await queryClient.fetchQuery({
    queryKey: [MainPageSeo_Prefix],
    queryFn: async () => {
      return await fetchGet<TPageSeo>(`${api_url}/${MainPageSEOPath}`);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {!!result && (
        <div className="w-full p-2 text-xl grid grid-cols-1 lg:grid-cols-2 items-start gap-y-3 space-y-5">
          <Suspense fallback={<Loading />}>
            <span className="block lg:col-span-2">
              <SearchTasks />
            </span>
          </Suspense>
          <Suspense fallback={<Loading from="fromstart" />}>
            <CalendarBasic />
            {/* <div className="text-xs p-2">
              {FormatDateTime(
                CheckIsTimeZoneString(result?.data.publishedAt as string),
              )}
            </div> */}
          </Suspense>
          <Suspense fallback={<Loading />}>
            <LastTodos />
          </Suspense>
          <Suspense fallback={<Loading />}>
            <div className="mt-5 lg:col-span-2">
              <ChartMonthProvider />
            </div>
          </Suspense>
        </div>
      )}
    </HydrationBoundary>
  );
}
