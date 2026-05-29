import { fetchGet } from "@/shared/utils/fetchers";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { type TPageSeo } from "@/shared/types/main_types";
import {
  API_URL,
  MainPageSEOPath,
  MainPageSeo_Prefix,
} from "@/shared/utils/consts";
import {
  CheckIsTimeZoneString,
  FormatDateTime,
  makeDateISOString,
  makeDateISOStringFromNow,
} from "@/shared/utils/functions";
import CalendarBasic from "@/entityes/components/calendar/CalendarBasic";
import { Suspense } from "react";
import Loading from "./loading";
import getCacheQueryClient from "@/entityes/providers/getQueryCache";
import LastTodos from "@/entityes/components/Todos/last10todos/LastTodos";
import ChartMonthProvider from "@/entityes/components/charts/TodosCharts";

export default async function Home() {
  const queryClient = getCacheQueryClient();
  const result = await queryClient.fetchQuery({
    queryKey: [MainPageSeo_Prefix],
    queryFn: async () => {
      return await fetchGet<TPageSeo>(`${API_URL}/${MainPageSEOPath}`);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {result && (
        <div className="w-fit p-2 mx-auto text-xl grid grid-cols-1 lg:grid-cols-2 items-start gap-2">
          <Suspense fallback={<Loading />}>
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
