"use client";

import { Calendar } from "@heroui/react";
import { FC } from "react";

interface CalendarBasicProps {}

const CalendarBasic: FC<CalendarBasicProps> = () => {
  return (
    <Calendar
      aria-label="Event date"
      className={" p-2 border border0slate-400/35"}
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
