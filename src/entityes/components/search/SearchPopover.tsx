"use client";

import { ParamsFromString } from "@/shared/utils/functions";
import { Button, Popover } from "@heroui/react";
import { Check, Cross, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useRef, useState } from "react";
import * as motion from "motion/react-client";

export default function SearchTasksPopover() {
  const [searchValue, setSearchValue] = useState<string>("");
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [isPopoverOpen, setPopoverOpen] = useState<boolean>(false);
  const router = useRouter();

  const handlerChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.currentTarget;
    setSearchValue(value);
  };

  const handlerClear = () => {
    setSearchValue("");
    searchRef.current?.focus();
  };

  const handlerSearch = () => {
    const sParams = ParamsFromString(searchValue);
    if (sParams === "") {
      return;
    }

    setSearchValue("");
    setPopoverOpen(false);
    router.push(`/search?${sParams}`);
  };

  return (
    <Popover isOpen={isPopoverOpen} onOpenChange={setPopoverOpen}>
      <Button isIconOnly size="sm" variant="primary">
        <Search
          size={16}
          strokeWidth={2}
          className="scale-90"
          onClick={() => setPopoverOpen((prev) => (prev = !prev))}
        />
      </Button>
      <Popover.Content placement="left" className={" min-w-30"}>
        <Popover.Dialog>
          <Popover.Arrow />
          <motion.div
            role="search"
            className=" flex items-center rounded-s-lg overflow-hidden border border-stone-200 dark:border-stone-600 focus-within:outline-2 focus-within:outline-accent focus-within:border-0"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
          >
            <span className="block w-fit p-2 place-content-center">
              <Search size={12} />
            </span>
            <input
              ref={searchRef}
              type="search"
              name="searhTasksPopover"
              id="searchTasksPopoverId"
              autoComplete="off"
              autoFocus
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
              isIconOnly
              isDisabled={searchValue.trim().length < 3}
              className={"px-4 py-0.5"}
              onClick={handlerSearch}
            >
              <span className="block w-fit text-green-600 dark:text-green-300">
                <Check size={12} strokeWidth={3} />
              </span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handlerClear}>
              <Cross size={12} className="rotate-45" />
            </Button>
          </motion.div>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
}
