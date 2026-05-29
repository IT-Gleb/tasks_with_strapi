import { TDateISOString, TDateTimeISOString } from "../types/main_types";

export function FormatDateTime(param: number | string) {
  //console.log(param);
  const dt = new Date(param);

  const options = {
    dateStyle: "medium",
    timeZone: "Europe/Moscow",
    timeStyle: "short",
  } satisfies Intl.DateTimeFormatOptions;

  return Intl.DateTimeFormat("ru-RU", options).format(dt);
}

export function CheckIsTimeZoneString(param: string) {
  if (
    !/^[\d]{4}-[\d]{2}-[\d]{2}T[\d]{2}:[\d]{2}:[\d]{2}\.[\d]{3}Z$/.test(param)
  ) {
    throw new Error("Не верный формат даты/времени");
  }
  return param as TDateTimeISOString;
}

export function makeDateISOString(param: string): TDateISOString {
  if (!/^[\d]{4}-[\d]{2}-[\d]{2}$/.test(param)) {
    throw new Error("Не верный формат даты");
  }
  return param as TDateISOString;
}

export function makeDateISOStringFromObject(param: {
  year: number;
  month: number;
  day: number;
}): TDateISOString {
  return makeDateISOString(
    `${param.year}-${param.month < 10 ? "0" + param.month : param.month}-${param.day < 10 ? "0" + param.day : param.day}`,
  );
}

export function firstLastMonthDayLastCurrentMonthDay(param:number|Date){
  let dt= new Date(param);

  let year= dt.getFullYear();
  let month= dt.getMonth()+1;
  const first_Date= new Date(year,month-1, 1);
  const last_Date= new Date(year, month+1, 1);
  
  year= first_Date.getFullYear();
  month= first_Date.getMonth();
  let day= first_Date.getDate();

  const firstDate= makeDateISOStringFromObject({year,month,day});

  year= last_Date.getFullYear();
  month= last_Date.getMonth();
  day= last_Date.getDate();

  const currentDate= makeDateISOStringFromObject({year,month,day});

  return {
    firstDate: firstDate,
    currentDate
  }
}