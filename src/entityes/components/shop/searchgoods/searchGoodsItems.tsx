"use client";

import { TGoodItem } from "@/shared/types/main_types";
import { API_URL, goodsSearchQuery } from "@/shared/utils/consts";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState, MouseEvent, useCallback, useRef } from "react";
import NewGoodItemCard from "../mainPage/gallery/newGoodItemCard";

type TSearchParams = {
  q: string;
  page: number | string;
  pgSize: number | string;
};

const SearchGoodsItems = ({ params }: { params: TSearchParams }) => {
  const [goods, setGoods] = useState<TGoodItem[]>([]);
  const goodsRef = useRef<HTMLDivElement[]>([]);

  const url = `${API_URL}/${goodsSearchQuery.replace("%1", params.q).replace("%2", String(params.page)).replace("%3", String(params.pgSize))}`;
  //console.log(url);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["searchGoods", params.q],
    queryFn: async () => {
      return await fetch(url, {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: "GET",
        signal: AbortSignal.timeout(10000),
      })
        .then((data) => data.json())
        .catch((err: unknown) => console.log((err as Error).message));
    },
    retry: 2,
    retryDelay: 500,
  });

  useEffect(() => {
    let isWork: boolean = true;

    if (data) {
      if (data?.data.length > 0) {
        if (isWork) {
          setGoods(data.data as TGoodItem[]);
        }
      }
    }

    return () => {
      isWork = false;
    };
  }, [data]);

  // Функция сохранения рефа
  const registerRef = useCallback((element: HTMLDivElement, index: number) => {
    if (element) {
      goodsRef.current[index] = element;
    }
  }, []);

  const handlerSelect = (evt: MouseEvent<HTMLDivElement>, index: number) => {
    evt.preventDefault();
    //setInView(index);
  };

  if (isLoading) {
    return (
      <div className="w-fit mx-auto">
        <Loader2 size={38} className=" animate-spin" />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="p-1 w-fit mx-auto">
        <p>
          Ошибка! Не могу получить данные. Попробуйте изменить поисковый запрос
          или повторить позднее...
        </p>
      </div>
    );
  }

  return (
    <div className="mt-2 p-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {goods &&
        goods.length > 0 &&
        goods.map((good, index) => (
          <NewGoodItemCard
            ref={(el: HTMLDivElement) => registerRef(el, index)}
            key={good.documentId}
            index={index}
            good={good}
            activeIndex={0}
            onClick={handlerSelect}
          />
        ))}
    </div>
  );
};

export default SearchGoodsItems;
