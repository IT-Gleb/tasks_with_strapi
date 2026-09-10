import "@/accets/css/globals.css";
import TanstaqProvider from "@/entityes/providers/TanstackProvider";

import ThisThemeProvider from "@/entityes/providers/ThisThemeProvider";
import NavigationMain from "@/entityes/components/ui/NavigationMain";
import FooterLayout from "@/entityes/components/FooterLayout";
import GradientLine from "@/entityes/components/ui/gradients/GradientLine";
import ThemeButton from "@/entityes/components/ui/buttons/ThemeButton";

import { Toast } from "@heroui/react";
import ManagerButton from "@/entityes/components/ui/buttons/ManagerButton";
import BreadCrambs from "@/entityes/components/ui/BreadCrambs";
import GetCity from "@/entityes/manager/GetCity";
import SearchGoodsInput from "@/entityes/components/shop/searchgoods/searchGoodInput";
import BasketDrawer from "@/entityes/components/shop/mainPage/drawer/BasketDrawer";

//import BasketDrawer from "@/entityes/components/shop/mainPage/drawer/BasketDrawer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className="light h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <TanstaqProvider>
          <ThisThemeProvider>
            <Toast.Provider placement="top" />
            <div className="w-full fixed z-50 bg-default dark:bg-slate-900 min-h-(--minHeaderH) flex flex-col pt-2">
              <div className="w-full lg:max-w-240 lg:mx-auto flex-1 flex flex-row gap-x-5 items-center justify-evenly">
                <NavigationMain />
                <SearchGoodsInput />
                <BasketDrawer />
                <ManagerButton />
                <div className="w-18 h-11 px-1 py-0.5 rounded-2xl overflow-hidden duration-300 transition-discrete bg-slate-300/75 dark:bg-slate-800 place-content-center pl-1 dark:pl-7 scale-65">
                  <ThemeButton />
                </div>
              </div>
              <div className="w-fit mx-auto">
                <BreadCrambs />
              </div>
              <GradientLine />
            </div>
            <div className="mt-(--minHeaderH) w-full flex flex-row flex-nowrap flex-1">
              <aside className="hidden sm:block"></aside>
              <main className="w-full lg:max-w-220 lg:mx-auto flex-1 px-2 bg-white dark:bg-green-900/20">
                <GetCity />
                {children}
              </main>
              <aside className="hidden sm:block"></aside>
            </div>

            <FooterLayout />
          </ThisThemeProvider>
        </TanstaqProvider>
      </body>
    </html>
  );
}
