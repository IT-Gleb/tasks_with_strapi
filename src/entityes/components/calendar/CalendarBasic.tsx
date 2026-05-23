"use client";

import { Calendar } from "@heroui/react";
import { FC, useEffect, useMemo, useState } from "react";

interface CalendarBasicProps {
  calendar: { identifier: string };
  day: number;
  era: string;
  month: number;
  year: number;
}

type TCalendarProps = CalendarBasicProps;

const CalendarBasic: FC = ({ param }: { param?: TCalendarProps }) => {
  const dateValue: CalendarBasicProps = {
    calendar: {
      identifier: "gregory",
    },
    day: 25,
    era: "AD",
    month: 5,
    year: 2026,
  };
  const [value, setValue] = useState<any | null>(null);
  const [focusedDate, setFocusedDate] = useState<any>(value);

  const val = useMemo(() => {
    console.log(value);
    return value;
  }, [value]);

  return (
    <Calendar
      aria-label="Event date"
      className={" p-2 border border0slate-400/35"}
      focusedValue={focusedDate}
      value={value}
      onChange={setValue}
      onFocusChange={setFocusedDate}
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
          {(date) => <Calendar.Cell date={date} />}
        </Calendar.GridBody>
      </Calendar.Grid>
    </Calendar>
  );
};

export default CalendarBasic;
