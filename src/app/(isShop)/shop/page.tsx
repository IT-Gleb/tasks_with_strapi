import HeroComp from "@/entityes/components/shop/mainPage/heroComp";
import MainPageShopProvider from "@/entityes/components/shop/mainPage/MainPageShopProvider";

export default async function ShopPage() {
  return (
    <>
      <HeroComp text="Приветствуем вас в нашем cafe-магазине" />
      <MainPageShopProvider />
    </>
  );
}
