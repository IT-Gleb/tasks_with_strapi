"use client";

import type { DateValue } from "@internationalized/date";

import { Calendar } from "@heroui/react";
import { FC, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getLocalTimeZone,
  // parseDate,
  // startOfMonth,
  //  startOfWeek,
  today,
} from "@internationalized/date";
import { makeDateISOStringFromObject } from "@/shared/utils/functions";
import { TDateISOString } from "@/shared/types/main_types";

const CalendarBasic: FC = () => {
  const [focusedDate, setFocusedDate] = useState<DateValue>(
    today(getLocalTimeZone()),
  );
  const [value, setValue] = useState<DateValue | null>(null);
  const router = useRouter();

  let currentDate: TDateISOString | string = useMemo(() => {
    //console.log(value);
    if (value === null) {
      return "";
    }
    return makeDateISOStringFromObject({
      year: value?.year as number,
      month: value?.month as number,
      day: value?.day as number,
    });
  }, [value]);

  useEffect(() => {
    let tmp: boolean = true;

    if (tmp && currentDate !== "") {
      router.push(`/todos/${currentDate}`);
    }

    return () => {
      tmp = false;
    };
  }, [currentDate]);

  return (
    <Calendar
      aria-label="Event date"
      className={" p-2 border border-slate-400/35 rounded-sm"}
      //focusedValue={focusedDate}
      value={value}
      onChange={setValue}
      //onFocusChange={setFocusedDate}
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
              className={`hover:text-accent-foreground hover:bg-accent-hover active:bg-red-400 `}
            />
          )}
        </Calendar.GridBody>
      </Calendar.Grid>
    </Calendar>
  );
};

export default CalendarBasic;
