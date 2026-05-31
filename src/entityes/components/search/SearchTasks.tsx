"use client";

import { Button, Description, Surface } from "@heroui/react";
import { Cross, Search } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";

export default function SearchTasks() {
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");

  const handlerClear = () => {
    setSearchValue("");
    searchRef.current?.focus();
  };

  const handlerChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target;
    setSearchValue(value);
  };

  return (
    <Surface
      variant="default"
      className="w-full p-1 border-b flex gap-x-2 items-start "
    >
      <div className=" w-full">
        <search className=" text-sm flex flex-row outline-1 outline-stone-200 dark:outline-stone-500 rounded-s-lg focus-within:outline-2 focus-within:outline-accent">
          <span className="block w-8 h-8 bg-stone-200 dark:bg-stone-500 place-content-center">
            <Search size={18} strokeWidth={2} className="ml-1" />
          </span>
          <input
            ref={searchRef}
            type="search"
            name="searhTasks"
            id="searchTasksId"
            autoComplete="off"
            minLength={3}
            maxLength={120}
            className=" w-full outline-0 border-0 p-0.5 pl-2"
            placeholder="Найти задачу..."
            value={searchValue}
            onChange={handlerChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearchValue("");
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
        <Description>
          Не менее - 3-х символов. Не более 120 символов.
        </Description>
      </div>
      <Button
        size="sm"
        variant="primary"
        className={" scale-80 place-content-center active:scale-70"}
      >
        <Search size={14} />
        Искать
      </Button>
    </Surface>
  );
}
