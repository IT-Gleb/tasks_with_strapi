"use client";

import { Button, Surface, useMediaQuery } from "@heroui/react";
import { Cross, Search } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import SearchTasksPopover from "./SearchPopover";
import { ParamsFromString } from "@/shared/utils/functions";
import { useRouter } from "next/navigation";

export default function SearchTasks() {
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");

  const isMobile = useMediaQuery("screen and (100px < width < 641px)");
  const router = useRouter();

  const handlerClear = () => {
    setSearchValue("");
    searchRef.current?.focus();
  };

  const handlerChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target;
    setSearchValue(value);
  };

  const handlerSearch = () => {
    const res = ParamsFromString(searchValue);
    if (res.length < 1) {
      return;
    }
    //console.log(res);
    setSearchValue("");
    router.push("/search?" + res);
  };

  return (
    <div className="w-full p-1 flex gap-x-2 items-start bg-transparent ">
      {!isMobile && (
        <search
          role="search"
          className={`sm:w-95 sm:max-w-100 xl:min-w-120 text-sm flex flex-row outline-0 overflow-hidden border border-stone-200 dark:border-stone-600 dark:outline-stone-500 rounded-s-lg focus-within:outline-2 focus-within:outline-accent focus-within:border-0`}
        >
          <span className="block w-8 h-8 bg-stone-200 dark:bg-stone-500 place-content-center">
            <Search size={14} strokeWidth={2} className="ml-1" />
          </span>
          <input
            ref={searchRef}
            type="search"
            name="searhTasks"
            id="searchTasksId"
            autoComplete="off"
            minLength={3}
            maxLength={120}
            className={` w-full outline-0 border-0 p-0.5 pl-2`}
            placeholder="Найти задачу..."
            value={searchValue}
            onChange={handlerChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handlerSearch();
              }
            }}
          />
          <Button
            size="sm"
            variant="ghost"
            className={" scale-75 active:scale-60"}
            onClick={handlerClear}
          >
            <Cross size={18} strokeWidth={2} className=" rotate-45" />
          </Button>
        </search>
      )}
      {isMobile ? (
        <SearchTasksPopover />
      ) : (
        <Button
          size="sm"
          variant="primary"
          className={" scale-80 place-content-center active:scale-70"}
          isIconOnly={isMobile}
          onClick={handlerSearch}
        >
          <Search size={14} />
          Искать
        </Button>
      )}
    </div>
  );
}
