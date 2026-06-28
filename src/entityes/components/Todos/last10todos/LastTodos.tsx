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
import { memo, useMemo } from "react";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";

const LastTodos = memo(() => {
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
    <motion.div
      className="w-fit mx-auto"
      initial={{ x: 200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="w-full p-0 overflow-hidden bg-default-100/25 dark:bg-default-700/25">
        <Card.Header>
          <Card.Title className="flex flex-col gap-y-2 bg-rose-300/25 dark:bg-rose-700/50">
            <div className="flex gap-1 items-center flex-1 w-fit mx-auto px-2 pt-1">
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
              <motion.p
                className="p-1 text-sm text-accent dark:text-green-300 text-center"
                initial={{ x: -220, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.75 }}
              >
                Нет данных! Возможно, Вы-молодец!
              </motion.p>
            )}

            {!!todos &&
              todos?.data.map((item, index) => {
                return (
                  <motion.div
                    key={item.documentId}
                    initial={{ x: -220, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.25 * index }}
                  >
                    <Link
                      href={`/todos/${item.updated}`}
                      className={
                        "flex gap-x-3 items-center p-1 text-sm text-warning-foreground dark:text-red-300 hover:font-semibold"
                      }
                    >
                      {index + 1}.
                      <ListOrdered size={14} />
                      {item.title}
                    </Link>
                  </motion.div>
                );
              })}
          </ScrollShadow>
        </Card.Content>
      </Card>
    </motion.div>
  );
});

export default LastTodos;
