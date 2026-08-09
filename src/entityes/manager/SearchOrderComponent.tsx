"use client";

import { Button, toast } from "@heroui/react";
import { Cross, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";

const SearchOrderInput = () => {
  const [searchNum, setSearchNum] = useState<string>("");
  const searchNumRef = useRef<HTMLInputElement | null>(null);
  const [searchDate, setSearchDate] = useState<string>("");
  const searchDateRef = useRef<HTMLInputElement | null>(null);

  const router = useRouter();

  const handlerChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target;

    const onlyDigits = /[\d]+/.exec(value)?.join("");
    //console.log(onlyDigits);
    onlyDigits !== undefined ? setSearchNum(onlyDigits) : setSearchNum("");
  };

  const handlerDate = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target;
    const onlyDigits = /[\d]+/.exec(value)?.join("");
    //console.log(onlyDigits);
    onlyDigits !== undefined ? setSearchDate(onlyDigits) : setSearchDate("");
  };

  function toSearch(url: string) {
    setSearchDate("");
    setSearchNum("");

    router.push(url);
    // const tmp = setTimeout(() => {
    //   clearTimeout(tmp);
    //   window.location.reload();
    // }, 1000);
  }

  const handlerRun = () => {
    searchNumRef.current?.focus();

    if (searchNum.trim().length < 1 && searchDate.trim().length < 1) {
      return;
    }
    let url = "";
    let ord_number = searchNum.trim();
    let dtStr = searchDate.trim();
    //Добавляем нули к номеру заказа
    if (ord_number.length > 0 && ord_number.length < 5) {
      while (ord_number.length !== 5) {
        ord_number = "0" + ord_number;
      }
    }

    if (dtStr.length < 1 && ord_number.length > 0) {
      url = `/dashboard?q=${ord_number}&state=search&page=1`;
      toSearch(url);
      return;
    }

    //Проверить на дату

    try {
      if (dtStr.length !== 8 && dtStr.length !== 6 && dtStr.length !== 4) {
        throw new Error("Invalid Date");
      }
      switch (dtStr.length) {
        case 4:
          dtStr = "01/01/" + dtStr;
          break;
        case 6:
          dtStr = dtStr.slice(0, 2) + "/01/" + dtStr.slice(2, dtStr.length);
          break;
        case 8:
          const tmp_str = dtStr;
          dtStr =
            tmp_str.slice(2, 4) +
            "/" +
            tmp_str.slice(0, 2) +
            "/" +
            tmp_str.slice(4, dtStr.length);
          break;
      }

      //console.log(dtStr);

      //console.log(dt.getFullYear(), dt.getMonth(), dt.getDate());
      const dt = new Date(dtStr);
      if (isNaN(dt.valueOf())) {
        throw new Error("Invalid Date");
      }
      if (dt.getFullYear() < 2026 || dt.getFullYear() > 2050) {
        throw new Error("Invalid Date");
      }
      //console.log(dt);
    } catch (err: unknown) {
      searchDateRef.current?.focus();
      toast.danger("Не верная дата! - " + dtStr);
      return;
    }

    if (ord_number === "") {
      url = `/dashboard?q=${searchDate.trim()}&state=search&page=1`;
    } else {
      url = `/dashboard?q=${searchDate.trim()}-${ord_number}&state=search&page=1`;
    }
    toSearch(url);
  };

  return (
    <div
      title="Искать"
      className="flex gap-x-0 items-center border border-slate-200/50 rounded-lg p-1.5 [&>button]:bg-slate-300 focus-within:[&>button]:bg-green-500 focus-within:border focus-within:border-green-400 relative before:content-[attr(title)] before:absolute before:left-4 before:-top-2.5 before:z-1 before:text-[0.6rem]/[calc(1/0.6)rem] before:text-slate-300 focus-within:before:text-green-600 before:bg-white dark:before:bg-default"
    >
      <span className="place-self-start">ord-</span>
      <div className="text-sm flex flex-col gap-y-1 items-center">
        <input
          ref={searchDateRef}
          type="text"
          name="searchDate"
          id="searchDate"
          maxLength={8}
          placeholder="ddmmyyyy"
          inputMode="numeric"
          pattern="d{8}"
          className="p-1 border border-slate-200/50 outline-0 rounded-sm max-w-21 focus:border-green-600"
          value={searchDate}
          onChange={handlerDate}
          onKeyDown={(evt) => {
            if (evt.key === "Enter") {
              searchNumRef.current?.focus();
            }
          }}
        />
        <span className="text-[0.5rem]/[calc(1/0.5)rem]">
          Дата, формат: 01012026
        </span>
      </div>
      <span className="place-self-start">-</span>
      <div className="text-sm flex flex-col gap-y-1 items-center">
        <input
          ref={searchNumRef}
          type="text"
          name="searchNumber"
          id="searchNumber"
          maxLength={5}
          placeholder="ddddd"
          inputMode="numeric"
          pattern="d{5}"
          className="p-1 border border-slate-200/50 outline-0 rounded-sm max-w-18 focus:border-green-600"
          value={searchNum}
          onChange={handlerChange}
        />
        <span className="text-[0.5rem]/[calc(1/0.5)rem]">
          Номер, формат: 00001
        </span>
      </div>
      <Button
        isIconOnly
        size="sm"
        isDisabled={searchDate.length < 4 && searchNum.length < 1}
        className={
          "scale-90 active:scale-80 ml-4 place-self-start disabled:bg-transparent"
        }
        onPress={handlerRun}
      >
        <Search size={14} />
      </Button>
    </div>
  );
};

export default SearchOrderInput;
