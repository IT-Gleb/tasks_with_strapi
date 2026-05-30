import { fetchGet } from "@/shared/utils/fetchers";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { type TPageSeo } from "@/shared/types/main_types";
import { MainPageSEOPath, MainPageSeo_Prefix } from "@/shared/utils/consts";

import CalendarBasic from "@/entityes/components/calendar/CalendarBasic";
import { Suspense } from "react";

import getCacheQueryClient from "@/entityes/providers/getQueryCache";
import LastTodos from "@/entityes/components/Todos/last10todos/LastTodos";
import ChartMonthProvider from "@/entityes/components/charts/TodosCharts";

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
      {result && (
        <div className="w-full p-2 text-xl grid grid-cols-1 lg:grid-cols-2 items-start gap-2">
          <Suspense
            fallback={
              <div className=" bg-stone-400 min-w-60 min-h-40 rounded-2xl"></div>
            }
          >
            <CalendarBasic />
            {/* <div className="text-xs p-2">
              {FormatDateTime(
                CheckIsTimeZoneString(result?.data.publishedAt as string),
              )}
            </div> */}
          </Suspense>
          <Suspense
            fallback={
              <div className=" bg-stone-400 min-w-60 min-h-40 rounded-2xl"></div>
            }
          >
            <LastTodos />
          </Suspense>
          <Suspense
            fallback={
              <div className="w-full lg:col-span-2 bg-stone-400 min-w-80 min-h-50 rounded-2xl"></div>
            }
          >
            <div className="mt-5 lg:col-span-2">
              <ChartMonthProvider />
            </div>
          </Suspense>
        </div>
      )}
    </HydrationBoundary>
  );
}
