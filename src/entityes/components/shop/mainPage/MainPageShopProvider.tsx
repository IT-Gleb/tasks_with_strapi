"use client";

import { API_URL, SERVER_URL } from "@/shared/utils/consts";
import { fetchGet } from "@/shared/utils/fetchers";
import { returnField } from "@/shared/utils/functions";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import * as motion from "motion/react-client";
import TitleComponent from "./TitleComponent";
import { Loader2 } from "lucide-react";
import type { TCategories } from "@/shared/types/main_types";

const url: string = `${API_URL}/main-page-shop`;

const animate_div = {
  active: {
    y: 2,
    transition: { delayChildren: 1.2 },
  },
  inactive: {
    y: 0,
  },
};

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
          return (
            <div key={item.id} className="my-5 w-full">
              <TitleComponent title={item.title} />
              <div className="flex gap-x-3 items-start">
                {item.goods.map((good) => {
                  return (
                    <figure key={good.documentId}>
                      <figcaption className=" text-xs max-h-6 line-clamp-1">
                        {good.title}
                      </figcaption>
                      <motion.div
                        className="w-48 h-63 overflow-hidden object-cover object-top-left rounded-3xl"
                        variants={animate_div}
                        initial={"inactive"}
                        whileHover={"active"}
                      >
                        <picture>
                          <source
                            srcSet={`${SERVER_URL}${good.picture[0].url}`}
                            className="w-full h-full"
                          />
                          <img
                            src="/window.svg"
                            className="w-full h-full"
                            alt={`${SERVER_URL}${good.picture[0].url}`}
                            loading="lazy"
                            decoding="async"
                            fetchPriority="low"
                            width="auto"
                            height="auto"
                          ></img>
                        </picture>
                      </motion.div>
                    </figure>
                  );
                })}
              </div>
            </div>
          );
        })}
    </section>
  );
};

export default MainPageShopProvider;
