import { fetchGet } from "@/shared/utils/fetchers";

import { type TPageSeo } from "@/shared/types/main_types";
import {
  GetAPI_URL,
  MainPageSEOPath,
  MainPageSeo_Prefix,
} from "@/shared/utils/consts";

import { Suspense } from "react";

//import getCacheQueryClient from "@/entityes/providers/getQueryCache";

import Loading from "../loading";
import dynamic from "next/dynamic";
import { Metadata } from "next";

//export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  //const query = getCacheQueryClient();
  const api_url = GetAPI_URL() + "/" + MainPageSEOPath;
  // console.log(api_url);

  const result = await fetchGet<TPageSeo>(api_url);

  //console.log(result);

  if (result) {
    return {
      title: result?.data.title,
      description: result?.data.description,
      authors: [{ name: result?.data.author }],
      creator: result?.data.creator,
    };
  } else {
    return {
      title: "Главная страница",
    };
  }
}

const CalendarBasicDyn = dynamic(
  () => import("@/entityes/components/calendar/CalendarBasic"),
);

const LastTodosDyn = dynamic(
  () => import("@/entityes/components/Todos/last10todos/LastTodos"),
);

const ChartMonthProviderDyn = dynamic(
  () => import("@/entityes/components/charts/TodosCharts"),
);

export default async function Home() {
  // const queryClient = getCacheQueryClient();
  // const api_url = process.env.API_URL ?? "no_api";
  // //console.log(api_url);

  // const result = await queryClient.fetchQuery({
  //   queryKey: [MainPageSeo_Prefix],
  //   queryFn: async () => {
  //     return await fetchGet<TPageSeo>(`${api_url}/${MainPageSEOPath}`);
  //   },
  // });

  return (
    // <HydrationBoundary state={dehydrate(queryClient)}>
    //   {!!result && (
    <div className="w-full lg:max-w-200 lg:mx-auto p-4 text-xl grid grid-cols-1 lg:grid-cols-2  lg:items-start gap-y-3 space-y-5">
      <Suspense fallback={<Loading from="fromstart" />}>
        <CalendarBasicDyn />
        {/* <div className="text-xs p-2">
              {FormatDateTime(
                CheckIsTimeZoneString(result?.data.publishedAt as string),
              )}
            </div> */}
      </Suspense>
      <Suspense fallback={<Loading />}>
        <LastTodosDyn />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <div className="mt-5 lg:col-span-2">
          <ChartMonthProviderDyn />
        </div>
      </Suspense>
    </div>
    //)}
    // </HydrationBoundary>
  );
}
