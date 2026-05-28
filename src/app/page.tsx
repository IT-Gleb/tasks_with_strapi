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
} from "@/shared/utils/functions";
import CalendarBasic from "@/entityes/components/calendar/CalendarBasic";
import { Suspense } from "react";
import Loading from "./loading";
import getCacheQueryClient from "@/entityes/providers/getQueryCache";

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
        <Suspense fallback={<Loading />}>
          <div className="w-fit p-2 mx-auto text-xl grid grid-cols-2 items-start gap-2">
            <CalendarBasic />
            <div className="text-xs p-2">
              {FormatDateTime(
                CheckIsTimeZoneString(result?.data.publishedAt as string),
              )}
            </div>
          </div>
        </Suspense>
      )}
    </HydrationBoundary>
  );
}
