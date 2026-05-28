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

  let currentMonth= dt.getUTCMonth()+1;
  currentMonth= dt.setUTCMonth(currentMonth+1,0);
  
  dt= new Date(dt);
  currentMonth= dt.getUTCMonth();
  const currentDay= dt.getUTCDate();
  const currentDate= `${dt.getUTCFullYear()}-${currentMonth < 10?"0"+currentMonth:currentMonth}-${currentDay < 10?"0"+currentDay:currentDay}`;

  let firstMonth= dt.setUTCMonth(currentMonth-1,1);
  dt= new Date(dt);
  firstMonth= dt.getUTCMonth();

  const firstDay= dt.getUTCDate();
  const firstDate=`${dt.getUTCFullYear()}-${firstMonth < 10?"0"+firstMonth:firstMonth}-${firstDay < 10?"0"+firstDay:firstDay}`;

  return {
    firstDate: firstDate,
    currentDate
  }
}