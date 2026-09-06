"use client";

import type { TGoodItem, TPageMeta } from "@/shared/types/main_types";
import { API_URL, goodsSearchQuery } from "@/shared/utils/consts";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState, MouseEvent, useCallback, useRef } from "react";
import NewGoodItemCard from "../mainPage/gallery/newGoodItemCard";
import TablePagination from "./paginationComponent";

type TSearchParams = {
  q: string;
  page: number | string;
  pgSize: number | string;
};

const SearchGoodsItems = ({ params }: { params: TSearchParams }) => {
  const [goods, setGoods] = useState<TGoodItem[]>([]);
  const goodsRef = useRef<HTMLDivElement[]>([]);
  const [selIndex, setSelIndex] = useState<number>(0);
  const [page, setPage] = useState<number>(params.page as number);

  const url = `${API_URL}/${goodsSearchQuery.replace("%1", params.q).replace("%2", String(page)).replace("%3", String(params.pgSize))}`;
  //console.log(url);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["searchGoods-" + params.q, page],
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
    setGoods([]);

    if (data) {
      if (data?.data.length > 0) {
        if (isWork) {
          //Рассчитать скидку
          const t_goods: TGoodItem[] = (data.data as TGoodItem[]).map(
            (good) => {
              const { initialprice, discount, price } = good;
              const newPrice =
                discount === 0
                  ? price
                  : initialprice - (discount * initialprice) / 100;
              const currGood: TGoodItem = Object.assign({}, good);
              currGood["price"] = newPrice;
              return currGood;
            },
          );
          setGoods(t_goods);
        }
      }
    }

    return () => {
      isWork = false;
      setGoods([]);
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
    setSelIndex(index);
    //setInView(index);
  };

  const handlerPage = (paramPage: number) => {
    setPage(paramPage);
    setSelIndex(0);
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

  if (goods.length < 1) {
    return (
      <div className="p-1 w-fit mx-auto">
        <p>Ничего не найдено</p>
      </div>
    );
  }

  return (
    <article className="flex flex-col">
      <header className="p-1 border-b">
        <TablePagination
          paramMeta={data.meta as TPageMeta}
          handlerPage={handlerPage}
        />
      </header>
      <main className="mt-2 p-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {goods &&
          goods.length > 0 &&
          goods.map((good, index) => (
            <NewGoodItemCard
              ref={(el: HTMLDivElement) => registerRef(el, index)}
              key={good.documentId}
              index={index}
              good={good}
              activeIndex={selIndex}
              onClick={handlerSelect}
            />
          ))}
      </main>
      <footer className="p-1 border-t">
        <TablePagination
          paramMeta={data.meta as TPageMeta}
          handlerPage={handlerPage}
        />
      </footer>
    </article>
  );
};

export default SearchGoodsItems;
