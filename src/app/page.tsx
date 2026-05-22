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
      <div className="w-fit p-2 mx-auto text-xl">{result?.data.author}</div>
    </HydrationBoundary>
  );
}
