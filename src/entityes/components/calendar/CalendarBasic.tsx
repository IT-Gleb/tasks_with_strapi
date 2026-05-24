"use client";

import type { CalendarDate, DateValue } from "@internationalized/date";

import { Calendar } from "@heroui/react";
import { FC, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getLocalTimeZone,
  // parseDate,
  // startOfMonth,
  //  startOfWeek,
  today,
} from "@internationalized/date";
import { makeDateISOStringFromObject } from "@/shared/utils/functions";

const CalendarBasic: FC = () => {
  const [focusedDate, setFocusedDate] = useState<DateValue>(
    today(getLocalTimeZone()),
  );

  const router = useRouter();

  const handlerDate = (param: CalendarDate) => {
    const currentDate = {
      year: param.year,
      month: param.month,
      day: param.day,
    };
    const toGo = makeDateISOStringFromObject(currentDate);
    if (!!toGo) {
      router.push(`/todos/${toGo}`);
    }
  };

  return (
    <Calendar
      aria-label="Event date"
      className={"fromcenter p-2 border border-slate-400/35 rounded-sm"}
      // focusedValue={focusedDate}
      // value={value}
      // onChange={setValue}
      onFocusChange={setFocusedDate}
      defaultValue={focusedDate}
    >
      <Calendar.Header>
        <Calendar.Heading />
        <Calendar.NavButton slot="previous" />
        <Calendar.NavButton slot="next" />
      </Calendar.Header>
      <Calendar.Grid>
        <Calendar.GridHeader>
          {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
        </Calendar.GridHeader>
        <Calendar.GridBody>
          {(date) => (
            <Calendar.Cell
              date={date}
              className={`text-soft-foreground hover:bg-accent-soft-foreground hover:text-white dark:hover:bg-default-foreground/40 active:bg-red-400 data-[today="true"]:bg-accent/55 data-[today="true"]:text-accent-foreground`}
              onClick={() => handlerDate(date)}
            />
          )}
        </Calendar.GridBody>
      </Calendar.Grid>
    </Calendar>
  );
};

export default CalendarBasic;
