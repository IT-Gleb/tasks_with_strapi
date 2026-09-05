import TitleComponent from "@/entityes/components/shop/mainPage/TitleComponent";
import SearchGoodsItems from "@/entityes/components/shop/searchgoods/searchGoodsItems";
import { bgGradients } from "@/shared/utils/consts";
import { randomArrayValue } from "@/shared/utils/functions";
import { Loader } from "lucide-react";
import { Suspense } from "react";

type TSearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

export default async function GoodSearchPage({
  searchParams,
}: {
  searchParams: TSearchParams;
}) {
  const par1 = await searchParams;
  const sPar = {
    q: par1.q as string,
    page: par1.page as unknown as number,
    pgSize: par1.pgSize as unknown as number,
  };

  const bgItem = randomArrayValue(bgGradients);
  const bgColor: string = `${bgItem.light} dark:${bgItem.dark}`;
  //console.log(params);

  return (
    <section className="w-fit mx-auto p-1">
      <TitleComponent title={par1.q as string} className={bgColor} />
      <Suspense fallback={<Loader size={38} className=" animate-spin" />}>
        <SearchGoodsItems params={sPar} />
      </Suspense>
    </section>
  );
}
