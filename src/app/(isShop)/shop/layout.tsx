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
      <body className="min-h-full">
        <TanstaqProvider>
          <ThisThemeProvider>
            <div className="w-full grid grid-cols-1 md:grid-cols-4">
              <div className="col-span-1 md:col-span-4 bg-default/40 dark:bg-default/30 min-h-(--minHeaderH)"></div>
              <aside className="w-full bg-default/50 dark:bg-chocolate/15">
                ал морал пло плаол
              </aside>
              <main className="md:col-span-2 min-h-(--minMainH) flex-1">
                {children}
              </main>
              <aside className="w-full bg-default/50 dark:bg-chocolate/12">
                {" "}
                дщкуькг35
              </aside>
              <div className="col-span-1 md:col-span-4 bg-default/30 min-h-(--minFooterH) dark:bg-default/50"></div>
            </div>
          </ThisThemeProvider>
        </TanstaqProvider>
      </body>
    </html>
  );
}
