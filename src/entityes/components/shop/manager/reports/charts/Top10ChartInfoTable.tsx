"use client";

import { TTop10Data } from "@/shared/types/main_types";
import { bgTop10ChartColors } from "@/shared/utils/consts";
import { Button, Popover } from "@heroui/react";
import { Info } from "lucide-react";

const Top10ChartInfoTable = ({ data }: { data: TTop10Data }) => {
  return (
    <div className="w-fit p-2 rounded-2xl overflow-x-hidden bg-yellow-200/25 shadow-lg my-2 mx-auto">
      {data.map((item, index) => (
        <ul key={item.id} className="w-full max-w-sm text-sm ">
          <li className="grid grid-cols-[35px_24px_35px] gap-x-2 items-start border-b">
            <span className="text-[0.5rem]/[0.65rem] place-self-center">
              {index + 1}.
            </span>
            <Popover>
              <Button
                size="sm"
                className={"w-5 h-3 place-self-center"}
                style={{ backgroundColor: bgTop10ChartColors[index] }}
              ></Button>
              <Popover.Content className="max-w-64 text-xs">
                <Popover.Dialog>
                  <Popover.Heading className="flex gap-x-4">
                    <Info
                      size={24}
                      style={{ color: bgTop10ChartColors[index] }}
                    />
                    Информация
                  </Popover.Heading>
                  <div className="mt-2 grid grid-cols-[minmax(0,1.2fr)_75px] items-center gap-x-2 p-2 text-xs font-semibold rounded-t-xl bg-slate-100 dark:bg-stone-700 border-b">
                    <span>Наименование</span>
                    <span>Количество</span>
                  </div>
                  <div className="mt-0.5 grid grid-cols-[minmax(0,1.2fr)_75px] items-center gap-x-2">
                    <span className="text-xs text-muted border-r p-1">
                      {item.title}
                    </span>
                    <span className="text-center">{item.total}</span>
                  </div>
                </Popover.Dialog>
              </Popover.Content>
            </Popover>

            {/* <span className="text-xs">{item.title}</span> */}
            <span className="text-right">{item.total}</span>
          </li>
        </ul>
      ))}
    </div>
  );
};

export default Top10ChartInfoTable;
