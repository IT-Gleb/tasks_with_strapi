"use client";

import { Card, Link, ScrollShadow } from "@heroui/react";
import GradientLine from "../../ui/gradients/GradientLine";
import { List, ListOrdered } from "lucide-react";
import { firstLastMonthDayLastCurrentMonthDay } from "@/shared/utils/functions";
import useGetData from "@/shared/hooks/tanstack/useGetData";
import { TTodosData } from "@/shared/types/main_types";
import {
  API_URL,
  TodosLast20,
  TodosLast20_prefix,
} from "@/shared/utils/consts";
import useDateStore from "@/shared/store/dateStore";
import { useMemo } from "react";

export default function LastTodos() {
  const currentDate = useDateStore((state) => state.currentDate);
  const dates = useMemo(() => {
    return firstLastMonthDayLastCurrentMonthDay(new Date(currentDate));
  }, [currentDate]);
  //console.log(dates);

  const url = `${API_URL}/${TodosLast20.replace("%1", dates.firstDate).replace("%2", dates.currentDate)}`;
  //console.log(url);

  const { data: todos, isError } = useGetData<TTodosData>({
    dataKey: TodosLast20_prefix + "-" + dates.currentDate,
    paramUrl: url,
  });

  //console.log(firstLastMonthDayLastCurrentMonthDay(Date.now()));
  if (isError) {
    return <div className="w-fit mx-auto p-1">Ошибка загрузки данных</div>;
  }

  return (
    <Card className="w-full p-0">
      <Card.Header className="p-1 ">
        <Card.Title className="flex flex-col gap-y-2 overflow-hidden">
          <div className="flex gap-1 items-center flex-1 w-fit mx-auto">
            <List size={18} />
            <span className="text-sm font-bold">
              Незавершенные задачи (последние 20):
            </span>
          </div>
          <GradientLine />
        </Card.Title>
      </Card.Header>
      <Card.Content>
        <ScrollShadow
          variant="fade"
          orientation="vertical"
          className=" max-h-60 p-1"
        >
          {!!todos && todos.data.length < 1 && (
            <p className="p-1 text-sm text-accent dark:text-green-300 text-center">
              Нет данных! Возможно, Вы-молодец!
            </p>
          )}
          {!!todos &&
            todos?.data.map((item, index) => {
              return (
                <Link
                  key={item.documentId}
                  href={`/todos/${item.updated}`}
                  className={
                    "flex gap-x-3 items-center p-1 text-warning-foreground dark:text-red-300 hover:font-semibold"
                  }
                >
                  {index + 1}.
                  <ListOrdered size={14} />
                  {item.title}
                </Link>
              );
            })}
        </ScrollShadow>
      </Card.Content>
    </Card>
  );
}
