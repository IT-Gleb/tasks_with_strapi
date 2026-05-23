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

export default async function Home() {
  const queryClient = new QueryClient();
  const result = await queryClient.fetchQuery({
    queryKey: [MainPageSeo_Prefix],
    queryFn: async () => {
      return await fetchGet<TPageSeo>(`${API_URL}/${MainPageSEOPath}`);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {result && (
        <div className="w-fit p-2 mx-auto text-xl grid grid-cols-2 items-center">
          <div className=" col-span-2 p-2 text-center">
            {result?.data.title}
          </div>
          <div className=" col-span-2 p-2">{result?.data.description}</div>
          <div className="p-2 text-lg">{result?.data.author}</div>
          <div className="p-2 text-sm"> {result?.data.creator}</div>
          <div></div>
          <div className="text-xs p-2">
            {FormatDateTime(
              CheckIsTimeZoneString(result?.data.publishedAt as string),
            )}
          </div>
        </div>
      )}
    </HydrationBoundary>
  );
}
