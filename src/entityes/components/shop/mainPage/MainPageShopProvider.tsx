"use client";

import { API_URL, SERVER_URL } from "@/shared/utils/consts";
import { fetchGet } from "@/shared/utils/fetchers";
import { returnField } from "@/shared/utils/functions";
import { Typography } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import * as motion from "motion/react-client";
import TitleComponent from "./TitleComponent";

const url: string = `${API_URL}/main-page-shop`;

type TGoodItemPicture = {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string | null;
  mime: string;
  ext: string;
  size: number;
  width: number;
  height: number;
};

type TGoodItem = {
  id: number;
  documentId: string;
  title: string;
  description: string;
  initialprice: number;
  discount: number;
  price: number;
  isactive: boolean;
  picture: TGoodItemPicture[];
};

type TCategories = {
  id: number;
  title: string;
  goods: TGoodItem[];
};

const animate_div = {
  active: {
    y: 2,
    transition: { delayChildren: 1.2 },
  },
  inactive: {
    y: 0,
  },
};
const animate_child = {
  active: {
    scale: 1.5,
  },
  inactive: {
    scale: 1,
  },
};

const MainPageShopProvider = () => {
  const { data } = useQuery({
    queryKey: ["main-page-shop"],
    queryFn: async () => {
      return await fetchGet<unknown>(url);
    },
  });
  const [categories, setCategories] = useState<TCategories[]>([]);

  //Конвертируем данные в TCategories[]
  useEffect(() => {
    let isWork: boolean = true;
    if (isWork) {
      //console.log(returnField(data, "CategoryComp"));
      //console.log(data);

      const temp_d = returnField(data, "GoodsZone");

      const Category: TCategories[] = [];
      if (temp_d !== null) {
        (temp_d as Array<any>).forEach((item) => {
          //   console.log(
          //     "Ищем CategoryComp-  ",
          //     returnField(item, "CategoryComp"),
          //   );
          const gds: TGoodItem[] = [];
          item.CategoryComp.forEach((item: any) => {
            gds.push(item.good);
          });

          //   if (gds.length > 0) {
          //     gds.forEach((item) => {
          //       const pics = item.picture;
          //       pics.forEach((item) => (item.url = `${API_URL}${item.url}`));
          //       pics.forEach((pic, index) => (item.picture[index].url = pic.url));
          //     });
          //   }

          Category.push({
            id: item.id,
            title: item.title,
            goods: gds,
          });
        });
        setCategories(Category);
      }
    }

    return () => {
      isWork = false;
    };
  }, [data]);

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
