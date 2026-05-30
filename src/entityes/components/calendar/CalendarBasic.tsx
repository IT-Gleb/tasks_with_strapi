"use client";

import type { CalendarDate, DateValue } from "@internationalized/date";

import { Calendar } from "@heroui/react";
import { FC, Suspense, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getLocalTimeZone,
  // parseDate,
  // startOfMonth,
  //  startOfWeek,
  isToday,
  today,
} from "@internationalized/date";
import { makeDateISOStringFromObject } from "@/shared/utils/functions";
import useGetData from "@/shared/hooks/tanstack/useGetData";
import { TTodosDates } from "@/shared/types/main_types";
import { API_URL, TodoDatesPath } from "@/shared/utils/consts";
import { Loader2 } from "lucide-react";
import Loading from "@/app/loading";
import useDateStore from "@/shared/store/dateStore";

const CalendarBasic: FC = () => {
  //const [value, setValue] = useState<DateValue | null>(null);
  const [focusedDate, setFocusedDate] = useState<DateValue>(
    today(getLocalTimeZone()),
  );

  const setCurrentDate = useDateStore((state) => state.setCurrentDate);

  const router = useRouter();
  const dateFromFocusedDate = useMemo(() => {
    let month = focusedDate.month;
    return `${focusedDate.year}-${month < 10 ? "0" + month : month}`;
  }, [focusedDate]);

  const thisMonth = focusedDate.month;
  //console.log(dateFromFocusedDate);

  const url: string = `${API_URL}/${TodoDatesPath.replace("%1", dateFromFocusedDate)}`;

  const { data, isLoading } = useGetData<TTodosDates>({
    dataKey: "todosDates-" + dateFromFocusedDate,
    paramUrl: url,
  });

  //console.log(url, data?.data);

  let daysWithTask = useMemo(() => {
    let days: number[] = [];
    if (!!data && data.data.length > 0) {
      days = data.data.reduce((acc: number[], value) => {
        if (!!value) {
          const date = new Date(value.updated);
          const day = date.getDate();
          if (!acc.includes(day)) {
            acc.push(date.getDate());
          }
        }
        return acc;
      }, []);
    }

    return days.sort((a, b) => {
      if (a > b) {
        return 1;
      } else return -1;
    });
  }, [data]);

  //console.log(daysWithTask);

  const handlerDate = (param: CalendarDate) => {
    const currentDate = {
      year: param.year,
      month: param.month,
      day: param.day,
    };
    const toGo = makeDateISOStringFromObject(currentDate);
    //setCurrentDate(toGo);

    if (!!toGo) {
      router.push(`/todos/${toGo}`);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  const handlerFocusChange = (date: CalendarDate) => {
    const work_Date = {
      year: date.year,
      month: date.month,
      day: date.day,
    };
    setCurrentDate(makeDateISOStringFromObject(work_Date));
    // setValue(focusedDate);
    setFocusedDate(date);
  };

  return (
    <Calendar
      aria-label="Event date"
      className={"fromcenter p-2 border border-slate-400/35 rounded-sm"}
      // focusedValue={focusedDate}
      // value={value}
      // onChange={setValue}
      onFocusChange={handlerFocusChange}
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
            >
              {({ formattedDate }) => (
                <>
                  {formattedDate}
                  {(isToday(date, getLocalTimeZone()) ||
                    (daysWithTask.includes(date.day) &&
                      thisMonth === date.month)) && <Calendar.CellIndicator />}
                </>
              )}
            </Calendar.Cell>
          )}
        </Calendar.GridBody>
      </Calendar.Grid>
    </Calendar>
  );
};

export default CalendarBasic;
