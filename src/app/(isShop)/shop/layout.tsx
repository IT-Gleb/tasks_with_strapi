import type { Metadata } from "next";

import "@/accets/css/globals.css";
import TanstaqProvider from "@/entityes/providers/TanstackProvider";

import { fetchGet } from "@/shared/utils/fetchers";
import { TPageSeo } from "@/shared/types/main_types";
import {
  API_URL,
  MainPageSeo_Prefix,
  MainPageSEOPath,
} from "@/shared/utils/consts";
import ThisThemeProvider from "@/entityes/providers/ThisThemeProvider";
import getCacheQueryClient from "@/entityes/providers/getQueryCache";
import NavigationMain from "@/entityes/components/ui/NavigationMain";
import FooterLayout from "@/entityes/components/FooterLayout";
import GradientLine from "@/entityes/components/ui/gradients/GradientLine";
import ThemeButton from "@/entityes/components/ui/buttons/ThemeButton";

// export async function generateMetadata(): Promise<Metadata> {
//   const query = getCacheQueryClient();
//   const api_url = process.env.API_URL ?? "no_api";
//   const result = await query.fetchQuery({
//     queryKey: [MainPageSeo_Prefix],
//     queryFn: async () => {
//       return await fetchGet<TPageSeo>(`${api_url}/${MainPageSEOPath}`);
//     },
//   });

//   return {
//     title: result?.data.title,
//     description: result?.data.description,
//     authors: [{ name: result?.data.author }],
//     creator: result?.data.creator,
//   };
// }

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
            <div className="w-full fixed z-50 bg-default dark:bg-slate-900 min-h-(--minHeaderH) flex flex-col pt-2">
              <div className="w-full lg:max-w-240 lg:mx-auto flex-1 flex flex-row items-center justify-between">
                <NavigationMain />
                <div className="w-18 h-11 px-1 py-0.5 rounded-2xl overflow-hidden duration-300 transition-discrete bg-slate-300/75 dark:bg-slate-800 place-content-center pl-1 dark:pl-7 scale-65">
                  <ThemeButton />
                </div>
              </div>
              <GradientLine />
            </div>
            <div className="mt-(--minHeaderH) w-full flex flex-row flex-nowrap flex-1">
              <aside className="hidden sm:block">left panel</aside>
              <main className="w-full lg:max-w-220 lg:mx-auto flex-1 px-2 bg-white dark:bg-green-900/20">
                {children}
              </main>
              <aside className="hidden sm:block">right panel</aside>
            </div>

            <FooterLayout />
          </ThisThemeProvider>
        </TanstaqProvider>
      </body>
    </html>
  );
}
