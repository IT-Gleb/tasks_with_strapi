"use client";

import { API_URL, bgGradients } from "@/shared/utils/consts";
import { fetchGet } from "@/shared/utils/fetchers";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import TitleComponent from "./TitleComponent";
import { Loader2 } from "lucide-react";
import type { TCategories } from "@/shared/types/main_types";
import GalleryGoods from "./galleryGoods";
import { randomArrayValue } from "@/shared/utils/functions";

const url: string = `${API_URL}/main-page-shop`;

const MainPageShopProvider = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["main-page-shop"],
    queryFn: async () => {
      return await fetchGet<{ data: TCategories[] }>(url);
    },
  });
  const [categories, setCategories] = useState<TCategories[]>([]);

  //Конвертируем данные в TCategories[]
  useEffect(() => {
    let isWork: boolean = true;
    if (!data || data.data === null) {
      return;
    }
    if (isWork) {
      //console.log(data);
      if (data.data.length > 0) {
        setCategories(data.data);
      }
    }

    return () => {
      isWork = false;
    };
  }, [data]);

  if (isLoading) {
    return (
      <div className="w-fit mx-auto mt-5 text-green-300 dark:text-default">
        <Loader2 size={44} strokeWidth={2} className=" animate-spin" />
      </div>
    );
  }

  return (
    <section>
      {categories &&
        categories.length > 0 &&
        categories.map((item) => {
          const { id, title, goods } = item;
          let back1 = randomArrayValue(bgGradients);

          const bgGrads: string = `${back1.light} dark:${back1.dark}`;
          const lt = back1.light.replaceAll("from", "bg");
          const dk = back1.dark.replaceAll("from", "bg");
          const backgroundstr = `${lt} dark:${dk}`;
          //console.log(backgroundstr, lt, dk);

          return (
            <section key={id} className="mt-5 w-full p-1">
              <TitleComponent title={title} className={bgGrads} />
              {goods.length > 0 && <GalleryGoods goods={goods} />}
            </section>
          );
        })}
    </section>
  );
};

export default MainPageShopProvider;
