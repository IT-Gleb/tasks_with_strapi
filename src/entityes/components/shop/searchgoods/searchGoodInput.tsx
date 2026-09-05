"use client";

import { itemsOnPage, LOCAL_SERVER_URL } from "@/shared/utils/consts";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

const SearchGoodsInput = () => {
  const router = useRouter();
  const [sValue, setSValue] = useState<string>("");

  const handlerValue = (evt: ChangeEvent<HTMLInputElement>) => {
    const text = evt.target.value;

    setSValue(text);
  };

  const handlerSearch = () => {
    if (sValue.trim().length < 4) {
      return;
    }
    const url =
      LOCAL_SERVER_URL +
      `/shop/goodsearch/?q=${encodeURI(sValue.trim())}&page=1&pgSize=${String(itemsOnPage)}`;

    //console.log(url);
    setSValue("");
    router.push(url);
  };

  return (
    <div
      role="search"
      className="w-full max-w-60 rounded-s-lg border flex items-center focus-within:border-accent"
    >
      <div className="w-6 h-6 p-1 rounded-s-lg bg-stone-300 dark:bg-stone-700">
        <Search size={18} />
      </div>
      <input
        type="search"
        name="searchGInput"
        id="searchGInput"
        minLength={4}
        maxLength={100}
        className="p-1 outline-0 border-0 w-full h-6 text-xs placeholder:text-xs bg-white dark:bg-default"
        placeholder="поиск..."
        autoComplete="off"
        value={sValue}
        onChange={handlerValue}
        onKeyDown={(evt) => {
          if (evt.key === "Enter") {
            handlerSearch();
          }
        }}
      />
    </div>
  );
};

export default SearchGoodsInput;
