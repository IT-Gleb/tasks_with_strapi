import HeroComp from "@/entityes/components/shop/mainPage/heroComp";
import MainPageShopProvider from "@/entityes/components/shop/mainPage/MainPageShopProvider";
import getCacheQueryClient from "@/entityes/providers/getQueryCache";
import type {
  THero,
  THeroError,
  THeroImage,
  TShopPageSEO,
} from "@/shared/types/main_types";
import { GetAPI_URL, shopPageSEO } from "@/shared/utils/consts";
import { fetchGet } from "@/shared/utils/fetchers";
import { Loader } from "lucide-react";
import { Metadata } from "next";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const query = getCacheQueryClient();
  const api_url = GetAPI_URL() ?? "no_api";
  const result = await query.fetchQuery({
    queryKey: ["shopPageSEO", 1],
    queryFn: async () => {
      return await fetchGet<TShopPageSEO>(`${api_url}/${shopPageSEO}`);
    },
  });

  return {
    title: result?.data.title,
    description: result?.data.description,
    authors: [{ name: result?.data.author }],
    creator: result?.data.creator,
  };
}

export default async function ShopPage() {
  const query = getCacheQueryClient();
  const url = `${GetAPI_URL()}/main-page-shop?hero=1`;
  const result = await query.fetchQuery({
    queryKey: ["HeroComp", 1],
    queryFn: async () => {
      return await fetchGet<THero | THeroError>(url);
    },
  });

  //console.log(result);

  // if ((result && "error" in result) || result === null) {
  //   return (
  //     <div className="mt-5 w-fit mx-auto text-lg indent-2">
  //       Ошибка (или отсутствие данных) получения данных. Попробуйте
  //       перезагрузить страницу позднее.
  //     </div>
  //   );
  // }

  //console.log(result);

  return (
    <>
      {result !== null && !("error" in result) && (
        <Suspense fallback={<Loader size={36} className=" animate-spin" />}>
          <HeroComp
            text={result?.data.HelloText as string}
            paramTopImages={result?.data.topImages as THeroImage[]}
            paramBottomImages={result?.data.bottomImages as THeroImage[]}
          />
        </Suspense>
      )}

      <Suspense fallback={<Loader size={36} className=" animate-spin" />}>
        <MainPageShopProvider />
      </Suspense>
    </>
  );
}
