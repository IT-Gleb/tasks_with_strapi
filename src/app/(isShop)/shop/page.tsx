import HeroComp from "@/entityes/components/shop/mainPage/heroComp";
import MainPageShopProvider from "@/entityes/components/shop/mainPage/MainPageShopProvider";
import getCacheQueryClient from "@/entityes/providers/getQueryCache";
import type { THero, THeroError, THeroImage } from "@/shared/types/main_types";
import { API_URL } from "@/shared/utils/consts";
import { fetchGet } from "@/shared/utils/fetchers";

export default async function ShopPage() {
  const query = getCacheQueryClient();
  const url = `${API_URL}/main-page-shop?hero=1`;
  const result = await query.fetchQuery({
    queryKey: ["HeroComp", 1],
    queryFn: async () => {
      return await fetchGet<THero | THeroError>(url);
    },
  });

  if ((result && "error" in result) || result === null) {
    return (
      <div className="mt-5 w-fit mx-auto text-lg">
        Ошибка (или отсутствие данных) получения данных
      </div>
    );
  }

  //console.log(result);

  return (
    <>
      <HeroComp
        text={result?.data.HelloText as string}
        paramTopImages={result?.data.topImages as THeroImage[]}
        paramBottomImages={result?.data.bottomImages as THeroImage[]}
      />
      <MainPageShopProvider />
    </>
  );
}
